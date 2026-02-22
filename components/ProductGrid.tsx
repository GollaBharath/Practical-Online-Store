import ProductCard, { type Product } from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
	if (products.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
				No products in this category yet.
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
