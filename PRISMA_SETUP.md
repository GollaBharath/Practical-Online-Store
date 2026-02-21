# Prisma + Supabase Setup Guide

This guide walks through setting up Prisma ORM with Supabase PostgreSQL for the Practical Online Store.

## Architecture

```
Next.js Application
       ↓
   Prisma ORM (Type-safe database access)
       ↓
PostgreSQL (Hosted on Supabase)
```

**Benefits of using Prisma:**

- Type-safe database queries
- Auto-generated migrations
- No need to write raw SQL
- Built-in relationship management

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name**: `practical-online-store`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose your region
4. Wait 2-3 minutes for initialization

---

## Step 2: Get Supabase Database Connection URL

### For Prisma (Connection String Format)

1. In your Supabase project dashboard
2. Go to **Settings** → **Database** (left sidebar)
3. Look for **"Connection Pooling"** or **"Direct Connection"**
4. Click the copy icon next to **"Connection string"**
5. Choose **"Prisma"** from the dropdown if available
6. The URL should look like:
   ```
   postgresql://postgres:passw0rd@db.xxxxx.supabase.co:5432/postgres
   ```

### If Prisma dropdown is not available:

1. Click **"Direct Connection"** tab
2. Copy the connection string
3. Update the `postgres.password` part if needed
4. Add `?schema=public` at the end (important!)

**Final URL format:**

```
postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
```

---

## Step 3: Update .env.local

Add this line to `.env.local`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
```

**Replace:**

- `YOUR_PASSWORD` with your database password from Supabase
- `xxxxx` with your Supabase project ID

### Full .env.local template:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Database (PostgreSQL via Supabase - For Prisma)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"

# Shop Configuration
NEXT_PUBLIC_SHOP_PHONE=+1234567890
NEXT_PUBLIC_ADMIN_PATH=admin-secret-12345

# Environment
NODE_ENV=development
```

---

## Step 4: Test Supabase Connection

```bash
# Try to connect (this will tell you if the connection URL is correct)
npx prisma db push --skip-generate
```

If you get connection errors:

- Check DATABASE_URL in .env.local (no typos)
- Verify password is correct
- Make sure Supabase project is fully initialized
- Try again in a few minutes if it just started

---

## Step 5: Create Database Schema with Prisma Migrate

```bash
# Generate and run the initial migration
npx prisma migrate dev --name init
```

This will:

1. Create the `products` table in Supabase
2. Generate Prisma Client (TypeScript types)
3. Create migration files in `prisma/migrations/`

**What it creates:**

- `Product` table with columns: id, name, price, description, imageUrl, category, createdAt, updatedAt
- Indexes on `category` and `createdAt` for fast queries

---

## Step 6: Create Supabase Storage Bucket

1. In Supabase dashboard → **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `product-images`
   - **Privacy**: **Public**
   - Click **"Create bucket"**

4. Click the bucket → **Policies** tab
5. Click **"New policy"** → Select **"For SELECT"**
   - Use template: "For public read access"
   - Click **"Review"** → **"Save policy"**

6. Add another policy for uploads:
   - Click **"New policy"** → **"For INSERT"**
   - Condition: `(auth.role() = 'authenticated')`
   - Click **"Review"** → **"Save policy"**

---

## Step 7: Create Admin User

1. In Supabase → **Authentication** (left sidebar)
2. Click **"Create new user"**
3. Enter:
   - **Email**: `admin@yourshop.com`
   - **Password**: Your strong admin password
   - **Auto send invite email**: Uncheck
4. Click **"Create user"**

**Save these credentials!** You'll need them for the admin login.

---

## Step 8: Test Everything

### Test Database Connection

```bash
# Check if Prisma can connect to database
curl http://localhost:3000/api/health
```

Response should be:

```json
{
	"success": true,
	"message": "Database connection successful",
	"checks": {
		"database": true,
		"productsCount": 0
	}
}
```

### Test Prisma Client

```bash
# Open Prisma Studio to view/manage database
npx prisma studio
```

This opens a UI at `http://localhost:5555` where you can:

- View all products
- Create test products
- See database structure

---

## Common Issues & Solutions

### Error: "Can't reach database server"

**Cause:** Connection URL is wrong or Supabase is still initializing

**Fix:**

1. Double-check DATABASE_URL in `.env.local`
2. Verify password is correct (no special characters mistyped)
3. Wait for Supabase project to fully initialize (5 minutes)
4. Try pinging Supabase: Check the status at https://status.supabase.com

### Error: "getaddrinfo ENOTFOUND db.xxxxx.supabase.co"

**Cause:** Network/DNS issue or wrong project ID

**Fix:**

1. Copy the connection string again from Supabase Settings
2. Make sure you're using the full URL with protocol (`postgresql://`)
3. Check internet connection

### Error: "permission denied for schema public"

**Cause:** Authentication issue with database

**Fix:**

1. Verify DATABASE_URL password is correct
2. Try resetting database password in Supabase settings
3. Recreate connection string from scratch

### Prisma Studio won't open

**Cause:** Database connection issue

**Fix:**

1. Make sure `npx prisma db push` works first
2. Database must be reachable before studio can open

---

## File Structure

```
prisma/
├── schema.prisma        // Database schema (models)
├── migrations/          // Auto-generated migrations
│   └── (timestamp)_init/
│       └── migration.sql
├── MIGRATION.md         // These instructions
└── seed.ts             // (Optional) Seed database with test data

lib/
├── prisma.ts           // Prisma Client instance
├── supabase.ts         // Supabase client (for storage/auth)
└── cart.ts             // Cart utilities
```

---

## Next Steps

1. ✅ Supabase project created
2. ✅ DATABASE_URL in .env.local
3. ✅ Run `npx prisma migrate dev --name init`
4. ✅ Storage bucket created
5. ✅ Admin user created
6. ✅ Test at `/api/health` returns success

→ **Ready for Phase 3: Core Frontend Components**

---

## Useful Commands

```bash
# View/edit database in GUI
npx prisma studio

# Check database connection
npx prisma db execute --stdin < /dev/null

# Create a migration for schema changes
npx prisma migrate dev --name add_new_field

# View migration status
npx prisma migrate status

# Reset database (warning: deletes all data!)
npx prisma migrate reset
```

---

## Architecture Reference

- **Prisma Client**: `lib/prisma.ts` (singleton instance)
- **API Routes**: `app/api/products/` (use Prisma for queries)
- **Database**: Supabase PostgreSQL (accessed via Prisma)
- **Storage**: Supabase Storage (accessed via @supabase/supabase-js)
