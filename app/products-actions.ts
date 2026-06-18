'use server';

import { supabase } from './lib/supabase';
import { supabaseAdmin } from './lib/supabase-admin';
import { Product } from './products';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    sellerName: r.seller_name ?? undefined,
    category: r.category,
    optionGroups: r.option_groups ?? undefined,
    optionCombinations: r.option_combinations ?? undefined,
    image: r.image ?? '',
    additionalImages: r.additional_images?.length ? r.additional_images : undefined,
    desc: r.desc,
    detailDescription: r.detail_description ?? undefined,
    detailImages: r.detail_images?.length ? r.detail_images : undefined,
    originalPrice: r.original_price ?? undefined,
    price: r.price,
    discountPrice: r.discount_price ?? undefined,
    shippingOrigin: r.shipping_origin ?? undefined,
    freeShipping: r.free_shipping ?? false,
    shippingFee: r.shipping_fee ?? undefined,
    leadTime: r.lead_time ?? undefined,
    returnAddress: r.return_address ?? undefined,
    returnShippingFee: r.return_shipping_fee ?? undefined,
  };
}

function productToRow(p: Product) {
  return {
    name: p.name,
    seller_name: p.sellerName ?? null,
    category: p.category,
    option_groups: p.optionGroups ?? [],
    option_combinations: p.optionCombinations ?? [],
    image: p.image ?? '',
    additional_images: p.additionalImages ?? [],
    desc: p.desc,
    detail_description: p.detailDescription ?? null,
    detail_images: p.detailImages ?? [],
    original_price: p.originalPrice ?? null,
    price: p.price,
    discount_price: p.discountPrice ?? null,
    shipping_origin: p.shippingOrigin ?? null,
    free_shipping: p.freeShipping ?? false,
    shipping_fee: p.shippingFee ?? null,
    lead_time: p.leadTime ?? null,
    return_address: p.returnAddress ?? null,
    return_shipping_fee: p.returnShippingFee ?? null,
  };
}

export async function getProductsAction(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('order_index');
  if (error || !data) return [];
  return data.map(rowToProduct);
}

export async function getProductAction(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return rowToProduct(data);
}

export async function addProductAction(product: Product): Promise<Product[]> {
  const { data: maxRow } = await supabase
    .from('products')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single();
  const nextOrder = ((maxRow as { order_index: number } | null)?.order_index ?? 0) + 1;
  await supabase.from('products').insert({ id: product.id, ...productToRow(product), order_index: nextOrder });
  return getProductsAction();
}

export async function updateProductAction(product: Product): Promise<Product[]> {
  await supabase.from('products').update(productToRow(product)).eq('id', product.id);
  return getProductsAction();
}

export async function deleteProductAction(id: string): Promise<Product[]> {
  await supabase.from('products').delete().eq('id', id);
  return getProductsAction();
}

export async function uploadProductImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File | null;
  if (!file) return { error: '파일이 없습니다.' };
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from('product-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };
  const { data } = supabaseAdmin.storage.from('product-images').getPublicUrl(filename);
  return { url: data.publicUrl };
}
