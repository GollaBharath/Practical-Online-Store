import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

const requireAdmin = async () => {
	if (!supabaseAdmin) return null;
	const cookieStore = await cookies();
	const token = cookieStore.get("admin_access_token")?.value;
	if (!token) return null;
	const { data, error } = await supabaseAdmin.auth.getUser(token);
	if (error) return null;
	return data.user;
};

/** GET /api/admin/shop-settings */
export async function GET() {
	try {
		const user = await requireAdmin();
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}
		const settings = await prisma.shopSettings.findUnique({
			where: { id: "singleton" },
		});
		return NextResponse.json({ success: true, data: settings ?? null });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

/** PUT /api/admin/shop-settings */
export async function PUT(request: Request) {
	try {
		const user = await requireAdmin();
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();

		const str = (v: unknown) =>
			typeof v === "string" && v.trim() ? v.trim() : null;

		const shopName =
			typeof body?.shopName === "string" && body.shopName.trim()
				? body.shopName.trim()
				: "The Book Store";

		const settings = await prisma.shopSettings.upsert({
			where: { id: "singleton" },
			update: {
				shopName,
				tagline: str(body?.tagline),
				phone: str(body?.phone),
				address: str(body?.address),
				email: str(body?.email),
				website: str(body?.website),
			},
			create: {
				id: "singleton",
				shopName,
				tagline: str(body?.tagline),
				phone: str(body?.phone),
				address: str(body?.address),
				email: str(body?.email),
				website: str(body?.website),
			},
		});

		return NextResponse.json({ success: true, data: settings });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
