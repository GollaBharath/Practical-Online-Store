import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

const bucketName = "product-images";

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

		if (!supabaseAdmin) {
			return NextResponse.json(
				{ success: false, message: "Supabase service key not configured." },
				{ status: 500 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file");
		const rawPath = formData.get("path");

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ success: false, message: "File is required." },
				{ status: 400 },
			);
		}

		const sanitizedName = file.name.replace(/\s+/g, "-");
		const uploadPath =
			typeof rawPath === "string" && rawPath.trim() !== ""
				? rawPath.trim()
				: `uploads/${Date.now()}-${sanitizedName}`;

		const arrayBuffer = await file.arrayBuffer();
		const fileBuffer = Buffer.from(arrayBuffer);

		const { error } = await supabaseAdmin.storage
			.from(bucketName)
			.upload(uploadPath, fileBuffer, {
				contentType: file.type || "application/octet-stream",
				upsert: true,
			});

		if (error) {
			return NextResponse.json(
				{ success: false, message: error.message },
				{ status: 400 },
			);
		}

		const { data } = supabaseAdmin.storage
			.from(bucketName)
			.getPublicUrl(uploadPath);

		return NextResponse.json(
			{ success: true, url: data.publicUrl, path: uploadPath },
			{ status: 200 },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
