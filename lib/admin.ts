import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

export const getAdminUser = async () => {
	if (!supabaseAdmin) return null;

	const cookieStore = await cookies();
	const token = cookieStore.get("admin_access_token")?.value;
	if (!token) return null;

	const { data, error } = await supabaseAdmin.auth.getUser(token);
	if (error) return null;
	return data.user;
};
