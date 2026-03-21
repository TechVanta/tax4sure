# ─── ACM Certificate for Custom Domain ──────────────────────────────────────
#
# Creates an SSL/TLS certificate for the custom domain (+ www subdomain).
# CloudFront requires the certificate to be in us-east-1 — our provider is
# already in that region so no alias provider is needed.
#
# After `terraform apply`, add the DNS validation CNAME records shown in the
# outputs to your domain registrar (GoDaddy). The certificate will remain in
# "Pending validation" status until those records are in place.

resource "aws_acm_certificate" "website" {
  count = var.domain_name != "" ? 1 : 0

  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  tags = {
    Name        = "Tax4Sure Website SSL"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
}
