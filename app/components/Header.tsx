'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { categories } from '../products';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

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

      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '2px solid #111' }}>
        <div className="wt-container wt-header-row" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '24px', height: '84px' }}>
          <Link href="/" className="wt-logo-link" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" className="wt-logo-img" style={{ height: '68px', width: 'auto' }} />
          </Link>
          <div className="wt-search" style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2.5px solid #111', borderRadius: '999px', padding: '11px 8px 11px 20px', maxWidth: '520px', minWidth: 0 }}>
            <input
              type="text"
              placeholder="베드, 간식, 목욕용품, 산책용품 검색"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: '15px', background: 'transparent' }}
            />
            <button style={{ background: '#0041BD', width: '38px', height: '38px', borderRadius: '50%', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: '18px' }}>🔍</span>
            </button>
          </div>
          <div className="wt-header-icons" style={{ display: 'flex', alignItems: 'center', gap: '18px', marginLeft: 'auto' }}>
            <button style={{ position: 'relative', display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '25px' }}>❤️</button>
            <button style={{ position: 'relative', display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '25px' }}>
              🛒
              <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#0041BD', color: '#fff', fontSize: '11px', fontWeight: '800', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'grid', placeItems: 'center', padding: '0 4px' }}>2</span>
            </button>
          </div>
        </div>
        <nav style={{ borderTop: '1px solid rgba(17,17,17,.14)' }}>
          <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '6px', height: '52px', alignItems: 'center', overflowX: 'auto' }}>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  color: '#111',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
