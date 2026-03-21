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

# ─── Custom Domain Outputs ────────────────────────────────────────────────────

output "acm_validation_records" {
  description = "Add these CNAME records in GoDaddy to validate the SSL certificate"
  value = var.domain_name != "" ? {
    for dvo in aws_acm_certificate.website[0].domain_validation_options : dvo.domain_name => {
      type  = "CNAME"
      name  = dvo.resource_record_name
      value = dvo.resource_record_value
    }
  } : {}
}

output "godaddy_dns_records" {
  description = "After SSL is validated, add these DNS records in GoDaddy to point your domain to CloudFront"
  value = var.domain_name != "" ? {
    root_domain = {
      type  = "CNAME"
      name  = "@"
      value = aws_cloudfront_distribution.website.domain_name
    }
    www = {
      type  = "CNAME"
      name  = "www"
      value = aws_cloudfront_distribution.website.domain_name
    }
  } : {}
}
