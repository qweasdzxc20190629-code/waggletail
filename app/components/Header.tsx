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

  useEffect(() => {
    const fetchCategories = () => getCategoryNamesAction().then(setCategoryList);
    fetchCategories();
    window.addEventListener('wtCategoriesChanged', fetchCategories);
    return () => window.removeEventListener('wtCategoriesChanged', fetchCategories);
  }, []);

  useEffect(() => {
    const uid = localStorage.getItem('wt_user_id');
    const updateCart = () => setCartCount(uid ? getCartCount(uid) : 0);
    const updateWish = () => setWishCount(uid ? getWishlist(uid).length : 0);
    updateCart();
    updateWish();
    window.addEventListener('wtCartChanged', updateCart);
    window.addEventListener('wtWishChanged', updateWish);
    return () => {
      window.removeEventListener('wtCartChanged', updateCart);
      window.removeEventListener('wtWishChanged', updateWish);
    };
  }, []);

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

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>

        {/* Topbar */}
        <div style={{ background: '#111', color: '#fff', fontSize: '13px' }}>
          <div className="wt-topbar" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '18px', height: '38px' }}>
            <span style={{ marginRight: 'auto', opacity: 0.82, fontWeight: '600', letterSpacing: '0.02em' }}>고객센터 1588-0000 · 평일 10:00–18:00</span>
            {isLoggedIn ? (
              <>
                {isAdmin && <Link href="/admin/dashboard" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 800, color: '#F5C400', textDecoration: 'none' }}>관리자</Link>}
                <button type="button" onClick={handleLogout} className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 800, color: '#F5C400', background: 'none', border: 'none', cursor: 'pointer' }}>로그아웃</button>
              </>
            ) : (
              <Link href="/login" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>로그인</Link>
            )}
            {!isLoggedIn && <Link href="/register" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>회원가입</Link>}
            <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>주문조회</a>
            <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>고객센터</a>
          </div>
        </div>

        {/* Main header — PC: yellow + nav in one row, Mobile: white header only */}
        <header className="wt-main-header" style={{ background: '#F5C400' }}>
          <div className="wt-container wt-header-row" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '16px', height: '52px' }}>

            {/* 로고 */}
            <Link href="/" className="wt-logo-link" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" className="wt-logo-img" style={{ height: '34px', width: 'auto' }} />
            </Link>

            {/* 가운데 Nav — PC만 */}
            <nav className="wt-pc-nav" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '100%', fontFamily: 'var(--font-montserrat), sans-serif' }}>
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

              {[{ label: 'Event', href: '/event' }, { label: 'About', href: '/about' }, { label: 'Community', href: '/community' }].map(({ label, href }) => (
                <Link key={label} href={href} style={navLinkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >{label}</Link>
              ))}
            </nav>

            {/* 아이콘 영역 */}
            <div className="wt-header-icons" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
              <button className="wt-icon-btn" style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                <svg className="wt-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
              <Link href="/mypage?modal=찜 목록" className="wt-icon-btn wt-icon-emoji" style={{ display: 'grid', placeItems: 'center', fontSize: '18px', textDecoration: 'none', position: 'relative' }}>
                ❤️
                {wishCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {wishCount > 99 ? '99+' : wishCount}
                  </span>
                )}
              </Link>
              <Link href="/mypage?modal=장바구니" className="wt-icon-btn wt-icon-emoji" style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', textDecoration: 'none', position: 'relative' }}>
                🛒
                {cartCount > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ff4d6d', color: '#fff', fontSize: '10px', fontWeight: 900, borderRadius: '999px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
              {isLoggedIn ? (
                <div style={{ position: 'relative' }}>
                  <button type="button" onClick={() => setDropdownOpen((v) => !v)} className="wt-account-btn"
                    style={{ fontWeight: 700, fontSize: '12px', padding: '5px 12px', borderRadius: '999px', border: '1.5px solid #111', background: '#fff', color: '#111', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                <Link href="/login" className="wt-account-btn"
                  style={{ fontWeight: 800, fontSize: '14px', padding: '9px 18px', borderRadius: '999px', border: '2px solid #111', background: '#111', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Mobile only: 별도 노란 nav 바 */}
        <nav className="wt-mobile-nav" style={{ background: '#F5C400' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 16px', display: 'flex', gap: '2px', height: '38px', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-montserrat), sans-serif' }}>
            <Link href="/"
              style={{ fontWeight: 600, fontSize: '11px', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#fff', textDecoration: 'none', background: 'transparent', textTransform: 'uppercase', fontFamily: 'var(--font-montserrat), sans-serif', flexShrink: 0 }}
            >Home</Link>
            <div style={{ position: 'relative', height: '38px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <button onClick={() => setShopSheetOpen((v) => !v)}
                style={{ fontWeight: 600, fontSize: '11px', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#fff', background: shopSheetOpen ? 'rgba(0,0,0,.15)' : 'transparent', border: 'none', cursor: 'pointer', textTransform: 'uppercase', fontFamily: 'var(--font-montserrat), sans-serif', display: 'flex', alignItems: 'center', gap: '3px' }}>
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
            {[{ label: 'Event', href: '/event' }, { label: 'About', href: '/about' }, { label: 'Community', href: '/community' }].map(({ label, href }) => (
              <Link key={label} href={href}
                style={{ fontWeight: 600, fontSize: '11px', padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#fff', textDecoration: 'none', background: 'transparent', textTransform: 'uppercase', fontFamily: 'var(--font-montserrat), sans-serif', flexShrink: 0 }}
              >{label}</Link>
            ))}
          </div>
        </nav>

      </div>

      <style>{`
        /* PC: yellow header, nav visible */
        .wt-mobile-nav { display: none; }

        @media (max-width: 768px) {
          .wt-main-header { background: #fff !important; }
          .wt-pc-nav { display: none !important; }
          .wt-mobile-nav { display: block !important; }
          .wt-topbar { display: none !important; }
          .wt-logo-img { height: 48px !important; }
          .wt-header-icons { gap: 10px !important; }
          .wt-icon-emoji { font-size: 20px !important; }
          .wt-icon-svg { width: 20px !important; height: 20px !important; }
          .wt-account-btn { font-size: 12px !important; padding: 7px 14px !important; }
          .wt-header-row { height: 64px !important; }
        }
      `}</style>
    </>
  );
}
