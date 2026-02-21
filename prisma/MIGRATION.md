# Prisma Migration Instructions

This file contains the SQL migration for creating the products table using Prisma.

## How to Run Migrations

Since we're using Prisma, you have two options:

### Option 1: Use Prisma Migrate (Recommended)

```bash
# Generate a migration based on schema changes
npx prisma migrate dev --name init

# This will:
# 1. Generate the migration file
# 2. Run it against your database
# 3. Generate/update Prisma Client
```

### Option 2: Manual SQL (If Prisma Migrate Doesn't Work)

If you get connection errors, run this SQL manually in Supabase SQL Editor:

```sql
-- CreateTable products
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "imageUrl" VARCHAR(500),
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt" DESC);
```

## Next Steps

1. Make sure DATABASE_URL is set in .env.local
2. Run: `npx prisma migrate dev --name init`
3. Test with: `curl http://localhost:3000/api/health`
