"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ShopSettings = {
	shopName: string;
	tagline: string;
	phone: string;
	address: string;
	email: string;
	website: string;
};

type Category = {
	id: string;
	name: string;
	description?: string | null;
	imageUrl?: string | null;
	parentId?: string | null;
	_count?: { children: number; products: number };
};

type Product = {
	id: string;
	name: string;
	colorPrice: number;
	bwPrice: number;
	description?: string | null;
	imageUrl?: string | null;
	categoryId: string;
	category?: { id: string; name: string } | null;
};

type CategoryFormState = {
	id?: string;
	name: string;
	description: string;
	parentId: string;
};

type ProductFormState = {
	id?: string;
	name: string;
	colorPrice: string;
	bwPrice: string;
	description: string;
	categoryId: string;
	imageUrl: string;
};

const initialCategoryForm: CategoryFormState = {
	name: "",
	description: "",
	parentId: "",
};

const initialProductForm: ProductFormState = {
	name: "",
	colorPrice: "",
	bwPrice: "",
	description: "",
	categoryId: "",
	imageUrl: "",
};

const initialSettings: ShopSettings = {
	shopName: "",
	tagline: "",
	phone: "",
	address: "",
	email: "",
	website: "",
};

// ─── Shared input/button classes ──────────────────────────────────────────────
const inputCls =
	"mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600";
const labelCls =
	"block text-xs font-semibold uppercase tracking-wide text-slate-500";
const btnPrimary =
	"rounded-md bg-primary-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50";
