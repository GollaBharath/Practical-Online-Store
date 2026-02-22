import { Suspense } from "react";
import { prisma } from "../lib/prisma";
import CatalogShell from "../components/CatalogShell";

export default async function Home() {
	// Fetch root categories + their children for the filter panel
	const rootCategories = await prisma.category.findMany({
		where: { parentId: null },
		orderBy: { name: "asc" },
		include: {
			children: {
				orderBy: { name: "asc" },
				select: { id: true, name: true },
			},
		},
	});

	return (
		<div className="min-h-screen bg-[#f8f7f4]">
			{/* ── Subtle page header ── */}
			<div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
				<div className="mx-auto max-w-7xl">
					<h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">
						Our Products
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						Search or filter to find what you need.
					</p>
				</div>
			</div>

			{/* ── Catalog shell (search + filters + product grid) ── */}
			<Suspense>
				<CatalogShell categories={rootCategories}>
					{/* ─────────────────────────────────────────────────────────────
					    TODO (backend): replace this placeholder with your actual
					    product grid. You can read the current filter values from
					    the URL search-params in this server component and pass
					    the fetched products to <ProductGrid products={…} />.

					    URL params available:
					      ?q=<search query>
					      &category=<categoryId>
					      &sub=<subcategoryId>
					      &print=color|bw
					    ───────────────────────────────────────────────────────────── */}
					<div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
						<svg
							className="mx-auto mb-3 h-10 w-10 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={1.5}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
							/>
						</svg>
						<p className="text-sm font-medium text-slate-500">
							Use the search bar or filters above to find products.
						</p>
						<p className="mt-1 text-xs text-slate-400">
							Product results will appear here.
						</p>
					</div>
				</CatalogShell>
			</Suspense>
		</div>
	);
}
