variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "website_bucket_name" {
  description = "S3 bucket name for the static website (must be globally unique)"
  type        = string
  default     = "tax4sure"
}

variable "documents_bucket_name" {
  description = "S3 bucket name for client document storage (must be globally unique)"
  type        = string
  default     = "tax4suredocuments"
}

variable "lambda_artifacts_bucket" {
  description = "S3 bucket for storing Lambda deployment ZIPs"
  type        = string
  default     = "tax4surelambdaartifacts"
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for user accounts"
  type        = string
  default     = "tax4sure-users"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "prod"
}
