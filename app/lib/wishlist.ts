export type WishItem = {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  addedAt: string;
};

export function getWishlist(userId: string): WishItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`wt_wish_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function isWished(userId: string, productId: string): boolean {
  return getWishlist(userId).some((w) => w.productId === productId);
}

export function toggleWishlist(userId: string, item: WishItem): boolean {
  const list = getWishlist(userId);
  const exists = list.some((w) => w.productId === item.productId);
  const updated = exists
    ? list.filter((w) => w.productId !== item.productId)
    : [{ ...item, addedAt: new Date().toISOString() }, ...list];
  localStorage.setItem(`wt_wish_${userId}`, JSON.stringify(updated));
  return !exists;
}

export function removeFromWishlist(userId: string, productId: string): WishItem[] {
  const updated = getWishlist(userId).filter((w) => w.productId !== productId);
  localStorage.setItem(`wt_wish_${userId}`, JSON.stringify(updated));
  return updated;
}
