"use client";

import { useState } from "react";

type AdminLoginFormProps = {
	redirectTo: string;
};

export default function AdminLoginForm({ redirectTo }: AdminLoginFormProps) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/admin/auth", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json();
			if (!response.ok || !result.success) {
				setError(result.message ?? "Login failed.");
				return;
			}

			window.location.href = redirectTo;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
					placeholder="admin@example.com"
					className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
				/>
			</div>
			<div>
				<label className="block text-sm font-medium text-gray-700">
					Password
				</label>
				<input
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
					placeholder="••••••••"
					className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
				/>
			</div>
			{error ? (
				<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
					{error}
				</div>
			) : null}
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400">
				{isSubmitting ? "Signing in..." : "Sign in"}
			</button>
		</form>
	);
}
