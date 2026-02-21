"use client";

import { useMemo, useState } from "react";
import Cart from "./Cart";
import { useCart } from "./CartContext";

type AppShellProps = {
	children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
	const { cart } = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);

	const itemCount = useMemo(
		() => cart.items.reduce((total, item) => total + item.quantity, 0),
		[cart.items],
	);

	return (
		<div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
			<header className="sticky top-0 z-30 border-b border-white/20 bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg backdrop-blur-sm">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
					<div>
						<p className="hidden text-xs uppercase tracking-wide text-primary-100 sm:block">
							✨ Local Shop
						</p>
						<h1 className="text-base font-bold text-white drop-shadow-sm sm:text-xl">
							Practical Online Store
						</h1>
					</div>
					<button
						onClick={() => setIsCartOpen(true)}
						className="relative flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-primary-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:px-4">
						<span className="hidden sm:inline">Cart</span>
						<span className="sm:hidden">🛒</span>
						{itemCount > 0 ? (
							<span className="rounded-full bg-gradient-to-r from-accent-500 to-secondary-500 px-2 py-0.5 text-xs font-bold text-white shadow-md">
								{itemCount}
							</span>
						) : null}
					</button>
				</div>
			</header>
			<main className="flex-1">{children}</main>
			<footer className="border-t border-purple-200 bg-gradient-to-r from-primary-600 to-secondary-600">
				<div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-xs text-primary-100 sm:text-sm">
					💬 Built for quick WhatsApp ordering • 🚀 Simple & Practical
				</div>
			</footer>
			<Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
		</div>
	);
}
