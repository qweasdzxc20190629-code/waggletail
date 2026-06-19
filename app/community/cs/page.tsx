'use client';

import { useState } from 'react';
import Link from 'next/link';

const SUB_NAV = [
  { label: 'Community', href: '/community' },
  { label: 'Notice', href: '/community/notice' },
  { label: 'Review', href: '/community/review' },
  { label: 'Membership', href: '/community/membership' },
  { label: 'CS Center', href: '/community/cs' },
];

type FaqTab = '주문/결제' | '배송' | '교환/반품' | '회원/계정' | '정기배송';

const FAQS: Record<FaqTab, { q: string; a: string }[]> = {
  '주문/결제': [
    { q: '주문 취소는 언제까지 가능한가요?', a: '출고 처리 전까지 마이페이지 > 주문내역에서 직접 취소 가능합니다. 출고 후에는 고객센터로 문의해 주세요.' },
    { q: '사용 가능한 결제 수단은 어떻게 되나요?', a: '신용카드, 체크카드, 네이버페이, 카카오페이, 토스페이, 무통장입금을 지원합니다.' },
    { q: '영수증/세금계산서 발행이 가능한가요?', a: '결제 완료 후 마이페이지에서 현금영수증 신청이 가능합니다. 세금계산서는 고객센터로 문의해 주세요.' },
    { q: '쿠폰과 포인트를 동시에 사용할 수 있나요?', a: '쿠폰과 포인트는 동시에 사용 가능합니다. 단, 일부 이벤트 쿠폰은 중복 적용이 제한될 수 있습니다.' },
  ],
  '배송': [
    { q: '배송은 얼마나 걸리나요?', a: '결제 확인 후 평균 1–3 영업일 이내 출고됩니다. 도서산간 지역은 추가 일정이 소요될 수 있습니다.' },
    { q: '배송비는 얼마인가요?', a: '3만원 이상 구매 시 무료배송입니다. 미만 시 배송비 3,000원이 부과됩니다. 골드·VIP 등급은 전 상품 무료배송입니다.' },
    { q: '배송 조회는 어디서 하나요?', a: '마이페이지 > 주문내역에서 운송장 번호를 확인하고 택배사 사이트에서 조회하실 수 있습니다.' },
    { q: '당일 출고가 가능한가요?', a: '오전 11시 이전 결제 확인 건에 한해 당일 출고를 진행합니다 (영업일 기준).' },
  ],
  '교환/반품': [
    { q: '교환/반품 신청은 어떻게 하나요?', a: '수령 후 7일 이내 마이페이지 > 주문내역 > 교환·반품 신청 버튼을 이용해 주세요.' },
    { q: '반품 배송비는 누가 부담하나요?', a: '단순 변심의 경우 왕복 배송비를 고객이 부담합니다. 상품 하자 또는 오배송의 경우 당사가 전액 부담합니다.' },
    { q: '반려동물이 사용한 제품도 반품 가능한가요?', a: '위생 상의 이유로 사용된 제품은 반품이 어렵습니다. 단, 상품 하자의 경우 사용 여부와 관계없이 처리 가능합니다.' },
    { q: '환불은 언제 이뤄지나요?', a: '반품 상품 수거 확인 후 영업일 기준 3–5일 이내 환불 처리됩니다.' },
  ],
  '회원/계정': [
    { q: '비밀번호를 잊어버렸어요.', a: '로그인 페이지 > 비밀번호 찾기를 이용해 주세요. 가입 이메일로 재설정 링크를 발송합니다.' },
    { q: '회원 탈퇴는 어떻게 하나요?', a: '마이페이지 > 계정 설정 > 회원 탈퇴에서 신청 가능합니다. 탈퇴 후 포인트 및 쿠폰은 모두 소멸됩니다.' },
    { q: '개인정보 수정은 어디서 하나요?', a: '마이페이지 > 개인정보 수정에서 이름, 연락처, 배송지 등을 변경하실 수 있습니다.' },
    { q: '이메일이 변경됐는데 로그인이 안 돼요.', a: '고객센터로 문의해 주시면 본인 확인 후 이메일 변경을 도와드립니다.' },
  ],
  '정기배송': [
    { q: '정기배송 신청은 어떻게 하나요?', a: '원하는 상품 페이지에서 정기배송 옵션을 선택하고 배송 주기(2·4·6주)를 설정하면 됩니다.' },
    { q: '정기배송 중간에 건너뛸 수 있나요?', a: '마이페이지 > 정기배송 관리에서 특정 회차 건너뛰기가 가능합니다. 출고 3일 전까지 신청해 주세요.' },
    { q: '정기배송 해지 방법은?', a: '마이페이지 > 정기배송 관리에서 언제든 해지하실 수 있습니다. 위약금이나 해지 조건이 없습니다.' },
    { q: '정기배송 할인은 얼마나 되나요?', a: '주기에 따라 최대 15% 할인이 적용됩니다. 회원 등급 할인과 중복 적용 가능합니다.' },
  ],
};

