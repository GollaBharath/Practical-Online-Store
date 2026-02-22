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

/** POST /api/admin/categories — create a category */
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
		if (!name) {
			return NextResponse.json(
				{ success: false, message: "Name is required." },
				{ status: 400 },
			);
		}

		const parentId =
			typeof body?.parentId === "string" && body.parentId.trim()
				? body.parentId.trim()
				: null;

		// Validate parent exists if provided
		if (parentId) {
			const parent = await prisma.category.findUnique({
				where: { id: parentId },
			});
			if (!parent) {
				return NextResponse.json(
					{ success: false, message: "Parent category not found." },
					{ status: 400 },
				);
			}
		}

		const category = await prisma.category.create({
			data: {
				name,
				description:
					typeof body?.description === "string" ? body.description : null,
				imageUrl: typeof body?.imageUrl === "string" ? body.imageUrl : null,
				parentId,
			},
		});

		return NextResponse.json(
			{ success: true, data: category },
			{ status: 201 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

/** PUT /api/admin/categories — update a category */
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
		const id = typeof body?.id === "string" ? body.id.trim() : "";
		if (!id) {
			return NextResponse.json(
				{ success: false, message: "Category id is required." },
				{ status: 400 },
			);
		}

		const data: {
			name?: string;
			description?: string | null;
			imageUrl?: string | null;
			parentId?: string | null;
		} = {};

		if (typeof body?.name === "string" && body.name.trim()) {
			data.name = body.name.trim();
		}
		if (typeof body?.description === "string") {
			data.description = body.description;
		}
		if (typeof body?.imageUrl === "string") {
			data.imageUrl = body.imageUrl;
		}
		if ("parentId" in body) {
			data.parentId =
				typeof body.parentId === "string" && body.parentId.trim()
					? body.parentId.trim()
					: null;
		}

		// Prevent self-parenting
		if (data.parentId && data.parentId === id) {
			return NextResponse.json(
				{ success: false, message: "A category cannot be its own parent." },
				{ status: 400 },
			);
		}

		const category = await prisma.category.update({ where: { id }, data });

		return NextResponse.json({ success: true, data: category });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

/** DELETE /api/admin/categories?id=<id> — delete a category */
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
				{ success: false, message: "Category id is required." },
				{ status: 400 },
			);
		}

		// Block deletion if it has children or products
		const category = await prisma.category.findUnique({
			where: { id },
			include: { _count: { select: { children: true, products: true } } },
		});

		if (!category) {
			return NextResponse.json(
				{ success: false, message: "Category not found." },
				{ status: 404 },
			);
		}

		if (category._count.children > 0) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Cannot delete a category that has sub-categories. Delete them first.",
				},
				{ status: 409 },
			);
		}

		if (category._count.products > 0) {
			return NextResponse.json(
				{
					success: false,
					message:
						"Cannot delete a category that still has products. Remove or move them first.",
				},
				{ status: 409 },
			);
		}

		await prisma.category.delete({ where: { id } });

		return NextResponse.json({ success: true });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
