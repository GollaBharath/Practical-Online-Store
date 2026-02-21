# Phase 2 Quick Reference

## 📋 Files Provided

| File                                       | Purpose                              |
| ------------------------------------------ | ------------------------------------ |
| `PHASE2_STATUS.md`                         | Complete Phase 2 status & what to do |
| `SUPABASE_SETUP.md`                        | Detailed step-by-step guide          |
| `migrations/001_create_products_table.sql` | Create products table                |
| `migrations/002_setup_rls_policies.sql`    | Set up security policies             |
| `app/api/health/route.ts`                  | Health check endpoint                |
| `app/api/products/route.ts`                | Products API (GET)                   |
| `lib/tests/supabase-test.ts`               | Connection test script               |

## ⚡ Quick Start (7 Steps, ~20 minutes)

```bash
# 1. Create Supabase account & project
→ https://supabase.com → New Project

# 2. Get API keys
Settings → API → Copy 3 values

# 3. Update .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# 4. Restart dev server
npm run dev

# 5. Run migrations
SQL Editor → Copy migrations/001_*.sql → Run
SQL Editor → Copy migrations/002_*.sql → Run

# 6. Create storage bucket
Storage → Create "product-images" → Public → Policies → Select

# 7. Create admin user
Authentication → Create User → admin@yourshop.com

# 8. Test connection
curl http://localhost:3000/api/health
```

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] `.env.local` updated with 3 keys
- [ ] Dev server restarted
- [ ] Products table exists in Supabase
- [ ] `product-images` bucket exists & public
- [ ] RLS policies applied
- [ ] Admin user created
- [ ] `/api/health` returns `{"success": true}`

## 🔗 Links

- **Supabase Dashboard:** https://supabase.com
- **This Project:** [PHASE2_STATUS.md](PHASE2_STATUS.md)
- **Detailed Guide:** [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

## 🚀 After Phase 2

Once verification passes:
→ Ready for **Phase 3: Core Frontend Components**
