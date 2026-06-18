export type PendingOrder = {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  optionLabel: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
};

export function savePendingOrder(order: PendingOrder) {
  localStorage.setItem('wt_pending_order', JSON.stringify(order));
}
export function getPendingOrder(): PendingOrder | null {
  try {
    const raw = localStorage.getItem('wt_pending_order');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function clearPendingOrder() {
  localStorage.removeItem('wt_pending_order');
}

export type Order = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  optionLabel: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  status: '주문완료' | '배송중' | '배송완료' | '주문취소';
  date: string;
  address?: string;
};

export function getOrders(userId: string): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`wt_orders_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateOrder(userId: string, orderId: string, patch: Partial<Pick<Order, 'status' | 'address'>>): Order[] {
  const orders = getOrders(userId);
  const updated = orders.map((o) => o.id === orderId ? { ...o, ...patch } : o);
  localStorage.setItem(`wt_orders_${userId}`, JSON.stringify(updated));
  return updated;
}

export function addOrder(userId: string, order: Omit<Order, 'id' | 'date' | 'status'>): Order {
  const orders = getOrders(userId);
  const now = new Date();
  const newOrder: Order = {
    ...order,
    id: `WT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-4)}`,
    date: now.toISOString(),
    status: '주문완료',
  };
  localStorage.setItem(`wt_orders_${userId}`, JSON.stringify([newOrder, ...orders]));
  return newOrder;
}
