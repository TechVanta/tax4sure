output "website_url" {
  description = "S3 static website URL (set as NEXT_PUBLIC_SITE_URL)"
  value       = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
}

output "lambda_function_url" {
  description = "Lambda Function URL — set this as NEXT_PUBLIC_API_URL in GitHub secrets"
  value       = aws_lambda_function_url.api.function_url
}

output "documents_bucket_name" {
  description = "S3 bucket for document storage"
  value       = aws_s3_bucket.documents.id
}

output "dynamodb_table_name" {
  description = "DynamoDB users table name"
  value       = aws_dynamodb_table.users.name
}

output "github_actions_access_key_id" {
  description = "AWS Access Key ID for GitHub Actions — add to repo secrets as AWS_ACCESS_KEY_ID"
  value       = aws_iam_access_key.github_actions.id
}

output "github_actions_secret_access_key" {
  description = "AWS Secret Access Key for GitHub Actions — add to repo secrets as AWS_SECRET_ACCESS_KEY"
  value       = aws_iam_access_key.github_actions.secret
  sensitive   = true
}
