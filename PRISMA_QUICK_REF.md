# Prisma Setup - Quick Reference

## Installation ✓

Already installed:

```
✓ @prisma/client@5.x
✓ prisma@5.x
✓ prisma/schema.prisma (created with Product model)
✓ lib/prisma.ts (Prisma Client singleton)
```

## Setup in 5 Steps (~10 minutes)

### 1️⃣ Get Supabase Connection URL

```
Supabase Dashboard → Settings → Database → Copy connection string (Prisma format)
```

URL format:

```
postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public
```

### 2️⃣ Update .env.local

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?schema=public"
```

### 3️⃣ Run Migration

```bash
npx prisma migrate dev --name init
```

This creates your products table in Supabase.

### 4️⃣ Create Storage Bucket (Manual)

```
Supabase → Storage → Create "product-images" → Public → Add SELECT/INSERT policies
```

### 5️⃣ Create Admin User (Manual)

```
Supabase → Authentication → Create user → admin@yourshop.com
```

### 6️⃣ Verify

```bash
curl http://localhost:3000/api/health
# Should return: { "success": true, "database": true }
```

---

## Files Updated for Prisma

| File                        | Change                                       |
| --------------------------- | -------------------------------------------- |
| `lib/prisma.ts`             | ✓ New file - Prisma Client instance          |
| `app/api/products/route.ts` | ✓ Updated - Uses `prisma.product.findMany()` |
| `app/api/health/route.ts`   | ✓ Updated - Uses `prisma.product.count()`    |
| `prisma/schema.prisma`      | ✓ New - Database schema with Product model   |
| `.env.local`                | ✓ Updated - Added DATABASE_URL               |
| `PRISMA_SETUP.md`           | ✓ New - Detailed setup guide                 |

---

## Prisma Commands

```bash
# Open database GUI (http://localhost:5555)
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name feature_name

# View migration status
npx prisma migrate status

# Run pending migrations
npx prisma db push

# Reset database (warning: destructive!)
npx prisma migrate reset
```

---

## API Examples

### Fetch Products

```javascript
GET http://localhost:3000/api/products
GET http://localhost:3000/api/products?category=electronics
GET http://localhost:3000/api/products?limit=10&offset=0
```

### Test Connection

```javascript
GET http://localhost:3000/api/health
```

---

## Schema Reference

**Product table:**

```
id (String, UUID)
name (String, required)
price (Decimal, 2 decimals)
description (String, optional)
imageUrl (String, optional)
category (String, optional)
createdAt (DateTime, auto)
updatedAt (DateTime, auto)
```

---

## Documentation

- **Full Guide**: [PRISMA_SETUP.md](PRISMA_SETUP.md)
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Next Phase

Once migration completes successfully:
→ **Phase 3: Core Frontend Components**
