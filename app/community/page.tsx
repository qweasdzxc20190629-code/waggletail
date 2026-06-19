'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

type Category = '전체' | '자유게시판' | '질문/답변' | '제품후기' | '산책메이트';

type Post = {
  id: number;
  category: Exclude<Category, '전체'>;
  title: string;
  author: string;
  avatar: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  isPinned?: boolean;
};

const POSTS: Post[] = [
  { id: 101, category: '자유게시판', title: '공지사항: 커뮤니티 이용 규칙 안내', author: '운영팀', avatar: '🐾', date: '2026.06.01', views: 1240, likes: 48, comments: 3, isPinned: true },
  { id: 102, category: '자유게시판', title: '공지사항: 베스트 게시글 선정 기준 안내', author: '운영팀', avatar: '🐾', date: '2026.06.01', views: 870, likes: 31, comments: 1, isPinned: true },
  { id: 98, category: '제품후기', title: '포근 도넛 베드 한 달 사용 후기예요 🐶', author: '콩이맘', avatar: '🐕', date: '2026.06.19', views: 432, likes: 67, comments: 14 },
  { id: 97, category: '질문/답변', title: '웰시코기 하네스 사이즈 어떻게 고르셨어요?', author: '두부아빠', avatar: '🦴', date: '2026.06.18', views: 211, likes: 12, comments: 9 },
  { id: 96, category: '자유게시판', title: '오늘 산책 중 만난 진돗개가 너무 귀여웠어요 ㅠㅠ', author: '하루맘', avatar: '🐩', date: '2026.06.18', views: 189, likes: 44, comments: 21 },
  { id: 95, category: '산책메이트', title: '서울 마포구 일대 산책 메이트 구해요 🌸', author: '몽실이네', avatar: '🐶', date: '2026.06.17', views: 156, likes: 8, comments: 6 },
  { id: 94, category: '제품후기', title: '배변패드 정기배송 신청했는데 대박이에요', author: '럭키대디', avatar: '🐾', date: '2026.06.17', views: 340, likes: 55, comments: 18 },
  { id: 93, category: '질문/답변', title: '말티즈 털 빠짐 심한데 어떤 빗 쓰세요?', author: '밀키보호자', avatar: '🐱', date: '2026.06.16', views: 278, likes: 19, comments: 12 },
  { id: 92, category: '자유게시판', title: '강아지랑 갈 수 있는 카페 추천해주세요 (서울)', author: '코코맘', avatar: '🐕', date: '2026.06.16', views: 512, likes: 73, comments: 35 },
  { id: 91, category: '산책메이트', title: '판교/분당 쪽 산책 같이 하실 분 계신가요?', author: '보리아빠', avatar: '🦮', date: '2026.06.15', views: 134, likes: 5, comments: 4 },
  { id: 90, category: '제품후기', title: '리드줄 색상 너무 이쁜데 내구성도 좋네요', author: '나비보호자', avatar: '🐈', date: '2026.06.15', views: 198, likes: 29, comments: 7 },
  { id: 89, category: '질문/답변', title: '비숑 1살 예방접종 일정 어떻게 되나요?', author: '하루맘', avatar: '🐩', date: '2026.06.14', views: 223, likes: 14, comments: 8 },
  { id: 88, category: '자유게시판', title: '드디어 입양했어요!! 골든리트리버 새 가족이에요', author: '골든패밀리', avatar: '🐕', date: '2026.06.14', views: 687, likes: 128, comments: 52 },
  { id: 87, category: '제품후기', title: '겨울 후드 XS 구매했는데 핏이 완벽해요', author: '몽실이네', avatar: '🐶', date: '2026.06.13', views: 245, likes: 38, comments: 11 },
  { id: 86, category: '산책메이트', title: '강남구 산책 메이트 구해요 (소형견)', author: '크림보호자', avatar: '🐾', date: '2026.06.13', views: 143, likes: 7, comments: 3 },
];

const CATEGORIES: Category[] = ['전체', '자유게시판', '질문/답변', '제품후기', '산책메이트'];

const CATEGORY_COLOR: Record<Exclude<Category, '전체'>, { bg: string; color: string }> = {
  '자유게시판': { bg: 'rgba(17,17,17,0.07)', color: '#555' },
  '질문/답변': { bg: 'rgba(0,65,189,0.1)', color: '#0041BD' },
  '제품후기': { bg: 'rgba(245,196,0,0.2)', color: '#886600' },
  '산책메이트': { bg: 'rgba(34,197,94,0.12)', color: '#16a34a' },
};

