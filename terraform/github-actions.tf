# ─── GitHub Actions OIDC – Keyless CI/CD ─────────────────────────────────────
#
# Allows GitHub Actions to assume an AWS role without storing long-lived keys.
# The role is referenced in deploy.yml as secrets.AWS_ROLE_ARN.
#
# After first apply, copy the output `github_actions_role_arn` into your
# GitHub repo → Settings → Secrets → AWS_ROLE_ARN.

variable "github_org" {
  description = "GitHub organisation or username that owns this repository"
  type        = string
  default     = "geekyrbhalala"   # update if your GitHub username differs
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "tax4sure"
}

# ── OIDC provider (one per AWS account, safe to re-apply) ────────────────────

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1",
                     "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]
}

# ── Role ──────────────────────────────────────────────────────────────────────

data "aws_iam_policy_document" "github_actions_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      # Allows any branch/tag in this repo to assume the role
      values   = ["repo:${var.github_org}/${var.github_repo}:*"]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = "tax4sure-github-actions"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume.json

  tags = {
    Name        = "Tax4Sure GitHub Actions Role"
    Environment = var.environment
  }
}

# ── Policy: everything CI/CD needs ───────────────────────────────────────────

data "aws_iam_policy_document" "github_actions_permissions" {
  # Upload files to the website S3 bucket
  statement {
    sid    = "WebsiteS3"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
      "s3:GetObject",
    ]
    resources = [
      aws_s3_bucket.website.arn,
      "${aws_s3_bucket.website.arn}/*",
    ]
  }

  # Upload Lambda ZIP to the artifacts bucket
  statement {
    sid    = "LambdaArtifactsS3"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
    ]
    resources = [
      aws_s3_bucket.lambda_artifacts.arn,
      "${aws_s3_bucket.lambda_artifacts.arn}/*",
    ]
  }

  # Deploy new Lambda code
  statement {
    sid    = "LambdaDeploy"
    effect = "Allow"
    actions = [
      "lambda:UpdateFunctionCode",
      "lambda:GetFunction",
    ]
    resources = [aws_lambda_function.api.arn]
  }

  # Invalidate CloudFront cache after each deploy
  statement {
    sid    = "CloudFrontInvalidate"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetDistribution",
    ]
    resources = [aws_cloudfront_distribution.website.arn]
  }

  # Read Terraform state from S3 backend
  statement {
    sid    = "TerraformState"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket",
    ]
    resources = [
      "arn:aws:s3:::terraform-state-geekyrbhalala",
      "arn:aws:s3:::terraform-state-geekyrbhalala/*",
    ]
  }

  # Terraform needs to read/write all managed resources
  statement {
    sid    = "TerraformManage"
    effect = "Allow"
    actions = [
      "s3:*",
      "dynamodb:*",
      "lambda:*",
      "apigateway:*",
      "iam:*",
      "cloudfront:*",
      "logs:*",
    ]
    resources = ["*"]
    condition {
      test     = "StringEquals"
      variable = "aws:RequestedRegion"
      values   = [var.aws_region]
    }
  }
}

resource "aws_iam_role_policy" "github_actions" {
  name   = "tax4sure-github-actions-policy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_actions_permissions.json
}

# ── Output the role ARN to copy into GitHub Secrets ──────────────────────────

output "github_actions_role_arn" {
  description = "Paste this into GitHub → Settings → Secrets → AWS_ROLE_ARN"
  value       = aws_iam_role.github_actions.arn
}
