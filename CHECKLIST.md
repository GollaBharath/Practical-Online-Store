# Practical Online Store - Build Checklist

## Phase 1: Project Setup

- [x] Initialize Next.js project (with TypeScript, Tailwind CSS)
- [x] Install dependencies: supabase, jspdf, next-auth (if needed)
- [x] Create `.env.local` with Supabase credentials
- [ ] Set up Supabase project & get API keys
- [x] Create basic folder structure (lib, components, app, styles)

## Phase 2: Supabase & Prisma Setup

- [x] Set up Prisma ORM with TypeScript
- [x] Create Prisma schema with Product model
- [x] Create lib/prisma.ts (Prisma Client singleton)
- [x] Update API routes to use Prisma instead of raw SQL
- [x] Create Supabase project at supabase.com
- [x] Get Supabase PostgreSQL connection URL
- [x] Update .env.local with DATABASE_URL
- [x] Run migrations: `npx prisma migrate dev --name init` ✓ SUCCESS
- [x] Create `product-images` storage bucket in Supabase
- [x] Create admin user in Supabase Auth
- [x] API endpoint: /api/health (working ✓)
- [x] API endpoint: /api/products (working ✓)

## Phase 3: Core Frontend Components

- [x] Create `ProductCard.tsx` component
- [x] Create `ProductGrid.tsx` component
- [x] Create `CartContext.tsx` (React Context for cart state)
- [x] Create `Cart.tsx` sidebar/drawer component
- [x] Create layout with header, footer, cart button

## Phase 4: Catalog & Cart Logic

- [x] Build homepage (`app/page.tsx`) with product grid
- [x] Implement "Add to Cart" button → save to cookies/localStorage
- [x] Build cart sidebar (show items, quantity, total)
- [x] Add "Remove from Cart" functionality
- [x] Add "Update Quantity" in cart
- [x] Persist cart in cookies/localStorage

## Phase 5: API Routes

- [x] Create `app/api/products/route.ts` (GET all products)
- [x] Create `app/api/admin/auth/route.ts` (admin login)
- [x] Create `app/api/admin/products/route.ts` (POST/PUT/DELETE products)
- [x] Create `app/api/admin/products/upload/route.ts` (image upload to Supabase)
- [ ] Add auth middleware for admin routes

## Phase 6: PDF Generation

- [x] Create `PDFGenerator.tsx` component
- [x] Implement jsPDF cart → PDF conversion
- [x] Add product images to PDF (fetch from Supabase Storage URLs)
- [x] Format PDF with: product list, quantities, total price
- [x] Add "Download PDF" button on cart

## Phase 7: WhatsApp Integration

- [x] Create `WhatsAppShare.tsx` component
- [x] Generate WhatsApp link: `wa.me/+{PHONE}?text={MESSAGE}`
- [x] Pre-fill message with cart summary or PDF link
- [x] Add "Send to WhatsApp" button
- [x] Store shop owner's WhatsApp number in env variable

## Phase 8: Admin Panel

- [x] Create `app/admin/page.tsx` (login form)
- [x] Create `app/admin/dashboard/page.tsx` (product management)
- [x] Implement admin login (Supabase auth)
- [x] Build "Add Product" form (name, price, description, image upload)
- [x] Build "Edit Product" functionality
- [x] Build "Delete Product" functionality
- [x] Add image upload to Supabase Storage (with folder structure)
- [x] Protect admin routes with middleware
- [x] Use obscure URL path for admin login (env variable)

## Phase 9: Admin Authentication

- [x] Set up Supabase Auth client in Next.js
- [x] Create admin middleware to check auth tokens
- [x] Implement logout functionality
- [x] Store JWT token in secure httpOnly cookies
- [x] Add session persistence on page reload

## Phase 10: UI & Polish

- [x] Design homepage with hero section
- [x] Style product cards (image, name, price, add button)
- [x] Design cart sidebar (clean, mobile-friendly)
- [x] Make responsive for mobile devices
- [x] Add loading states (skeleton loaders)
- [x] Add error handling (network errors, image failures)
- [x] Add toast notifications (add to cart, upload success, etc.)

## Phase 11: Image Handling

- [x] Set up Supabase Storage client
- [x] Implement image upload form in admin
- [x] Generate public image URLs from Supabase Storage
- [x] Handle image optimization/resizing (optional)
- [x] Fallback for missing images (placeholder)

## Phase 12: Testing & Validation

- [ ] Test cart persistence across browser refresh
- [ ] Test PDF generation with multiple items
- [ ] Test WhatsApp link (opens correct chat)
- [ ] Test admin login/logout
- [ ] Test product upload (image + metadata)
- [ ] Test product edit/delete
- [ ] Test on mobile devices
- [ ] Check Supabase RLS policies work correctly

## Phase 13: Deployment

- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel
- [ ] Deploy to Vercel
- [ ] Test live site (catalog, cart, admin)
- [ ] Set up Supabase backups
- [ ] Document admin login URL (keep private)

## Phase 14: Final Touches

- [ ] Add 404 page
- [ ] Add error boundaries
- [ ] Create admin guide (how to add products)
- [ ] Set up analytics (optional)
- [ ] Performance optimization (images, lazy loading)

---

## Notes for Implementation

- **Cart Persistence**: Use `localStorage` + cookies (set with httpOnly=false for client access)
- **Image Storage**: Store full URLs in products table, images in Supabase Storage
- **Admin Path**: Use `.env.NEXT_PUBLIC_ADMIN_PATH` for obscured admin login URL
- **WhatsApp Number**: Store in `.env.NEXT_PUBLIC_SHOP_PHONE`
- **Error Handling**: Show user-friendly messages, log errors to console for debugging
- **Mobile First**: Design for mobile since customers will mostly use phones

---

## Deliverables by Phase

| Phase | Deliverable                            | Status |
| ----- | -------------------------------------- | ------ |
| 1     | Working Next.js project structure      | [x]    |
| 2     | Supabase database + storage ready      | [x]    |
| 3     | Reusable React components              | [x]    |
| 4     | Customer browsing + cart functionality | [x]    |
| 5     | API backend ready                      | [x]    |
| 6     | PDF generation working                 | [x]    |
| 7     | WhatsApp share working                 | [x]    |
| 8-9   | Admin panel with auth                  | [x]    |
| 10    | UI/UX complete and responsive          | [x]    |
| 11    | Images uploading and displaying        | [ ]    |
| 12    | All features tested                    | [ ]    |
| 13    | Deployed live                          | [ ]    |
| 14    | Polish & documentation                 | [ ]    |
