'use server';

import { supabaseAdmin } from './lib/supabase-admin';

export type CartItem = {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  optionLabel: string;
  qty: number;
  unitPrice: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCart(r: any): CartItem {
  return {
    productId: r.product_id,
    productName: r.product_name ?? '',
    productImage: r.product_image ?? '',
    category: r.category ?? '',
    optionLabel: r.option_label ?? '',
    qty: r.qty ?? 1,
    unitPrice: r.unit_price ?? 0,
  };
}

export async function getCartAction(userId: string): Promise<CartItem[]> {
  const { data } = await supabaseAdmin
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  return data ? data.map(rowToCart) : [];
}

export async function getCartCountAction(userId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from('carts')
    .select('qty')
    .eq('user_id', userId);
  return data ? data.reduce((sum, r) => sum + (r.qty ?? 0), 0) : 0;
}

export async function addToCartAction(userId: string, item: CartItem): Promise<CartItem[]> {
  const { data } = await supabaseAdmin
    .from('carts')
    .select('id, qty')
    .eq('user_id', userId)
    .eq('product_id', item.productId)
    .eq('option_label', item.optionLabel)
    .maybeSingle();

  if (data) {
    await supabaseAdmin.from('carts').update({ qty: data.qty + item.qty }).eq('id', data.id);
  } else {
    await supabaseAdmin.from('carts').insert({
      user_id: userId,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      category: item.category,
      option_label: item.optionLabel,
      qty: item.qty,
      unit_price: item.unitPrice,
    });
  }
  return getCartAction(userId);
}

export async function updateCartQtyAction(
  userId: string,
  productId: string,
  optionLabel: string,
  qty: number
): Promise<CartItem[]> {
  if (qty <= 0) {
    await supabaseAdmin.from('carts').delete()
      .eq('user_id', userId).eq('product_id', productId).eq('option_label', optionLabel);
  } else {
    await supabaseAdmin.from('carts').update({ qty })
      .eq('user_id', userId).eq('product_id', productId).eq('option_label', optionLabel);
  }
  return getCartAction(userId);
}

export async function removeFromCartAction(userId: string, productId: string, optionLabel: string): Promise<CartItem[]> {
  return updateCartQtyAction(userId, productId, optionLabel, 0);
}

export async function clearCartAction(userId: string): Promise<void> {
  await supabaseAdmin.from('carts').delete().eq('user_id', userId);
}
