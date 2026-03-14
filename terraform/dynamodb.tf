# ─── Cases Table ──────────────────────────────────────────────────────────────
resource "aws_dynamodb_table" "cases" {
  name         = "tax4sure-cases"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "caseId"

  attribute {
    name = "caseId"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    name            = "UsernameIndex"
    hash_key        = "username"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name        = "Tax4Sure Cases"
    Environment = var.environment
  }
}

# ─── Notifications Table ───────────────────────────────────────────────────────
resource "aws_dynamodb_table" "notifications" {
  name         = "tax4sure-notifications"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "notificationId"

  attribute {
    name = "notificationId"
    type = "S"
  }

  attribute {
    name = "recipientUsername"
    type = "S"
  }

  global_secondary_index {
    name            = "RecipientIndex"
    hash_key        = "recipientUsername"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name        = "Tax4Sure Notifications"
    Environment = var.environment
  }
}

# ─── Users Table ───────────────────────────────────────────────────────────────
resource "aws_dynamodb_table" "users" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "username"

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name        = "Tax4Sure Users"
    Environment = var.environment
  }
}
