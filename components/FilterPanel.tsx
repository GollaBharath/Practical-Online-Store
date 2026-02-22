"use client";

/* ─── Types ──────────────────────────────────────────────────────────── */

export type CategoryOption = {
	id: string;
	name: string;
	children?: { id: string; name: string }[];
};

export type PrintType = "color" | "bw";

export type FilterState = {
	categoryId: string | null;
	subcategoryId: string | null;
	printType: PrintType | null;
};

interface FilterPanelProps {
	categories: CategoryOption[];
	filters: FilterState;
	onChange: (next: FilterState) => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

function Chip({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-all",
				active
					? "border-primary-700 bg-primary-800 text-white shadow-sm"
					: "border-slate-200 bg-white text-slate-600 hover:border-primary-400 hover:text-primary-700",
			].join(" ")}>
			{label}
		</button>
	);
}

function FilterSection({
	label,
	children,
	animateIn = false,
}: {
	label: string;
	children: React.ReactNode;
	animateIn?: boolean;
}) {
	return (
		<div
			className={[
				"flex flex-wrap items-center gap-2",
				animateIn ? "border-l-2 border-primary-200 pl-3" : "",
			].join(" ")}>
			<span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
				{label}
			</span>
			{children}
		</div>
	);
}

/* ─── Component ──────────────────────────────────────────────────────── */

export default function FilterPanel({
	categories,
	filters,
	onChange,
}: FilterPanelProps) {
	const { categoryId, subcategoryId, printType } = filters;

	const selectedCategory = categories.find((c) => c.id === categoryId) ?? null;
	const hasSubcategories =
		selectedCategory !== null &&
		selectedCategory.children !== undefined &&
		selectedCategory.children.length > 0;

	const isFiltered =
		categoryId !== null || subcategoryId !== null || printType !== null;

	/* ── helpers ── */
	function setCategory(id: string | null) {
		onChange({ ...filters, categoryId: id, subcategoryId: null });
	}

	function setSubcategory(id: string | null) {
		onChange({ ...filters, subcategoryId: id });
	}

	function setPrintType(pt: PrintType | null) {
		onChange({ ...filters, printType: pt });
	}

	function clearAll() {
		onChange({ categoryId: null, subcategoryId: null, printType: null });
	}

	return (
		<div className="space-y-3">
			{/* ── Category ── */}
			{categories.length > 0 ? (
				<FilterSection label="Category">
					<Chip
						label="All"
						active={categoryId === null}
						onClick={() => setCategory(null)}
					/>
					{categories.map((cat) => (
						<Chip
							key={cat.id}
							label={cat.name}
							active={categoryId === cat.id}
							onClick={() => setCategory(categoryId === cat.id ? null : cat.id)}
						/>
					))}
				</FilterSection>
			) : null}

			{/* ── Sub-category — appears only when the selected category has children ── */}
			{hasSubcategories ? (
				<FilterSection label="Sub-category" animateIn>
					<Chip
						label="All"
						active={subcategoryId === null}
						onClick={() => setSubcategory(null)}
					/>
					{selectedCategory!.children!.map((sub) => (
						<Chip
							key={sub.id}
							label={sub.name}
							active={subcategoryId === sub.id}
							onClick={() =>
								setSubcategory(subcategoryId === sub.id ? null : sub.id)
							}
						/>
					))}
				</FilterSection>
			) : null}

			{/* ── Print type ── */}
			<FilterSection label="Print type">
				<Chip
					label="All"
					active={printType === null}
					onClick={() => setPrintType(null)}
				/>
				<Chip
					label="Colour"
					active={printType === "color"}
					onClick={() => setPrintType(printType === "color" ? null : "color")}
				/>
				<Chip
					label="Black & White"
					active={printType === "bw"}
					onClick={() => setPrintType(printType === "bw" ? null : "bw")}
				/>
			</FilterSection>

			{/* ── Clear all ── */}
			{isFiltered ? (
				<div>
					<button
						type="button"
						onClick={clearAll}
						className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
						<svg
							className="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={2}>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
						Clear filters
					</button>
				</div>
			) : null}
		</div>
	);
}
