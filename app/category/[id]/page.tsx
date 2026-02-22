import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/components/ProductCard";

type PageProps = { params: Promise<{ id: string }> };

export default async function CategoryPage({ params }: PageProps) {
	const { id } = await params;

	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			parent: { select: { id: true, name: true } },
			children: {
				orderBy: { name: "asc" },
				include: { _count: { select: { children: true, products: true } } },
			},
			products: {
				orderBy: { createdAt: "desc" },
				include: { category: { select: { id: true, name: true } } },
			},
		},
	});

	if (!category) notFound();

	const products: Product[] = category.products.map((p) => ({
		id: p.id,
		name: p.name,
		colorPrice: Number(p.colorPrice),
		bwPrice: Number(p.bwPrice),
		description: p.description,
		imageUrl: p.imageUrl,
		categoryId: p.categoryId,
		category: p.category,
	}));

	// Build breadcrumb by walking up the tree
	const breadcrumb: { id: string; name: string }[] = [];
	if (category.parent) {
		breadcrumb.push({ id: category.parent.id, name: category.parent.name });
	}

	return (
		<div className="min-h-screen">
			{/* Hero */}
			<section className="bg-primary-800 px-4 py-10 sm:py-14">
				<div className="mx-auto max-w-7xl">
					{/* Breadcrumb */}
					<nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-primary-400">
						<Link href="/" className="transition-colors hover:text-white">
							Home
						</Link>
						{breadcrumb.map((crumb) => (
							<span key={crumb.id} className="contents">
								<span className="text-primary-600">/</span>
								<Link
									href={`/category/${crumb.id}`}
									className="transition-colors hover:text-white">
									{crumb.name}
								</Link>
							</span>
						))}
						<span className="text-primary-600">/</span>
						<span className="font-medium text-white">{category.name}</span>
					</nav>

					<h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
						{category.name}
					</h1>
					{category.description ? (
						<p className="mt-2 max-w-2xl text-sm text-primary-300 sm:text-base">
							{category.description}
						</p>
					) : null}
					{category.children.length > 0 || products.length > 0 ? (
						<div className="mt-4 flex flex-wrap gap-4">
							{category.children.length > 0 ? (
								<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-3 py-1 text-xs font-medium text-primary-200">
									{category.children.length} sub-
									{category.children.length === 1 ? "category" : "categories"}
								</span>
							) : null}
							{products.length > 0 ? (
								<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-600/30 px-3 py-1 text-xs font-medium text-secondary-300">
									{products.length}{" "}
									{products.length === 1 ? "product" : "products"}
								</span>
							) : null}
						</div>
					) : null}
				</div>
			</section>

			{/* Content */}
			<div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
				{/* Sub-categories */}
				{category.children.length > 0 ? (
					<section>
						<h2 className="mb-5 text-lg font-semibold text-slate-800 sm:text-xl">
							Sub-categories
						</h2>
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{category.children.map((child) => (
								<CategoryCard key={child.id} category={child} />
							))}
						</div>
					</section>
				) : null}

				{/* Products */}
				{products.length > 0 ? (
					<section>
						<h2 className="mb-5 text-lg font-semibold text-slate-800 sm:text-xl">
							Products
						</h2>
						<ProductGrid products={products} />
					</section>
				) : null}

				{/* Empty state */}
				{category.children.length === 0 && products.length === 0 ? (
					<div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
						<p className="text-4xl mb-3">📭</p>
						<p className="font-semibold">This category is empty.</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
