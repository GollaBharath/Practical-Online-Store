import { supabase } from "./supabase";

export const adminLogin = async (email: string, password: string) => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

		return { success: true, user: data.user, session: data.session };
	} catch (error) {
		console.error("Login error:", error);
		return { success: false, error };
	}
};

export const adminLogout = async () => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		return { success: true };
	} catch (error) {
		console.error("Logout error:", error);
		return { success: false, error };
	}
};

export const getAdminSession = async () => {
	try {
		const { data, error } = await supabase.auth.getSession();
		if (error) throw error;
		return data.session;
	} catch (error) {
		console.error("Session fetch error:", error);
		return null;
	}
};

export const isAdminLoggedIn = async (): Promise<boolean> => {
	const session = await getAdminSession();
	return !!session;
};
