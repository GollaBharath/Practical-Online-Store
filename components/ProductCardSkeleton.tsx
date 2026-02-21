export default function ProductCardSkeleton() {
	return (
		<div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="aspect-square w-full rounded-lg bg-gray-200" />
			<div className="mt-4 space-y-3">
				<div className="h-5 w-3/4 rounded bg-gray-200" />
				<div className="h-4 w-full rounded bg-gray-200" />
				<div className="h-4 w-5/6 rounded bg-gray-200" />
				<div className="flex items-center justify-between">
					<div className="h-5 w-20 rounded bg-gray-200" />
					<div className="h-9 w-24 rounded-lg bg-gray-200" />
				</div>
			</div>
		</div>
	);
}
