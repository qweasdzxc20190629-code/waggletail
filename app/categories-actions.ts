'use server';

import { supabase } from './lib/supabase';
import { supabaseAdmin } from './lib/supabase-admin';

export type CategoryData = {
  name: string;
  emoji: string;
  en: string;
  bg: string;
  textColor: string;
  border: boolean;
  imageUrl?: string;
  bannerMobile?: string;
  bannerPc?: string;
  bannerTag?: string;
  bannerTitle?: string;
  bannerDesc?: string;
  sortOrder?: number;
  navName?: string;
};

export async function getCategoriesAction(): Promise<CategoryData[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('name, emoji, en, bg, text_color, border, image_url, banner_mobile, banner_pc, banner_tag, banner_title, banner_desc, sort_order, nav_name')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error || !data) return [];
  return data.map((r) => ({
    name: r.name,
    emoji: r.emoji,
    en: r.en,
    bg: r.bg,
    textColor: r.text_color,
    border: r.border,
    imageUrl: r.image_url ?? undefined,
    bannerMobile: r.banner_mobile ?? undefined,
    bannerPc: r.banner_pc ?? undefined,
    bannerTag: r.banner_tag ?? undefined,
    bannerTitle: r.banner_title ?? undefined,
    bannerDesc: r.banner_desc ?? undefined,
    sortOrder: r.sort_order ?? 99,
    navName: r.nav_name ?? r.name,
  }));
}

export async function uploadCategoryImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File | null;
  if (!file) return { error: '파일이 없습니다.' };
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from('category-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };
  const { data } = supabaseAdmin.storage.from('category-images').getPublicUrl(filename);
  return { url: data.publicUrl };
}

export async function getCategoryNamesAction(): Promise<string[]> {
  const cats = await getCategoriesAction();
  return cats.map((c) => c.name);
}

export async function addCategoryAction(cat: Omit<CategoryData, 'name'> & { name: string }): Promise<{ categories: CategoryData[]; error?: string }> {
  const name = cat.name.trim();
  if (!name) return { categories: await getCategoriesAction(), error: '카테고리 이름을 입력해주세요.' };
  const { error } = await supabase.from('categories').insert({
    name,
    emoji: cat.emoji || '🐾',
    en: cat.en || 'Category',
    bg: cat.bg || '#fff',
    text_color: cat.textColor || '#111',
    border: cat.border ?? true,
    image_url: cat.imageUrl ?? null,
    banner_mobile: cat.bannerMobile ?? null,
    banner_pc: cat.bannerPc ?? null,
    nav_name: cat.navName ?? name,
  });
  if (error) {
    if (error.code === '23505') return { categories: await getCategoriesAction(), error: '이미 존재하는 카테고리입니다.' };
    return { categories: await getCategoriesAction(), error: error.message };
  }
  return { categories: await getCategoriesAction() };
}

export async function updateCategoryAction(oldName: string, cat: CategoryData): Promise<{ categories: CategoryData[]; error?: string }> {
  const name = cat.name.trim();
  if (!name) return { categories: await getCategoriesAction(), error: '카테고리 이름을 입력해주세요.' };
  const updatePayload: Record<string, unknown> = {
    name,
    emoji: cat.emoji,
    en: cat.en,
    bg: cat.bg,
    text_color: cat.textColor,
    border: cat.border,
    image_url: cat.imageUrl ?? null,
    nav_name: cat.navName ?? name,
  };
  if (cat.bannerMobile !== undefined) updatePayload.banner_mobile = cat.bannerMobile;
  if (cat.bannerPc !== undefined) updatePayload.banner_pc = cat.bannerPc;
  if (cat.bannerTag !== undefined) updatePayload.banner_tag = cat.bannerTag;
  if (cat.bannerTitle !== undefined) updatePayload.banner_title = cat.bannerTitle;
  if (cat.bannerDesc !== undefined) updatePayload.banner_desc = cat.bannerDesc;
  const { error } = await supabase.from('categories').update(updatePayload).eq('name', oldName);
  if (error) {
    if (error.code === '23505') return { categories: await getCategoriesAction(), error: '이미 존재하는 카테고리입니다.' };
    return { categories: await getCategoriesAction(), error: error.message };
  }
  if (oldName !== name) {
    await supabase.from('products').update({ category: name }).eq('category', oldName);
  }
  return { categories: await getCategoriesAction() };
}

export async function deleteCategoryAction(name: string): Promise<CategoryData[]> {
  await supabase.from('categories').delete().eq('name', name);
  return getCategoriesAction();
}
