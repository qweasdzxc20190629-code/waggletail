'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCartCount } from '../lib/cart';
import { getWishlist } from '../lib/wishlist';
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
    const updateCart = () => setCartCount(currentUserId ? getCartCount(currentUserId) : 0);
    const updateWish = () => setWishCount(currentUserId ? getWishlist(currentUserId).length : 0);
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

  const [shopSheetOpen, setShopSheetOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutSheetOpen, setAboutSheetOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [communitySheetOpen, setCommunitySheetOpen] = useState(false);

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

  const iconSize = isMobile ? 22 : 18;
  const logoHeight = isMobile ? 30 : 34;
  const headerHeight = isMobile ? 52 : 52;
  const iconGap = isMobile ? 16 : 14;
  const mobileNavLinkStyle: React.CSSProperties = {
    fontWeight: 600, fontSize: '11px', padding: '4px 10px', borderRadius: '999px',
    whiteSpace: 'nowrap', color: '#fff', textDecoration: 'none', background: 'transparent',
    textTransform: 'uppercase', fontFamily: 'var(--font-montserrat), sans-serif', flexShrink: 0,
  };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>

        {/* Topbar — PC only */}
        {!isMobile && (
          <div style={{ background: '#111', color: '#fff', fontSize: '13px' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '18px', height: '38px' }}>
              <span style={{ marginRight: 'auto', opacity: 0.82, fontWeight: '600', letterSpacing: '0.02em' }}>고객센터 1588-0000 · 평일 10:00–18:00</span>
              {isLoggedIn ? (
                <>
                  {isAdmin && <Link href="/admin/dashboard" style={{ opacity: 0.82, fontWeight: 800, color: '#F5C400', textDecoration: 'none' }}>관리자</Link>}
                  <button type="button" onClick={handleLogout} style={{ opacity: 0.82, fontWeight: 800, color: '#F5C400', background: 'none', border: 'none', cursor: 'pointer' }}>로그아웃</button>
                </>
              ) : (
                <Link href="/login" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>로그인</Link>
              )}
              {!isLoggedIn && <Link href="/register" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>회원가입</Link>}
              <a href="#" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>주문조회</a>
              <a href="#" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>고객센터</a>
            </div>
          </div>
        )}

        {/* Main header */}
        <header style={{ background: isMobile ? '#fff' : '#F5C400' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: `0 ${isMobile ? 16 : 24}px`, display: 'flex', alignItems: 'center', gap: '16px', height: `${headerHeight}px` }}>

            {/* 로고 */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" style={{ height: `${logoHeight}px`, width: 'auto' }} />
            </Link>

            {/* PC Nav */}
            {!isMobile && (
              <nav style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '100%', fontFamily: 'var(--font-montserrat), sans-serif' }}>
                <Link href="/" style={navLinkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >Home</Link>

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
            )}

            {/* 아이콘 영역 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: `${iconGap}px`, marginLeft: 'auto' }}>
              <button style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
              <Link href="/mypage?modal=찜 목록" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', position: 'relative', padding: '2px' }}>
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {wishCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {wishCount > 99 ? '99+' : wishCount}
                  </span>
                )}
              </Link>
              <Link href="/mypage?modal=장바구니" style={{ display: 'grid', placeItems: 'center', textDecoration: 'none', position: 'relative', padding: '2px' }}>
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
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
                    style={{ fontWeight: 700, fontSize: '12px', padding: '5px 12px', borderRadius: '999px', border: '1.5px solid #111', background: isMobile ? '#f5f5f5' : '#fff', color: '#111', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  style={{ fontWeight: 800, fontSize: isMobile ? '12px' : '14px', padding: isMobile ? '6px 14px' : '9px 18px', borderRadius: '999px', border: '2px solid #111', background: '#111', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Mobile nav bar */}
        {isMobile && (
          <nav style={{ background: '#F5C400' }}>
            <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 12px', display: 'flex', gap: '2px', height: '36px', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-montserrat), sans-serif' }}>
              <Link href="/" style={mobileNavLinkStyle}>Home</Link>
              <div style={{ position: 'relative', height: '36px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => setShopSheetOpen((v) => !v)}
                  style={{ ...mobileNavLinkStyle, background: shopSheetOpen ? 'rgba(0,0,0,.15)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  Shop <span style={{ fontSize: '7px', opacity: 0.7 }}>▼</span>
                </button>
                {shopSheetOpen && (
                  <>
                    <div onClick={() => setShopSheetOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '6px', zIndex: 100, minWidth: '140px' }}>
                      <Link href="/products" onClick={() => setShopSheetOpen(false)}
                        style={{ display: 'block', fontWeight: 800, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#0041BD', textDecoration: 'none', borderBottom: '1px solid rgba(17,17,17,.08)', paddingBottom: '14px', marginBottom: '4px' }}>
                        전체 상품 보기 →
                      </Link>
                      {categoryList.map((cat) => (
                        <Link key={cat} href={`/category/${encodeURIComponent(cat)}`} onClick={() => setShopSheetOpen(false)}
                          style={{ display: 'block', fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none' }}>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Link href="/event" style={mobileNavLinkStyle}>Event</Link>
              <div style={{ position: 'relative', height: '36px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => setAboutSheetOpen((v) => !v)}
                  style={{ ...mobileNavLinkStyle, background: aboutSheetOpen ? 'rgba(0,0,0,.15)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  About <span style={{ fontSize: '7px', opacity: 0.7 }}>▼</span>
                </button>
                {aboutSheetOpen && (
                  <>
                    <div onClick={() => setAboutSheetOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '6px', zIndex: 100, minWidth: '160px' }}>
                      {ABOUT_LINKS.map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setAboutSheetOpen(false)}
                          style={{ display: 'block', fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none' }}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div style={{ position: 'relative', height: '36px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <button onClick={() => setCommunitySheetOpen((v) => !v)}
                  style={{ ...mobileNavLinkStyle, background: communitySheetOpen ? 'rgba(0,0,0,.15)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  Community <span style={{ fontSize: '7px', opacity: 0.7 }}>▼</span>
                </button>
                {communitySheetOpen && (
                  <>
                    <div onClick={() => setCommunitySheetOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '14px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '6px', zIndex: 100, minWidth: '140px' }}>
                      {COMMUNITY_LINKS.map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setCommunitySheetOpen(false)}
                          style={{ display: 'block', fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none' }}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}

      </div>

    </>
  );
}
