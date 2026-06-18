'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, computeDisplayPrice } from '../../products';
import { savePendingOrder } from '../../lib/orders';
import { isWished, toggleWishlist } from '../../lib/wishlist';
import { addToCart } from '../../lib/cart';

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem('wt_user_id');
    if (uid) setWished(isWished(uid, product.id));
  }, [product.id]);
  const images = useMemo(() => [product.image, ...(product.additionalImages ?? [])].filter(Boolean), [product]);
  const [selectedImage, setSelectedImage] = useState(images[0] ?? '');
  const [tab, setTab] = useState<'detail' | 'shipping'>('detail');
  const [qty, setQty] = useState(1);

  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.optionGroups ?? []).map((g) => [g.id, g.values[0]]))
  );

  const selectedCombo = useMemo(() => {
    if (!product.optionGroups?.length) return null;
    const key = product.optionGroups.map((g) => selectedValues[g.id]).join('|');
    return product.optionCombinations?.find((c) => c.key === key) ?? null;
  }, [product, selectedValues]);

  const pricingInput = selectedCombo
    ? { originalPrice: selectedCombo.originalPrice, price: selectedCombo.salePrice, discountPrice: selectedCombo.discountPrice }
    : { originalPrice: product.originalPrice, price: product.price, discountPrice: product.discountPrice };

  const { basePrice, finalPrice, discountPercent } = computeDisplayPrice(pricingInput);
  const stock = selectedCombo?.stock;
  const soldOut = stock !== undefined && stock <= 0;
  const totalPrice = finalPrice * qty;

  const handleBuy = () => {
    if (soldOut) return;
    const userId = localStorage.getItem('wt_user_id');
    if (!userId) { router.push('/login'); return; }
    const optionLabel = product.optionGroups?.length
      ? product.optionGroups.map((g) => `${g.name}: ${selectedValues[g.id]}`).join(', ')
      : '';
    savePendingOrder({
      productId: product.id,
      productName: product.name,
      productImage: product.image ?? '',
      category: product.category,
      optionLabel,
      qty,
      unitPrice: finalPrice,
      totalPrice,
    });
    router.push('/checkout');
  };

  return (
    <>
      {/* ── 상단: 이미지 + 정보 ── */}
      <div className="pd-wrap">

        {/* 좌: 이미지 */}
        <div className="pd-left">
          <div style={{ background: '#f7f7f7', overflow: 'hidden', borderRadius: '4px', aspectRatio: '1', position: 'relative' }}>
            {selectedImage
              ? <img src={selectedImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '60px', opacity: 0.2 }}>📦</div>
            }
            {/* 하트 버튼 */}
            <button
              type="button"
              onClick={() => {
                const uid = localStorage.getItem('wt_user_id');
                if (!uid) { router.push('/login'); return; }
                const next = toggleWishlist(uid, {
                  productId: product.id,
                  productName: product.name,
                  productImage: product.image ?? '',
                  category: product.category,
                  price: finalPrice,
                  addedAt: '',
                });
                setWished(next);
                window.dispatchEvent(new Event('wtWishChanged'));
              }}
              style={{
                position: 'absolute', top: '12px', right: '12px',
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.88)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                backdropFilter: 'blur(4px)',
                transition: 'transform .15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? '#ff4d6d' : 'none'} stroke={wished ? '#ff4d6d' : '#555'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  style={{
                    width: '68px', height: '68px', padding: 0, cursor: 'pointer', background: 'none',
                    border: selectedImage === src ? '2px solid #111' : '2px solid #e0e0e0',
                    borderRadius: '4px', overflow: 'hidden', flexShrink: 0,
                  }}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우: 상품 정보 */}
        <div className="pd-right">

          {/* 상품명 블록 */}
          <span style={{ display: 'inline-block', background: '#F5C400', color: '#fff', fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', padding: '4px 10px', borderRadius: '0px', marginBottom: '12px', fontFamily: 'var(--font-montserrat), sans-serif' }}>BEST</span>
          <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.4, margin: '0 0 10px', letterSpacing: '-0.01em', fontFamily: "'Pretendard', sans-serif", color: '#3a3a3a' }}>{product.name}</h1>
          {product.desc && <p style={{ fontSize: '14px', color: '#999', margin: '0 0 24px', lineHeight: 1.7 }}>{product.desc}</p>}

          {/* 가격 */}
          <div style={{ background: '#f8f8f8', borderRadius: '10px', padding: '16px 18px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              {discountPercent > 0 && (
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#e8230a' }}>{discountPercent}%</span>
              )}
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#111', letterSpacing: '-0.02em' }}>{finalPrice.toLocaleString()}원</span>
              {basePrice > finalPrice && (
                <span style={{ fontSize: '14px', color: '#bbb', textDecoration: 'line-through' }}>{basePrice.toLocaleString()}원</span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>
              배송비 {product.freeShipping ? '무료' : `${(product.shippingFee ?? 3000).toLocaleString()}원`}
              {product.shippingOrigin ? ` · 출고지 ${product.shippingOrigin}` : ''}
            </p>
          </div>

          {/* 옵션 선택 */}
          {product.optionGroups && product.optionGroups.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {product.optionGroups.map((group) => (
                <div key={group.id}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#555', letterSpacing: '0.02em' }}>
                    {group.name}
                  </label>
                  <select
                    value={selectedValues[group.id]}
                    onChange={(e) => setSelectedValues((prev) => ({ ...prev, [group.id]: e.target.value }))}
                    style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '11px 12px', fontSize: '14px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'auto' }}
                  >
                    {group.values.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              ))}
              {stock !== undefined && (
                <p style={{ fontSize: '13px', margin: 0, fontWeight: soldOut ? 700 : 400, color: soldOut ? '#e8230a' : '#888' }}>
                  {soldOut ? '선택한 옵션은 품절입니다.' : `재고 ${stock.toLocaleString()}개`}
                </p>
              )}
            </div>
          )}

          {/* 수량 + 총금액 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: '40px', height: '40px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'grid', placeItems: 'center' }}>−</button>
              <span style={{ width: '52px', textAlign: 'center', fontSize: '15px', fontWeight: 700, borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', height: '40px', lineHeight: '40px' }}>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}
                style={{ width: '40px', height: '40px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px', display: 'grid', placeItems: 'center' }}>+</button>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 2px' }}>총 상품금액</p>
              <p style={{ fontSize: '26px', fontWeight: 900, color: '#111', margin: 0, letterSpacing: '-0.02em' }}>{totalPrice.toLocaleString()}<span style={{ fontSize: '16px', fontWeight: 700 }}>원</span></p>
            </div>
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              disabled={soldOut}
              onClick={() => {
                const uid = localStorage.getItem('wt_user_id');
                if (!uid) { router.push('/login'); return; }
                const optionLabel = product.optionGroups?.length
                  ? product.optionGroups.map((g) => `${g.name}: ${selectedValues[g.id]}`).join(', ')
                  : '';
                addToCart(uid, { productId: product.id, productName: product.name, productImage: product.image ?? '', category: product.category, optionLabel, qty, unitPrice: finalPrice });
                window.dispatchEvent(new Event('wtCartChanged'));
                alert('장바구니에 담았습니다.');
              }}
              style={{ flex: 1, padding: '15px', border: 'none', borderRadius: '10px', background: soldOut ? '#eee' : '#0041BD', color: soldOut ? '#999' : '#fff', fontWeight: 700, fontSize: '15px', cursor: soldOut ? 'not-allowed' : 'pointer' }}
            >
              장바구니
            </button>
            <button
              type="button"
              onClick={handleBuy}
              disabled={soldOut}
              style={{ flex: 1, padding: '15px', border: 'none', borderRadius: '10px', background: soldOut ? '#ccc' : '#F5C400', color: soldOut ? '#fff' : '#111', fontWeight: 700, fontSize: '15px', cursor: soldOut ? 'not-allowed' : 'pointer' }}
            >
              {soldOut ? '품절' : '바로 구매'}
            </button>
          </div>

        </div>
      </div>

      {/* ── 하단: 탭 ── */}
      <div style={{ marginTop: '60px', borderTop: '2px solid #111' }}>
        <div style={{ display: 'flex' }}>
          {([['detail', '상품상세'], ['shipping', '배송/반품/교환']] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              style={{
                padding: '14px 28px', fontSize: '14px', fontWeight: tab === key ? 800 : 500,
                background: tab === key ? '#111' : '#fff', color: tab === key ? '#fff' : '#666',
                border: 'none', borderRight: '1px solid #e0e0e0', cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '48px 0', maxWidth: '860px' }}>
          {tab === 'detail' ? (
            <>
              {product.detailDescription && (
                <p style={{ fontSize: '15px', lineHeight: 2, color: '#333', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
                  {product.detailDescription}
                </p>
              )}
              {product.detailImages?.map((src, i) => (
                <img key={i} src={src} alt="" style={{ width: '100%', display: 'block', marginBottom: '8px' }} />
              ))}
              {!product.detailDescription && !product.detailImages?.length && (
                <p style={{ color: '#aaa', fontSize: '14px' }}>상세 설명이 없습니다.</p>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <ShipRow label="배송방법">택배배송</ShipRow>
              <ShipRow label="배송비">
                {product.freeShipping ? '무료배송' : `${(product.shippingFee ?? 3000).toLocaleString()}원 (일정 금액 이상 무료)`}
              </ShipRow>
              <ShipRow label="배송기간">{product.leadTime ?? '결제 후 1~3 영업일 이내 출고'}</ShipRow>
              <ShipRow label="출고지">{product.shippingOrigin ?? '정보 없음'}</ShipRow>
              <ShipRow label="반품/교환지">{product.returnAddress ?? '정보 없음'}</ShipRow>
              <ShipRow label="반품배송비">{product.returnShippingFee ? `${product.returnShippingFee.toLocaleString()}원 (왕복 부담)` : '정보 없음'}</ShipRow>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pd-wrap {
          display: grid;
          grid-template-columns: 46fr 54fr;
          gap: 52px;
          align-items: start;
        }
        .pd-right {
          position: sticky;
          top: 100px;
        }
        @media (max-width: 900px) {
          .pd-wrap { gap: 32px; }
          .pd-right { position: static; }
        }
        @media (max-width: 640px) {
          .pd-wrap { grid-template-columns: 1fr; gap: 20px; }
          .pd-right { position: static; }
        }
      `}</style>
    </>
  );
}


function ShipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', padding: '14px 0', borderBottom: '1px solid #f0f0f0', gap: '16px' }}>
      <span style={{ width: '100px', flexShrink: 0, fontSize: '13px', color: '#888', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '14px', color: '#333' }}>{children}</span>
    </div>
  );
}
