import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/categories
 * Returns all categories with their children (tree structure).
 * Pass ?parentId=null or omit to get root categories.
 * Pass ?parentId=<id> to get children of a specific category.
 * Pass ?all=true to get every category flat.
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const all = searchParams.get("all") === "true";
		const parentIdParam = searchParams.get("parentId");

		if (all) {
			const categories = await prisma.category.findMany({
				orderBy: { name: "asc" },
				include: { _count: { select: { children: true, products: true } } },
			});
			return NextResponse.json({ success: true, data: categories });
		}

		// Default: return root categories (no parent) with their children
		const where =
			parentIdParam !== null ? { parentId: parentIdParam } : { parentId: null };

		const categories = await prisma.category.findMany({
			where,
			orderBy: { name: "asc" },
			include: {
				_count: { select: { children: true, products: true } },
			},
		});

		return NextResponse.json({ success: true, data: categories });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
