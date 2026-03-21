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

variable "gmail_user" {
  description = "Gmail address used to send contact form emails (e.g. tax4sureca@gmail.com)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "gmail_app_password" {
  description = "Gmail App Password (16-char, generated in Google Account > Security > App Passwords)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "contact_email" {
  description = "Recipient email for contact form notifications"
  type        = string
  default     = "tax4sureca@gmail.com"
}

variable "domain_name" {
  description = "Custom domain name for the website (e.g. tax4sure.com). Leave empty to skip custom domain setup."
  type        = string
  default     = "tax4sure.ca"
}

variable "domain_ssl_validated" {
  description = "Set to true AFTER the ACM certificate DNS validation is complete in GoDaddy. Phase 1: false (creates cert, outputs validation records). Phase 2: true (attaches cert + custom domain to CloudFront)."
  type        = bool
  default     = true
}

