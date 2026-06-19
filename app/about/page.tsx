'use client';

import { useState } from 'react';
import Link from 'next/link';

const VALUES = [
  {
    icon: '🐾',
    title: '반려동물 우선',
    desc: '모든 제품과 서비스는 반려동물의 건강과 행복을 최우선으로 설계됩니다.',
  },
  {
    icon: '✅',
    title: '검증된 품질',
    desc: '직접 사용하고 싶은 제품만 엄선합니다. 성분, 내구성, 안전성 — 타협하지 않습니다.',
  },
  {
    icon: '💛',
    title: '진심 있는 서비스',
    desc: '보호자의 고민을 함께 나누고, 진짜 필요한 것을 찾을 수 있도록 돕겠습니다.',
  },
  {
    icon: '🌱',
    title: '지속 가능성',
    desc: '반려동물과 지구 모두를 위해 환경을 고려한 선택을 지향합니다.',
  },
];

const TEAM = [
  { name: '김민석', role: 'Founder & CEO', emoji: '🧑‍💼', bio: '반려견 3마리와 함께 사는 집사. 좋은 제품을 쉽게 찾을 수 없는 불편함에서 WAGGLE TAIL이 시작됐습니다.' },
  { name: '이지연', role: 'Head of Product', emoji: '👩‍💻', bio: '10년차 이커머스 기획자. 보호자의 눈높이에서 쇼핑 경험을 설계합니다.' },
  { name: '박수현', role: 'Brand Designer', emoji: '🎨', bio: '반려묘 2마리를 키우는 디자이너. 브랜드가 가진 따뜻함을 시각으로 전달합니다.' },
  { name: '최동훈', role: 'Operations', emoji: '📦', bio: '빠르고 안전한 배송과 고객 경험을 책임집니다. 작은 불편도 놓치지 않으려 합니다.' },
];

const STORY = [
  { year: '2021', title: '시작', desc: '반려견을 키우며 느낀 "좋은 제품을 고르기 어렵다"는 불편함에서 출발했습니다.' },
  { year: '2022', title: '첫 번째 제품', desc: '직접 사용해보고 검증한 첫 상품 라인업으로 소규모 런칭. 입소문으로 빠르게 성장했습니다.' },
  { year: '2023', title: '브랜드 확장', desc: '카테고리를 넓히고 정기배송 서비스를 시작했습니다. 누적 고객 1만 명을 달성했습니다.' },
  { year: '2024', title: '커뮤니티', desc: '보호자들이 서로 정보를 나누는 커뮤니티 기능을 오픈했습니다.' },
  { year: '2025', title: '지금', desc: '더 많은 반려동물 가족과 함께하기 위해 오늘도 나아가고 있습니다.' },
];

