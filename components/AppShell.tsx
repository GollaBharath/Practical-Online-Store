import Link from "next/link";
import type { ShopSettings } from "@/lib/shop-settings";

type AppShellProps = {
	children: React.ReactNode;
	settings: ShopSettings;
};

export default function AppShell({ children, settings }: AppShellProps) {
	const { shopName, tagline, phone, address, email, website } = settings;
	const hasContactInfo = phone || address || email;

	return (
		<div className="flex min-h-screen flex-col bg-[#f8f7f4]">
			{/* ── Main header ── */}
			<header className="sticky top-0 z-30 border-b border-primary-700 bg-primary-800 shadow-sm">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
					<Link href="/" className="flex min-w-0 flex-col">
						<span className="truncate text-lg font-bold tracking-tight text-white sm:text-xl">
							{shopName}
						</span>
						{tagline ? (
							<span className="truncate text-xs text-primary-400">
								{tagline}
							</span>
						) : null}
					</Link>

					{/* ── Contact quick-actions ── */}
					{phone ? (
						<div className="flex items-center gap-2">
							<span className="hidden text-xs text-primary-400 sm:block">
								{phone}
							</span>
							{/* WhatsApp */}
							<a
								href={`https://wa.me/${phone.replace(/\D/g, "")}`}
								target="_blank"
								rel="noopener noreferrer"
								title="Chat on WhatsApp"
								aria-label="Chat on WhatsApp"
								className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white transition-opacity hover:opacity-90">
								{/* WhatsApp SVG */}
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="currentColor">
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
								</svg>
							</a>
							{/* Call */}
							<a
								href={`tel:${phone.replace(/\D/g, "")}`}
								title="Call us"
								aria-label="Call us"
								className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-primary-200 transition-colors hover:bg-primary-600 hover:text-white">
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									strokeWidth={2}>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
									/>
								</svg>
							</a>
						</div>
					) : null}
				</div>
			</header>

			{/* ── Page content ── */}
			<main className="flex-1">{children}</main>

			{/* ── Footer ── */}
			<footer className="border-t border-primary-700 bg-primary-900">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{/* Brand */}
						<div>
							<p className="text-base font-semibold text-white">{shopName}</p>
							{tagline ? (
								<p className="mt-1 text-sm text-primary-400">{tagline}</p>
							) : null}
						</div>

						{/* Contact */}
						{hasContactInfo ? (
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
									Contact
								</p>
								{phone ? (
									<a
										href={`tel:${phone.replace(/\s+/g, "")}`}
										className="flex items-center gap-2 text-sm text-slate-200 transition-colors hover:text-white">
										<svg
											className="h-4 w-4 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth={1.5}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
											/>
										</svg>
										{phone}
									</a>
								) : null}
								{email ? (
									<a
										href={`mailto:${email}`}
										className="flex items-center gap-2 text-sm text-slate-200 transition-colors hover:text-white">
										<svg
											className="h-4 w-4 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth={1.5}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
											/>
										</svg>
										{email}
									</a>
								) : null}
							</div>
						) : null}

						{/* Address */}
						{address ? (
							<div className="space-y-2">
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
									Location
								</p>
								<p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
									{address}
								</p>
								{website ? (
									<a
										href={website}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 text-sm text-secondary-400 transition-colors hover:text-secondary-300">
										<svg
											className="h-4 w-4 shrink-0"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth={1.5}>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253"
											/>
										</svg>
										{website.replace(/^https?:\/\//, "")}
									</a>
								) : null}
							</div>
						) : null}
					</div>
					<div className="mt-8 border-t border-primary-800 pt-5 text-center text-xs text-primary-600">
						&copy; {new Date().getFullYear()} {shopName}. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
