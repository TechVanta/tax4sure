# ─── CloudFront Function: domain enforcement + URL rewriting ─────────────────
#
# 1. Redirects *.cloudfront.net requests to the custom domain (if configured)
# 2. Rewrites directory paths to index.html for Next.js static export

locals {
  cf_function_with_domain = <<-EOT
    function handler(event) {
      var request = event.request;
      var host = request.headers.host.value;
      var uri = request.uri;
      var customDomain = '${var.domain_name}';
      var wwwDomain = 'www.${var.domain_name}';

      // Redirect non-custom-domain requests (e.g. *.cloudfront.net) to custom domain
      if (host !== customDomain && host !== wwwDomain) {
        return {
          statusCode: 301,
          statusDescription: 'Moved Permanently',
          headers: {
            location: { value: 'https://' + wwwDomain + uri }
          }
        };
      }

      // Directory request (ends with /) → append index.html
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      }
      // No file extension in last path segment → treat as a page route
      else if (!uri.split('/').pop().includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
  EOT

  cf_function_without_domain = <<-EOT
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Directory request (ends with /) → append index.html
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      }
      // No file extension in last path segment → treat as a page route
      else if (!uri.split('/').pop().includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
  EOT
}

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "tax4sure-url-rewrite"
  runtime = "cloudfront-js-2.0"
  comment = "Enforce custom domain + rewrite paths to index.html"
  publish = true

  code = var.domain_ssl_validated ? local.cf_function_with_domain : local.cf_function_without_domain
}

# ─── CloudFront Origin Access Control ────────────────────────────────────────

resource "aws_cloudfront_origin_access_control" "website" {
  name                              = "tax4sure-website-oac"
  description                       = "OAC for Tax4Sure website S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ─── CloudFront Distribution ──────────────────────────────────────────────────

resource "aws_cloudfront_distribution" "website" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Tax4Sure – Tax & Accounting Portal"

  # PriceClass_100 = US, Canada, Europe only (lowest cost)
  price_class = "PriceClass_100"

  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_id                = "S3-tax4sure-website"
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-tax4sure-website"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 86400    # 1 day for assets
    max_ttl     = 31536000 # 1 year max

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # HTML files served fresh (matching the S3 sync cache-control headers)
  ordered_cache_behavior {
    path_pattern           = "*.html"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-tax4sure-website"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  # SPA routing: unknown paths → return index.html with 200
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 300
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # Custom domain aliases — only after SSL cert is validated in GoDaddy
  aliases = var.domain_ssl_validated ? [var.domain_name, "www.${var.domain_name}"] : []

  # Phase 1 (domain_ssl_validated=false): default CloudFront cert
  # Phase 2 (domain_ssl_validated=true):  ACM cert + custom domain
  viewer_certificate {
    cloudfront_default_certificate = var.domain_ssl_validated ? false : true
    acm_certificate_arn            = var.domain_ssl_validated ? aws_acm_certificate.website[0].arn : null
    ssl_support_method             = var.domain_ssl_validated ? "sni-only" : null
    minimum_protocol_version       = var.domain_ssl_validated ? "TLSv1.2_2021" : null
  }

  tags = {
    Name        = "Tax4Sure Website CDN"
    Environment = var.environment
  }
}
