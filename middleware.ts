import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_access_token";

export function middleware(request: NextRequest) {
	const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "admin";
	const { pathname } = request.nextUrl;

	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		const url = request.nextUrl.clone();
		url.pathname = `/${adminPath}${pathname.replace("/admin", "")}`;
		return NextResponse.redirect(url);
	}

	if (pathname === `/${adminPath}` || pathname.startsWith(`/${adminPath}/`)) {
		const url = request.nextUrl.clone();
		url.pathname = `/admin${pathname.replace(`/${adminPath}`, "")}`;

		if (url.pathname.startsWith("/admin/dashboard")) {
			const token = request.cookies.get(ADMIN_COOKIE)?.value;
			if (!token) {
				const loginUrl = request.nextUrl.clone();
				loginUrl.pathname = `/${adminPath}`;
				loginUrl.searchParams.set("next", pathname);
				return NextResponse.redirect(loginUrl);
			}
		}

		return NextResponse.rewrite(url);
	}

	if (
		pathname.startsWith("/api/admin") &&
		!pathname.startsWith("/api/admin/auth")
	) {
		const token = request.cookies.get(ADMIN_COOKIE)?.value;
		if (!token) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 },
			);
		}
	}

	return NextResponse.next();
}