const FAQS = [
  { q: '배송은 얼마나 걸리나요?', a: '결제 완료 후 평균 1-3 영업일 이내 출고됩니다. 제주/도서산간 지역은 추가 일정이 소요될 수 있습니다.' },
  { q: '교환·반품은 어떻게 하나요?', a: '수령 후 7일 이내 고객센터 또는 마이페이지에서 신청하실 수 있습니다. 단, 반려동물이 사용한 제품은 위생상 교환·반품이 어려울 수 있습니다.' },
  { q: '정기배송은 언제든 해지할 수 있나요?', a: '네, 약정 없이 언제든 건너뛰거나 해지하실 수 있습니다. 마이페이지 > 정기배송 관리에서 설정할 수 있습니다.' },
  { q: '제품 추천을 받을 수 있나요?', a: '고객센터 채팅 또는 이메일로 반려동물의 종, 나이, 건강 상태를 알려주시면 맞춤 추천을 드립니다.' },
  { q: '회원 등급 혜택은 어떻게 되나요?', a: '구매 금액에 따라 일반 > 실버 > 골드 > VIP 등급이 부여됩니다. 등급별 추가 할인 및 전용 이벤트 혜택이 제공됩니다.' },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: '#111', color: '#fff', padding: '100px 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.2em', color: '#F5C400', marginBottom: '20px' }}>WAGGLE TAIL</p>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 auto 24px', maxWidth: '820px', wordBreak: 'keep-all' }}>
          반려동물과 사람이<br />함께 행복한 세상
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.65)', fontWeight: 400, margin: '0 auto', maxWidth: '560px', lineHeight: 1.7, wordBreak: 'keep-all' }}>
          WAGGLE TAIL은 반려동물 가족을 위한 라이프스타일 브랜드입니다.<br />
          좋은 제품을 쉽게 만날 수 있도록, 오늘도 고민합니다.
        </p>
      </section>

      {/* Stats */}
      <section style={{ background: '#F5C400', padding: '48px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'center' }}>
          {[
            { num: '10,000+', label: '누적 고객' },
            { num: '200+', label: '엄선된 상품' },
            { num: '4.9', label: '평균 별점' },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px', color: '#111' }}>{s.num}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(17,17,17,0.6)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section id="intro" style={{ padding: 'clamp(64px, 8vw, 100px) 24px', maxWidth: '860px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', marginBottom: '16px' }}>OUR MISSION</p>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.2, margin: '0 0 24px', wordBreak: 'keep-all' }}>
          "어떤 제품이 정말 좋은지<br />보호자가 직접 고민하지 않아도 되도록."
        </h2>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8, margin: 0, fontWeight: 400, wordBreak: 'keep-all' }}>
          반려동물 용품 시장은 빠르게 성장했지만, 정작 어떤 제품이 안전하고 좋은지 알기 어렵습니다.
          WAGGLE TAIL은 수백 가지 제품을 직접 사용하고 검증해 진짜 좋은 것만 엄선합니다.
          보호자들이 믿고 선택할 수 있는 브랜드가 되는 것이 우리의 미션입니다.
        </p>
      </section>

      {/* Values */}
      <section style={{ background: '#f7f8fa', padding: 'clamp(64px, 8vw, 100px) 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', marginBottom: '16px', textAlign: 'center' }}>OUR VALUES</p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 56px' }}>우리가 지키는 것들</h2>
          <div className="about-values-grid">
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: '#fff', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '32px' }}>{v.icon}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" style={{ padding: 'clamp(64px, 8vw, 100px) 24px', maxWidth: '720px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', marginBottom: '16px' }}>OUR STORY</p>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 56px', wordBreak: 'keep-all' }}>WAGGLE TAIL 이야기</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STORY.map((s, i) => (
            <div key={s.year} style={{ display: 'flex', gap: '28px', paddingBottom: i < STORY.length - 1 ? '36px' : '0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '999px', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', color: '#111', flexShrink: 0 }}>{s.year.slice(2)}</div>
                {i < STORY.length - 1 && <div style={{ width: '2px', flex: 1, background: '#eee', marginTop: '8px' }} />}
              </div>
              <div style={{ paddingTop: '10px', paddingBottom: i < STORY.length - 1 ? '8px' : '0' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '13px', color: '#0041BD' }}>{s.year}</p>
                <h3 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '17px', letterSpacing: '-0.02em' }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: 1.7, wordBreak: 'keep-all' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: '#f7f8fa', padding: 'clamp(64px, 8vw, 100px) 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', marginBottom: '16px', textAlign: 'center' }}>OUR TEAM</p>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', textAlign: 'center', margin: '0 0 56px' }}>함께하는 사람들</h2>
          <div className="about-team-grid">
            {TEAM.map((m) => (
              <div key={m.name} style={{ background: '#fff', borderRadius: '20px', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '999px', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{m.emoji}</div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontWeight: 900, fontSize: '17px', letterSpacing: '-0.02em' }}>{m.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.04em' }}>{m.role}</p>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: 1.7, fontWeight: 400 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: 'clamp(64px, 8vw, 100px) 24px', maxWidth: '720px', margin: '0 auto' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', marginBottom: '16px' }}>FAQ</p>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 40px' }}>자주 묻는 질문</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderTop: '1.5px solid #eee', ...(i === FAQS.length - 1 ? { borderBottom: '1.5px solid #eee' } : {}) }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', textAlign: 'left', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}
              >
                <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.4, color: '#111', wordBreak: 'keep-all' }}>{faq.q}</span>
                <span style={{ fontSize: '18px', color: '#aaa', flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.8, margin: '0 0 20px', fontWeight: 400, wordBreak: 'keep-all' }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ background: '#111', color: '#fff', padding: 'clamp(64px, 8vw, 100px) 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#F5C400', marginBottom: '16px' }}>CONTACT</p>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.15 }}>무엇이든 물어보세요</h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', margin: '0 0 48px', lineHeight: 1.7 }}>고객센터 및 제휴 문의는 아래 채널로 연락주세요.</p>
        <div className="about-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '720px', margin: '0 auto 48px' }}>
          {[
            { label: '고객센터', value: '1588-0000', sub: '평일 10:00 – 18:00' },
            { label: '이메일', value: 'hello@waggletail.kr', sub: '24시간 접수 가능' },
            { label: '제휴 문의', value: 'biz@waggletail.kr', sub: '입점·협업 문의' },
          ].map((c) => (
            <div key={c.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px 20px' }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: '#F5C400', letterSpacing: '0.1em' }}>{c.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#fff', wordBreak: 'break-all' }}>{c.value}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{c.sub}</p>
            </div>
          ))}
        </div>
        <Link href="/products" style={{ display: 'inline-block', background: '#F5C400', color: '#111', fontWeight: 900, fontSize: '15px', padding: '16px 36px', borderRadius: '999px', textDecoration: 'none', letterSpacing: '-0.01em' }}>
          쇼핑 시작하기 →
        </Link>
      </section>

      <style>{`
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .about-contact-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        @media (max-width: 640px) {
          .about-values-grid { grid-template-columns: 1fr; }
          .about-team-grid { grid-template-columns: 1fr; }
          .about-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
