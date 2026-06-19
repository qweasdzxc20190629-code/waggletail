'use server';

import { supabaseAdmin } from './lib/supabase-admin';

export type WishItem = {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  addedAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToWish(r: any): WishItem {
  return {
    productId: r.product_id,
    productName: r.product_name ?? '',
    productImage: r.product_image ?? '',
    category: r.category ?? '',
    price: r.price ?? 0,
    addedAt: r.added_at ?? '',
  };
}

export async function getWishlistAction(userId: string): Promise<WishItem[]> {
  const { data } = await supabaseAdmin
    .from('wishlists')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  return data ? data.map(rowToWish) : [];
}

export async function getWishCountAction(userId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from('wishlists')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  return count ?? 0;
}

export async function isWishedAction(userId: string, productId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  return !!data;
}

export async function toggleWishlistAction(
  userId: string,
  item: WishItem
): Promise<{ wished: boolean; list: WishItem[] }> {
  const { data } = await supabaseAdmin
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', item.productId)
    .maybeSingle();

  if (data) {
    await supabaseAdmin.from('wishlists').delete().eq('user_id', userId).eq('product_id', item.productId);
    return { wished: false, list: await getWishlistAction(userId) };
  } else {
    await supabaseAdmin.from('wishlists').insert({
      user_id: userId,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      category: item.category,
      price: item.price,
    });
    return { wished: true, list: await getWishlistAction(userId) };
  }
}

export async function removeFromWishlistAction(userId: string, productId: string): Promise<WishItem[]> {
  await supabaseAdmin.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
  return getWishlistAction(userId);
}
