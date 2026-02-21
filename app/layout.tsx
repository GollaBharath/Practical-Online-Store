import type { Metadata } from "next";
import "../styles/globals.css";
import AppShell from "../components/AppShell";
import { CartProvider } from "../components/CartContext";

export const metadata: Metadata = {
	title: "Practical Online Store",
	description: "Browse products and order via WhatsApp",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-gray-50">
				<CartProvider>
					<AppShell>{children}</AppShell>
				</CartProvider>
			</body>
		</html>
	);
}
