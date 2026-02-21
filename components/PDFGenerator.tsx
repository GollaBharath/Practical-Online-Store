"use client";

import { jsPDF } from "jspdf";
import type { CartItem } from "../lib/cart";

const formatPrice = (value: number) => `Rs ${value.toFixed(2)}`;

const fetchImageDataUrl = async (url: string): Promise<string | null> => {
	try {
		const response = await fetch(url);
		if (!response.ok) return null;
		const blob = await response.blob();
		return await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to read image."));
			reader.readAsDataURL(blob);
		});
	} catch {
		return null;
	}
};

const getImageFormat = (dataUrl: string): "PNG" | "JPEG" =>
	dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";

type PDFGeneratorProps = {
	items: CartItem[];
	totalPrice: number;
};

export default function PDFGenerator({ items, totalPrice }: PDFGeneratorProps) {
	const handleDownload = async () => {
		if (items.length === 0) return;

		const doc = new jsPDF();
		const pageWidth = doc.internal.pageSize.getWidth();
		let cursorY = 20;

		doc.setFontSize(16);
		doc.text("Order Summary", 14, cursorY);
		cursorY += 8;

		doc.setFontSize(10);
		doc.text(`Generated: ${new Date().toLocaleString()}`, 14, cursorY);
		cursorY += 10;

		for (const item of items) {
			if (cursorY > 260) {
				doc.addPage();
				cursorY = 20;
			}

			const imageData = item.image_url
				? await fetchImageDataUrl(item.image_url)
				: null;

			const imageSize = 20;
			if (imageData) {
				doc.addImage(
					imageData,
					getImageFormat(imageData),
					14,
					cursorY,
					imageSize,
					imageSize,
				);
			}

			const textX = imageData ? 38 : 14;
			const nameLines = doc.splitTextToSize(item.name, pageWidth - textX - 14);
			doc.setFontSize(12);
			doc.text(nameLines, textX, cursorY + 6);

			doc.setFontSize(10);
			doc.text(
				`Qty: ${item.quantity}   Price: ${formatPrice(item.price)}   Line: ${formatPrice(
					item.price * item.quantity,
				)}`,
				textX,
				cursorY + 14,
			);

			cursorY += Math.max(imageSize + 6, 26);
		}

		if (cursorY > 260) {
			doc.addPage();
			cursorY = 20;
		}

		doc.setFontSize(14);
		doc.text(`Total: ${formatPrice(totalPrice)}`, 14, cursorY + 6);

		doc.save(`order-${Date.now()}.pdf`);
	};

	return (
		<button
			onClick={handleDownload}
			disabled={items.length === 0}
			className="w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300">
			Download PDF
		</button>
	);
}
