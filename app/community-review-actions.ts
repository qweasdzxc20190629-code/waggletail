'use server';

import { supabaseAdmin } from './lib/supabase-admin';

export type CommunityBestReview = {
  id: number;
  category: string;
  product: string;
  productThumb: string;
  title: string;
  body: string;
  author: string;
  star: number;
  reviewCount: number;
  avgStar: number;
  hasPhoto: boolean;
  isBest: boolean;
  date: string;
  likes: number;
  imageUrl?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(r: any): CommunityBestReview {
  return {
    id: r.id,
    category: r.category ?? '',
    product: r.product ?? '',
    productThumb: r.product_thumb ?? '📦',
    title: r.title ?? '',
    body: r.body ?? '',
    author: r.author ?? '',
    star: r.star ?? 5,
    reviewCount: r.review_count ?? 0,
    avgStar: r.avg_star ?? 5,
    hasPhoto: r.has_photo ?? false,
    isBest: r.is_best ?? true,
    date: r.date ?? '',
    likes: r.likes ?? 0,
    imageUrl: r.image_url ?? undefined,
  };
}

export async function getCommunityBestReviewsAction(): Promise<CommunityBestReview[]> {
  const { data } = await supabaseAdmin
    .from('community_best_reviews')
    .select('*')
    .order('created_at', { ascending: true });
  return data ? data.map(rowToReview) : [];
}

export async function addCommunityBestReviewAction(
  r: Omit<CommunityBestReview, 'id'>
): Promise<CommunityBestReview[]> {
  await supabaseAdmin.from('community_best_reviews').insert({
    category: r.category,
    product: r.product,
    product_thumb: r.productThumb,
    title: r.title,
    body: r.body,
    author: r.author,
    star: r.star,
    review_count: r.reviewCount,
    avg_star: r.avgStar,
    has_photo: r.hasPhoto,
    is_best: r.isBest,
    date: r.date,
    likes: r.likes,
    image_url: r.imageUrl ?? null,
  });
  return getCommunityBestReviewsAction();
}

export async function updateCommunityBestReviewAction(
  id: number,
  r: Omit<CommunityBestReview, 'id'>
): Promise<CommunityBestReview[]> {
  await supabaseAdmin.from('community_best_reviews').update({
    category: r.category,
    product: r.product,
    product_thumb: r.productThumb,
    title: r.title,
    body: r.body,
    author: r.author,
    star: r.star,
    review_count: r.reviewCount,
    avg_star: r.avgStar,
    has_photo: r.hasPhoto,
    is_best: r.isBest,
    date: r.date,
    likes: r.likes,
    image_url: r.imageUrl ?? null,
  }).eq('id', id);
  return getCommunityBestReviewsAction();
}

export async function deleteCommunityBestReviewAction(id: number): Promise<CommunityBestReview[]> {
  await supabaseAdmin.from('community_best_reviews').delete().eq('id', id);
  return getCommunityBestReviewsAction();
}
