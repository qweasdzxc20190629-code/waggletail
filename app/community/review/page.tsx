'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type ReviewCategory = '전체' | '침구/방석' | '산책용품' | '의류' | '위생용품' | '간식/사료';

type ReviewPost = {
  id: number;
  category: Exclude<ReviewCategory, '전체'>;
  product: string;
  title: string;
  author: string;
  avatar: string;
  star: number;
  date: string;
  likes: number;
  hasPhoto: boolean;
};

const REVIEWS: ReviewPost[] = [
  { id: 1, category: '침구/방석', product: '포근 도넛 베드', title: '한 달 써봤는데 솜이 아직도 빵빵해요', author: '콩이맘', avatar: '🐕', star: 5, date: '2026.06.19', likes: 67, hasPhoto: true },
  { id: 2, category: '위생용품', product: '배변 패드 정기배송', title: '정기배송으로 받으니 너무 편해요 진짜', author: '두부아빠', avatar: '🐶', star: 5, date: '2026.06.18', likes: 55, hasPhoto: true },
  { id: 3, category: '의류', product: '따뜻한 겨울 후드', title: 'XS 핏 완벽하고 색깔도 이뻐요 ㅎㅎ', author: '몽실이네', avatar: '🐩', star: 5, date: '2026.06.17', likes: 38, hasPhoto: true },
  { id: 4, category: '산책용품', product: '리드줄', title: '재질 고급스럽고 색상도 예뻐요 추천!', author: '하루맘', avatar: '🦴', star: 4, date: '2026.06.16', likes: 29, hasPhoto: false },
  { id: 5, category: '침구/방석', product: '포근 도넛 베드', title: '처음엔 낯설어했는데 이제 안 나와요', author: '럭키대디', avatar: '🐾', star: 5, date: '2026.06.15', likes: 44, hasPhoto: true },
  { id: 6, category: '산책용품', product: '하네스', title: '사이즈 딱 맞고 하네스 착용 거부 없어졌어요', author: '밀키보호자', avatar: '🐱', star: 5, date: '2026.06.14', likes: 31, hasPhoto: false },
  { id: 7, category: '간식/사료', product: '오리고기 져키', title: '냄새가 심하지 않고 강아지가 잘 먹어요', author: '코코맘', avatar: '🐕', star: 4, date: '2026.06.13', likes: 18, hasPhoto: false },
  { id: 8, category: '의류', product: '쿨메시 여름 티셔츠', title: '여름에 산책할 때 덥지 않아서 좋아요', author: '보리아빠', avatar: '🦮', star: 5, date: '2026.06.12', likes: 22, hasPhoto: true },
  { id: 9, category: '위생용품', product: '발 세정제', title: '산책 후 발닦기 편하고 세정력도 좋아요', author: '나비보호자', avatar: '🐈', star: 4, date: '2026.06.11', likes: 14, hasPhoto: false },
  { id: 10, category: '침구/방석', product: '사계절 쿠션 방석', title: '소재 촉감이 너무 좋아요 우리 아이 매일 거기만 있어요', author: '골든패밀리', avatar: '🐕', star: 5, date: '2026.06.10', likes: 36, hasPhoto: true },
  { id: 11, category: '산책용품', product: '포켓 파우치', title: '산책할 때 간식이랑 배변봉투 넣기 딱 좋아요', author: '크림보호자', avatar: '🐾', star: 5, date: '2026.06.09', likes: 19, hasPhoto: false },
  { id: 12, category: '간식/사료', product: '연어 트릿', title: '훈련용 간식으로 최고예요 집중도 잘해요', author: '별이엄마', avatar: '🐶', star: 5, date: '2026.06.08', likes: 27, hasPhoto: true },
];

const CATEGORIES: ReviewCategory[] = ['전체', '침구/방석', '산책용품', '의류', '위생용품', '간식/사료'];

const SUB_NAV = [
  { label: 'Community', href: '/community' },
  { label: 'Notice', href: '/community/notice' },
  { label: 'Review', href: '/community/review' },
  { label: 'Membership', href: '/community/membership' },
  { label: 'CS Center', href: '/community/cs' },
];

