import ProductGrid from "../components/ProductGrid";
import type { Product } from "../components/ProductCard";
import { prisma } from "../lib/prisma";

export default async function Home() {
	const products = await prisma.product.findMany({
		orderBy: { createdAt: "desc" },
	});

	const catalog: Product[] = products.map((product) => ({
		id: product.id,
		name: product.name,
		price: Number(product.price),
		description: product.description,
		imageUrl: product.imageUrl,
		category: product.category,
	}));

	return (
		<main className="min-h-screen">
			<section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 px-4 py-16">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
				<div className="relative mx-auto max-w-7xl text-center">
					<div className="inline-block animate-pulse rounded-full bg-white/20 px-4 py-1 text-sm font-semibold text-white backdrop-blur-sm mb-6">
						✨ Welcome
					</div>
					<h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg sm:text-6xl md:text-7xl">
						Discover Amazing Products
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
						🛍️ Browse our collection, add to cart, and order via WhatsApp in
						seconds!
					</p>
					<div className="mt-8 flex justify-center gap-4">
						<div className="rounded-2xl bg-white/10 backdrop-blur-md px-6 py-3 shadow-xl">
							<p className="text-2xl font-bold text-white">{catalog.length}</p>
							<p className="text-sm text-primary-100">Products</p>
						</div>
						<div className="rounded-2xl bg-white/10 backdrop-blur-md px-6 py-3 shadow-xl">
							<p className="text-2xl font-bold text-white">⚡</p>
							<p className="text-sm text-primary-100">Fast Order</p>
						</div>
					</div>
				</div>
			</section>
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="mb-8 text-center">
					<h2 className="text-3xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent sm:text-4xl">
						🎯 Featured Products
					</h2>
					<p className="mt-2 text-base text-gray-600">
						Handpicked items just for you
					</p>
				</div>
				<ProductGrid products={catalog} />
			</div>
		</main>
	);
}
