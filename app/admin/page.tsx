import { redirect } from "next/navigation";
import AdminLoginForm from "../../components/admin/AdminLoginForm";
import { getAdminUser } from "../../lib/admin";

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams?: { next?: string };
}) {
	const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "admin";
	const dashboardPath = `/${adminPath}/dashboard`;
	const nextPath = searchParams?.next ?? dashboardPath;
	const user = await getAdminUser();

	if (user) {
		redirect(dashboardPath);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 px-4 py-10">
			<div className="w-full max-w-md">
				<div className="rounded-3xl border-2 border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl">
					<div className="mb-6 text-center">
						<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg">
							<svg
								className="h-8 w-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h1 className="text-3xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
							🔑 Admin Access
						</h1>
						<p className="mt-2 text-sm font-medium text-gray-600">
							Sign in with your Supabase credentials
						</p>
					</div>
					<AdminLoginForm redirectTo={nextPath} />
					<p className="mt-6 text-center text-xs font-medium text-gray-500">
						🔒 Secured by Supabase Authentication
					</p>
				</div>
			</div>
		</main>
	);
}
