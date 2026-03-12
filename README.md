# Tax4Sure – CPA Client Portal

A professional, secure document management portal for CPA firms and their clients. Built with Next.js 14, Google Sheets (user database), and Google Drive (file storage).

---

## Features

- **Secure Authentication** — NextAuth.js with JWT sessions and bcrypt password hashing
- **Google Sheets as User DB** — Zero-infrastructure user management
- **Google Drive File Storage** — Organized by client and tax year
- **Tax Year Organization** — Dedicated folders for 2022–2026
- **Drag & Drop Uploads** — Multi-file with per-file progress bars
- **Document Management** — Download, delete with confirmation
- **Responsive Design** — Mobile-first, collapsible sidebar
- **Professional UI** — Framer Motion animations, skeleton loaders, toast notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom shadcn/ui components |
| Auth | NextAuth.js (credentials + JWT) |
| User Database | Google Sheets API |
| File Storage | Google Drive API |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Animations | Framer Motion |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd tax4sure
npm install
```

### 2. Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable the following APIs:
   - **Google Sheets API**
   - **Google Drive API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a new service account
6. Download the JSON key file
7. Note the `client_email` and `private_key` from the JSON

### 3. Set Up Google Sheet

1. Create a new Google Sheet
2. Name the first sheet tab **`Users`**
3. Add these exact headers in row 1:
   ```
   ID | FullName | Email | Username | PasswordHash | Mobile | CreatedAt
   ```
4. Share the sheet with your service account email (Editor permission)
5. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 4. Set Up Google Drive

1. Open Google Drive
2. Create a folder named **`Tax4Sure`**
3. Share this folder with your service account email (Editor permission)
4. Get the folder ID from the URL: `https://drive.google.com/drive/folders/{FOLDER_ID}`

### 5. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_drive_folder_id
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
```

> **Tip:** Generate a strong NEXTAUTH_SECRET with:
> ```bash
> openssl rand -base64 32
> ```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
tax4sure/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              # Auth pages wrapper
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Sign up page
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout (auth guard + sidebar)
│   │   ├── page.tsx                # Year folder selection
│   │   └── [year]/page.tsx         # Document management per year
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth handler
│   │   ├── register/               # User registration
│   │   └── documents/
│   │       ├── upload/             # File upload to Drive
│   │       ├── list/               # List files for a year
│   │       ├── delete/             # Delete a file
│   │       └── stats/              # Dashboard stats (file counts)
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles + Tailwind
├── components/
│   ├── auth/
│   │   ├── BrandPanel.tsx          # Left branding panel for auth pages
│   ├── dashboard/
│   │   ├── YearFolderCard.tsx      # Tax year folder card with skeleton
│   │   ├── DocumentUploader.tsx    # Drag-and-drop file uploader
│   │   └── DocumentList.tsx        # File list with delete confirmation
│   ├── layout/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   └── Sidebar.tsx             # Collapsible sidebar
│   ├── ui/                         # Base UI components (shadcn/ui style)
│   └── providers.tsx               # NextAuth + Sonner providers
├── lib/
│   ├── auth-options.ts             # NextAuth config + rate limiting
│   ├── google-sheets.ts            # Sheets API helpers (users CRUD)
│   ├── google-drive.ts             # Drive API helpers (folders, files)
│   └── utils.ts                    # Shared utilities + constants
└── .env.local.example              # Environment variables template
```

---

## Security Notes

- Passwords are hashed with **bcrypt (12 salt rounds)** — never stored in plaintext
- All API routes validate the active session before processing
- File MIME types are validated server-side (not just by extension)
- Login endpoint has **rate limiting** (max 5 attempts per minute per IP)
- Input validation via **Zod** schemas on all API endpoints

---

## Supported File Types

| Type | Extension | Max Size |
|---|---|---|
| PDF Document | `.pdf` | 25 MB |
| JPEG Image | `.jpg`, `.jpeg` | 25 MB |
| PNG Image | `.png` | 25 MB |
| Excel Spreadsheet | `.xlsx`, `.xls` | 25 MB |
| CSV File | `.csv` | 25 MB |
| Word Document | `.docx`, `.doc` | 25 MB |

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables via Vercel dashboard or CLI:
vercel env add GOOGLE_CLIENT_EMAIL
vercel env add GOOGLE_PRIVATE_KEY
# ... etc
```

> **Note:** When setting `GOOGLE_PRIVATE_KEY` in Vercel, paste the raw value including `-----BEGIN PRIVATE KEY-----` lines. Vercel handles the escaping automatically.

---

## License

MIT © 2026 Tax4Sure
