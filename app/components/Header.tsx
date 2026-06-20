'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCartCountAction } from '../cart-actions';
import { getWishCountAction } from '../wishlist-actions';
import Link from 'next/link';
import { getCategoryNamesAction } from '../categories-actions';
import { DASHBOARD_ROLES } from '../users';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchCategories = () => getCategoryNamesAction().then(setCategoryList);
    fetchCategories();
    window.addEventListener('wtCategoriesChanged', fetchCategories);
    return () => window.removeEventListener('wtCategoriesChanged', fetchCategories);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      if (currentUserId) getCartCountAction(currentUserId).then(setCartCount);
      else setCartCount(0);
    };
    const updateWish = () => {
      if (currentUserId) getWishCountAction(currentUserId).then(setWishCount);
      else setWishCount(0);
    };
    updateCart();
    updateWish();
    window.addEventListener('wtCartChanged', updateCart);
    window.addEventListener('wtWishChanged', updateWish);
    return () => {
      window.removeEventListener('wtCartChanged', updateCart);
      window.removeEventListener('wtWishChanged', updateWish);
    };
  }, [currentUserId]);

  useEffect(() => {
    const update = () => {
      const role = window.localStorage.getItem('wt_role');
      setIsLoggedIn(!!role);
      setIsAdmin(!!role && DASHBOARD_ROLES.includes(role as never));
      setCurrentUserId(window.localStorage.getItem('wt_user_id') ?? '');
      setCurrentRole(role ?? '');
    };
    update();
    window.addEventListener('isAdminChanged', update);
    return () => window.removeEventListener('isAdminChanged', update);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('wt_role');
    window.localStorage.removeItem('wt_user_id');
    window.localStorage.removeItem('isAdmin');
    window.dispatchEvent(new Event('isAdminChanged'));
    router.push('/login');
  };

  const navLinkStyle: React.CSSProperties = {
    fontWeight: 600, fontSize: '12px', padding: '5px 11px', borderRadius: '999px',
    whiteSpace: 'nowrap', color: '#fff', textDecoration: 'none',
    background: 'transparent', textTransform: 'uppercase',
    fontFamily: 'var(--font-montserrat), sans-serif',
  };

  const [aboutOpen, setAboutOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerShopOpen, setDrawerShopOpen] = useState(false);
  const [drawerAboutOpen, setDrawerAboutOpen] = useState(false);
  const [drawerCommunityOpen, setDrawerCommunityOpen] = useState(false);

  const EVENT_MESSAGES = [
    { badge: 'EVENT', text: '첫 주문 고객님께 배송비 0원 혜택!' },
    { badge: 'COUPON', text: '처음 만나는 와글테일, 첫 구매 5% 할인!' },
    { badge: 'EVENT', text: '채널 추가 시 3,000원 쿠폰 지급!' },
  ];
  const [evIdx, setEvIdx] = useState(0);
  const [evSliding, setEvSliding] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setEvSliding(true);
      setTimeout(() => {
        setEvIdx((i) => (i + 1) % EVENT_MESSAGES.length);
        setEvSliding(false);
      }, 350);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const COMMUNITY_LINKS = [
    { label: 'Notice', href: '/community/notice' },
    { label: 'Review', href: '/community/review' },
    { label: 'Membership', href: '/community/membership' },
    { label: 'CS Center', href: '/community/cs' },
  ];

  const ABOUT_LINKS = [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'FAQ', href: '/about#faq' },
    { label: 'Contact', href: '/about#contact' },
  ];

  const iconSize = 18;
  const logoHeight = isMobile ? 30 : 34;
  const headerHeight = 52;
  const iconGap = isMobile ? 16 : 14;

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>

        {/* Event bar — PC/모바일 공통 */}
        <div style={{ background: '#F5C400', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* 세로 클리핑 전용 — 가로는 outer overflow:hidden이 처리 */}
          <div style={{ position: 'relative', height: '28px' }}>
            {/* current row — 위로 사라짐 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
              transform: evSliding ? 'translate(-50%, calc(-50% - 28px))' : 'translate(-50%, -50%)',
              transition: evSliding ? 'transform 0.35s ease' : 'none',
            }}>
              <span style={{ background: '#fff', color: '#111', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.03em', fontFamily: "'Pretendard', sans-serif" }}>
                {EVENT_MESSAGES[evIdx].badge}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#111', fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.01em' }}>
                {EVENT_MESSAGES[evIdx].text}
              </span>
            </div>
            {/* next row — 아래에서 올라옴 */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
              transform: evSliding ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 28px))',
              transition: evSliding ? 'transform 0.35s ease' : 'none',
            }}>
              <span style={{ background: '#fff', color: '#111', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.03em', fontFamily: "'Pretendard', sans-serif" }}>
                {EVENT_MESSAGES[(evIdx + 1) % EVENT_MESSAGES.length].badge}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#111', fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.01em' }}>
                {EVENT_MESSAGES[(evIdx + 1) % EVENT_MESSAGES.length].text}
              </span>
            </div>
            {/* sizer — letterSpacing 포함해 실제 너비와 일치 */}
            <div style={{ visibility: 'hidden', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.03em', fontFamily: "'Pretendard', sans-serif" }}>COUPON</span>
              <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: "'Pretendard', sans-serif", letterSpacing: '0.01em' }}>처음 만나는 와글테일, 첫 구매 5% 할인!</span>
            </div>
          </div>
        </div>


        {/* Main header */}
        <header style={{ background: 'linear-gradient(to bottom, rgba(0,10,50,0.35) 0%, rgba(0,10,50,0.28) 100%), #0041BD' }}>
          {isMobile ? (
            /* ── 모바일: 햄버거 | 로고(중앙) | 돋보기+장바구니 ── */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '52px', padding: '0 16px' }}>
              {/* 왼쪽: 햄버거 */}
              <div>
                <button onClick={() => setDrawerOpen(true)} style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              </div>
              {/* 중앙: 로고 */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: '30px', width: 'auto' }} />
              </Link>
              {/* 오른쪽: 돋보기 + 장바구니 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', justifyContent: 'flex-end' }}>
                <button style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                </button>
                <Link href="/mypage?modal=장바구니" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', position: 'relative', padding: '2px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          ) : (
            /* ── PC: 기존 레이아웃 ── */
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: `${headerHeight}px` }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: `${logoHeight}px`, width: 'auto' }} />
              </Link>

              <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', height: '100%', fontFamily: 'var(--font-montserrat), sans-serif' }}>
                <div onMouseEnter={() => setShopOpen(true)} onMouseLeave={() => setShopOpen(false)}
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <button style={{ ...navLinkStyle, background: shopOpen ? 'rgba(0,0,0,.1)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Shop <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
                  </button>
                  {shopOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '10px', zIndex: 100, minWidth: '280px' }}>
                      <Link href="/products" onClick={() => setShopOpen(false)}
                        style={{ display: 'block', fontWeight: 800, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#0041BD', textDecoration: 'none', borderBottom: '1px solid rgba(17,17,17,.08)', paddingBottom: '14px', marginBottom: '4px' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,65,189,.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >전체 상품 보기 →</Link>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px', marginTop: '6px' }}>
                        {categoryList.map((cat) => (
                          <Link key={cat} href={`/category/${encodeURIComponent(cat)}`} onClick={() => setShopOpen(false)}
                            style={{ fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none', whiteSpace: 'nowrap' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(17,17,17,.06)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >{cat}</Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link href="/event" style={navLinkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >Event</Link>

                <div onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Link href="/about" style={{ ...navLinkStyle, background: aboutOpen ? 'rgba(0,0,0,.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    About <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
                  </Link>
                  {aboutOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '10px', zIndex: 100, minWidth: '200px' }}>
                      {ABOUT_LINKS.map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setAboutOpen(false)}
                          style={{ display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none', whiteSpace: 'nowrap' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(17,17,17,.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >{item.label}</Link>
                      ))}
                    </div>
                  )}
                </div>

                <div onMouseEnter={() => setCommunityOpen(true)} onMouseLeave={() => setCommunityOpen(false)}
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
                  <Link href="/community/notice" style={{ ...navLinkStyle, background: communityOpen ? 'rgba(0,0,0,.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Community <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
                  </Link>
                  {communityOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '10px', zIndex: 100, minWidth: '160px' }}>
                      {COMMUNITY_LINKS.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setCommunityOpen(false)}
                          style={{ display: 'block', fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none', whiteSpace: 'nowrap' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(17,17,17,.06)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >{item.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {/* PC 아이콘 영역 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: `${iconGap}px`, marginLeft: 'auto' }}>
                <button style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
                  </svg>
                </button>
                <Link href="/mypage?modal=찜 목록" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', position: 'relative', padding: '2px' }}>
                  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {wishCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                      {wishCount > 99 ? '99+' : wishCount}
                    </span>
                  )}
                </Link>
                <Link href="/mypage?modal=장바구니" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', position: 'relative', padding: '2px' }}>
                  <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
                {isLoggedIn ? (
                  <div style={{ position: 'relative' }}>
                    <button type="button" onClick={() => setDropdownOpen((v) => !v)}
                      style={{ fontWeight: 700, fontSize: '12px', padding: '5px 12px', borderRadius: '999px', border: '1.5px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      내 계정 <span style={{ fontSize: '8px', opacity: 0.5 }}>▼</span>
                    </button>
                    {dropdownOpen && (
                      <>
                        <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '2px solid #111', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 20, minWidth: '160px', padding: '6px' }}>
                          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid rgba(17,17,17,.08)', marginBottom: '4px' }}>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUserId}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#aaa', fontWeight: 600 }}>{currentRole}</p>
                          </div>
                          <Link href="/mypage" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '11px 14px', fontWeight: 700, fontSize: '14px', color: '#111', textDecoration: 'none', borderRadius: '8px' }}>마이페이지</Link>
                          <Link href="/mypage?modal=주문내역" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '11px 14px', fontWeight: 700, fontSize: '14px', color: '#111', textDecoration: 'none', borderRadius: '8px' }}>주문조회</Link>
                          {isAdmin && <Link href="/admin/dashboard" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '11px 14px', fontWeight: 700, fontSize: '14px', color: '#111', textDecoration: 'none', borderRadius: '8px' }}>관리자 페이지</Link>}
                          <div style={{ height: '1px', background: 'rgba(17,17,17,.1)', margin: '4px 0' }} />
                          <button type="button" onClick={() => { setDropdownOpen(false); handleLogout(); }}
                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', fontWeight: 700, fontSize: '14px', color: '#ff4d6d', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>
                            로그아웃
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link href="/login"
                    style={{ fontWeight: 800, fontSize: '14px', padding: '9px 18px', borderRadius: '999px', border: '2px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    로그인
                  </Link>
                )}
              </div>
            </div>
          )}
        </header>

        {/* 카테고리 서브 네비 — 메인 제외, PC는 쇼핑 페이지에서만 표시 */}
        <nav className={`wt-catnav${(pathname === '/products' || pathname.startsWith('/category')) ? ' wt-catnav-shop' : ''}`} style={{ background: '#111', overflowX: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', display: (pathname === '/products' || pathname.startsWith('/category')) ? undefined : 'none' } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '36px', width: '100%' }}>
            <Link href="/products" style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>전체</Link>
            {categoryList.map((cat) => (
              <Link key={cat} href={`/category/${encodeURIComponent(cat)}`} style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>{cat}</Link>
            ))}
          </div>
        </nav>

      </div>

      {/* ── 모바일 드로어 ── */}
      {isMobile && drawerOpen && (
        <>
          {/* 오버레이 */}
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200 }} />
          {/* 패널 */}
          <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '80vw', maxWidth: '320px', background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* 드로어 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
              <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: '24px', width: 'auto' }} />
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'grid', placeItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 드로어 메뉴 */}
            <nav style={{ flex: 1, padding: '12px 0' }}>
              {/* Shop */}
              <button onClick={() => setDrawerShopOpen((v) => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '14px', color: '#111' }}>
                Shop <span style={{ fontSize: '10px', opacity: 0.5, transform: drawerShopOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {drawerShopOpen && (
                <div style={{ background: '#fafafa', paddingBottom: '4px' }}>
                  <Link href="/products" onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '11px 32px', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#0041BD', textDecoration: 'none' }}>전체 상품 보기 →</Link>
                  {categoryList.map((cat) => (
                    <Link key={cat} href={`/category/${encodeURIComponent(cat)}`} onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '11px 32px', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#333', textDecoration: 'none' }}>{cat}</Link>
                  ))}
                </div>
              )}

              <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />

              {/* Event */}
              <Link href="/event" onClick={() => setDrawerOpen(false)} style={{ display: 'flex', alignItems: 'center', padding: '14px 24px', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '14px', color: '#111', textDecoration: 'none' }}>Event</Link>

              <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />

              {/* About */}
              <button onClick={() => setDrawerAboutOpen((v) => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '14px', color: '#111' }}>
                About <span style={{ fontSize: '10px', opacity: 0.5, transform: drawerAboutOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {drawerAboutOpen && (
                <div style={{ background: '#fafafa', paddingBottom: '4px' }}>
                  {ABOUT_LINKS.map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '11px 32px', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#333', textDecoration: 'none' }}>{item.label}</Link>
                  ))}
                </div>
              )}

              <div style={{ height: '1px', background: '#f0f0f0', margin: '4px 0' }} />

              {/* Community */}
              <button onClick={() => setDrawerCommunityOpen((v) => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '14px', color: '#111' }}>
                Community <span style={{ fontSize: '10px', opacity: 0.5, transform: drawerCommunityOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>▼</span>
              </button>
              {drawerCommunityOpen && (
                <div style={{ background: '#fafafa', paddingBottom: '4px' }}>
                  {COMMUNITY_LINKS.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '11px 32px', fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '13px', color: '#333', textDecoration: 'none' }}>{item.label}</Link>
                  ))}
                </div>
              )}
            </nav>

            {/* 드로어 하단: 로그인/계정 */}
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px 20px' }}>
              {isLoggedIn ? (
                <>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#111' }}>{currentUserId}</p>
                  <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#aaa' }}>{currentRole}</p>
                  <Link href="/mypage" onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '10px 16px', fontWeight: 700, fontSize: '13px', color: '#111', textDecoration: 'none', background: '#f5f5f5', borderRadius: '8px', marginBottom: '8px' }}>마이페이지</Link>
                  {isAdmin && <Link href="/admin/dashboard" onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '10px 16px', fontWeight: 700, fontSize: '13px', color: '#0041BD', textDecoration: 'none', background: '#f0f4ff', borderRadius: '8px', marginBottom: '8px' }}>관리자 페이지</Link>}
                  <button onClick={() => { setDrawerOpen(false); handleLogout(); }} style={{ width: '100%', padding: '10px 16px', fontWeight: 700, fontSize: '13px', color: '#ff4d6d', background: 'none', border: '1px solid #ff4d6d', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>로그아웃</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setDrawerOpen(false)} style={{ display: 'block', padding: '12px 16px', fontWeight: 800, fontSize: '14px', color: '#fff', background: '#111', borderRadius: '8px', textDecoration: 'none', textAlign: 'center' }}>로그인</Link>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`.wt-catnav::-webkit-scrollbar{display:none}@media(min-width:769px){.wt-catnav{display:none}.wt-catnav-shop{display:block}}`}</style>
    </>
  );
}
