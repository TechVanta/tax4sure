output "cloudfront_url" {
  description = "HTTPS URL for the Tax4Sure website (via CloudFront)"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (used for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
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

output "admin_password" {
  description = "Admin portal password — run: terraform output -raw admin_password"
  value       = random_password.admin_password.result
  sensitive   = true
}
