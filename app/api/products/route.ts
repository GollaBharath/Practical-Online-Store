import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/* ── Constants ── */
const MAX_Q_LENGTH = 200;
const MAX_ID_LENGTH = 40;
const MAX_LIMIT = 120;
const DEFAULT_LIMIT = 60;

/* ── Helpers ── */
function sanitizeId(raw: string): string {
	return raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, MAX_ID_LENGTH);
}

/**
 * GET /api/products
 *
 * Query parameters (all optional):
 *   q          – case-insensitive search on name + description (max 200 chars)
 *   category   – filter by parent category ID (includes its direct children)
 *   sub        – filter by exact category ID (overrides `category`)
 *   print      – "color" | "bw"  (color → colorPrice > 0; bw → bwPrice > 0)
 *   limit      – max rows to return (default: 60, hard cap: 120)
 *   offset     – pagination offset (default: 0)
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		/* ── Parse & sanitise ── */
		const q = (searchParams.get("q") ?? "").trim().slice(0, MAX_Q_LENGTH);

		const rawCategory = searchParams.get("category")?.trim() ?? null;
		const rawSub = searchParams.get("sub")?.trim() ?? null;
		const printRaw = searchParams.get("print");
		const print = printRaw === "color" || printRaw === "bw" ? printRaw : null;

		const categoryId = rawCategory ? sanitizeId(rawCategory) : null;
		const subId = rawSub ? sanitizeId(rawSub) : null;

		const rawLimit = parseInt(searchParams.get("limit") ?? "", 10);
		const limit = Number.isFinite(rawLimit)
			? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
			: DEFAULT_LIMIT;

		const rawOffset = parseInt(searchParams.get("offset") ?? "", 10);
		const offset = Number.isFinite(rawOffset) ? Math.max(rawOffset, 0) : 0;

		/* ── Build where clause ── */
		const where: Prisma.ProductWhereInput = {};

		if (subId) {
			where.categoryId = subId;
		} else if (categoryId) {
			const children = await prisma.category.findMany({
				where: { parentId: categoryId },
				select: { id: true },
			});
			const ids = [categoryId, ...children.map((c) => c.id)];
			where.categoryId = { in: ids };
		}

		if (print === "color") {
			where.colorPrice = { gt: 0 };
		} else if (print === "bw") {
			where.bwPrice = { gt: 0 };
		}

		if (q) {
			where.OR = [
				{ name: { contains: q, mode: "insensitive" } },
				{ description: { contains: q, mode: "insensitive" } },
			];
		}

		/* ── Query ── */
		const [products, total] = await prisma.$transaction([
			prisma.product.findMany({
				where,
				skip: offset,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: { category: { select: { id: true, name: true } } },
			}),
			prisma.product.count({ where }),
		]);

		const serialized = products.map((p) => ({
			...p,
			colorPrice: Number(p.colorPrice),
			bwPrice: Number(p.bwPrice),
		}));

		return NextResponse.json(
			{
				success: true,
				data: serialized,
				pagination: { limit, offset, count: serialized.length, total },
			},
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
