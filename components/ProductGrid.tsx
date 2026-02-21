import ProductCard, { Product } from "./ProductCard";

type ProductGridProps = {
	products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
	if (products.length === 0) {
		return (
			<div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
				No products available yet.
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
