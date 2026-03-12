# ─── JWT Secret ──────────────────────────────────────────────────────────────

resource "random_password" "jwt_secret" {
  length  = 48
  special = false

  lifecycle {
    # Never regenerate after first creation — existing tokens would break
    ignore_changes = [length, special]
  }
}

# Upload a placeholder ZIP so Terraform can create the function on first apply.
# GitHub Actions will update the code on every push to main.
resource "aws_s3_object" "lambda_placeholder" {
  bucket  = aws_s3_bucket.lambda_artifacts.id
  key     = "api/lambda.zip"
  content = "placeholder"

  lifecycle {
    # Never overwrite after first creation — CI/CD owns this
    ignore_changes = [content, etag]
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
