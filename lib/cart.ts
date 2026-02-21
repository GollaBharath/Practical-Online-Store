export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image_url?: string;
	category?: string;
}

export interface Cart {
	items: CartItem[];
	totalPrice: number;
	lastUpdated: string;
}

const CART_KEY = "store_cart";

// Get cart from localStorage
export const getCart = (): Cart => {
	if (typeof window === "undefined")
		return { items: [], totalPrice: 0, lastUpdated: new Date().toISOString() };

	try {
		const cart = localStorage.getItem(CART_KEY);
		return cart
			? JSON.parse(cart)
			: { items: [], totalPrice: 0, lastUpdated: new Date().toISOString() };
	} catch {
		return { items: [], totalPrice: 0, lastUpdated: new Date().toISOString() };
	}
};

// Save cart to localStorage
export const saveCart = (cart: Cart): void => {
	if (typeof window === "undefined") return;
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Add item to cart
export const addToCart = (item: CartItem): Cart => {
	const cart = getCart();
	const existingItem = cart.items.find((i) => i.id === item.id);

	if (existingItem) {
		existingItem.quantity += item.quantity;
	} else {
		cart.items.push(item);
	}

	cart.totalPrice = calculateTotal(cart.items);
	cart.lastUpdated = new Date().toISOString();
	saveCart(cart);

	return cart;
};

// Remove item from cart
export const removeFromCart = (itemId: string): Cart => {
	const cart = getCart();
	cart.items = cart.items.filter((i) => i.id !== itemId);
	cart.totalPrice = calculateTotal(cart.items);
	cart.lastUpdated = new Date().toISOString();
	saveCart(cart);

	return cart;
};

// Update item quantity
export const updateQuantity = (itemId: string, quantity: number): Cart => {
	const cart = getCart();
	const item = cart.items.find((i) => i.id === itemId);

	if (item) {
		if (quantity <= 0) {
			return removeFromCart(itemId);
		}
		item.quantity = quantity;
	}

	cart.totalPrice = calculateTotal(cart.items);
	cart.lastUpdated = new Date().toISOString();
	saveCart(cart);

	return cart;
};

// Clear cart
export const clearCart = (): Cart => {
	const emptyCart: Cart = {
		items: [],
		totalPrice: 0,
		lastUpdated: new Date().toISOString(),
	};
	saveCart(emptyCart);
	return emptyCart;
};

// Calculate total price
const calculateTotal = (items: CartItem[]): number => {
	return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Get cart summary as string for WhatsApp
export const getCartSummary = (): string => {
	const cart = getCart();
	if (cart.items.length === 0) return "Cart is empty";

	let summary = "My Order:\n\n";
	cart.items.forEach((item) => {
		summary += `${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n`;
	});
	summary += `\nTotal: ₹${cart.totalPrice.toFixed(2)}`;

	return summary;
};
