export type CartItem = {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  optionLabel: string;
  qty: number;
  unitPrice: number;
};

export function getCart(userId: string): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`wt_cart_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addToCart(userId: string, item: CartItem): CartItem[] {
  const cart = getCart(userId);
  const key = `${item.productId}__${item.optionLabel}`;
  const exists = cart.find((c) => `${c.productId}__${c.optionLabel}` === key);
  const updated = exists
    ? cart.map((c) => `${c.productId}__${c.optionLabel}` === key ? { ...c, qty: c.qty + item.qty } : c)
    : [...cart, item];
  localStorage.setItem(`wt_cart_${userId}`, JSON.stringify(updated));
  return updated;
}

export function updateCartQty(userId: string, productId: string, optionLabel: string, qty: number): CartItem[] {
  const cart = getCart(userId);
  const key = `${productId}__${optionLabel}`;
  const updated = qty <= 0
    ? cart.filter((c) => `${c.productId}__${c.optionLabel}` !== key)
    : cart.map((c) => `${c.productId}__${c.optionLabel}` === key ? { ...c, qty } : c);
  localStorage.setItem(`wt_cart_${userId}`, JSON.stringify(updated));
  return updated;
}

export function removeFromCart(userId: string, productId: string, optionLabel: string): CartItem[] {
  return updateCartQty(userId, productId, optionLabel, 0);
}

export function clearCart(userId: string) {
  localStorage.removeItem(`wt_cart_${userId}`);
}

export function getCartCount(userId: string): number {
  return getCart(userId).reduce((sum, c) => sum + c.qty, 0);
}
