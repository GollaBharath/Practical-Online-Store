"use client";

/**
 * CatalogShell
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages search + filter state and syncs it to the URL as query-params so the
 * server component (page.tsx) can read them and fetch the right products.
 *
 * URL params written:
 *   ?q=<search>
 *   &category=<categoryId>
 *   &sub=<subcategoryId>
 *   &print=color|bw
 *
 * The `children` slot is where the product grid goes. It is rendered below the
 * search/filter toolbar. Pass <ProductGrid products={…} /> (or any content) as
 * children once you have the backend wired up.
 */

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import FilterPanel, {
	type CategoryOption,
	type FilterState,
	type PrintType,
} from "@/components/FilterPanel";

interface CatalogShellProps {
	categories: CategoryOption[];
	children: React.ReactNode;
	totalResults?: number | null;
}

export default function CatalogShell({
	categories,
	children,
	totalResults,
}: CatalogShellProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	/* ── Read current state from URL ── */
	const query = searchParams.get("q") ?? "";
	const filters: FilterState = {
		categoryId: searchParams.get("category"),
		subcategoryId: searchParams.get("sub"),
		printType: (searchParams.get("print") as PrintType | null) ?? null,
	};

	/* ── Push new params to the URL ── */
	const pushParams = useCallback(
		(updates: {
			q?: string;
			category?: string | null;
			sub?: string | null;
			print?: string | null;
		}) => {
			const params = new URLSearchParams(searchParams.toString());

			function set(key: string, value: string | null | undefined) {
				if (value === null || value === undefined || value === "") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}

			if ("q" in updates) set("q", updates.q);
			if ("category" in updates) {
				set("category", updates.category);
				// reset subcategory when category changes
				set("sub", null);
			}
			if ("sub" in updates) set("sub", updates.sub);
			if ("print" in updates) set("print", updates.print);

			const search = params.toString();
			startTransition(() => {
				router.push(pathname + (search ? `?${search}` : ""));
			});
		},
		[pathname, router, searchParams],
	);

	/* ── Handlers ── */
	function handleSearchChange(value: string) {
		pushParams({ q: value });
	}

	function handleFiltersChange(next: FilterState) {
		pushParams({
			category: next.categoryId,
			sub: next.subcategoryId,
			print: next.printType,
		});
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
			{/* ── Toolbar ── */}
			<div
				className={[
					"rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-opacity sm:p-5",
					isPending ? "opacity-60" : "opacity-100",
				].join(" ")}>
				{/* Search */}
				<SearchBar
					value={query}
					onChange={handleSearchChange}
					placeholder="Search by product name…"
				/>

				{/* Divider */}
				<div className="my-4 border-t border-slate-100" />

				{/* Filters */}
				<FilterPanel
					categories={categories}
					filters={filters}
					onChange={handleFiltersChange}
				/>
			</div>

			{/* ── Result count or pending indicator ── */}
			<div className="mt-4 flex min-h-[1.5rem] items-center">
				{isPending ? (
					<span className="flex items-center gap-2 text-xs text-slate-400">
						<span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-primary-600" />
						Searching…
					</span>
				) : totalResults !== null && totalResults !== undefined ? (
					<span className="text-xs text-slate-500">
						{totalResults === 0
							? "No products found"
							: `${totalResults} product${totalResults !== 1 ? "s" : ""} found`}
					</span>
				) : null}
			</div>

			{/* ── Product area ── */}
			<div className="mt-2">{children}</div>
		</div>
	);
}
