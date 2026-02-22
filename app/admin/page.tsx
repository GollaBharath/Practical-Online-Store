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
		<main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-10">
			<div className="w-full max-w-md">
				<div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
					<div className="mb-6 text-center">
						<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-800 shadow">
							<svg
								className="h-7 w-7 text-white"
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
						<h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
						<p className="mt-1 text-sm text-slate-500">
							Sign in with your Supabase credentials
						</p>
					</div>
					<AdminLoginForm redirectTo={nextPath} />
					<p className="mt-6 text-center text-xs text-slate-400">
						Secured by Supabase Authentication
					</p>
				</div>
			</div>
		</main>
	);
}
