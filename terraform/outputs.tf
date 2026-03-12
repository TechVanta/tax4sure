output "website_url" {
  description = "S3 static website URL"
  value       = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
}

output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.api.api_endpoint
}

output "documents_bucket_name" {
  description = "S3 bucket for document storage"
  value       = aws_s3_bucket.documents.id
}

output "dynamodb_table_name" {
  description = "DynamoDB users table name"
  value       = aws_dynamodb_table.users.name
}
