"use client";

import { useRef } from "react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChange,
	placeholder = "Search products…",
}: SearchBarProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="relative w-full">
			{/* Search icon */}
			<span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
				<svg
					className="h-4.5 w-4.5 text-slate-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					strokeWidth={2}>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
					/>
				</svg>
			</span>

			<input
				ref={inputRef}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20 sm:py-3 sm:text-base"
			/>

			{/* Clear button */}
			{value ? (
				<button
					type="button"
					onClick={() => {
						onChange("");
						inputRef.current?.focus();
					}}
					aria-label="Clear search"
					className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
					<svg
						className="h-4 w-4"
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
				</button>
			) : null}
		</div>
	);
}
