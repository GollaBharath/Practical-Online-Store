"use client";

import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	addToCart,
	clearCart,
	getCart,
	removeFromCart,
	updateQuantity,
	Cart,
	CartItem,
} from "../lib/cart";

// Simple toast notification
const showToast = (message: string) => {
	if (typeof window === "undefined") return;
	// Create toast element
	const toast = document.createElement("div");
	toast.textContent = message;
	toast.className =
		"fixed bottom-4 right-4 z-50 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300";
	document.body.appendChild(toast);
	// Fade in
	setTimeout(() => {
		toast.style.opacity = "1";
	}, 10);
	// Remove after 2s
	setTimeout(() => {
		toast.style.opacity = "0";
		setTimeout(() => document.body.removeChild(toast), 300);
	}, 2000);
};

type CartContextValue = {
	cart: Cart;
	addItem: (item: CartItem) => void;
	removeItem: (itemId: string) => void;
	updateItemQuantity: (itemId: string, quantity: number) => void;
	clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<Cart>(() => getCart());

	useEffect(() => {
		setCart(getCart());
	}, []);

	const value = useMemo<CartContextValue>(
		() => ({
			cart,
			addItem: (item) => {
				setCart(addToCart(item));
				showToast(`${item.name} added to cart`);
			},
			removeItem: (itemId) => {
				const existingItem = cart.items.find((i) => i.id === itemId);
				setCart(removeFromCart(itemId));
				if (existingItem) showToast(`${existingItem.name} removed`);
			},
			updateItemQuantity: (itemId, quantity) =>
				setCart(updateQuantity(itemId, quantity)),
			clear: () => {
				setCart(clearCart());
				showToast("Cart cleared");
			},
		}),
		[cart],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}

export type { CartItem };
