"use client";

import type { CartItem } from "../lib/cart";

const formatPrice = (value: number) => `Rs ${value.toFixed(2)}`;

const buildMessage = (items: CartItem[], totalPrice: number): string => {
	if (items.length === 0) return "My cart is empty.";

	const lines = items.map(
		(item) =>
			`${item.name} x${item.quantity} = ${formatPrice(
				item.price * item.quantity,
			)}`,
	);

	return [
		"My Order:",
		"",
		...lines,
		"",
		`Total: ${formatPrice(totalPrice)}`,
	].join("\n");
};

type WhatsAppShareProps = {
	items: CartItem[];
	totalPrice: number;
};

export default function WhatsAppShare({
	items,
	totalPrice,
}: WhatsAppShareProps) {
	const handleShare = () => {
		const phoneRaw = process.env.NEXT_PUBLIC_SHOP_PHONE ?? "";
		const phone = phoneRaw.replace(/\D/g, "");
		if (!phone) return;

		const message = buildMessage(items, totalPrice);
		const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
		window.open(url, "_blank", "noopener,noreferrer");
	};

	return (
		<button
			onClick={handleShare}
			disabled={items.length === 0}
			className="w-full rounded-lg border border-green-600 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400">
			Send to WhatsApp
		</button>
	);
}
