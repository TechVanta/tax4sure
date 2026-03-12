output "website_url" {
  description = "S3 static website URL"
  value       = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
}

output "lambda_function_url" {
  description = "Lambda Function URL (API endpoint)"
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
