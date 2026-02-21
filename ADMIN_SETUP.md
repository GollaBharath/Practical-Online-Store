# Admin Setup Guide

## Creating Your First Admin User

To access the admin dashboard, you need to create an admin user in Supabase.

### Steps:

1. **Go to Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Users" tab

3. **Add a New User**
   - Click "Add user" button
   - Choose "Create user"
   - Enter admin email and password
   - Click "Create user"

4. **Access Admin Panel**
   - Visit: `http://localhost:3000/set-products-fghj` (development)
   - Or: `https://your-domain.com/set-products-fghj` (production)
   - Sign in with the email and password you created

## Admin URL Configuration

The admin path is configured via environment variable for security.

In your `.env.local` file:

```
NEXT_PUBLIC_ADMIN_PATH=set-products-fghj
```

Change this to any obscure path you prefer to keep the admin panel hidden from public access.

## Admin Features

Once logged in, you can:

- ✅ View all products in your inventory
- ✅ Add new products with images
- ✅ Edit existing products
- ✅ Delete products
- ✅ Upload images to Supabase Storage
- ✅ Organize products by category

## Image Upload

The admin panel supports two methods for adding product images:

1. **Direct URL**: Paste an image URL from any public source
2. **File Upload**: Upload images from your device (stored in Supabase Storage)

Supported formats: JPEG, PNG, WebP, GIF (max 5MB)

## Security Notes

- Admin authentication uses httpOnly cookies for security
- All admin routes are protected by middleware
- Admin path should be kept private (don't share publicly)
- Use strong passwords for admin accounts
- Consider enabling 2FA in Supabase for added security

## Troubleshooting

### Can't Access Admin Panel

- Verify the admin path matches your `NEXT_PUBLIC_ADMIN_PATH` variable
- Clear browser cookies and try again
- Check that Supabase environment variables are set correctly

### Image Upload Fails

- Ensure the `product-images` bucket exists in Supabase Storage
- Check that the bucket has public access enabled
- Verify `SUPABASE_SERVICE_KEY` is set in `.env.local`

### Session Expires

- Sessions last 1 hour by default
- Simply log in again when prompted
- Sessions persist across page refreshes

## Creating the Storage Bucket

If you haven't created the storage bucket yet:

1. Go to Supabase Dashboard → Storage
2. Click "Create bucket"
3. Name: `product-images`
4. Set to "Public bucket" (allow public access)
5. Click "Create bucket"

Now image uploads will work correctly!
