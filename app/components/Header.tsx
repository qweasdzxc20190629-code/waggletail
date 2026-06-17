'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories } from '../products';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  useEffect(() => {
    const updateAdmin = () => {
      setIsAdmin(typeof window !== 'undefined' && window.localStorage.getItem('isAdmin') === 'true');
    };

    updateAdmin();
    window.addEventListener('isAdminChanged', updateAdmin);

    return () => {
      window.removeEventListener('isAdminChanged', updateAdmin);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('isAdmin');
      window.dispatchEvent(new Event('isAdminChanged'));
    }
    router.push('/login');
  };

  return (
    <>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ background: '#111', color: '#fff', fontSize: '13px' }}>
        <div className="wt-container wt-topbar" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '18px', height: '38px' }}>
          <span style={{ marginRight: 'auto', opacity: 0.82, fontWeight: '600', letterSpacing: '0.02em' }}>고객센터 1588-0000 · 평일 10:00–18:00</span>
          {isAdmin ? (
            <>
              <Link href="/admin/dashboard" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 800, color: '#FFDC20', textDecoration: 'none' }}>
                관리자
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="wt-topbar-link"
                style={{ opacity: 0.82, fontWeight: 800, color: '#FFDC20', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>
              로그인
            </Link>
          )}
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>회원가입</a>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>주문조회</a>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>고객센터</a>
        </div>
      </div>

      <header style={{ background: '#fff', borderBottom: '2px solid #111' }}>
        <div className="wt-container wt-header-row" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '84px' }}>
          <Link href="/" className="wt-logo-link" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" className="wt-logo-img" style={{ height: '68px', width: 'auto' }} />
          </Link>
          <div className="wt-header-icons" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
            <button className="wt-icon-btn" style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <svg className="wt-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </button>
            <button className="wt-icon-btn wt-icon-emoji" style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>❤️</button>
            <button className="wt-icon-btn wt-icon-emoji" style={{ display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>
              🛒
            </button>
            {isAdmin ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="wt-account-btn"
                  style={{ fontWeight: 800, fontSize: '14px', padding: '9px 18px', borderRadius: '999px', border: '2px solid #111', background: '#fff', color: '#111', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  내 계정 <span style={{ fontSize: '10px', opacity: 0.5 }}>▼</span>
                </button>
                {dropdownOpen && (
                  <>
                    <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '2px solid #111', borderRadius: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 20, minWidth: '140px' }}>
                      <Link
                        href="/mypage"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '13px 18px', fontWeight: 700, fontSize: '14px', color: '#111', textDecoration: 'none', borderBottom: '1px solid rgba(17,17,17,.1)' }}
                      >
                        마이페이지
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 18px', fontWeight: 700, fontSize: '14px', color: '#ff4d6d', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="wt-account-btn"
                style={{ fontWeight: 800, fontSize: '14px', padding: '9px 18px', borderRadius: '999px', border: '2px solid #111', background: '#111', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
        <nav style={{ borderTop: '1px solid rgba(17,17,17,.14)', position: 'relative' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '4px', height: '52px', alignItems: 'center' }}>

            {/* Shop — hover dropdown */}
            <div
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            >
              <button
                style={{ fontWeight: 800, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#111', background: shopOpen ? 'rgba(17,17,17,.07)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Shop <span style={{ fontSize: '9px', opacity: 0.45 }}>▼</span>
              </button>

              {shopOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '2px solid #111', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.12)', padding: '10px', zIndex: 100, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', minWidth: '280px' }}>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${encodeURIComponent(cat)}`}
                      onClick={() => setShopOpen(false)}
                      style={{ fontWeight: 700, fontSize: '14px', padding: '10px 14px', borderRadius: '10px', color: '#111', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .1s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(17,17,17,.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { label: 'Event', href: '/event' },
              { label: 'About', href: '/about' },
              { label: 'Community', href: '/community' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ fontWeight: 800, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#111', textDecoration: 'none', background: 'transparent' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(17,17,17,.07)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .wt-logo-img { height: 42px !important; }
          .wt-header-icons { gap: 8px !important; }
          .wt-icon-emoji { font-size: 18px !important; }
          .wt-icon-svg { width: 18px !important; height: 18px !important; }
          .wt-account-btn { font-size: 12px !important; padding: 7px 12px !important; }
          .wt-header-row { gap: 8px !important; height: 64px !important; }
          .wt-topbar { display: none !important; }
        }
      `}</style>
    </>
  );
}
