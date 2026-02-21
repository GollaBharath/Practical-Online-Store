"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import type { CartItem } from "../lib/cart";

type Product = {
	id: string;
	name: string;
	price: number;
	description?: string | null;
	imageUrl?: string | null;
	category?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
	const { addItem } = useCart();

	const handleAdd = () => {
		const cartItem: CartItem = {
			id: product.id,
			name: product.name,
			price: product.price,
			quantity: 1,
			image_url: product.imageUrl ?? undefined,
			category: product.category ?? undefined,
		};
		addItem(cartItem);
	};

	const [imageError, setImageError] = useState(false);

	return (
		<div className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-white p-4 shadow-lg transition-all hover:scale-[1.02] hover:border-primary-300 hover:shadow-2xl">
			{product.category ? (
				<span className="absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 px-3 py-1 text-xs font-bold text-white shadow-md">
					{product.category}
				</span>
			) : null}
			<div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 transition-transform group-hover:scale-[1.05]">
				{product.imageUrl && !imageError ? (
					<img
						src={product.imageUrl}
						alt={product.name}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						loading="lazy"
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="flex h-full w-full flex-col items-center justify-center gap-2 text-primary-300">
						<svg
							className="h-12 w-12 sm:h-16 sm:w-16"
							fill="currentColor"
							viewBox="0 0 24 24">
							<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
						</svg>
						<p className="text-xs text-primary-400">
							{imageError ? "Failed to load" : "No image"}
						</p>
					</div>
				)}
			</div>
			<div className="mt-4 flex flex-col gap-3">
				<div>
					<h3 className="line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
						{product.name}
					</h3>
					{product.description ? (
						<p className="mt-1 line-clamp-2 text-xs text-gray-600 sm:text-sm">
							{product.description}
						</p>
					) : null}
				</div>
				<div className="flex items-center justify-between gap-2">
					<div>
						<p className="text-xs text-gray-500">Price</p>
						<p className="text-lg font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent sm:text-xl">
							Rs {product.price.toFixed(2)}
						</p>
					</div>
					<button
						onClick={handleAdd}
						className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-5 sm:text-sm">
						🛒 Add
					</button>
				</div>
			</div>
		</div>
	);
}

export type { Product };
