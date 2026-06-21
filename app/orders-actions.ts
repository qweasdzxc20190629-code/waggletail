'use server';

import { supabaseAdmin } from './lib/supabase-admin';

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
  status: '주문완료' | '발주확인' | '배송준비중' | '배송지시' | '배송중' | '배송완료' | '주문취소';
  date: string;
  address?: string;
  buyerName?: string;
  buyerPhone?: string;
  recipientName?: string;
  recipientPhone?: string;
  request?: string;
  trackingNumber?: string;
  courier?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOrder(r: any): Order {
  return {
    id: r.id,
    productId: r.product_id,
    productName: r.product_name ?? '',
    productImage: r.product_image ?? '',
    category: r.category ?? '',
    optionLabel: r.option_label ?? '',
    qty: r.qty ?? 1,
    unitPrice: r.unit_price ?? 0,
    totalPrice: r.total_price ?? 0,
    status: r.status ?? '주문완료',
    date: r.date,
    address: r.address ?? undefined,
    buyerName: r.buyer_name ?? undefined,
    buyerPhone: r.buyer_phone ?? undefined,
    recipientName: r.recipient_name ?? undefined,
    recipientPhone: r.recipient_phone ?? undefined,
    request: r.request ?? undefined,
    trackingNumber: r.tracking_number ?? undefined,
    courier: r.courier ?? undefined,
  };
}

export async function getAllOrdersAction(): Promise<Order[]> {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('date', { ascending: false });
  return data ? data.map(rowToOrder) : [];
}

export async function getAllOrdersUpdateAction(
  orderId: string,
  patch: Partial<Pick<Order, 'status' | 'trackingNumber' | 'courier'>> & { clearTracking?: boolean }
): Promise<Order[]> {
  await supabaseAdmin
    .from('orders')
    .update({
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.clearTracking ? { tracking_number: null, courier: null } : {
        ...(patch.trackingNumber !== undefined ? { tracking_number: patch.trackingNumber } : {}),
        ...(patch.courier !== undefined ? { courier: patch.courier } : {}),
      }),
    })
    .eq('id', orderId);
  return getAllOrdersAction();
}

export async function getOrdersAction(userId: string): Promise<Order[]> {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return data ? data.map(rowToOrder) : [];
}

export async function addOrderAction(
  userId: string,
  order: Omit<Order, 'id' | 'date' | 'status'> & {
    buyerName?: string;
    buyerPhone?: string;
    recipientName?: string;
    recipientPhone?: string;
    request?: string;
  }
): Promise<Order> {
  const now = new Date();
  const id = `WT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-4)}`;
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      id,
      user_id: userId,
      product_id: order.productId,
      product_name: order.productName,
      product_image: order.productImage,
      category: order.category,
      option_label: order.optionLabel,
      qty: order.qty,
      unit_price: order.unitPrice,
      total_price: order.totalPrice,
      status: '주문완료',
      date: now.toISOString(),
      address: order.address,
      buyer_name: order.buyerName,
      buyer_phone: order.buyerPhone,
      recipient_name: order.recipientName,
      recipient_phone: order.recipientPhone,
      request: order.request,
    })
    .select()
    .single();
  if (error || !data) throw new Error(error?.message ?? 'addOrder failed');
  return rowToOrder(data);
}

export async function updateOrderAction(
  userId: string,
  orderId: string,
  patch: Partial<Pick<Order, 'status' | 'address'>>
): Promise<Order[]> {
  await supabaseAdmin
    .from('orders')
    .update({
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.address !== undefined ? { address: patch.address } : {}),
    })
    .eq('id', orderId)
    .eq('user_id', userId);
  return getOrdersAction(userId);
}
