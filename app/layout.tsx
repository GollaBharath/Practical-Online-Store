import type { Metadata } from "next";
import "../styles/globals.css";
import AppShell from "../components/AppShell";
import { getShopSettings } from "../lib/shop-settings";

export const metadata: Metadata = {
	title: "Practical Online Store",
	description: "Browse our catalog",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const settings = await getShopSettings();

	return (
		<html lang="en">
			<body suppressHydrationWarning>
				<AppShell settings={settings}>{children}</AppShell>
			</body>
		</html>
	);
}
