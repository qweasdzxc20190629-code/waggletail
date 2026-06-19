'use client';

import Link from 'next/link';
import { useState } from 'react';


const TIERS = [
  {
    id: 'general',
    name: '일반',
    nameEn: 'General',
    emoji: '🐾',
    condition: '가입 즉시',
    color: '#888',
    bg: '#f7f8fa',
    border: '#e0e0e0',
    benefits: [
      '전 상품 구매 가능',
      '포인트 적립 (구매금액의 1%)',
      '신규 가입 15% 할인 쿠폰 1회',
      '커뮤니티 이용',
    ],
  },
  {
    id: 'silver',
    name: '실버',
    nameEn: 'Silver',
    emoji: '🥈',
    condition: '누적 구매 30만원 이상',
    color: '#6b7280',
    bg: '#f0f4f8',
    border: '#b0bec5',
    benefits: [
      '일반 등급 혜택 포함',
      '포인트 적립 (구매금액의 2%)',
      '월 1회 5% 할인 쿠폰',
      '신상품 얼리 액세스',
      '무료 배송 기준 금액 인하',
    ],
  },
  {
    id: 'gold',
    name: '골드',
    nameEn: 'Gold',
    emoji: '🥇',
    condition: '누적 구매 100만원 이상',
    color: '#b8860b',
    bg: '#fffbea',
    border: '#F5C400',
    benefits: [
      '실버 등급 혜택 포함',
      '포인트 적립 (구매금액의 3%)',
      '월 1회 10% 할인 쿠폰',
      '전 상품 무료 배송',
      '전용 고객센터 채널',
      '한정 굿즈 우선 구매권',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    nameEn: 'VIP',
    emoji: '👑',
    condition: '누적 구매 300만원 이상',
    color: '#0041BD',
    bg: '#f0f4ff',
    border: '#0041BD',
    benefits: [
      '골드 등급 혜택 포함',
      '포인트 적립 (구매금액의 5%)',
      '월 1회 15% 할인 쿠폰',
      '신상품 무료 체험 신청 가능',
      '전담 CS 매니저 배정',
      '연 1회 특별 선물 증정',
      'VIP 전용 이벤트 초대',
    ],
  },
];

const FAQS = [
  { q: '등급은 언제 업그레이드되나요?', a: '구매 확정 후 익월 1일에 등급이 반영됩니다. 취소·반품된 주문은 집계에서 제외됩니다.' },
  { q: '등급이 다운그레이드될 수 있나요?', a: '네, 최근 12개월 누적 구매금액 기준으로 매년 1월 재산정됩니다.' },
  { q: '포인트는 어떻게 사용하나요?', a: '마이페이지 > 포인트 내역에서 확인하고, 결제 시 1P = 1원으로 사용하실 수 있습니다.' },
  { q: '포인트 유효기간이 있나요?', a: '적립일로부터 2년간 유효합니다. 만료 30일 전 이메일로 안내드립니다.' },
];

export default function MembershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Header */}
      <section style={{ padding: '48px 24px 56px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '8px' }}>COMMUNITY</p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 10px' }}>Membership</h1>
        <p style={{ fontSize: '15px', color: '#888', fontWeight: 400, margin: 0 }}>더 자주 함께할수록, 더 많은 혜택이 돌아옵니다.</p>
      </section>

      {/* Tier cards */}
      <section style={{ background: '#f7f8fa', padding: '56px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="tier-grid">
            {TIERS.map((t) => (
              <div key={t.id} style={{ background: t.bg, border: `2px solid ${t.border}`, borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                {t.id === 'vip' && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: '#0041BD', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '6px 14px', borderRadius: '0 18px 0 12px', letterSpacing: '0.06em' }}>최고 등급</div>
                )}
                <div>
                  <span style={{ fontSize: '28px' }}>{t.emoji}</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: t.color }}>{t.name}</h2>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#aaa', letterSpacing: '0.06em' }}>{t.nameEn}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 700, color: '#aaa' }}>{t.condition}</p>
                </div>
                <div style={{ height: '1px', background: t.border, opacity: 0.5 }} />
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {t.benefits.map((b) => (
                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: '#333' }}>
                      <span style={{ color: t.color, fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 24px', maxWidth: '760px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 40px', textAlign: 'center' }}>등급 산정 기준</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { step: '01', title: '구매 확정', desc: '배송 완료 후 구매 확정 시 구매금액이 집계됩니다.' },
            { step: '02', title: '누적 집계', desc: '최근 12개월 구매금액을 기준으로 등급을 산정합니다.' },
            { step: '03', title: '익월 반영', desc: '매월 1일 등급이 업데이트되고 혜택이 즉시 적용됩니다.' },
          ].map((s, i) => (
            <div key={s.step} style={{ display: 'flex', gap: '20px', paddingBottom: i < 2 ? '28px' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '999px', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#111' }}>{s.step}</div>
                {i < 2 && <div style={{ width: '2px', flex: 1, background: '#eee', marginTop: '8px' }} />}
              </div>
              <div style={{ paddingTop: '8px' }}>
                <h3 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '16px' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f7f8fa', padding: '64px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 32px' }}>자주 묻는 질문</h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderTop: '1.5px solid #e0e0e0', ...(i === FAQS.length - 1 ? { borderBottom: '1.5px solid #e0e0e0' } : {}) }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', textAlign: 'left', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>{faq.q}</span>
                <span style={{ fontSize: '18px', color: '#aaa', flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
              </button>
              {openFaq === i && <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, margin: '0 0 18px', fontWeight: 400 }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 10px' }}>지금 시작하면 바로 일반 등급</h2>
        <p style={{ fontSize: '15px', color: '#888', margin: '0 0 28px' }}>신규 가입 즉시 15% 할인 쿠폰도 드려요</p>
        <Link href="/register" style={{ display: 'inline-block', background: '#F5C400', color: '#111', fontWeight: 900, fontSize: '15px', padding: '16px 40px', borderRadius: '999px', textDecoration: 'none' }}>
          무료 가입하기 →
        </Link>
      </section>

      <style>{`
        .tier-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .tier-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .tier-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
