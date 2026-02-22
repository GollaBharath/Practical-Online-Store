import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/shop-settings — public, no auth required */
export async function GET() {
	try {
		const settings = await prisma.shopSettings.findUnique({
			where: { id: "singleton" },
		});
		return NextResponse.json({ success: true, data: settings ?? null });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
