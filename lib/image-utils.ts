/**
 * Image utility functions for optimization and validation
 */

/**
 * Validates if string is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return (
			(parsed.protocol === "http:" || parsed.protocol === "https:") &&
			/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(parsed.pathname)
		);
	} catch {
		return false;
	}
}

/**
 * Returns a placeholder image URL for missing/broken images
 */
export function getPlaceholderImage(
	width: number = 400,
	height: number = 400,
): string {
	return `https://via.placeholder.com/${width}x${height}/e5e7eb/9ca3af?text=No+Image`;
}

/**
 * Generates optimized Supabase Storage URL with transformations
 * @param url - Original Supabase Storage URL
 * @param options - Transformation options
 */
export function optimizeSupabaseImage(
	url: string,
	options?: {
		width?: number;
		height?: number;
		quality?: number;
		format?: "origin" | "webp";
	},
): string {
	if (!url.includes("supabase")) return url;

	const params = new URLSearchParams();
	if (options?.width) params.set("width", options.width.toString());
	if (options?.height) params.set("height", options.height.toString());
	if (options?.quality) params.set("quality", options.quality.toString());
	if (options?.format) params.set("format", options.format);

	const queryString = params.toString();
	return queryString ? `${url}?${queryString}` : url;
}

/**
 * Validates file size and type before upload
 */
export function validateImageFile(file: File): {
	valid: boolean;
	error?: string;
} {
	const maxSize = 5 * 1024 * 1024; // 5MB
	const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF.",
		};
	}

	if (file.size > maxSize) {
		return {
			valid: false,
			error: "File size exceeds 5MB. Please upload a smaller image.",
		};
	}

	return { valid: true };
}

/**
 * Generates a safe filename for storage
 */
export function generateSafeFilename(originalName: string): string {
	const timestamp = Date.now();
	const sanitized = originalName
		.replace(/[^a-zA-Z0-9.-]/g, "-")
		.replace(/-+/g, "-")
		.toLowerCase();
	return `${timestamp}-${sanitized}`;
}
