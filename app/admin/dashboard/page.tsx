'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const stats = [
  { label: '오늘 판매량', value: '0', bg: '#0041BD' },
  { label: '오늘 매출', value: '0원', bg: '#FFDC20', color: '#111' },
  { label: '전체 상품 수', value: '0', bg: '#0041BD' },
  { label: '전체 주문 수', value: '0', bg: '#FFDC20', color: '#111' },
];

const detailStats = [
  { label: '신규 주문', value: '0' },
  { label: '재주문', value: '0' },
  { label: '반품', value: '0' },
  { label: '환불', value: '0' },
  { label: '방문자', value: '0' },
  { label: '검색수', value: '0' },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F5F8FF', color: '#111', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD' }}>WAGGLE TAIL DASHBOARD</p>
            <h1 style={{ margin: '10px 0 0', fontSize: '38px', fontWeight: 900 }}>관리자 대시보드</h1>
          </div>
          <div style={{ minWidth: '220px', padding: '16px 20px', background: '#0041BD', color: '#fff', borderRadius: '22px', boxShadow: '0 18px 40px rgba(0,65,189,0.14)' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, opacity: 0.9 }}>실시간 통계 현황</p>
            <p style={{ margin: '10px 0 0', fontSize: '28px', fontWeight: 900 }}>데이터가 준비 중입니다</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {stats.map((item) => (
            <div key={item.label} style={{ padding: '26px 24px', borderRadius: '24px', background: item.bg, color: item.color || '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.08)' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, letterSpacing: '0.12em', opacity: 0.9 }}>{item.label}</p>
              <p style={{ margin: '18px 0 0', fontSize: '40px', fontWeight: 900, lineHeight: 1 }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
            {detailStats.map((item) => (
              <div key={item.label} style={{ padding: '24px', borderRadius: '22px', background: '#fff', boxShadow: '0 20px 44px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0041BD' }}>{item.label}</p>
                <p style={{ margin: '18px 0 0', fontSize: '32px', fontWeight: 900, color: '#111' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(180deg, #0041BD 0%, #00265a 100%)', borderRadius: '28px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.15)' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, opacity: 0.85 }}>WAGGLE TAIL BANNER</p>
              <h2 style={{ margin: '18px 0 0', fontSize: '30px', fontWeight: 900, lineHeight: 1.05 }}>오늘도 꼬리가<br />흔들리는 하루</h2>
              <p style={{ margin: '18px 0 0', fontSize: '15px', lineHeight: 1.8, opacity: 0.88 }}>주문 현황을 빠르게 확인하고, 판매 흐름을 한눈에 파악하세요.</p>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: '#FFDC20', color: '#111', padding: '10px 16px', borderRadius: '14px', fontWeight: 800, fontSize: '13px' }}>실시간 업데이트</span>
              <span style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', padding: '10px 16px', borderRadius: '14px', fontWeight: 700, fontSize: '13px' }}>관리자 전용</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
