'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const mockOrders = [
  { id: 'WT-20260501', name: '포근 도넛 베드 (M)', status: '배송완료', date: '2026.05.01', price: 39900, image: '🛏️' },
  { id: 'WT-20260418', name: '강아지 간식 3종 세트', status: '배송중', date: '2026.04.18', price: 24500, image: '🍗' },
  { id: 'WT-20260402', name: '산책 리드줄 · 하네스 세트', status: '배송완료', date: '2026.04.02', price: 32000, image: '🐕' },
];

const menuItems = [
  { icon: '📦', label: '주문내역', desc: '주문·배송 현황', href: '#' },
  { icon: '❤️', label: '찜 목록', desc: '저장한 상품 보기', href: '#' },
  { icon: '📍', label: '배송지 관리', desc: '배송지 추가·수정', href: '#' },
  { icon: '🔁', label: '정기배송', desc: '구독 현황 관리', href: '#' },
  { icon: '💬', label: '1:1 문의', desc: '문의 내역 확인', href: '#' },
  { icon: '⭐', label: '리뷰 관리', desc: '작성한 리뷰 보기', href: '#' },
];

const statusColor: Record<string, { bg: string; color: string }> = {
  '배송완료': { bg: 'rgba(17,17,17,.08)', color: '#555' },
  '배송중':   { bg: 'rgba(0,65,189,.1)',  color: '#0041BD' },
  '주문확인': { bg: 'rgba(255,220,32,.3)', color: '#7a6000' },
};

export default function MyPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    const admin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(admin);
    if (!admin) router.push('/login');
  }, [router]);

  if (!mounted || !isAdmin) return null;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#f6f7fb', minHeight: '100vh' }}>

      {/* Profile hero */}
      <section style={{ background: '#0041BD', color: '#fff', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#FFDC20', marginBottom: '24px' }}>MY PAGE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FFDC20', border: '3px solid #fff', display: 'grid', placeItems: 'center', fontSize: '32px', flexShrink: 0 }}>
              🐾
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>관리자님</h1>
                <span style={{ background: '#FFDC20', color: '#111', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '999px' }}>ADMIN</span>
              </div>
              <p style={{ fontSize: '14px', opacity: 0.75, margin: 0 }}>qweasdzxc20190629@gmail.com</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mp-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '32px' }}>
            {[
              { label: '주문내역', value: '3건' },
              { label: '적립금', value: '4,200원' },
              { label: '쿠폰', value: '2장' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.12)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900 }}>{s.value}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '960px', margin: '-32px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Quick menu */}
        <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '18px' }}>바로가기</h2>
          <div className="mp-menu-grid">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="mp-menu-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', borderRadius: '14px', textAlign: 'center', transition: 'background .15s', cursor: 'pointer' }}>
                  <div style={{ width: '48px', height: '48px', background: '#f4f6fb', borderRadius: '14px', display: 'grid', placeItems: 'center', fontSize: '22px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>최근 주문내역</h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: 700, color: '#0041BD', textDecoration: 'none' }}>전체 보기 →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mockOrders.map((order) => {
              const sc = statusColor[order.status] ?? { bg: '#eee', color: '#555' };
              return (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: '1.5px solid rgba(17,17,17,.1)', borderRadius: '14px' }}>
                  <div style={{ width: '52px', height: '52px', background: '#f4f6fb', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '26px', flexShrink: 0 }}>
                    {order.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{order.date} · {order.id}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '4px' }}>{order.price.toLocaleString()}원</div>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: sc.bg, color: sc.color }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account settings */}
        <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '14px' }}>계정 설정</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: '개인정보 수정', icon: '✏️' },
              { label: '비밀번호 변경', icon: '🔒' },
              { label: '알림 설정', icon: '🔔' },
              { label: '회원 탈퇴', icon: '⚠️', red: true },
            ].map((item, i, arr) => (
              <a
                key={item.label}
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 4px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(17,17,17,.08)' : 'none',
                  textDecoration: 'none',
                  color: item.red ? '#ff4d6d' : '#111',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{item.icon}</span> {item.label}
                </span>
                <span style={{ opacity: 0.3, fontSize: '16px' }}>›</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mp-menu-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }
        .mp-menu-item:hover {
          background: rgba(17,17,17,.05);
        }
        @media (max-width: 640px) {
          .mp-stats {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .mp-menu-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
