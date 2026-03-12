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
      FRONTEND_URL          = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
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

resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "DELETE", "OPTIONS"]
    allow_headers     = ["Content-Type", "Authorization"]
    max_age           = 3600
  }
}
