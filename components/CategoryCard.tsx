import Link from "next/link";

export type Category = {
	id: string;
	name: string;
	description?: string | null;
	imageUrl?: string | null;
	parentId?: string | null;
	_count?: { children: number; products: number };
};

export default function CategoryCard({ category }: { category: Category }) {
	const childCount = category._count?.children ?? 0;
	const productCount = category._count?.products ?? 0;

	return (
		<Link
			href={`/category/${category.id}`}
			className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
			{/* Image / placeholder */}
			<div className="aspect-video w-full overflow-hidden bg-slate-100">
				{category.imageUrl ? (
					<img
						src={category.imageUrl}
						alt={category.name}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-slate-100">
						<svg
							className="h-10 w-10 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={1.5}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
							/>
						</svg>
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-700 sm:text-base">
					{category.name}
				</h3>
				{category.description ? (
					<p className="line-clamp-2 text-xs text-slate-500">
						{category.description}
					</p>
				) : null}
				<div className="mt-auto flex flex-wrap gap-2 pt-2">
					{childCount > 0 ? (
						<span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
							{childCount}{" "}
							{childCount === 1 ? "sub-category" : "sub-categories"}
						</span>
					) : null}
					{productCount > 0 ? (
						<span className="rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-700">
							{productCount} {productCount === 1 ? "product" : "products"}
						</span>
					) : null}
					{childCount === 0 && productCount === 0 ? (
						<span className="text-xs italic text-slate-400">Empty</span>
					) : null}
				</div>
			</div>
		</Link>
	);
}
