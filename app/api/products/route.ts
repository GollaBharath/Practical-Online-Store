import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ProductRecord = {
	price: number | { toNumber?: () => number };
} & Record<string, unknown>;

/**
 * GET /api/products
 * Fetch all products from database
 *
 * Query parameters:
 * - category: Filter by category (optional)
 * - limit: Number of products to return (default: 100)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const limit = parseInt(searchParams.get("limit") || "100");
		const offset = parseInt(searchParams.get("offset") || "0");

		// Build where clause for filtering
		const where = category ? { category } : {};

		// Fetch products with pagination
		const products = await prisma.product.findMany({
			where,
			skip: offset,
			take: limit,
			orderBy: { createdAt: "desc" },
		});

		const serialized = products.map((product: ProductRecord) => ({
			...product,
			price:
				typeof product.price === "number"
					? product.price
					: Number(product.price),
		}));

		return NextResponse.json(
			{
				success: true,
				data: serialized,
				pagination: {
					limit,
					offset,
					count: serialized.length,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
