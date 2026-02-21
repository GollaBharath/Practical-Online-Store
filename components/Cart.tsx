"use client";

import { useCart } from "./CartContext";
import PDFGenerator from "./PDFGenerator";
import WhatsAppShare from "./WhatsAppShare";

type CartProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function Cart({ isOpen, onClose }: CartProps) {
	const { cart, removeItem, updateItemQuantity, clear } = useCart();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50">
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>
			<aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-gradient-to-br from-white to-primary-50 shadow-2xl sm:max-w-md">
				<div className="flex items-center justify-between border-b-2 border-primary-200 bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
					<h2 className="text-base font-bold text-white sm:text-lg">
						🛒 Your Cart
					</h2>
					<button
						onClick={onClose}
						className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:text-sm">
						Close
					</button>
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					{cart.items.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center text-center">
							<div className="rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 p-8">
								<p className="text-6xl">🛒</p>
							</div>
							<p className="mt-6 text-base font-semibold text-gray-700">
								Your cart is empty
							</p>
							<p className="mt-2 text-sm text-gray-500">
								Add some amazing products to get started!
							</p>
						</div>
					) : (
						<div className="flex flex-col gap-3">
							{cart.items.map((item) => (
								<div
									key={item.id}
									className="rounded-xl border-2 border-primary-200 bg-white p-3 shadow-md transition-all hover:shadow-lg">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-sm font-bold text-gray-900 sm:text-base">
												{item.name}
											</p>
											<p className="text-xs font-semibold text-primary-600 sm:text-sm">
												Rs {item.price.toFixed(2)}
											</p>
										</div>
										<button
											onClick={() => removeItem(item.id)}
											className="rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-600 transition-colors hover:bg-red-200">
											✕
										</button>
									</div>
									<div className="mt-3 flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2">
										<div className="flex items-center gap-2">
											<label className="text-xs font-bold text-primary-700">
												Qty
											</label>
											<input
												type="number"
												min={1}
												value={item.quantity}
												onChange={(event) =>
													updateItemQuantity(
														item.id,
														Number(event.target.value),
													)
												}
												className="w-14 rounded-lg border-2 border-primary-300 bg-white px-2 py-1 text-xs font-bold text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:w-16 sm:text-sm"
											/>
										</div>
										<p className="text-sm font-black text-primary-700 sm:text-base">
											Rs {(item.price * item.quantity).toFixed(2)}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="border-t-2 border-primary-200 bg-white p-4 shadow-2xl">
					<div className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-4">
						<div className="flex items-center justify-between text-base font-bold text-white sm:text-lg">
							<span>💰 Total</span>
							<span>Rs {cart.totalPrice.toFixed(2)}</span>
						</div>
					</div>
					<div className="mt-4 flex flex-col gap-3">
						<PDFGenerator items={cart.items} totalPrice={cart.totalPrice} />
						<WhatsAppShare items={cart.items} totalPrice={cart.totalPrice} />
						<div className="flex items-center gap-3">
							<button
								onClick={clear}
								className="flex-1 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 hover:scale-105">
								🗑️ Clear
							</button>
							<button
								onClick={onClose}
								className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl">
								✨ Continue
							</button>
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}
