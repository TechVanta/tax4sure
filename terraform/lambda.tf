# ─── JWT Secret ──────────────────────────────────────────────────────────────

resource "random_password" "jwt_secret" {
  length  = 48
  special = false

  lifecycle {
    # Never regenerate after first creation — existing tokens would break
    ignore_changes = [length, special]
  }
}

# Create a minimal valid ZIP so Terraform can create the Lambda on first apply.
# GitHub Actions will overwrite this with the real code on every push.
data "archive_file" "lambda_placeholder" {
  type        = "zip"
  output_path = "${path.module}/placeholder.zip"

  source {
    content  = "exports.handler = async () => ({ statusCode: 200, body: 'Placeholder — deploy via CI/CD' });"
    filename = "index.js"
  }
}

resource "aws_s3_object" "lambda_placeholder" {
  bucket = aws_s3_bucket.lambda_artifacts.id
  key    = "api/lambda.zip"
  source = data.archive_file.lambda_placeholder.output_path
  etag   = data.archive_file.lambda_placeholder.output_md5

  lifecycle {
    # Never overwrite after first creation — CI/CD owns this
    ignore_changes = [source, etag]
  }
}

resource "aws_lambda_function" "api" {
  function_name = "tax4sure-api"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 512

  s3_bucket = aws_s3_bucket.lambda_artifacts.id
  s3_key    = aws_s3_object.lambda_placeholder.key

  environment {
    variables = {
      AWS_REGION_ENV        = var.aws_region
      DYNAMODB_TABLE_NAME   = aws_dynamodb_table.users.name
      S3_BUCKET_NAME        = aws_s3_bucket.documents.id
      JWT_SECRET            = random_password.jwt_secret.result
      FRONTEND_URL          = "https://${aws_cloudfront_distribution.website.domain_name}"
    }
  }

  lifecycle {
    # Let GitHub Actions manage the code — Terraform only manages config
    ignore_changes = [s3_key, s3_object_version, source_code_hash]
  }

  tags = {
    Name        = "Tax4Sure API"
    Environment = var.environment
  }

  depends_on = [aws_s3_object.lambda_placeholder]
}

# ─── API Gateway (HTTP API) ───────────────────────────────────────────────────

resource "aws_apigatewayv2_api" "api" {
  name          = "tax4sure-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://${aws_cloudfront_distribution.website.domain_name}"]
    allow_methods = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }

  tags = {
    Name        = "Tax4Sure API Gateway"
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  tags = {
    Name        = "Tax4Sure API Default Stage"
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.api.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "catch_all" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
