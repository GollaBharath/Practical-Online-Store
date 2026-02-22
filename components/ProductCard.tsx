"use client";

import { useState } from "react";

export type Product = {
	id: string;
	name: string;
	colorPrice: number;
	bwPrice: number;
	description?: string | null;
	imageUrl?: string | null;
	categoryId: string;
	category?: { id: string; name: string } | null;
};

type Flavor = "color" | "bw";

export default function ProductCard({ product }: { product: Product }) {
	const [imageError, setImageError] = useState(false);

	const colorAvailable = product.colorPrice > 0;
	const bwAvailable = product.bwPrice > 0;

	// Default selected flavor: first available one
	const defaultFlavor: Flavor | null = colorAvailable
		? "color"
		: bwAvailable
			? "bw"
			: null;
	const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(
		defaultFlavor,
	);

	const displayPrice =
		selectedFlavor === "color"
			? product.colorPrice
			: selectedFlavor === "bw"
				? product.bwPrice
				: null;

	return (
		<div className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
			<div className="aspect-square w-full overflow-hidden bg-slate-100">
				{product.imageUrl && !imageError ? (
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<svg
							className="h-12 w-12 text-slate-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={1.5}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
							/>
						</svg>
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-1.5 p-4">
				<h3 className="line-clamp-2 text-sm font-semibold text-slate-900 sm:text-base">
					{product.name}
				</h3>
				{product.description ? (
					<p className="line-clamp-2 text-xs text-slate-500">
						{product.description}
					</p>
				) : null}

				{/* Flavor selector */}
				<div className="mt-2 flex gap-2">
					<button
						type="button"
						disabled={!colorAvailable}
						onClick={() => colorAvailable && setSelectedFlavor("color")}
						className={[
							"flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors",
							colorAvailable
								? selectedFlavor === "color"
									? "border-primary-700 bg-primary-700 text-white"
									: "border-slate-300 bg-white text-slate-700 hover:border-primary-600 hover:text-primary-700"
								: "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through",
						].join(" ")}>
						Color
						{colorAvailable ? (
							<span className="ml-1 font-normal">
								Rs {product.colorPrice.toFixed(2)}
							</span>
						) : (
							<span className="ml-1 font-normal">N/A</span>
						)}
					</button>

					<button
						type="button"
						disabled={!bwAvailable}
						onClick={() => bwAvailable && setSelectedFlavor("bw")}
						className={[
							"flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors",
							bwAvailable
								? selectedFlavor === "bw"
									? "border-primary-700 bg-primary-700 text-white"
									: "border-slate-300 bg-white text-slate-700 hover:border-primary-600 hover:text-primary-700"
								: "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through",
						].join(" ")}>
						B&amp;W
						{bwAvailable ? (
							<span className="ml-1 font-normal">
								Rs {product.bwPrice.toFixed(2)}
							</span>
						) : (
							<span className="ml-1 font-normal">N/A</span>
						)}
					</button>
				</div>

				{displayPrice !== null ? (
					<p className="mt-auto pt-2 text-base font-bold text-secondary-700 sm:text-lg">
						Rs {displayPrice.toFixed(2)}
					</p>
				) : (
					<p className="mt-auto pt-2 text-sm text-slate-400">Not available</p>
				)}
			</div>
		</div>
	);
}