export default function ReviewPage() {
  const [tab, setTab] = useState<ReviewCategory>('전체');
  const [starFilter, setStarFilter] = useState<number>(0);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 9;

  const filtered = useMemo(() => {
    let list = REVIEWS;
    if (tab !== '전체') list = list.filter((r) => r.category === tab);
    if (starFilter > 0) list = list.filter((r) => r.star === starFilter);
    if (photoOnly) list = list.filter((r) => r.hasPhoto);
    return list;
  }, [tab, starFilter, photoOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const avgStar = (REVIEWS.reduce((s, r) => s + r.star, 0) / REVIEWS.length).toFixed(1);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Sub nav */}
      <div style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUB_NAV.map((n) => (
            <Link key={n.href} href={n.href} style={{
              padding: '14px 16px', fontSize: '13px', fontWeight: 700,
              color: n.href === '/community/review' ? '#111' : '#aaa',
              borderBottom: n.href === '/community/review' ? '2px solid #111' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{n.label}</Link>
          ))}
        </div>
      </div>

      {/* Header */}
      <section style={{ padding: '48px 24px 0', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '8px' }}>COMMUNITY</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>Review</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffdf0', border: '1.5px solid #F5C400', borderRadius: '12px', padding: '10px 18px' }}>
            <span style={{ fontSize: '20px', color: '#F5C400' }}>★</span>
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em' }}>{avgStar}</span>
            <span style={{ fontSize: '13px', color: '#999', fontWeight: 500 }}>/ 5.0 · {REVIEWS.length}개 리뷰</span>
          </div>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #eee', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setTab(c); setPage(1); }} style={{
              padding: '10px 16px', fontSize: '13px', fontWeight: 700,
              background: 'none', border: 'none',
              borderBottom: tab === c ? '2.5px solid #111' : '2.5px solid transparent',
              cursor: 'pointer', color: tab === c ? '#111' : '#bbb',
              whiteSpace: 'nowrap', marginBottom: '-1px', flexShrink: 0,
            }}>{c}</button>
          ))}
        </div>
      </section>

      {/* Filter bar */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#aaa' }}>별점</span>
        {[0, 5, 4, 3].map((s) => (
          <button key={s} onClick={() => { setStarFilter(s); setPage(1); }} style={{
            padding: '5px 12px', fontSize: '12px', fontWeight: 700,
            border: '1.5px solid', borderColor: starFilter === s ? '#111' : '#e8e8e8',
            borderRadius: '999px', background: starFilter === s ? '#111' : '#fff',
            color: starFilter === s ? '#fff' : '#888', cursor: 'pointer',
          }}>{s === 0 ? '전체' : `${'★'.repeat(s)}`}</button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', color: photoOnly ? '#111' : '#aaa' }}>
            <input type="checkbox" checked={photoOnly} onChange={(e) => { setPhotoOnly(e.target.checked); setPage(1); }}
              style={{ width: '15px', height: '15px', accentColor: '#111' }} />
            포토리뷰만
          </label>
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px' }}>
        {paginated.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: '15px', padding: '60px 0' }}>조건에 맞는 리뷰가 없습니다.</p>
        ) : (
          <div className="review-grid">
            {paginated.map((r) => (
              <Link key={r.id} href={`/community/review/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="review-card" style={{ borderRadius: '16px', border: '1.5px solid #f0f0f0', overflow: 'hidden', background: '#fff', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }}>
                  {/* Photo placeholder */}
                  <div style={{ aspectRatio: '4/3', background: r.hasPhoto ? '#e8edf5' : '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {r.hasPhoto
                      ? <span style={{ fontSize: '36px', opacity: 0.4 }}>{r.avatar}</span>
                      : <span style={{ fontSize: '28px', opacity: 0.2 }}>📷</span>
                    }
                    {r.hasPhoto && (
                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px' }}>포토</span>
                    )}
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#F5C400', fontSize: '13px', letterSpacing: '-0.5px' }}>{'★'.repeat(r.star)}{'☆'.repeat(5 - r.star)}</span>
                      <span style={{ fontSize: '11px', color: '#bbb' }}>{r.date.slice(5)}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, color: '#0041BD' }}>{r.product}</p>
                    <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 600, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, color: '#111', wordBreak: 'keep-all' }}>{r.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px' }}>{r.avatar}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#888' }}>{r.author}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#bbb' }}>♥ {r.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '40px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ddd' : '#111', fontSize: '14px', fontWeight: 700 }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid', borderColor: page === n ? '#111' : '#e8e8e8', background: page === n ? '#111' : '#fff', color: page === n ? '#fff' : '#111', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>{n}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ddd' : '#111', fontSize: '14px', fontWeight: 700 }}>›</button>
          </div>
        )}
      </div>

      <style>{`
        .review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .review-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.1); transform: translateY(-4px); }
        @media (max-width: 640px) { .review-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
      `}</style>
    </div>
  );
}
