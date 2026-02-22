import { prisma } from "./prisma";

export type ShopSettings = {
	shopName: string;
	tagline: string | null;
	phone: string | null;
	address: string | null;
	email: string | null;
	website: string | null;
};

export async function getShopSettings(): Promise<ShopSettings> {
	try {
		const settings = await prisma.shopSettings.findUnique({
			where: { id: "singleton" },
		});
		return {
			shopName: settings?.shopName ?? "The Book Store",
			tagline: settings?.tagline ?? null,
			phone: settings?.phone ?? null,
			address: settings?.address ?? null,
			email: settings?.email ?? null,
			website: settings?.website ?? null,
		};
	} catch {
		// Fallback if DB not yet seeded
		return {
			shopName: "The Book Store",
			tagline: null,
			phone: null,
			address: null,
			email: null,
			website: null,
		};
	}
}
