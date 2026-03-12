# Tax4Sure — CPA Client Portal

A professional, secure document management portal for CPA firms and their clients. Clients can sign up, log in, and upload/manage tax documents organized by year — all backed by a serverless AWS infrastructure.

---

## Architecture

```
┌─────────────────┐       HTTPS        ┌──────────────────────┐
│   Browser (SPA)  │ ───────────────── │  S3 Static Website    │
│   Next.js 14     │                   │  tax4sure-website     │
└────────┬─────────┘                   └──────────────────────┘
         │
         │  API calls (fetch)
         ▼
┌──────────────────────┐    ┌─────────────────────┐
│  Lambda Function URL  │───│  AWS Lambda (Node 20)│
│  (public endpoint)    │   │  tax4sure-api        │
└───────────────────────┘   └──────────┬───────────┘
                                       │
                         ┌─────────────┼─────────────┐
                         ▼             ▼             ▼
                  ┌────────────┐ ┌──────────┐ ┌──────────────┐
                  │  DynamoDB   │ │ S3 Docs  │ │ JWT Auth     │
                  │  Users      │ │ (private)│ │ (sign/verify)│
                  └────────────┘ └──────────┘ └──────────────┘
```

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | Next.js 14 (static export) + TypeScript | S3 static website |
| Backend API | AWS Lambda (Node.js 20) | Lambda Function URL |
| Database | DynamoDB (PAY_PER_REQUEST) | AWS |
| File Storage | S3 (private bucket, pre-signed URLs) | AWS |
| Auth | JWT (jsonwebtoken) + bcrypt | Lambda |
| Infrastructure | Terraform | S3 remote state |
| CI/CD | GitHub Actions + OIDC | On push to `main` |

---

## Features

- **Secure Authentication** — JWT tokens + bcrypt password hashing (12 salt rounds)
- **DynamoDB User Store** — Serverless, zero-maintenance user database
- **S3 Document Storage** — Private bucket with pre-signed upload/download URLs
- **Tax Year Organization** — Dedicated folders for 2022–2026
- **Drag & Drop Uploads** — Multi-file with per-file progress bars
- **Document Management** — View, download, delete with confirmation dialog
- **Responsive Design** — Mobile-first, collapsible sidebar
- **Professional UI** — Framer Motion animations, skeleton loaders, toast notifications
- **GitHub OIDC** — No long-lived AWS keys; CI/CD uses short-lived role credentials

---

## Prerequisites

| Requirement | Details |
|---|---|
| **AWS Account** | With an OIDC role for GitHub Actions (broad permissions — see below) |
| **Terraform State Bucket** | `terraform-state-geekyrbhalala` must exist in `us-east-1` |
| **Node.js** | v20+ (for local development only) |

### GitHub OIDC Provider & Role (one-time setup)

You need an IAM OIDC identity provider for GitHub and a role with permissions for:
S3, DynamoDB, Lambda, IAM, CloudWatch Logs.

If you haven't already created the OIDC provider:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

The role's trust policy must allow your GitHub repo to assume it.

### Terraform State Bucket (one-time setup)

```bash
aws s3api create-bucket --bucket terraform-state-geekyrbhalala --region us-east-1
```

---

## Deployment — One Secret, Fully Automated

### Step 1: Add the single GitHub Secret

Go to **github.com/geekyrbhalala/tax4sure → Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|---|---|
| `AWS_ROLE_ARN` | ARN of your GitHub Actions OIDC role |

That's the **only** secret. Everything else is hardcoded or auto-generated.

### Step 2: Push & Deploy

```bash
git push origin main
```

GitHub Actions automatically runs three jobs in order:

1. **Terraform Apply** — Provisions all AWS resources (S3 buckets, DynamoDB, Lambda, IAM roles). JWT secret is auto-generated and stored in Terraform state.
2. **Deploy Lambda** — Compiles TypeScript, packages a ZIP, uploads to S3, updates the Lambda function.
3. **Deploy Website** — Builds Next.js (using the Lambda URL from Terraform output), syncs static files to S3.

### Step 3: Verify

After the workflow completes:

- **Website:** `http://tax4sure.s3-website-us-east-1.amazonaws.com`
- **API:** `curl <lambda_function_url>/api/auth/login` → returns 400 (missing body)
- **Sign up:** Create an account through the website

---

## Local Development

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_API_URL=https://xxx.lambda-url.us-east-1.on.aws/
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend runs locally but API calls go to the deployed Lambda.

---

## Project Structure

