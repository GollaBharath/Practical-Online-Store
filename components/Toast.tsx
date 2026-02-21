"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastProps = {
	message: string;
	type?: ToastType;
	duration?: number;
	onClose: () => void;
};

export default function Toast({
	message,
	type = "info",
	duration = 3000,
	onClose,
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(onClose, 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const bgColor =
		type === "success"
			? "bg-green-600"
			: type === "error"
				? "bg-red-600"
				: "bg-gray-900";

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${bgColor} ${
				isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
			}`}>
			{message}
		</div>
	);
}

export function useToast() {
	const [toasts, setToasts] = useState<
		Array<{ id: number; message: string; type: ToastType }>
	>([]);

	const showToast = (message: string, type: ToastType = "info") => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);
	};

	const removeToast = (id: number) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	const ToastContainer = () => (
		<>
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					onClose={() => removeToast(toast.id)}
				/>
			))}
		</>
	);

	return { showToast, ToastContainer };
}
