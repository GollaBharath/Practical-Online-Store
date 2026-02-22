import { redirect } from "next/navigation";
import AdminDashboard from "../../../components/admin/AdminDashboard";
import { getAdminUser } from "../../../lib/admin";

export default async function AdminDashboardPage() {
	const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? "admin";
	const loginPath = `/${adminPath}`;
	const user = await getAdminUser();

	if (!user) {
		redirect(loginPath);
	}

	return (
		<main className="min-h-screen bg-slate-100 px-4 py-8">
			<div className="mx-auto w-full max-w-7xl">
				<AdminDashboard adminPath={adminPath} adminEmail={user.email} />
			</div>
		</main>
	);
}
