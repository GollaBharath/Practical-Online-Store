# Supabase Setup Guide - Phase 2

This guide walks through setting up Supabase for the Practical Online Store project.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"** (or sign in if you don't have an account)
3. Fill in project details:
   - **Name**: `practical-online-store` (or your choice)
   - **Database Password**: Create a strong password (save it safely)
   - **Region**: Choose region closest to your location
4. Click **"Create new project"** (wait 2-3 minutes for initialization)

## Step 2: Get API Credentials

Once project is created:

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (under "Project API keys") → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret, scroll down) → `SUPABASE_SERVICE_KEY`

3. Update `.env.local` in your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

## Step 3: Create Products Table

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste the entire contents of [migrations/001_create_products_table.sql](migrations/001_create_products_table.sql)
4. Click **"Run"**
5. Verify: Go to **Table Editor** → you should see `products` table

## Step 4: Create Storage Bucket

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `product-images`
   - **Privacy**: Public
   - Click **"Create bucket"**

4. Click on `product-images` bucket → **Policies** tab
5. Click **"New policy"** → **For SELECT**
   - Policy Name: `Select - Public Read`
   - Template: `"For public read access"`
   - Click **"Review"** → **"Save policy"**

## Step 5: Set RLS Policies

1. Go to **SQL Editor** again
2. Click **"New Query"**
3. Paste the entire contents of [migrations/002_setup_rls_policies.sql](migrations/002_setup_rls_policies.sql)
4. Click **"Run"**

## Step 6: Create Admin User

### Method A: Via Supabase Dashboard (Recommended for first setup)

1. Go to **Authentication** (left sidebar)
2. Click **"Create new user"**
3. Enter:
   - **Email**: admin@yourshop.com (or your email)
   - **Password**: Your strong admin password (save it!)
   - Check **"Auto send invite email"** (uncheck)
4. Click **"Create user"**

### Method B: Via SQL (Alternative)

1. Go to **SQL Editor**
2. Click **"New Query"**
3. Run this:

```sql
-- Create admin user (you'll still need to set password in Auth panel)
INSERT INTO auth.users (email, email_confirmed_at)
VALUES ('admin@yourshop.com', NOW());
```

## Step 7: Test Supabase Connection

1. Update `.env.local` with your credentials (from Step 2)
2. Run your dev server:

```bash
npm run dev
```

3. Open browser to `http://localhost:3000`
4. Check browser console (F12) for any errors

5. Optional: Create a test API route to verify connection works:
   - See [lib/tests/supabase-test.ts](lib/tests/supabase-test.ts) for a test script

## Step 8: Verify Everything

Checklist:

- [ ] Supabase project created
- [ ] API credentials copied to `.env.local`
- [ ] `products` table created (check Table Editor)
- [ ] `product-images` storage bucket created
- [ ] RLS policies applied
- [ ] Admin user created
- [ ] Dev server runs without Supabase errors
- [ ] (Optional) Test script runs successfully

## Troubleshooting

### "Missing Supabase environment variables" Error

- Make sure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after updating `.env.local`

### "Invalid Login Credentials"

- Check email and password for admin user in Supabase Auth panel
- Password must be set before you can log in

### "Access Denied" when uploading images

- Make sure RLS policy for storage bucket is set to public read, authenticated write
- Check that you're authenticated as admin before uploading

### Products table not showing

- Go to SQL Editor → check if query ran successfully
- If error, copy the SQL again and double-check syntax

## Next Steps

Once Phase 2 is complete:

- Move to **Phase 3: Core Frontend Components**
- Start building ProductCard, ProductGrid, Cart components

## Environment Variables Reference

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (public key)
SUPABASE_SERVICE_KEY=eyJhbGc...           (secret key)

# Shop
NEXT_PUBLIC_SHOP_PHONE=+1234567890        (WhatsApp number)
NEXT_PUBLIC_ADMIN_PATH=admin-secret-12345 (obscure admin path)
```

Replace placeholders with your actual values.
