# Phase 2 Completion Status

## What Has Been Prepared ✓

All infrastructure code and guidance has been created. You need to perform the manual setup steps.

### Files Created:

```
✓ migrations/001_create_products_table.sql
    → SQL to create products table with proper schema
    → Ready to copy-paste into Supabase SQL Editor

✓ migrations/002_setup_rls_policies.sql
    → SQL to set up Row-Level Security policies
    → Public read access for products
    → Admin-only write/update/delete access

✓ SUPABASE_SETUP.md
    → Step-by-step guide for Supabase account & project setup
    → Instructions for each step of Phase 2
    → Troubleshooting guide

✓ app/api/health/route.ts
    → Health check endpoint at GET /api/health
    → Test if Supabase connection is working

✓ app/api/products/route.ts
    → Public API endpoint to fetch products
    → Supports filtering by category & pagination

✓ lib/tests/supabase-test.ts
    → Test script to verify connection
    → Can be run from terminal or imported
```

---

## What You Need To Do (Manual Steps)

### Step 1: Create Supabase Project

**Time: 5 minutes**

1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project:
   - Name: `practical-online-store`
   - Set a strong database password
   - Choose your region
4. Wait 2-3 minutes for initialization

### Step 2: Get & Add API Credentials

**Time: 2 minutes**

1. In Supabase dashboard → Settings → API
2. Copy these 3 values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_KEY`

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

4. Restart dev server: `npm run dev`

### Step 3: Create Products Table

**Time: 1 minute**

1. In Supabase → SQL Editor → New Query
2. Copy entire contents of: `migrations/001_create_products_table.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Verify: Go to Table Editor, you should see `products` table

### Step 4: Create Storage Bucket

**Time: 2 minutes**

1. In Supabase → Storage
2. Click "Create a new bucket"
3. Name: `product-images`
4. Privacy: **Public**
5. Click "Create bucket"
6. Click the bucket → Policies tab
7. Click "New policy" → Select "For SELECT"
8. Use template "For public read access"
9. Save

### Step 5: Set RLS Policies

**Time: 1 minute**

1. Supabase → SQL Editor → New Query
2. Copy entire contents of: `migrations/002_setup_rls_policies.sql`
3. Paste and run
4. Done!

### Step 6: Create Admin User

**Time: 1 minute**

1. Supabase → Authentication (left sidebar)
2. Click "Create new user"
3. Email: `admin@yourshop.com` (or your email)
4. Password: Create a strong password (save it!)
5. Click "Create user"

### Step 7: Test Connection

**Time: 2 minutes**

**Option A: Via API Endpoint**

```bash
# Run dev server if not already running
npm run dev

# Open in browser
http://localhost:3000/api/health

# Should return JSON with success: true
```

**Option B: Via Test Script**

```bash
# In terminal
node -e "import('./lib/tests/supabase-test.ts').then(m => m.testSupabaseConnection())"
```

**Option C: Manual Testing**

```javascript
// In browser console (http://localhost:3000)
import { supabase } from "@/lib/supabase";
const { data } = await supabase.from("products").select();
console.log(data);
```

---

## Quick Checklist

Complete these manually:

- [ ] Created Supabase project at supabase.com
- [ ] Copied API credentials to `.env.local`
- [ ] Restarted dev server after updating `.env.local`
- [ ] Ran migration 001 (products table) in SQL Editor
- [ ] Created `product-images` storage bucket (Public)
- [ ] Ran migration 002 (RLS policies) in SQL Editor
- [ ] Created admin user in Authentication
- [ ] Tested connection at /api/health (shows success: true)

---

## Common Issues & Fixes

### Error: "Missing Supabase environment variables"

**Solution:** Make sure `.env.local` has both:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then restart dev server (`npm run dev`)

### Error: "relation 'public.products' does not exist"

**Solution:** Run migration 001 in SQL Editor. Make sure the query succeeded.

### Error: "permission denied" on API

**Solution:** Make sure RLS policies were applied (migration 002)

### Login fails

**Solution:** Check that admin user exists in Supabase Auth panel. Password must be set.

### Storage bucket shows 404

**Solution:** Create bucket with name `product-images` in Storage. Must be **Public**.

---

## Next Steps

Once all manual steps are complete and `/api/health` returns `success: true`:

**→ Proceed to Phase 3: Core Frontend Components**

---

## Reference

- **Full Setup Guide:** [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- **Products Table Schema:** [migrations/001_create_products_table.sql](migrations/001_create_products_table.sql)
- **RLS Policies:** [migrations/002_setup_rls_policies.sql](migrations/002_setup_rls_policies.sql)
- **Env Variables Template:** `.env.local` (at root)