const btnSecondary =
	"rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard({
	adminPath,
	adminEmail,
}: {
	adminPath: string;
	adminEmail?: string | null;
}) {
	// ── State ─────────────────────────────────────────────────────────────────
	type Tab = "settings" | "categories" | "products";
	const [activeTab, setActiveTab] = useState<Tab>("settings");

	const [categories, setCategories] = useState<Category[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [settingsData, setSettingsData] =
		useState<ShopSettings>(initialSettings);

	const [catForm, setCatForm] =
		useState<CategoryFormState>(initialCategoryForm);
	const [prodForm, setProdForm] =
		useState<ProductFormState>(initialProductForm);
	const [settingsForm, setSettingsForm] =
		useState<ShopSettings>(initialSettings);

	const [isLoadingSettings, setIsLoadingSettings] = useState(true);
	const [isLoadingCats, setIsLoadingCats] = useState(true);
	const [isLoadingProds, setIsLoadingProds] = useState(true);
	const [isSavingSettings, setIsSavingSettings] = useState(false);
	const [isSavingCat, setIsSavingCat] = useState(false);
	const [isSavingProd, setIsSavingProd] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// ── Data loaders ──────────────────────────────────────────────────────────
	const loadSettings = useCallback(async () => {
		setIsLoadingSettings(true);
		try {
			const res = await fetch("/api/admin/shop-settings");
			const json = await res.json();
			if (!res.ok) throw new Error(json.message ?? "Failed to load settings.");
			const s: ShopSettings = {
				shopName: json.shopName ?? "",
				tagline: json.tagline ?? "",
				phone: json.phone ?? "",
				address: json.address ?? "",
				email: json.email ?? "",
				website: json.website ?? "",
			};
			setSettingsData(s);
			setSettingsForm(s);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load settings.");
		} finally {
			setIsLoadingSettings(false);
		}
	}, []);

	const loadCategories = useCallback(async () => {
		setIsLoadingCats(true);
		try {
			const res = await fetch("/api/categories?all=true");
			const json = await res.json();
			if (!res.ok)
				throw new Error(json.message ?? "Failed to load categories.");
			setCategories(json.data ?? []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load categories.",
			);
		} finally {
			setIsLoadingCats(false);
		}
	}, []);

	const loadProducts = useCallback(async () => {
		setIsLoadingProds(true);
		try {
			const res = await fetch("/api/products");
			const json = await res.json();
			if (!res.ok) throw new Error(json.message ?? "Failed to load products.");
			setProducts(json.data ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load products.");
		} finally {
			setIsLoadingProds(false);
		}
	}, []);

	useEffect(() => {
		void loadSettings();
		void loadCategories();
		void loadProducts();
	}, [loadSettings, loadCategories, loadProducts]);

	// ── Helpers ───────────────────────────────────────────────────────────────
	const notify = (msg: string, isError = false) => {
		if (isError) {
			setError(msg);
			setSuccess(null);
		} else {
			setSuccess(msg);
			setError(null);
		}
		setTimeout(() => {
			setError(null);
			setSuccess(null);
		}, 5000);
	};

	// ── Settings handler ──────────────────────────────────────────────────────
	const handleSettingsSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingSettings(true);
		try {
			const res = await fetch("/api/admin/shop-settings", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					shopName: settingsForm.shopName,
					tagline: settingsForm.tagline || null,
					phone: settingsForm.phone || null,
					address: settingsForm.address || null,
					email: settingsForm.email || null,
					website: settingsForm.website || null,
				}),
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Save failed.");
			notify("Shop settings saved. Reload the page to see the header update.");
			setSettingsData({ ...settingsForm });
		} catch (err) {
			notify(err instanceof Error ? err.message : "Save failed.", true);
		} finally {
			setIsSavingSettings(false);
		}
	};

	const isEditingCat = Boolean(catForm.id);
	const isEditingProd = Boolean(prodForm.id);

	// Build a flat list sorted for the parent selector (name-sorted, indented)
	const categoryOptions = useMemo(() => {
		// Topological sort so parents appear before children
		const map = new Map(categories.map((c) => [c.id, c]));
		const result: { id: string; label: string }[] = [];
		const visited = new Set<string>();

		const visit = (id: string, depth: number) => {
			if (visited.has(id)) return;
			visited.add(id);
			const cat = map.get(id);
			if (!cat) return;
			result.push({ id: cat.id, label: "—".repeat(depth) + " " + cat.name });
			categories
				.filter((c) => c.parentId === id)
				.sort((a, b) => a.name.localeCompare(b.name))
				.forEach((child) => visit(child.id, depth + 1));
		};

		categories
			.filter((c) => !c.parentId)
			.sort((a, b) => a.name.localeCompare(b.name))
			.forEach((root) => visit(root.id, 0));

		return result;
	}, [categories]);

	// ── Category handlers ─────────────────────────────────────────────────────
	const handleCatSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingCat(true);
		try {
			const payload = {
				id: catForm.id,
				name: catForm.name,
				description: catForm.description,
				parentId: catForm.parentId || null,
			};
			const res = await fetch("/api/admin/categories", {
				method: isEditingCat ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Save failed.");
			notify(isEditingCat ? "Category updated." : "Category created.");
			setCatForm(initialCategoryForm);
			await loadCategories();
		} catch (err) {
			notify(err instanceof Error ? err.message : "Save failed.", true);
		} finally {
			setIsSavingCat(false);
		}
	};

	const handleDeleteCat = async (id: string, name: string) => {
		if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
		try {
			const res = await fetch(`/api/admin/categories?id=${id}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Delete failed.");
			notify("Category deleted.");
			await loadCategories();
			await loadProducts();
		} catch (err) {
			notify(err instanceof Error ? err.message : "Delete failed.", true);
		}
	};

	const handleEditCat = (cat: Category) => {
		setCatForm({
			id: cat.id,
			name: cat.name,
			description: cat.description ?? "",
			parentId: cat.parentId ?? "",
		});
		setActiveTab("categories");
	};

	// ── Product handlers ──────────────────────────────────────────────────────
	const handleProdSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingProd(true);
		try {
			const payload = {
				id: prodForm.id,
				name: prodForm.name,
				colorPrice:
					prodForm.colorPrice === "" ? 0 : Number(prodForm.colorPrice),
				bwPrice: prodForm.bwPrice === "" ? 0 : Number(prodForm.bwPrice),
				description: prodForm.description,
				categoryId: prodForm.categoryId,
				imageUrl: prodForm.imageUrl,
			};
			const res = await fetch("/api/admin/products", {
				method: isEditingProd ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Save failed.");
			notify(isEditingProd ? "Product updated." : "Product created.");
			setProdForm(initialProductForm);
			await loadProducts();
			await loadCategories(); // refresh counts
		} catch (err) {
			notify(err instanceof Error ? err.message : "Save failed.", true);
		} finally {
			setIsSavingProd(false);
		}
	};

	const handleDeleteProd = async (id: string, name: string) => {
		if (!confirm(`Delete "${name}"?`)) return;
		try {
			const res = await fetch(`/api/admin/products?id=${id}`, {
				method: "DELETE",
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Delete failed.");
			notify("Product deleted.");
			await loadProducts();
			await loadCategories();
		} catch (err) {
			notify(err instanceof Error ? err.message : "Delete failed.", true);
		}
	};

	const handleEditProd = (p: Product) => {
		setProdForm({
			id: p.id,
			name: p.name,
			colorPrice: p.colorPrice.toString(),
			bwPrice: p.bwPrice.toString(),
			description: p.description ?? "",
			categoryId: p.categoryId,
			imageUrl: p.imageUrl ?? "",
		});
		setActiveTab("products");
	};

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setIsUploading(true);
		try {
			const formData = new FormData();
			const safeName = file.name.replace(/\s+/g, "-");
			const folder = prodForm.categoryId || "uploads";
			formData.append("file", file);
			formData.append("path", `${folder}/${Date.now()}-${safeName}`);
			const res = await fetch("/api/admin/products/upload", {
				method: "POST",
				body: formData,
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				throw new Error(json.message ?? "Upload failed.");
			setProdForm((prev) => ({ ...prev, imageUrl: json.url }));
			notify("Image uploaded.");
		} catch (err) {
			notify(err instanceof Error ? err.message : "Upload failed.", true);
		} finally {
			setIsUploading(false);
		}
	};

	const handleLogout = async () => {
		await fetch("/api/admin/auth", { method: "DELETE" });
		window.location.href = `/${adminPath}`;
	};

	// ── Tab config ────────────────────────────────────────────────────────────
	const tabs: { id: Tab; label: string }[] = [
		{ id: "settings", label: "Shop Settings" },
		{ id: "categories", label: `Categories (${categories.length})` },
		{ id: "products", label: `Products (${products.length})` },
	];

	// ── Render ────────────────────────────────────────────────────────────────
	return (
		<div className="space-y-6">
			{/* Header bar */}
			<div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
				<div>
					<h2 className="text-lg font-bold text-slate-900">Admin Dashboard</h2>
					{adminEmail ? (
						<p className="mt-0.5 text-xs text-slate-500">{adminEmail}</p>
					) : null}
					{settingsData.shopName ? (
						<p className="text-xs font-medium text-slate-600">
							{settingsData.shopName}
						</p>
					) : null}
				</div>
				<div className="flex items-center gap-4">
					<p className="hidden text-xs text-slate-400 sm:block">
						{categories.length} categories &middot; {products.length} products
					</p>
					<button onClick={handleLogout} className={btnSecondary}>
						Logout
					</button>
				</div>
			</div>

			{/* Notifications */}
			{error ? (
				<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<span className="font-semibold">Error:</span> {error}
				</div>
			) : null}
			{success ? (
				<div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					<span className="font-semibold">Success:</span> {success}
				</div>
			) : null}

			{/* Tabs */}
			<div className="border-b border-slate-200">
				<nav className="-mb-px flex gap-1 overflow-x-auto">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
								activeTab === tab.id
									? "border-primary-700 text-primary-800"
									: "border-transparent text-slate-500 hover:text-slate-700"
							}`}>
							{tab.label}
						</button>
					))}
				</nav>
			</div>

			{/* ── Settings Tab ─────────────────────────────────────────────────── */}
			{activeTab === "settings" ? (
				<section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
					<div className="mb-5">
						<h3 className="text-base font-semibold text-slate-900">
							Shop Identity
						</h3>
						<p className="mt-1 text-sm text-slate-500">
							This information appears in the site header and footer.
						</p>
					</div>
					{isLoadingSettings ? (
						<div className="flex justify-center py-10">
							<div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
						</div>
					) : (
						<form
							onSubmit={handleSettingsSubmit}
							className="max-w-xl space-y-5">
							<div>
								<label className={labelCls}>Shop Name *</label>
								<input
									value={settingsForm.shopName}
									onChange={(e) =>
										setSettingsForm((p) => ({ ...p, shopName: e.target.value }))
									}
									required
									placeholder="e.g., The Book Store"
									className={inputCls}
								/>
							</div>
							<div>
								<label className={labelCls}>Tagline</label>
								<input
									value={settingsForm.tagline}
									onChange={(e) =>
										setSettingsForm((p) => ({ ...p, tagline: e.target.value }))
									}
									placeholder="e.g., Your local bookshop since 1990"
									className={inputCls}
								/>
							</div>
							<div className="grid gap-5 sm:grid-cols-2">
								<div>
									<label className={labelCls}>Phone</label>
									<input
										value={settingsForm.phone}
										onChange={(e) =>
											setSettingsForm((p) => ({ ...p, phone: e.target.value }))
										}
										placeholder="+1 234 567 8900"
										className={inputCls}
									/>
								</div>
								<div>
									<label className={labelCls}>Email</label>
									<input
										type="email"
										value={settingsForm.email}
										onChange={(e) =>
											setSettingsForm((p) => ({ ...p, email: e.target.value }))
										}
										placeholder="hello@store.com"
										className={inputCls}
									/>
								</div>
							</div>
							<div>
								<label className={labelCls}>Address</label>
								<textarea
									rows={2}
									value={settingsForm.address}
									onChange={(e) =>
										setSettingsForm((p) => ({
											...p,
											address: e.target.value,
										}))
									}
									placeholder="123 Main Street, City, Country"
									className={inputCls}
								/>
							</div>
							<div>
								<label className={labelCls}>Website</label>
								<input
									type="url"
									value={settingsForm.website}
									onChange={(e) =>
										setSettingsForm((p) => ({
											...p,
											website: e.target.value,
										}))
									}
									placeholder="https://www.store.com"
									className={inputCls}
								/>
							</div>
							<div className="pt-2">
								<button
									type="submit"
									disabled={isSavingSettings}
									className={btnPrimary}>
									{isSavingSettings ? "Saving..." : "Save Settings"}
								</button>
							</div>
						</form>
					)}
				</section>
			) : null}

			{/* ── Categories Tab ────────────────────────────────────────────────── */}
			{activeTab === "categories" ? (
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Category Form */}
					<section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-5 flex items-center justify-between">
							<h3 className="text-base font-semibold text-slate-900">
								{isEditingCat ? "Edit Category" : "New Category"}
							</h3>
							{isEditingCat ? (
								<span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
									Editing
								</span>
							) : null}
						</div>
						<form onSubmit={handleCatSubmit} className="space-y-4">
							<div>
								<label className={labelCls}>Name *</label>
								<input
									value={catForm.name}
									onChange={(e) =>
										setCatForm((p) => ({ ...p, name: e.target.value }))
									}
									required
									placeholder="e.g., Fiction"
									className={inputCls}
								/>
							</div>
							<div>
								<label className={labelCls}>Parent Category</label>
								<select
									value={catForm.parentId}
									onChange={(e) =>
										setCatForm((p) => ({ ...p, parentId: e.target.value }))
									}
									className={inputCls}>
									<option value="">— Root (no parent) —</option>
									{categoryOptions
										.filter((opt) => opt.id !== catForm.id)
										.map((opt) => (
											<option key={opt.id} value={opt.id}>
												{opt.label}
											</option>
										))}
								</select>
							</div>
							<div>
								<label className={labelCls}>Description</label>
								<textarea
									rows={2}
									value={catForm.description}
									onChange={(e) =>
										setCatForm((p) => ({
											...p,
											description: e.target.value,
										}))
									}
									placeholder="Optional description"
									className={inputCls}
								/>
							</div>
							<div className="flex items-center gap-3 pt-1">
								<button
									type="submit"
									disabled={isSavingCat}
									className={btnPrimary}>
									{isSavingCat
										? "Saving..."
										: isEditingCat
											? "Update"
											: "Create"}
								</button>
								{isEditingCat ? (
									<button
										type="button"
										onClick={() => setCatForm(initialCategoryForm)}
										className={btnSecondary}>
										Cancel
									</button>
								) : null}
							</div>
						</form>
					</section>

					{/* Category List */}
					<section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 className="mb-4 text-base font-semibold text-slate-900">
							All Categories
						</h3>
						{isLoadingCats ? (
							<div className="flex justify-center py-10">
								<div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
							</div>
						) : categories.length === 0 ? (
							<p className="py-8 text-center text-sm text-slate-500">
								No categories yet.
							</p>
						) : (
							<div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
								{categoryOptions.map(({ id, label }) => {
									const cat = categories.find((c) => c.id === id)!;
									return (
										<div
											key={id}
											className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5">
											<div className="min-w-0">
												<p className="truncate text-sm font-medium text-slate-800">
													{label}
												</p>
												<p className="mt-0.5 text-xs text-slate-400">
													{cat._count?.children ?? 0} sub-categories &middot;{" "}
													{cat._count?.products ?? 0} products
												</p>
											</div>
											<div className="flex shrink-0 gap-1">
												<button
													onClick={() => handleEditCat(cat)}
													className="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">
													Edit
												</button>
												<button
													onClick={() => handleDeleteCat(cat.id, cat.name)}
													className="rounded bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-200">
													Delete
												</button>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</section>
				</div>
			) : null}

			{/* ── Products Tab ──────────────────────────────────────────────────── */}
			{activeTab === "products" ? (
				<div className="grid gap-6 lg:grid-cols-2">
					{/* Product Form */}
					<section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<div className="mb-5 flex items-center justify-between">
							<h3 className="text-base font-semibold text-slate-900">
								{isEditingProd ? "Edit Product" : "New Product"}
							</h3>
							{isEditingProd ? (
								<span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
									Editing
								</span>
							) : null}
						</div>
						<form onSubmit={handleProdSubmit} className="space-y-4">
							<div>
								<label className={labelCls}>Product Name *</label>
								<input
									value={prodForm.name}
									onChange={(e) =>
										setProdForm((p) => ({ ...p, name: e.target.value }))
									}
									required
									placeholder="e.g., The Great Gatsby"
									className={inputCls}
								/>
							</div>
							<div className="grid gap-4 sm:grid-cols-3">
								<div>
									<label className={labelCls}>Color Price (Rs)</label>
									<input
										type="number"
										min="0"
										step="0.01"
										value={prodForm.colorPrice}
										onChange={(e) =>
											setProdForm((p) => ({ ...p, colorPrice: e.target.value }))
										}
										placeholder="0 = N/A"
										className={inputCls}
									/>
								</div>
								<div>
									<label className={labelCls}>B&amp;W Price (Rs)</label>
									<input
										type="number"
										min="0"
										step="0.01"
										value={prodForm.bwPrice}
										onChange={(e) =>
											setProdForm((p) => ({ ...p, bwPrice: e.target.value }))
										}
										placeholder="0 = N/A"
										className={inputCls}
									/>
								</div>
								<div>
									<label className={labelCls}>Category *</label>
									<select
										value={prodForm.categoryId}
										onChange={(e) =>
											setProdForm((p) => ({
												...p,
												categoryId: e.target.value,
											}))
										}
										required
										className={inputCls}>
										<option value="">— Select —</option>
										{categoryOptions.map((opt) => (
											<option key={opt.id} value={opt.id}>
												{opt.label}
											</option>
										))}
									</select>
								</div>
							</div>
							<div>
								<label className={labelCls}>Description</label>
								<textarea
									rows={3}
									value={prodForm.description}
									onChange={(e) =>
										setProdForm((p) => ({
											...p,
											description: e.target.value,
										}))
									}
									placeholder="Describe the product..."
									className={inputCls}
								/>
							</div>
							{/* Image */}
							<div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4">
								<label className={labelCls}>Product Image</label>
								{prodForm.imageUrl ? (
									<div className="flex items-start gap-3">
										<img
											src={prodForm.imageUrl}
											alt="Preview"
											className="h-20 w-20 shrink-0 rounded-md object-cover"
										/>
										<div className="min-w-0">
											<p className="break-all text-xs text-slate-500">
												{prodForm.imageUrl}
											</p>
											<button
												type="button"
												onClick={() =>
													setProdForm((p) => ({ ...p, imageUrl: "" }))
												}
												className="mt-1 text-xs font-medium text-red-600 hover:text-red-700">
												Remove
											</button>
										</div>
									</div>
								) : null}
								<input
									value={prodForm.imageUrl}
									onChange={(e) =>
										setProdForm((p) => ({ ...p, imageUrl: e.target.value }))
									}
									placeholder="Paste image URL"
									className={inputCls}
								/>
								<div className="flex items-center gap-2">
									<div className="h-px flex-1 bg-slate-300" />
									<span className="text-xs text-slate-400">or</span>
									<div className="h-px flex-1 bg-slate-300" />
								</div>
								<label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400">
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
							<div className="flex items-center gap-3 pt-1">
								<button
									type="submit"
									disabled={isSavingProd}
									className={btnPrimary}>
									{isSavingProd
										? "Saving..."
										: isEditingProd
											? "Update Product"
											: "Create Product"}
								</button>
								{isEditingProd ? (
									<button
										type="button"
										onClick={() => setProdForm(initialProductForm)}
										className={btnSecondary}>
										Cancel
									</button>
								) : null}
							</div>
						</form>
					</section>

					{/* Product List */}
					<section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
						<h3 className="mb-4 text-base font-semibold text-slate-900">
							All Products
						</h3>
						{isLoadingProds ? (
							<div className="flex justify-center py-10">
								<div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
							</div>
						) : products.length === 0 ? (
							<p className="py-8 text-center text-sm text-slate-500">
								No products yet. Create a category first, then add products.
							</p>
						) : (
							<div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
								{products.map((product) => (
									<div
										key={product.id}
										className="flex gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
										{product.imageUrl ? (
											<img
												src={product.imageUrl}
												alt={product.name}
												className="h-14 w-14 shrink-0 rounded-md object-cover"
											/>
										) : (
											<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-200">
												<svg
													className="h-6 w-6 text-slate-400"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
													strokeWidth={1.5}>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
													/>
												</svg>
											</div>
										)}
										<div className="flex min-w-0 flex-1 flex-col justify-between">
											<div className="flex items-start justify-between gap-2">
												<div className="min-w-0">
													<p className="truncate text-sm font-medium text-slate-900">
														{product.name}
													</p>
													<div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
														{product.colorPrice > 0 ? (
															<span className="font-semibold text-secondary-700">
																Color: Rs {product.colorPrice.toFixed(2)}
															</span>
														) : (
															<span className="text-slate-400">Color: N/A</span>
														)}
														<span className="text-slate-300">·</span>
														{product.bwPrice > 0 ? (
															<span className="font-semibold text-secondary-700">
																B&amp;W: Rs {product.bwPrice.toFixed(2)}
															</span>
														) : (
															<span className="text-slate-400">
																B&amp;W: N/A
															</span>
														)}
													</div>
													{product.category ? (
														<span className="mt-1 inline-block rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
															{product.category.name}
														</span>
													) : null}
												</div>
												<div className="flex shrink-0 gap-1">
													<button
														onClick={() => handleEditProd(product)}
														className="rounded bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">
														Edit
													</button>
													<button
														onClick={() =>
															handleDeleteProd(product.id, product.name)
														}
														className="rounded bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-200">
														Delete
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</section>
				</div>
			) : null}
		</div>
	);
}
