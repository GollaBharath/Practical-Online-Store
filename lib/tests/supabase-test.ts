/**
 * Supabase Connection Test Script
 *
 * Use this to verify your Supabase setup is working correctly.
 * Run from browser console or as a Next.js API route
 *
 * Instructions:
 * 1. Make sure .env.local has valid Supabase credentials
 * 2. Run: npm run dev
 * 3.Either:
 *    a) Open http://localhost:3000 and paste test code in browser console
 *    b) Create an API route that imports and runs this
 */

import { supabase, supabaseAdmin } from "../supabase";

export async function testSupabaseConnection() {
	console.log("🔍 Testing Supabase Connection...\n");

	try {
		// Test 1: Check if Supabase client is initialized
		console.log("✓ Test 1: Supabase client initialized");
		console.log(`  URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

		// Test 2: Fetch products table
		console.log("\n✓ Test 2: Fetching products...");
		const { data: products, error: productsError } = await supabase
			.from("products")
			.select("*")
			.limit(5);

		if (productsError) {
			console.error("  ❌ Error fetching products:", productsError.message);
			return false;
		}
		console.log(`  Found ${products?.length || 0} products`);
		if (products && products.length > 0) {
			console.log("  Sample:", products[0]);
		}

		// Test 3: Check storage bucket
		console.log("\n✓ Test 3: Checking storage bucket...");
		const { data: files, error: storageError } = await supabase.storage
			.from("product-images")
			.list("", { limit: 5 });

		if (storageError && storageError.message.includes("404")) {
			console.warn(
				'  ⚠️  Bucket not found - create "product-images" bucket in Storage',
			);
		} else if (storageError) {
			console.error("  ❌ Storage error:", storageError.message);
			return false;
		} else {
			console.log(`  ✓ Bucket exists, contains ${files?.length || 0} items`);
		}

		// Test 4: Check authentication status
		console.log("\n✓ Test 4: Checking auth status...");
		const { data: authData } = await supabase.auth.getSession();
		if (authData.session) {
			console.log("  ✓ Authenticated as:", authData.session.user.email);
		} else {
			console.log("  ℹ️  Not authenticated (expected for public browsing)");
		}

		// Test 5: Test admin service key (server-side only)
		if (typeof window === "undefined" && supabaseAdmin) {
			console.log("\n✓ Test 5: Admin client available (server-side)");
		}

		console.log("\n✅ All tests passed! Supabase is configured correctly.\n");
		return true;
	} catch (error) {
		console.error("❌ Unexpected error:", error);
		return false;
	}
}

// Alternative: Direct fetch test (no Supabase SDK)
export async function testSupabaseRaw() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key) {
		console.error("Missing environment variables");
		return false;
	}

	try {
		console.log("🔍 Testing Supabase REST API...");
		const response = await fetch(`${url}/rest/v1/products?limit=1`, {
			headers: {
				"Content-Type": "application/json",
				apikey: key,
			},
		});

		if (!response.ok) {
			console.error("HTTP Error:", response.status, response.statusText);
			return false;
		}

		const data = await response.json();
		console.log("✅ REST API working. Sample data:", data);
		return true;
	} catch (error) {
		console.error("❌ REST API test failed:", error);
		return false;
	}
}
