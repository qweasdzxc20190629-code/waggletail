'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type NoticeCategory = '전체' | '공지사항' | '이벤트' | '배송' | '업데이트';

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
  { id: 1,  category: '공지사항', title: '[필독] 커뮤니티 이용 규칙 안내',                              date: '2026.06.01', views: 2410, isPinned: true },
  { id: 2,  category: '공지사항', title: '개인정보 처리방침 개정 안내 (2026.06 기준)',                   date: '2026.06.01', views: 1830, isPinned: true },
  { id: 3,  category: '업데이트', title: '커뮤니티 기능 오픈 안내 — 자유게시판·산책메이트·리뷰',         date: '2026.06.19', views: 980,  isNew: true },
  { id: 4,  category: '이벤트',   title: '신규 가입 첫 주문 15% 할인 — 상시 진행',                      date: '2026.06.18', views: 764,  isNew: true },
  { id: 5,  category: '이벤트',   title: '포토 리뷰 작성 시 포인트 최대 2,000P 지급',                   date: '2026.06.17', views: 611 },
  { id: 6,  category: '배송',     title: '6월 현충일 연휴 배송 일정 안내 (6/6)',                         date: '2026.06.03', views: 540 },
  { id: 7,  category: '업데이트', title: '정기배송 건너뛰기 기능 업데이트 안내',                         date: '2026.05.28', views: 388 },
  { id: 8,  category: '이벤트',   title: '봄맞이 산책용품 기획전 종료 안내',                             date: '2026.05.01', views: 712 },
  { id: 9,  category: '배송',     title: '5월 가정의 달 연휴 배송 일정 안내',                            date: '2026.04.29', views: 493 },
  { id: 10, category: '공지사항', title: '결제 수단 추가 — 네이버페이·카카오페이 지원',                  date: '2026.04.20', views: 867 },
  { id: 11, category: '업데이트', title: '앱 버전 1.4.0 업데이트 — UI 개선 및 버그 수정',               date: '2026.04.10', views: 290 },
  { id: 12, category: '배송',     title: '택배사 변경 안내 (CJ대한통운 → 로젠택배)',                     date: '2026.03.15', views: 1050 },
  { id: 13, category: '이벤트',   title: '정기배송 첫 달 무료 이벤트 결과 발표',                        date: '2026.03.01', views: 428 },
  { id: 14, category: '공지사항', title: '회원 등급제 도입 안내 — 일반·실버·골드·VIP',                  date: '2026.02.14', views: 1340 },
  { id: 15, category: '업데이트', title: '찜 목록 및 장바구니 기능 개선 안내',                           date: '2026.02.01', views: 315 },
];

const CATEGORIES: NoticeCategory[] = ['전체', '공지사항', '이벤트', '배송', '업데이트'];
const PER_PAGE = 10;

export default function NoticePage() {
  const [tab, setTab] = useState<NoticeCategory>('전체');
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [page, setPage] = useState(1);

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

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(input);
    setPage(1);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'Pretendard', sans-serif", color: '#111' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', borderBottom: '1px solid #ebebeb' }}>
        <h1 style={{
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: '0 0 20px',
          color: '#111',
        }}>NOTICE</h1>
        <p style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#aaa',
          margin: 0,
          lineHeight: 1.8,
          wordBreak: 'keep-all',
        }}>
          와글테일의 새로운 소식과<br />
          중요한 안내를 전해드립니다.
        </p>
      </section>

      {/* Filter + Search */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((c, i) => (
            <button key={c} onClick={() => { setTab(c); setPage(1); }} style={{
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: tab === c ? 700 : 400,
              background: 'none',
              border: 'none',
              borderBottom: tab === c ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              color: tab === c ? '#111' : '#bbb',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              paddingLeft: i === 0 ? 0 : '16px',
              transition: 'color .15s',
            }}>{c}</button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="검색"
            style={{
              padding: '7px 14px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '13px',
              outline: 'none',
              width: '160px',
              color: '#111',
              fontFamily: 'inherit',
            }}
          />
          <button type="submit" style={{
            padding: '7px 14px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>검색</button>
        </form>
      </div>

      {/* List */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8px 24px 0' }}>
        {displayed.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '14px', padding: '80px 0' }}>공지사항이 없습니다.</p>
        ) : displayed.map((n) => (
          <Link key={n.id} href={`/community/notice/${n.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div
              className="notice-row"
              style={{ padding: '22px 4px', borderBottom: '1px solid #ebebeb' }}
            >
              <p style={{ margin: '0 0 10px', fontSize: '17px', fontWeight: n.isPinned ? 700 : 600, lineHeight: 1.4, color: '#111', wordBreak: 'keep-all' }}>
                {n.title}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#ccc', fontWeight: 400 }}>
                {n.date}&nbsp;&nbsp;·&nbsp;&nbsp;조회 {n.views.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', padding: '36px 24px 80px' }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{ width: '34px', height: '34px', border: '1px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ddd' : '#888', fontSize: '14px', borderRadius: '4px' }}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)}
              style={{ width: '34px', height: '34px', border: '1px solid', borderColor: page === n ? '#111' : '#e8e8e8', background: page === n ? '#111' : '#fff', color: page === n ? '#fff' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: page === n ? 700 : 400, borderRadius: '4px' }}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ width: '34px', height: '34px', border: '1px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ddd' : '#888', fontSize: '14px', borderRadius: '4px' }}>›</button>
        </div>
      )}
      {totalPages <= 1 && <div style={{ paddingBottom: '80px' }} />}

      <style>{`
        .notice-row { transition: background .12s; }
        .notice-row:hover { background: #fafafa; }
      `}</style>
    </div>
  );
}
