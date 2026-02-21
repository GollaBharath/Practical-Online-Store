"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
	id: string;
	name: string;
	price: number;
	description?: string | null;
	imageUrl?: string | null;
	category?: string | null;
};

type FormState = {
	id?: string;
	name: string;
	price: string;
	description: string;
	category: string;
	imageUrl: string;
};

type AdminDashboardProps = {
	adminPath: string;
	adminEmail?: string | null;
};

const initialFormState: FormState = {
	name: "",
	price: "",
	description: "",
	category: "",
	imageUrl: "",
};

export default function AdminDashboard({
	adminPath,
	adminEmail,
}: AdminDashboardProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [formState, setFormState] = useState<FormState>(initialFormState);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const isEditing = Boolean(formState.id);

	const loadProducts = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/products");
			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.message ?? "Failed to load products.");
			}
			setProducts(result.data ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load products.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		void loadProducts();
	}, []);

	const totalProducts = useMemo(() => products.length, [products.length]);

	const resetForm = () => {
		setFormState(initialFormState);
	};

	const handleEdit = (product: Product) => {
		setFormState({
			id: product.id,
			name: product.name,
			price: product.price.toString(),
			description: product.description ?? "",
			category: product.category ?? "",
			imageUrl: product.imageUrl ?? "",
		});
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Delete this product?")) return;
		setError(null);
		setSuccess(null);
		try {
			const response = await fetch(`/api/admin/products?id=${id}`, {
				method: "DELETE",
			});
			const result = await response.json();
			if (!response.ok || !result.success) {
				throw new Error(result.message ?? "Delete failed.");
			}
			setSuccess("Product deleted.");
			await loadProducts();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Delete failed.");
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setSuccess(null);
		setIsSaving(true);

		try {
			const payload = {
				id: formState.id,
				name: formState.name,
				price: formState.price,
				description: formState.description,
				category: formState.category,
				imageUrl: formState.imageUrl,
			};

			const response = await fetch("/api/admin/products", {
				method: isEditing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const result = await response.json();
			if (!response.ok || !result.success) {
				throw new Error(result.message ?? "Save failed.");
			}

			setSuccess(isEditing ? "Product updated." : "Product created.");
			resetForm();
			await loadProducts();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Save failed.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setError(null);
		setSuccess(null);
		setIsUploading(true);

		try {
			const formData = new FormData();
			const safeName = file.name.replace(/\s+/g, "-");
			const folder = formState.category ? formState.category.trim() : "uploads";
			const path = `${folder}/${Date.now()}-${safeName}`;

			formData.append("file", file);
			formData.append("path", path);

			const response = await fetch("/api/admin/products/upload", {
				method: "POST",
				body: formData,
			});
			const result = await response.json();
			if (!response.ok || !result.success) {
				throw new Error(result.message ?? "Upload failed.");
			}

			setFormState((prev) => ({ ...prev, imageUrl: result.url }));
			setSuccess("Image uploaded.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Upload failed.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleLogout = async () => {
		await fetch("/api/admin/auth", { method: "DELETE" });
		window.location.href = `/${adminPath}`;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-gradient-to-r from-primary-500 to-secondary-500 p-6 shadow-2xl">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h2 className="text-2xl font-black text-white drop-shadow-lg sm:text-3xl">
							📦 Admin Dashboard
						</h2>
						<p className="mt-1 text-sm font-medium text-primary-100">
							{adminEmail
								? `👤 Signed in as ${adminEmail}`
								: "Manage your products"}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-white/20 backdrop-blur-md px-4 py-2 shadow-lg">
							<p className="text-xs font-bold text-primary-100">
								Total Products
							</p>
							<p className="text-3xl font-black text-white drop-shadow-md">
								{totalProducts}
							</p>
						</div>
						<button
							onClick={handleLogout}
							className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
							🚪 Logout
						</button>
					</div>
				</div>
			</div>

			{/* Status Messages */}
			{error ? (
				<div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
					<span className="font-black">⚠️ Error:</span> {error}
				</div>
			) : null}
			{success ? (
				<div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
					<span className="font-black">✅ Success:</span> {success}
				</div>
			) : null}

			{/* Main Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Add/Edit Form */}
				<section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">
							{isEditing ? "✏️ Edit Product" : "➕ Add New Product"}
						</h3>
						{isEditing ? (
							<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
								Editing
							</span>
						) : null}
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Product Name *
							</label>
							<input
								value={formState.name}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										name: event.target.value,
									}))
								}
								required
								placeholder="e.g., Wireless Headphones"
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Price (Rs) *
								</label>
								<input
									type="number"
									min="0"
									step="0.01"
									value={formState.price}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											price: event.target.value,
										}))
									}
									required
									placeholder="99.99"
									className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Category
								</label>
								<input
									value={formState.category}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											category: event.target.value,
										}))
									}
									placeholder="e.g., Electronics"
									className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								rows={3}
								value={formState.description}
								onChange={(event) =>
									setFormState((prev) => ({
										...prev,
										description: event.target.value,
									}))
								}
								placeholder="Describe the product features..."
								className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
							/>
						</div>

						{/* Image Preview & Upload */}
						<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
							<label className="block text-sm font-medium text-gray-700">
								📷 Product Image
							</label>

							<div className="mt-3 space-y-3">
								{/* Image Preview */}
								{formState.imageUrl ? (
									<div className="flex items-start gap-3">
										<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
											<img
												src={formState.imageUrl}
												alt="Preview"
												className="h-full w-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="truncate text-xs text-gray-600">
												{formState.imageUrl}
											</p>
											<button
												type="button"
												onClick={() =>
													setFormState((prev) => ({ ...prev, imageUrl: "" }))
												}
												className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium">
												✕ Remove
											</button>
										</div>
									</div>
								) : null}

								{/* URL Input */}
								<input
									value={formState.imageUrl}
									onChange={(event) =>
										setFormState((prev) => ({
											...prev,
											imageUrl: event.target.value,
										}))
									}
									placeholder="Paste image URL here"
									className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
								/>

								{/* Divider */}
								<div className="flex items-center gap-3">
									<div className="h-px flex-1 bg-gray-300"></div>
									<span className="text-xs text-gray-500">or</span>
									<div className="h-px flex-1 bg-gray-300"></div>
								</div>

								{/* File Upload Button */}
								<label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<span>
										{isUploading ? "Uploading..." : "Upload from device"}
									</span>
									<input
										type="file"
										accept="image/*"
										onChange={handleUpload}
										className="hidden"
										disabled={isUploading}
									/>
								</label>
							</div>
						</div>
						<div className="flex items-center gap-3 pt-2">
							<button
								type="submit"
								disabled={isSaving}
								className="flex-1 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">
								{isSaving
									? "⏳ Saving..."
									: isEditing
										? "✔ Update Product"
										: "✨ Create Product"}
							</button>
							{isEditing ? (
								<button
									type="button"
									onClick={resetForm}
									className="rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-md transition-all hover:scale-105 hover:bg-gray-50">
									❌ Cancel
								</button>
							) : null}
						</div>
					</form>
				</section>

				{/* Products List */}
				<section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<h3 className="mb-4 text-lg font-semibold text-gray-900">
						📦 Product Inventory
					</h3>
					{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
								<p className="mt-3 text-sm text-gray-500">
									Loading products...
								</p>
							</div>
						</div>
					) : products.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="rounded-full bg-gray-100 p-4">
								<svg
									className="h-8 w-8 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
									/>
								</svg>
							</div>
							<p className="mt-4 text-sm font-medium text-gray-900">
								No products yet
							</p>
							<p className="mt-1 text-xs text-gray-500">
								Create your first product to get started
							</p>
						</div>
					) : (
						<div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
							{products.map((product) => (
								<div
									key={product.id}
									className="group rounded-xl border-2 border-primary-200 bg-gradient-to-br from-white to-primary-50 p-4 shadow-md transition-all hover:scale-[1.01] hover:border-primary-300 hover:shadow-lg">
									<div className="flex gap-4">
										{/* Product Image */}
										{product.imageUrl ? (
											<div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 shadow-md">
												<img
													src={product.imageUrl}
													alt={product.name}
													className="h-full w-full object-cover"
												/>
											</div>
										) : (
											<div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 shadow-md">
												<svg
													className="h-10 w-10 text-primary-300"
													fill="currentColor"
													viewBox="0 0 24 24">
													<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
												</svg>
											</div>
										)}

										{/* Product Info */}
										<div className="flex flex-1 flex-col justify-between">
											<div>
												<div className="flex items-start justify-between gap-3">
													<div className="flex-1">
														<h4 className="font-bold text-gray-900">
															{product.name}
														</h4>
														<p className="mt-0.5 text-sm font-bold text-primary-600">
															Rs {product.price.toFixed(2)}
														</p>
													</div>
													<div className="flex items-center gap-1">
														<button
															onClick={() => handleEdit(product)}
															className="rounded-lg bg-blue-100 px-2.5 py-1.5 text-xs font-bold text-blue-600 transition-all hover:scale-110 hover:bg-blue-200">
															✏️
														</button>
														<button
															onClick={() => handleDelete(product.id)}
															className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-bold text-red-600 transition-all hover:scale-110 hover:bg-red-200">
															🗑️
														</button>
													</div>
												</div>
												{product.category ? (
													<span className="mt-1 inline-block rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 px-3 py-0.5 text-xs font-bold text-white shadow-sm">
														{product.category}
													</span>
												) : null}
											</div>
											{product.description ? (
												<p className="mt-2 line-clamp-2 text-xs text-gray-600">
													{product.description}
												</p>
											) : null}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
