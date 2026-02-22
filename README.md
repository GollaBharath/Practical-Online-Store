# Practical Online Store

A lightweight storefront where customers browse products and contact the store owner directly via WhatsApp — no payment gateway, no complex backend.

**Live:** [practical-online-store.vercel.app](https://practical-online-store.vercel.app)

---

## How it works

Customers browse the catalog, filter by category or print type, and tap the WhatsApp button to enquire about a product. The store owner manages everything through a hidden admin panel.

---

## Features

**Customer side**

- Browse products with search and category filters
- Filter by color print / B&W print pricing
- Contact store via WhatsApp directly from any product
- Fully responsive, mobile-first

**Admin side**

- Login at `/<NEXT_PUBLIC_ADMIN_PATH>` (obscured URL, not `/admin`)
- Manage shop settings (name, tagline, phone, address, etc.)
- Create and nest categories
- Add, edit, and delete products
- Upload product images to Supabase Storage

---

## Tech Stack

| Layer      | Tech                                |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router, TypeScript) |
| Database   | PostgreSQL via Supabase             |
| ORM        | Prisma 5                            |
| Storage    | Supabase Storage                    |
| Auth       | Supabase Auth (admin only)          |
| Styling    | Tailwind CSS 4                      |
| Deployment | Vercel                              |

---

## Local setup

### 1. Clone and install

```bash
git clone https://github.com/GollaBharath/Practical-Online-Store.git
cd Practical-Online-Store
npm install
```

### 2. Environment variables

Create a `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_KEY=<service role key>

# Supabase connection pooler (port 6543) — for runtime
DATABASE_URL="postgresql://postgres.<project>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (port 5432) — for Prisma migrations only
DIRECT_URL="postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres"

NEXT_PUBLIC_SHOP_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_ADMIN_PATH=your-secret-path
```

> Get `DATABASE_URL` from Supabase → Settings → Database → **Transaction pooler** (port 6543).

### 3. Set up the database

```bash
npx prisma migrate deploy
```

### 4. Run

```bash
npm run dev
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add all env vars from above in **Vercel → Settings → Environment Variables**
   - Do **not** add `NODE_ENV` — Vercel sets it automatically
4. Vercel will run `prisma generate && next build` automatically

---

## Project structure

```
app/
  page.tsx              # Storefront / catalog
  admin/page.tsx        # Admin login
  admin/dashboard/      # Admin panel
  api/                  # REST endpoints
  category/[id]/        # Category browse page
components/
  AppShell.tsx          # Site header/footer
  CatalogShell.tsx      # Search + filter UI
  ProductCard.tsx
  ProductGrid.tsx
  admin/
    AdminDashboard.tsx
    AdminLoginForm.tsx
lib/
  prisma.ts             # Prisma client singleton
  supabase.ts           # Supabase clients
  admin.ts              # Admin session helpers
  shop-settings.ts      # Settings fetcher
  image-utils.ts        # Image validation + optimization
prisma/
  schema.prisma
  migrations/
```
