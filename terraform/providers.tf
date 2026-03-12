terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  # Remote state in S3 — create this bucket manually once before first apply:
  #   aws s3api create-bucket --bucket terraform-state-geekyrbhalala --region us-east-1
  backend "s3" {
    bucket = "terraform-state-geekyrbhalala"
    key    = "tax4sure/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}
