import ProductCard, { type Product } from "./ProductCard";

type Flavor = "color" | "bw";

export default function ProductGrid({
	products,
	printFilter,
}: {
	products: Product[];
	printFilter?: Flavor | null;
}) {
	if (products.length === 0) {
		return (
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
				<p className="text-sm font-medium text-slate-500">No products found.</p>
				<p className="mt-1 text-xs text-slate-400">
					Try adjusting your search or filters.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					forcedFlavor={printFilter ?? null}
				/>
			))}
		</div>
	);
}
