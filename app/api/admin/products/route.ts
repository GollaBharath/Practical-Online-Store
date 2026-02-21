import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

const parsePrice = (price: unknown): number | null => {
	if (typeof price === "number") return price;
	if (typeof price === "string" && price.trim() !== "") {
		const parsed = Number(price);
		return Number.isFinite(parsed) ? parsed : null;
	}
	return null;
};

const requireAdmin = async () => {
	if (!supabaseAdmin) return null;
	const cookieStore = await cookies();
	const token = cookieStore.get("admin_access_token")?.value;
	if (!token) return null;
	const { data, error } = await supabaseAdmin.auth.getUser(token);
	if (error) return null;
	return data.user;
};

export async function POST(request: Request) {
	try {
		const user = await requireAdmin();
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const name = typeof body?.name === "string" ? body.name.trim() : "";
		const price = parsePrice(body?.price);

		if (!name || price === null) {
			return NextResponse.json(
				{ success: false, message: "Name and price are required." },
				{ status: 400 },
			);
		}

		const product = await prisma.product.create({
			data: {
				name,
				price,
				description:
					typeof body?.description === "string" ? body.description : null,
				imageUrl: typeof body?.imageUrl === "string" ? body.imageUrl : null,
				category: typeof body?.category === "string" ? body.category : null,
			},
		});

		return NextResponse.json(
			{ success: true, data: { ...product, price: Number(product.price) } },
			{ status: 201 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

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
		const id = typeof body?.id === "string" ? body.id : "";

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Product id is required." },
				{ status: 400 },
			);
		}

		const price = parsePrice(body?.price);
		const data: {
			name?: string;
			price?: number;
			description?: string | null;
			imageUrl?: string | null;
			category?: string | null;
		} = {};

		if (typeof body?.name === "string" && body.name.trim() !== "") {
			data.name = body.name.trim();
		}
		if (price !== null) {
			data.price = price;
		}
		if (typeof body?.description === "string") {
			data.description = body.description;
		}
		if (typeof body?.imageUrl === "string") {
			data.imageUrl = body.imageUrl;
		}
		if (typeof body?.category === "string") {
			data.category = body.category;
		}

		const product = await prisma.product.update({
			where: { id },
			data,
		});

		return NextResponse.json(
			{ success: true, data: { ...product, price: Number(product.price) } },
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

export async function DELETE(request: Request) {
	try {
		const user = await requireAdmin();
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}

		const { searchParams } = new URL(request.url);
		const id = searchParams.get("id");

		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Product id is required." },
				{ status: 400 },
			);
		}

		const product = await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json(
			{ success: true, data: { ...product, price: Number(product.price) } },
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
