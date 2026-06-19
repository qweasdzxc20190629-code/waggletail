'use server';

import { supabase } from './lib/supabase';
import { supabaseAdmin } from './lib/supabase-admin';

export type Review = {
  id: string;
  name: string;
  avatar: string;
  breed: string;
  age: string;
  star: number;
  text: string;
  product: string;
  verified: boolean;
  likes: number;
  date: string;
  imageUrl?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(r: any): Review {
  return {
    id: r.id,
    name: r.name,
    avatar: r.avatar ?? '🐶',
    breed: r.breed ?? '',
    age: r.age ?? '',
    star: r.star ?? 5,
    text: r.text,
    product: r.product ?? '',
    verified: r.verified ?? false,
    likes: r.likes ?? 0,
    date: r.date ?? '',
    imageUrl: r.image_url ?? undefined,
  };
}

export async function getReviewsAction(): Promise<Review[]> {
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToReview);
}

export async function addReviewAction(r: Omit<Review, 'id'>): Promise<{ reviews: Review[]; error?: string }> {
  const { error } = await supabaseAdmin.from('reviews').insert({
    name: r.name,
    avatar: r.avatar,
    breed: r.breed,
    age: r.age,
    star: r.star,
    text: r.text,
    product: r.product,
    verified: r.verified,
    likes: r.likes,
    date: r.date,
    image_url: r.imageUrl ?? null,
  });
  if (error) return { reviews: await getReviewsAction(), error: error.message };
  return { reviews: await getReviewsAction() };
}

export async function updateReviewAction(id: string, r: Omit<Review, 'id'>): Promise<{ reviews: Review[]; error?: string }> {
  const { error } = await supabaseAdmin.from('reviews').update({
    name: r.name,
    avatar: r.avatar,
    breed: r.breed,
    age: r.age,
    star: r.star,
    text: r.text,
    product: r.product,
    verified: r.verified,
    likes: r.likes,
    date: r.date,
    image_url: r.imageUrl ?? null,
  }).eq('id', id);
  if (error) return { reviews: await getReviewsAction(), error: error.message };
  return { reviews: await getReviewsAction() };
}

export async function deleteReviewAction(id: string): Promise<Review[]> {
  await supabaseAdmin.from('reviews').delete().eq('id', id);
  return getReviewsAction();
}

export async function uploadReviewImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get('file') as File | null;
  if (!file) return { error: '파일이 없습니다.' };
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = await file.arrayBuffer();
  const { error } = await supabaseAdmin.storage
    .from('review-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false });
  if (error) return { error: error.message };
  const { data } = supabaseAdmin.storage.from('review-images').getPublicUrl(filename);
  return { url: data.publicUrl };
}
