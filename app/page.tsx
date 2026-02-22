import { Suspense } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import CatalogShell from "../components/CatalogShell";
import ProductGrid from "../components/ProductGrid";
import type { Product } from "../components/ProductCard";

/* ── Constants ── */
const MAX_Q_LENGTH = 200;
const MAX_ID_LENGTH = 40;
const MAX_RESULTS = 120;

/* ── Helpers ── */

/** Strip every character that can't appear in a cuid/uuid. */
function sanitizeId(raw: string): string {
	return raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, MAX_ID_LENGTH);
}

type PageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
	const params = await searchParams;

	/* ── Parse & sanitise URL params ── */
	const q =
		typeof params.q === "string" ? params.q.trim().slice(0, MAX_Q_LENGTH) : "";

	const rawCategory =
		typeof params.category === "string" ? params.category.trim() : null;
	const rawSub = typeof params.sub === "string" ? params.sub.trim() : null;
	const print =
		params.print === "color" || params.print === "bw" ? params.print : null;

	const categoryId = rawCategory ? sanitizeId(rawCategory) : null;
	const subId = rawSub ? sanitizeId(rawSub) : null;

	/* ── Build Prisma where clause ── */
	const where: Prisma.ProductWhereInput = {};

	// Category / subcategory filter
	if (subId) {
		// Specific subcategory selected
		where.categoryId = subId;
	} else if (categoryId) {
		// Parent category selected → include its direct children too
		const children = await prisma.category.findMany({
			where: { parentId: categoryId },
			select: { id: true },
		});
		const ids = [categoryId, ...children.map((c) => c.id)];
		where.categoryId = { in: ids };
	}

	// Print-type filter
	if (print === "color") {
		where.colorPrice = { gt: 0 };
	} else if (print === "bw") {
		where.bwPrice = { gt: 0 };
	}

	// Full-text search (case-insensitive) on name + description
	if (q) {
		where.OR = [
			{ name: { contains: q, mode: "insensitive" } },
			{ description: { contains: q, mode: "insensitive" } },
		];
	}

	/* ── Fetch in a single transaction ── */
	const [rawProducts, total, rootCategories] = await prisma.$transaction([
		prisma.product.findMany({
			where,
			orderBy: { createdAt: "desc" },
			take: MAX_RESULTS,
			include: { category: { select: { id: true, name: true } } },
		}),
		prisma.product.count({ where }),
		prisma.category.findMany({
			where: { parentId: null },
			orderBy: { name: "asc" },
			include: {
				children: {
					orderBy: { name: "asc" },
					select: { id: true, name: true },
				},
			},
		}),
	]);

	const products: Product[] = rawProducts.map((p) => ({
		id: p.id,
		name: p.name,
		colorPrice: Number(p.colorPrice),
		bwPrice: Number(p.bwPrice),
		description: p.description,
		imageUrl: p.imageUrl,
		categoryId: p.categoryId,
		category: p.category,
	}));

	return (
		<div className="min-h-screen bg-[#f8f7f4]">
			{/* ── Catalog shell (search + filters + product grid) ── */}
			<Suspense>
				<CatalogShell categories={rootCategories} totalResults={total}>
					<ProductGrid products={products} printFilter={print} />
				</CatalogShell>
			</Suspense>
		</div>
	);
}
