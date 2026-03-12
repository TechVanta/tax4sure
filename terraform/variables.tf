variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "website_bucket_name" {
  description = "S3 bucket name for the static website (must be globally unique)"
  type        = string
  default     = "tax4sure-website"
}

variable "documents_bucket_name" {
  description = "S3 bucket name for client document storage (must be globally unique)"
  type        = string
  default     = "tax4sure-documents"
}

variable "lambda_artifacts_bucket" {
  description = "S3 bucket for storing Lambda deployment ZIPs"
  type        = string
  default     = "tax4sure-lambda-artifacts"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for user accounts"
  type        = string
  default     = "tax4sure-users"
}

variable "jwt_secret" {
  description = "Secret key for signing JWT tokens (min 32 chars)"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}