const FAQ_TABS: FaqTab[] = ['주문/결제', '배송', '교환/반품', '회원/계정', '정기배송'];

export default function CSPage() {
  const [faqTab, setFaqTab] = useState<FaqTab>('주문/결제');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ category: '', title: '', content: '', email: '', name: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>

      {/* Sub nav */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SUB_NAV.map((n) => (
            <Link key={n.href} href={n.href} style={{
              padding: '14px 16px', fontSize: '13px', fontWeight: 700,
              color: n.href === '/community/cs' ? '#111' : '#aaa',
              borderBottom: n.href === '/community/cs' ? '2px solid #111' : '2px solid transparent',
              textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            }}>{n.label}</Link>
          ))}
        </div>
      </div>

      {/* Header */}
      <section style={{ padding: '48px 24px 0', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '8px' }}>COMMUNITY</p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>CS Center</h1>
        <p style={{ fontSize: '15px', color: '#888', margin: '0 0 40px' }}>무엇이든 도와드릴게요. 평일 10:00 – 18:00 운영합니다.</p>

        {/* Contact cards */}
        <div className="cs-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '56px' }}>
          {[
            { icon: '📞', label: '전화 상담', value: '1588-0000', sub: '평일 10:00 – 18:00', action: null },
            { icon: '✉️', label: '이메일 문의', value: 'hello@waggletail.kr', sub: '24시간 접수 · 1영업일 내 답변', action: null },
            { icon: '💬', label: '채팅 상담', value: '실시간 채팅', sub: '평일 10:00 – 17:00', action: '채팅 시작' },
          ].map((c) => (
            <div key={c.label} style={{ border: '1.5px solid #eee', borderRadius: '16px', padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '24px' }}>{c.icon}</span>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#aaa', letterSpacing: '0.06em' }}>{c.label}</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: 900, letterSpacing: '-0.01em' }}>{c.value}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#bbb', fontWeight: 500 }}>{c.sub}</p>
              {c.action && (
                <button style={{ marginTop: '8px', padding: '8px 0', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>{c.action}</button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f7f8fa', padding: '56px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 28px' }}>자주 묻는 질문</h2>

          {/* FAQ tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {FAQ_TABS.map((t) => (
              <button key={t} onClick={() => { setFaqTab(t); setOpenIdx(null); }} style={{
                padding: '7px 16px', fontSize: '13px', fontWeight: 700,
                border: '1.5px solid', borderColor: faqTab === t ? '#111' : '#e0e0e0',
                borderRadius: '999px', background: faqTab === t ? '#111' : '#fff',
                color: faqTab === t ? '#fff' : '#888', cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #eee' }}>
            {FAQS[faqTab].map((faq, i) => (
              <div key={i} style={{ borderBottom: i < FAQS[faqTab].length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111', lineHeight: 1.4 }}>Q. {faq.q}</span>
                  <span style={{ fontSize: '16px', color: '#aaa', flexShrink: 0, transition: 'transform .2s', transform: openIdx === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
                </button>
                {openIdx === i && (
                  <div style={{ padding: '0 20px 18px', display: 'flex', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0041BD', flexShrink: 0 }}>A.</span>
                    <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: 1.8, fontWeight: 400 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section style={{ padding: '64px 24px 80px', maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>1:1 문의하기</h2>
        <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 32px' }}>영업일 기준 1일 이내 이메일로 답변 드립니다.</p>

        {submitted ? (
          <div style={{ background: '#f0f7ff', border: '1.5px solid #0041BD', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '28px', margin: '0 0 12px' }}>✅</p>
            <h3 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '18px' }}>문의가 접수됐습니다</h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>영업일 기준 1일 이내 <strong>{form.email}</strong>으로 답변 드립니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                이름 *
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="홍길동"
                  style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                이메일 *
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              문의 유형 *
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                <option value="">선택해주세요</option>
                {['주문/결제', '배송', '교환/반품', '회원/계정', '정기배송', '제품 문의', '기타'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              제목 *
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="문의 제목을 입력해주세요"
                style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              내용 *
              <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="문의 내용을 자세히 입력해주세요." rows={6}
                style={{ padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.6 }} />
            </label>
            <button type="submit"
              style={{ padding: '14px', background: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em' }}>
              문의 제출하기
            </button>
          </form>
        )}
      </section>

      <style>{`
        @media (max-width: 640px) {
          .cs-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