export default function CommunityPage() {
  const [tab, setTab] = useState<Category>('전체');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = useMemo(() => {
    let list = POSTS;
    if (tab !== '전체') list = list.filter((p) => p.category === tab);
    if (search.trim()) list = list.filter((p) => p.title.includes(search.trim()) || p.author.includes(search.trim()));
    return list;
  }, [tab, search]);

  const pinned = filtered.filter((p) => p.isPinned);
  const normal = filtered.filter((p) => !p.isPinned);
  const totalPages = Math.max(1, Math.ceil(normal.length / PER_PAGE));
  const paginated = normal.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const displayed = [...pinned, ...paginated];

  const handleTab = (c: Category) => { setTab(c); setPage(1); };
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); setPage(1); };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Page header */}
      <section style={{ borderBottom: '1px solid #eee', padding: '56px 24px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '10px' }}>WAGGLE TAIL</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px' }}>Community</h1>
          <p style={{ fontSize: '14px', color: '#999', fontWeight: 500, margin: '0 0 32px' }}>반려동물 보호자들의 이야기를 나눠요</p>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => handleTab(c)} style={{
                padding: '12px 18px',
                fontWeight: 700,
                fontSize: '14px',
                background: 'none',
                border: 'none',
                borderBottom: tab === c ? '2.5px solid #111' : '2.5px solid transparent',
                cursor: 'pointer',
                color: tab === c ? '#111' : '#aaa',
                whiteSpace: 'nowrap',
                marginBottom: '-1px',
                transition: 'color .15s',
                flexShrink: 0,
              }}>
                {c}
                {c === '질문/답변' && (
                  <span style={{ marginLeft: '5px', fontSize: '11px', background: '#0041BD', color: '#fff', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>
                    {POSTS.filter(p => p.category === '질문/답변').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '360px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목 또는 작성자 검색"
              style={{ width: '100%', padding: '9px 14px 9px 34px', border: '1.5px solid #e8e8e8', borderRadius: '999px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '9px 18px', background: '#111', color: '#fff', border: 'none', borderRadius: '999px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>검색</button>
        </form>
        <Link href="/community/write" style={{ padding: '9px 20px', background: '#F5C400', color: '#111', border: 'none', borderRadius: '999px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
          + 글쓰기
        </Link>
      </div>

      {/* Post list */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* PC table header */}
        <div className="comm-table-head" style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 50px', gap: '0', padding: '10px 16px', borderTop: '2px solid #111', borderBottom: '1px solid #eee', fontSize: '12px', fontWeight: 700, color: '#aaa' }}>
          <span>제목</span>
          <span style={{ textAlign: 'center' }}>작성자</span>
          <span style={{ textAlign: 'center' }}>날짜</span>
          <span style={{ textAlign: 'center' }}>조회</span>
        </div>

        {displayed.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: '15px', padding: '60px 0', fontWeight: 500 }}>게시글이 없습니다.</p>
        ) : (
          <div>
            {displayed.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="comm-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px 50px',
                  gap: '0',
                  padding: '14px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  background: post.isPinned ? '#fffdf0' : '#fff',
                  cursor: 'pointer',
                  transition: 'background .12s',
                  alignItems: 'center',
                }}>
                  {/* Title col */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    {post.isPinned && (
                      <span style={{ fontSize: '10px', fontWeight: 800, background: '#F5C400', color: '#111', padding: '2px 7px', borderRadius: '4px', flexShrink: 0, letterSpacing: '0.04em' }}>공지</span>
                    )}
                    {!post.isPinned && (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', flexShrink: 0, ...CATEGORY_COLOR[post.category] }}>
                        {post.category}
                      </span>
                    )}
                    <span style={{ fontSize: '14px', fontWeight: post.isPinned ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: post.isPinned ? '#111' : '#222' }}>
                      {post.title}
                    </span>
                    {post.comments > 0 && (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0041BD', flexShrink: 0 }}>[{post.comments}]</span>
                    )}
                    {post.likes >= 30 && !post.isPinned && (
                      <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 }}>인기</span>
                    )}
                  </div>
                  {/* Author */}
                  <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{post.avatar}</span>
                    <span className="comm-author" style={{ fontSize: '12px', fontWeight: 600, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.author}</span>
                  </div>
                  {/* Date */}
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', fontWeight: 500 }}>
                    {post.date.slice(5)}
                  </div>
                  {/* Views */}
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', fontWeight: 500 }}>
                    {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}k` : post.views}
                  </div>
                </div>

                {/* Mobile card (hidden on PC) */}
                <div className="comm-mobile-card" style={{ display: 'none', padding: '16px 0', borderBottom: '1px solid #f0f0f0', background: post.isPinned ? '#fffdf0' : '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {post.isPinned
                      ? <span style={{ fontSize: '10px', fontWeight: 800, background: '#F5C400', color: '#111', padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.04em' }}>공지</span>
                      : <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', ...CATEGORY_COLOR[post.category] }}>{post.category}</span>
                    }
                    {post.likes >= 30 && !post.isPinned && (
                      <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(255,77,109,0.1)', color: '#ff4d6d', padding: '2px 7px', borderRadius: '4px' }}>인기</span>
                    )}
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: post.isPinned ? 700 : 500, color: '#111', lineHeight: 1.4, wordBreak: 'keep-all' }}>
                    {post.title}
                    {post.comments > 0 && <span style={{ marginLeft: '4px', fontSize: '12px', fontWeight: 700, color: '#0041BD' }}>[{post.comments}]</span>}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#bbb', fontWeight: 500 }}>
                    <span>{post.avatar} {post.author}</span>
                    <span>{post.date.slice(5)}</span>
                    <span>조회 {post.views}</span>
                    <span>♥ {post.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '32px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ddd' : '#111', fontSize: '14px', fontWeight: 700 }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid', borderColor: page === n ? '#111' : '#e8e8e8', background: page === n ? '#111' : '#fff', color: page === n ? '#fff' : '#111', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1.5px solid #e8e8e8', background: '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ddd' : '#111', fontSize: '14px', fontWeight: 700 }}>›</button>
          </div>
        )}
      </div>

      <style>{`
        .comm-row:hover { background: #f9f9f9 !important; }
        .comm-mobile-card { display: none !important; }
        @media (max-width: 640px) {
          .comm-table-head { display: none !important; }
          .comm-row { display: none !important; }
          .comm-mobile-card { display: block !important; }
          .comm-author { display: none; }
        }
      `}</style>
    </div>
  );
}
