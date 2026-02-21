import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const email = typeof body?.email === "string" ? body.email : "";
		const password = typeof body?.password === "string" ? body.password : "";

		if (!email || !password) {
			return NextResponse.json(
				{ success: false, message: "Email and password are required." },
				{ status: 400 },
			);
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			return NextResponse.json(
				{ success: false, message: error.message },
				{ status: 401 },
			);
		}
		if (!data.session) {
			return NextResponse.json(
				{ success: false, message: "Session not created." },
				{ status: 401 },
			);
		}

		const response = NextResponse.json(
			{
				success: true,
				user: data.user,
			},
			{ status: 200 },
		);

		response.cookies.set("admin_access_token", data.session.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: data.session.expires_in,
		});
		response.cookies.set("admin_refresh_token", data.session.refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
		});

		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) {
			return NextResponse.json(
				{ success: false, message: error.message },
				{ status: 401 },
			);
		}

		const response = NextResponse.json({ success: true }, { status: 200 });
		response.cookies.set("admin_access_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});
		response.cookies.set("admin_refresh_token", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 0,
		});

		return response;
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json({ success: false, message }, { status: 500 });
	}
}
