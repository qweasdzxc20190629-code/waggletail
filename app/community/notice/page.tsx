'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type NoticeCategory = '전체' | '공지사항' | '이벤트 안내' | '배송 공지' | '서비스 업데이트';

type Notice = {
  id: number;
  category: Exclude<NoticeCategory, '전체'>;
  title: string;
  date: string;
  views: number;
  isPinned?: boolean;
  isNew?: boolean;
};

const NOTICES: Notice[] = [
  { id: 1, category: '공지사항', title: '[필독] 커뮤니티 이용 규칙 안내', date: '2026.06.01', views: 2410, isPinned: true },
  { id: 2, category: '공지사항', title: '개인정보 처리방침 개정 안내 (2026.06 기준)', date: '2026.06.01', views: 1830, isPinned: true },
  { id: 3, category: '서비스 업데이트', title: '🎉 커뮤니티 기능 오픈 안내 — 자유게시판·산책메이트·리뷰 오픈', date: '2026.06.19', views: 980, isNew: true },
  { id: 4, category: '이벤트 안내', title: '[이벤트] 신규 가입 첫 주문 15% 할인 — 상시 진행', date: '2026.06.18', views: 764, isNew: true },
  { id: 5, category: '이벤트 안내', title: '[이벤트] 포토 리뷰 작성 시 포인트 최대 2,000P 지급', date: '2026.06.17', views: 611 },
  { id: 6, category: '배송 공지', title: '6월 현충일 연휴 배송 일정 안내 (6/6)', date: '2026.06.03', views: 540 },
  { id: 7, category: '서비스 업데이트', title: '정기배송 건너뛰기 기능 업데이트 안내', date: '2026.05.28', views: 388 },
  { id: 8, category: '이벤트 안내', title: '[마감] 봄맞이 산책용품 기획전 종료 안내', date: '2026.05.01', views: 712 },
  { id: 9, category: '배송 공지', title: '5월 가정의 달 연휴 배송 일정 안내', date: '2026.04.29', views: 493 },
  { id: 10, category: '공지사항', title: '결제 수단 추가 안내 — 네이버페이·카카오페이 지원', date: '2026.04.20', views: 867 },
  { id: 11, category: '서비스 업데이트', title: '앱 버전 1.4.0 업데이트 — UI 개선 및 버그 수정', date: '2026.04.10', views: 290 },
  { id: 12, category: '배송 공지', title: '택배사 변경 안내 (CJ대한통운 → 로젠택배)', date: '2026.03.15', views: 1050 },
  { id: 13, category: '이벤트 안내', title: '[종료] 정기배송 첫 달 무료 이벤트 결과 발표', date: '2026.03.01', views: 428 },
  { id: 14, category: '공지사항', title: '회원 등급제 도입 안내 — 일반·실버·골드·VIP', date: '2026.02.14', views: 1340 },
  { id: 15, category: '서비스 업데이트', title: '찜 목록 및 장바구니 기능 개선 안내', date: '2026.02.01', views: 315 },
];

const CATEGORIES: NoticeCategory[] = ['전체', '공지사항', '이벤트 안내', '배송 공지', '서비스 업데이트'];

const CAT_STYLE: Record<Exclude<NoticeCategory, '전체'>, { bg: string; color: string }> = {
  '공지사항':    { bg: 'rgba(17,17,17,0.08)', color: '#444' },
  '이벤트 안내': { bg: 'rgba(245,196,0,0.2)', color: '#886600' },
  '배송 공지':   { bg: 'rgba(0,65,189,0.1)', color: '#0041BD' },
  '서비스 업데이트': { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
};

const SUB_NAV = [
  { label: 'Community', href: '/community' },
  { label: 'Notice', href: '/community/notice' },
  { label: 'Review', href: '/community/review' },
  { label: 'Membership', href: '/community/membership' },
  { label: 'CS Center', href: '/community/cs' },
];

export default function NoticePage() {
  const [tab, setTab] = useState<NoticeCategory>('전체');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = NOTICES;
    if (tab !== '전체') list = list.filter((n) => n.category === tab);
    if (search.trim()) list = list.filter((n) => n.title.includes(search.trim()));
    return list;
  }, [tab, search]);

  const pinned = filtered.filter((n) => n.isPinned);
  const normal = filtered.filter((n) => !n.isPinned);
  const totalPages = Math.max(1, Math.ceil(normal.length / PER_PAGE));
  const displayed = [...pinned, ...normal.slice((page - 1) * PER_PAGE, page * PER_PAGE)];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Sub nav */}
      <div style={{ borderBottom: '1px solid #eee', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUB_NAV.map((n) => (
            <Link key={n.href} href={n.href} style={{
              padding: '14px 16px', fontSize: '13px', fontWeight: 700,
              color: n.href === '/community/notice' ? '#111' : '#aaa',
              borderBottom: n.href === '/community/notice' ? '2px solid #111' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{n.label}</Link>
          ))}
        </div>
      </div>

      {/* Page header */}
      <section style={{ padding: '48px 24px 0', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '8px' }}>COMMUNITY</p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 32px' }}>Notice</h1>

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

      {/* Toolbar */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); }} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색어를 입력하세요"
              style={{ padding: '8px 14px 8px 32px', border: '1.5px solid #e8e8e8', borderRadius: '999px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '220px' }} />
          </div>
          <button type="submit" style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>검색</button>
        </form>
      </div>

      {/* List */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ borderTop: '2px solid #111' }}>
          {displayed.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#bbb', fontSize: '15px', padding: '60px 0' }}>공지사항이 없습니다.</p>
          ) : displayed.map((n, i) => (
            <Link key={n.id} href={`/community/notice/${n.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 4px',
                borderBottom: '1px solid #f0f0f0',
                background: n.isPinned ? '#fffef5' : '#fff',
                cursor: 'pointer',
                transition: 'background .12s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = n.isPinned ? '#fffadb' : '#f9f9f9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = n.isPinned ? '#fffef5' : '#fff')}
              >
                {/* No. / 공지 */}
                <div style={{ width: '48px', textAlign: 'center', flexShrink: 0 }}>
                  {n.isPinned
                    ? <span style={{ fontSize: '10px', fontWeight: 800, background: '#F5C400', color: '#111', padding: '3px 8px', borderRadius: '4px' }}>공지</span>
                    : <span style={{ fontSize: '13px', color: '#ccc', fontWeight: 600 }}>{NOTICES.filter(x => !x.isPinned).length - i + pinned.length}</span>
                  }
                </div>

                {/* Category badge */}
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '5px', flexShrink: 0, ...CAT_STYLE[n.category] }}>
                  {n.category}
                </span>

                {/* Title */}
                <p style={{ flex: 1, margin: 0, fontSize: '14px', fontWeight: n.isPinned ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#111' }}>
                  {n.title}
                  {n.isNew && <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: 800, color: '#ff4d6d', verticalAlign: 'middle' }}>NEW</span>}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '20px', flexShrink: 0, fontSize: '12px', color: '#bbb', fontWeight: 500 }}>
                  <span className="notice-date">{n.date}</span>
                  <span className="notice-views">조회 {n.views.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '32px' }}>
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
        @media (max-width: 640px) {
          .notice-views { display: none; }
          .notice-date { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}