```
tax4sure/
├── app/                            # Next.js App Router pages
│   ├── (auth)/                     # Auth pages (login, signup)
│   │   ├── layout.tsx              # Split-screen auth layout
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Sign up page
│   ├── dashboard/                  # Protected dashboard pages
│   │   ├── layout.tsx              # Dashboard layout (navbar + sidebar)
│   │   ├── page.tsx                # Year folder grid
│   │   └── [year]/                 # Per-year document view
│   │       ├── page.tsx            # Server component
│   │       └── YearPageClient.tsx  # Client component (upload + list)
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing / redirect
│   └── globals.css                 # Global styles + Tailwind
│
├── components/
│   ├── auth/
│   │   └── BrandPanel.tsx          # Left branding panel for auth pages
│   ├── dashboard/
│   │   ├── YearFolderCard.tsx      # Tax year folder card
│   │   ├── DocumentUploader.tsx    # Drag-and-drop multi-file uploader
│   │   └── DocumentList.tsx        # File list with delete confirmation
│   ├── layout/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── Sidebar.tsx             # Collapsible sidebar
│   ├── ui/                         # Base UI components (shadcn/ui style)
│   └── providers.tsx               # AuthProvider + Toaster wrapper
│
├── lib/
│   ├── api-client.ts               # Centralized fetch wrapper (adds JWT)
│   ├── auth-client.ts              # Client-side token/user storage
│   ├── auth-context.tsx            # React auth context provider
│   ├── types.ts                    # Shared TypeScript interfaces
│   └── utils.ts                    # Shared utilities + constants
│
├── lambda/                         # AWS Lambda backend (separate package)
│   ├── index.ts                    # Router (maps paths to handlers)
│   ├── handlers/
│   │   ├── auth.ts                 # Login + registration handlers
│   │   └── documents.ts           # List, delete, presign-upload handlers
│   ├── lib/
│   │   ├── dynamodb.ts             # DynamoDB client + user CRUD
│   │   ├── jwt.ts                  # JWT sign/verify helpers
│   │   └── response.ts            # HTTP response helpers + CORS
│   ├── package.json
│   └── tsconfig.json
│
├── terraform/                      # Infrastructure as Code
│   ├── providers.tf                # AWS provider + S3 backend
│   ├── variables.tf                # Input variables
│   ├── dynamodb.tf                 # DynamoDB users table
│   ├── s3.tf                       # S3 buckets (website, documents, artifacts)
│   ├── lambda.tf                   # Lambda function + function URL
│   ├── iam.tf                      # IAM role (Lambda execution)
│   └── outputs.tf                  # Terraform outputs
│
├── .github/workflows/
│   └── deploy.yml                  # CI/CD: build + deploy on push to main
│
├── .env.local.example              # Environment variables template
├── package.json                    # Frontend dependencies
├── next.config.mjs                 # Next.js config (static export)
├── tailwind.config.ts              # Tailwind CSS config
└── tsconfig.json                   # TypeScript config
```

---

## API Endpoints

All endpoints are served by the Lambda function at the `NEXT_PUBLIC_API_URL` base.

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | No | Log in with username/email + password |
| `POST` | `/api/auth/register` | No | Create a new account |
| `GET` | `/api/documents/list?year=2025` | Yes | List documents for a tax year |
| `GET` | `/api/documents/stats` | Yes | Get file counts for all tax years |
| `POST` | `/api/documents/presign-upload` | Yes | Get a pre-signed S3 upload URL |
| `DELETE` | `/api/documents/delete?fileId=...` | Yes | Delete a document |

Auth endpoints accept JSON bodies. Protected endpoints require `Authorization: Bearer <token>`.

---

## Supported File Types

| Type | Extensions | Max Size |
|---|---|---|
| PDF | `.pdf` | 25 MB |
| Images | `.jpg`, `.jpeg`, `.png` | 25 MB |
| Spreadsheets | `.xlsx`, `.xls`, `.csv` | 25 MB |
| Documents | `.docx`, `.doc` | 25 MB |

---

## Security

- Passwords hashed with **bcrypt (12 salt rounds)** — never stored in plaintext
- JWT tokens for stateless authentication
- All document endpoints validate the JWT before processing
- File uploads go through **pre-signed S3 URLs** — files never pass through Lambda
- File ownership enforced: users can only access `clients/{username}/` paths
- Input validation via **Zod** schemas on all endpoints
- Documents bucket is **private** — all public access blocked
- GitHub Actions uses **OIDC** — no long-lived AWS credentials stored as secrets
- CORS headers set on Lambda responses

---

## Terraform Variables

| Variable | Default | Description |
|---|---|---|
| `aws_region` | `us-east-1` | AWS region |
| `website_bucket_name` | `tax4sure-website` | S3 bucket for static site |
| `documents_bucket_name` | `tax4sure-documents` | S3 bucket for client documents |
| `lambda_artifacts_bucket` | `tax4sure-lambda-artifacts` | S3 bucket for Lambda ZIP |
| `dynamodb_table_name` | `tax4sure-users` | DynamoDB table name |
| `jwt_secret` | *(required)* | Secret for signing JWT tokens (min 32 chars) |
| `github_repo` | `geekyrbhalala/tax4sure` | GitHub repo allowed to assume OIDC role |
| `environment` | `prod` | Environment tag |

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

**Job 1: Deploy Lambda API**
1. Checkout code
2. Install Lambda dependencies (`npm ci`)
3. Compile TypeScript
4. Package `dist/` + `node_modules/` into `lambda.zip`
5. Assume AWS role via OIDC
6. Upload ZIP to `s3://tax4sure-lambda-artifacts/api/lambda.zip`
7. Update Lambda function code

**Job 2: Deploy Static Website**
1. Checkout code
2. Install frontend dependencies (`npm ci`)
3. Build static site (`next build` with `output: "export"`)
4. Assume AWS role via OIDC
5. Sync `out/` to `s3://tax4sure-website` with cache headers

---

## License

MIT © 2026 Tax4Sure
