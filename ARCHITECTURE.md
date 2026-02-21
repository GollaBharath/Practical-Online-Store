# Practical Online Store - Architecture

## Overview
A lightweight e-commerce catalog for local shops. Customers browse products, add to cart (cookie-based), generate a PDF, and contact the shop owner via WhatsApp. No authentication required for customers. Admin panel for product management.

## Tech Stack
- **Frontend**: Next.js 14+ (React, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (product images)
- **PDF Generation**: jsPDF (client-side)
- **Styling**: Tailwind CSS
- **State Management**: React hooks + Context API (for cart)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                     │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Catalog    │    Cart      │    Admin     │   PDF/Share    │
│   (Public)   │  (Cookies)   │  (Protected) │   (WhatsApp)   │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       │      GET /api/products      │                │
       │      POST /api/admin/*      │                │
       │       (Protected)           │                │
       └──────────────┬──────────────┘                │
                      │                               │
                      ▼                               │
        ┌──────────────────────────┐                 │
        │  SUPABASE (PostgreSQL)   │                 │
        │                          │                 │
        │  - Products table        │                 │
        │  - Admin auth (RLS)      │                 │
        │  - Storage bucket        │◄────────────────┘
        │    (images)              │
        └──────────────────────────┘
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Auth (Supabase Built-in)
- Admin user (email + password)
- Simple JWT-based session

## Storage
- **Bucket**: `product-images`
- **Folder structure**: `product-images/{category}/{product-id}/`
- **Access**: Public read (for image URLs), authenticated write (admin only)

## Frontend Structure

```
app/
├── page.tsx                 # Homepage (product catalog)
├── api/
│   ├── products/
│   │   └── route.ts         # GET products (public)
│   └── admin/
│       ├── route.ts         # Admin auth
│       ├── products/
│       │   ├── route.ts     # POST/PUT/DELETE products
│       │   └── upload/      # Image upload
│       └── orders/
│           └── route.ts     # View orders (future)
│
├── components/
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   ├── CartSidebar.tsx
│   └── PDFGenerator.tsx
│
├── admin/
│   ├── page.tsx             # Admin login
│   ├── dashboard/
│   │   └── page.tsx         # Product management
│   └── middleware.ts        # Auth check
│
├── lib/
│   ├── supabase.ts          # Client & server
│   ├── auth.ts              # Admin auth logic
│   └── cart.ts              # Cookie cart utils
│
└── styles/
    └── globals.css
```

## Key Flows

### 1. Customer Browse & Cart
- User visits `/` → fetches products from Supabase
- Clicks "Add to Cart" → item stored in cookie (JSON array)
- Cookie persists across sessions
- Cart shown in sidebar

### 2. Checkout & PDF
1. User clicks "Generate PDF"
2. PDFGenerator collects cart items
3. jsPDF creates PDF client-side with:
   - Product list with images (from Supabase Storage URLs)
   - Total price
   - QR code or link (optional)
4. PDF is generated and ready to share

### 3. WhatsApp Share
- User clicks "Send to WhatsApp"
- Opens: `https://wa.me/+{SHOP_PHONE}?text={MESSAGE}`
- Message includes PDF link (if stored) or user manually shares

### 4. Admin Upload
1. Admin visits `/{OBSCURE_PATH}` (e.g., `/admin-xyz123`)
2. Logs in with email/password (Supabase auth)
3. Dashboard shows:
   - Product list
   - Add/Edit/Delete forms
   - Image upload (to Supabase Storage)
4. Creates new products or updates existing

## Cookie Cart Schema
```javascript
// localStorage/cookies
{
  items: [
    { id: "uuid", name: "Product", price: 100, quantity: 2, image_url: "..." },
    ...
  ],
  totalPrice: 200,
  lastUpdated: "timestamp"
}
```

## Security
- **Admin path**: Obscured URL + Supabase RLS policies
- **Admin auth**: Supabase email + password (JWT)
- **API protection**: Row-level security (RLS) on products table
- **Image access**: Public read, authenticated write only
- **No price tampering**: Shop owner validates in WhatsApp (optional backend check)

## Deployment
- **Frontend**: Vercel (Next.js native)
- **Database**: Supabase hosted PostgreSQL
- **Storage**: Supabase Storage (included)
- **Environment vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`

## Future Enhancements
- Order history (store customer messages)
- Analytics (popular products)
- Inventory tracking
- Multiple shop admin accounts
- Product reviews/ratings
