'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPendingOrder, clearPendingOrder, PendingOrder } from '../lib/orders';
import { addOrderAction } from '../orders-actions';

declare global {
  interface Window {
    daum: {
      Postcode: new (opts: { oncomplete: (data: DaumPostcodeResult) => void; onclose?: () => void }) => { open: () => void };
    };
  }
}
type DaumPostcodeResult = { roadAddress: string; jibunAddress: string; zonecode: string };
type PayMethod = 'card' | 'kakao' | 'naver' | 'bank';

const shippingFee: number = 0;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [userId, setUserId] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [paying, setPaying] = useState(false);
  const detailRef = useRef<HTMLInputElement>(null);

  const [buyer, setBuyer] = useState({ name: '', phone: '' });
  const [addr, setAddr] = useState({
    name: '',
    phone: '',
    zonecode: '',
    address: '',
    detail: '',
    request: '문 앞에 놔주세요',
  });

  useEffect(() => {
    const role = localStorage.getItem('wt_role');
    const uid = localStorage.getItem('wt_user_id') ?? '';
    if (!role) { router.push('/login'); return; }
    const pending = getPendingOrder();
    if (!pending) { router.push('/products'); return; }
    setOrder(pending);
    setUserId(uid);
    setBuyer((prev) => ({ ...prev, name: uid }));
    // 카카오 우편번호 스크립트 로드
    if (!document.getElementById('daum-postcode-script')) {
      const script = document.createElement('script');
      script.id = 'daum-postcode-script';
      script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    }
    setMounted(true);
  }, [router]);

  const openPostcode = () => {
    if (!window.daum?.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddr((prev) => ({
          ...prev,
          zonecode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
          detail: '',
        }));
        setTimeout(() => detailRef.current?.focus(), 100);
      },
    }).open();
  };

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePay = async () => {
    if (!order || !userId) return;
    if (!buyer.name.trim()) { alert('구매자 이름을 입력해주세요.'); return; }
    if (!buyer.phone.trim()) { alert('구매자 휴대폰을 입력해주세요.'); return; }
    if (!addr.name.trim()) { alert('수령인 이름을 입력해주세요.'); return; }
    if (!addr.phone.trim()) { alert('수령인 휴대폰을 입력해주세요.'); return; }
    if (!addr.address.trim()) { alert('주소를 검색해주세요.'); return; }
    if (!addr.detail.trim()) { alert('상세주소를 입력해주세요.'); return; }
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(buyer.phone)) { alert('구매자 휴대폰 형식이 올바르지 않습니다.\n예: 010-1234-5678'); return; }
    if (!phoneRegex.test(addr.phone)) { alert('수령인 휴대폰 형식이 올바르지 않습니다.\n예: 010-1234-5678'); return; }
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1200));
    await addOrderAction(userId, {
      productId: order.productId,
      productName: order.productName,
      productImage: order.productImage,
      category: order.category,
      optionLabel: order.optionLabel,
      qty: order.qty,
      unitPrice: order.unitPrice,
      totalPrice: order.totalPrice + shippingFee,
      address: `${addr.address} ${addr.detail}`.trim(),
      buyerName: buyer.name,
      buyerPhone: buyer.phone,
      recipientName: addr.name,
      recipientPhone: addr.phone,
      request: addr.request,
    });
    clearPendingOrder();
    router.push('/checkout/complete');
  };

  if (!mounted || !order) return null;

  const total = order.totalPrice + shippingFee;

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '24px 16px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }} className="co-wrap">

        {/* 왼쪽 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* 배송지 */}
          <Section title="배송지">
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="구매자 이름" value={buyer.name} onChange={(v) => setBuyer((p) => ({ ...p, name: v }))} placeholder="이름" />
                <Field label="구매자 휴대폰" value={buyer.phone} onChange={(v) => setBuyer((p) => ({ ...p, phone: formatPhone(v) }))} placeholder="010-0000-0000" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="수령인 이름" value={addr.name} onChange={(v) => setAddr((p) => ({ ...p, name: v }))} placeholder="이름" />
                <Field label="수령인 휴대폰" value={addr.phone} onChange={(v) => setAddr((p) => ({ ...p, phone: formatPhone(v) }))} placeholder="010-0000-0000" />
              </div>
              {/* 주소 검색 */}
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>주소</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    readOnly
                    value={addr.zonecode}
                    placeholder="우편번호"
                    style={{ width: '110px', flexShrink: 0, padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: '#f9f9f9' }}
                  />
                  <button
                    type="button"
                    onClick={openPostcode}
                    style={{ padding: '10px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  readOnly
                  value={addr.address}
                  placeholder="도로명 주소 (위 버튼으로 검색)"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: '#f9f9f9', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>상세주소</p>
                <input
                  ref={detailRef}
                  type="text"
                  value={addr.detail}
                  onChange={(e) => setAddr((p) => ({ ...p, detail: e.target.value }))}
                  placeholder="동, 호수 등 상세 주소 입력"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>배송 요청사항</p>
                <select
                  value={addr.request}
                  onChange={(e) => setAddr((p) => ({ ...p, request: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                >
                  {['문 앞에 놔주세요', '경비실에 맡겨주세요', '택배함에 넣어주세요', '직접 받겠습니다'].map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          {/* 주문 상품 */}
          <Section title={`배송 1건`}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0', flexShrink: 0 }}>
                {order.productImage
                  ? <img src={order.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '28px' }}>📦</div>
                }
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4 }}>
                  {order.productName}{order.optionLabel ? ` — ${order.optionLabel}` : ''}
                </p>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>수량 {order.qty}개 · {shippingFee > 0 ? `배송비 ${shippingFee.toLocaleString()}원` : '무료배송'}</p>
                <p style={{ fontSize: '15px', fontWeight: 800 }}>{order.totalPrice.toLocaleString()}원</p>
              </div>
            </div>
          </Section>

          {/* 결제수단 */}
          <Section title="결제수단">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {([
                { id: 'card', label: '💳 신용/체크카드', available: true },
                { id: 'kakao', label: '카카오페이', available: false },
                { id: 'naver', label: '네이버페이', available: false },
                { id: 'bank', label: '🏦 계좌이체', available: true },
              ] as { id: PayMethod; label: string; available: boolean }[]).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={!m.available}
                  onClick={() => m.available && setPayMethod(m.id)}
                  style={{
                    padding: '14px',
                    border: payMethod === m.id ? '2px solid #111' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: !m.available ? '#f9f9f9' : payMethod === m.id ? '#111' : '#fff',
                    color: !m.available ? '#bbb' : payMethod === m.id ? '#fff' : '#111',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: m.available ? 'pointer' : 'not-allowed',
                    position: 'relative',
                  }}
                >
                  {m.label}
                  {!m.available && (
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 400, marginTop: '2px', color: '#bbb' }}>준비중</span>
                  )}
                </button>
              ))}
            </div>
            {payMethod === 'card' && (
              <div style={{ marginTop: '12px', padding: '14px', background: '#f8f8f8', borderRadius: '8px', fontSize: '13px', color: '#555' }}>
                결제 시 등록된 카드로 자동 결제됩니다. (데모)
              </div>
            )}
            {payMethod === 'bank' && (
              <div style={{ marginTop: '12px', padding: '14px', background: '#f8f8f8', borderRadius: '8px', fontSize: '13px', color: '#555' }}>
                입금 확인 후 배송이 시작됩니다. (데모)
              </div>
            )}
          </Section>
        </div>

        {/* 오른쪽 — 결제 요약 */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>최종 결제 금액</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <SumRow label="총 상품 가격" value={`${order.totalPrice.toLocaleString()}원`} />
              <SumRow label="배송비" value={shippingFee > 0 ? `${shippingFee.toLocaleString()}원` : '0원'} />
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700 }}>총 결제 금액</span>
              <span style={{ fontSize: '22px', fontWeight: 900 }}>{total.toLocaleString()}<span style={{ fontSize: '14px' }}>원</span></span>
            </div>

            <p style={{ fontSize: '11px', color: '#999', lineHeight: 1.6, marginBottom: '16px' }}>
              위 주문 내용을 확인하였으며, 개인정보 이용 및 결제에 동의합니다.
            </p>

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              style={{
                width: '100%',
                padding: '16px',
                background: paying ? '#555' : '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: paying ? 'not-allowed' : 'pointer',
                transition: 'background .15s',
              }}
            >
              {paying ? '결제 처리 중...' : `${total.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .co-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '6px' }}>{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
