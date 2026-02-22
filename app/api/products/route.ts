import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products
 * Fetch products from database.
 *
 * Query parameters:
 * - categoryId: Filter by category id (optional)
 * - limit: Number of products to return (default: 100)
 * - offset: Pagination offset (default: 0)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const categoryId = searchParams.get("categoryId");
		const limit = parseInt(searchParams.get("limit") || "100");
		const offset = parseInt(searchParams.get("offset") || "0");

		const where = categoryId ? { categoryId } : {};

		const products = await prisma.product.findMany({
			where,
			skip: offset,
			take: limit,
			orderBy: { createdAt: "desc" },
			include: { category: { select: { id: true, name: true } } },
		});

		const serialized = products.map((product) => ({
			...product,
			colorPrice: Number(product.colorPrice),
			bwPrice: Number(product.bwPrice),
		}));

		return NextResponse.json(
			{
				success: true,
				data: serialized,
				pagination: { limit, offset, count: serialized.length },
			},
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
