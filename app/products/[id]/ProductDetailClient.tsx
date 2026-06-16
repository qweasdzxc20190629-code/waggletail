'use client';

import { useMemo, useState } from 'react';
import { Product, computeDisplayPrice } from '../../products';

export default function ProductDetailClient({ product }: { product: Product }) {
  const images = useMemo(() => [product.image, ...(product.additionalImages ?? [])], [product]);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.optionGroups ?? []).map((group) => [group.id, group.values[0]]))
  );

  const selectedCombo = useMemo(() => {
    if (!product.optionGroups || product.optionGroups.length === 0) return null;
    const key = product.optionGroups.map((group) => selectedValues[group.id]).join('|');
    return product.optionCombinations?.find((combo) => combo.key === key) ?? null;
  }, [product, selectedValues]);

  const pricingInput = selectedCombo
    ? { originalPrice: selectedCombo.originalPrice, price: selectedCombo.salePrice, discountPrice: selectedCombo.discountPrice }
    : { originalPrice: product.originalPrice, price: product.price, discountPrice: product.discountPrice };
  const salePrice = pricingInput.price;
  const { basePrice, finalPrice, discountPercent } = computeDisplayPrice(pricingInput);

  const stock = selectedCombo ? selectedCombo.stock : undefined;
  const soldOut = stock !== undefined && stock <= 0;

  const handleBuy = () => {
    if (soldOut) return;
    const optionLabel = product.optionGroups?.length
      ? product.optionGroups.map((group) => `${group.name}: ${selectedValues[group.id]}`).join(', ')
      : '';
    window.alert(
      `${product.name}${optionLabel ? ` (${optionLabel})` : ''}\n${finalPrice.toLocaleString()}원에 구매되었습니다.\n(데모 환경이라 실제 결제는 진행되지 않습니다.)`
    );
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          <div style={{ background: '#f4f6fb', borderRadius: '24px', overflow: 'hidden', minHeight: '420px' }}>
            <img src={selectedImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
              {images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    border: selectedImage === src ? '3px solid #0041BD' : '2px solid rgba(0,0,0,0.12)',
                  }}
                >
                  <img src={src} alt={`썸네일 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em' }}>{product.category}</span>
          <div>
            <p style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 18px', lineHeight: 1.05 }}>{product.name}</p>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8, margin: 0 }}>{product.desc}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {basePrice > finalPrice && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '15px', color: '#999', textDecoration: 'line-through' }}>{basePrice.toLocaleString()}원</span>
                {discountPercent > 0 && <span style={{ fontSize: '18px', fontWeight: 900, color: '#ff4d6d' }}>{discountPercent}%</span>}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900 }}>{finalPrice.toLocaleString()}</span>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>원</span>
            </div>
            {pricingInput.discountPrice !== undefined && pricingInput.discountPrice < salePrice && (
              <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>판매가 {salePrice.toLocaleString()}원 → 할인가 적용</p>
            )}
          </div>

          {product.optionGroups && product.optionGroups.length > 0 && (
            <div style={{ display: 'grid', gap: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px' }}>옵션 선택</span>
              {product.optionGroups.map((group) => (
                <label key={group.id} style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
                  {group.name}
                  <select
                    value={selectedValues[group.id]}
                    onChange={(e) => setSelectedValues((prev) => ({ ...prev, [group.id]: e.target.value }))}
                    style={{ width: '100%', border: '2px solid #111', borderRadius: '12px', padding: '12px 14px', fontSize: '14px', outline: 'none' }}
                  >
                    {group.values.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </label>
              ))}
              {stock !== undefined && (
                <p style={{ fontSize: '13px', margin: 0, fontWeight: soldOut ? 800 : 500, color: soldOut ? '#d52b1e' : '#666' }}>
                  {soldOut ? '선택한 옵션은 품절입니다.' : `재고 ${stock.toLocaleString()}개`}
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleBuy}
              disabled={soldOut}
              style={{
                background: soldOut ? '#eee' : '#FFDC20',
                color: soldOut ? '#999' : '#111',
                border: '2px solid #111',
                borderRadius: '12px',
                padding: '16px 24px',
                fontWeight: 800,
                cursor: soldOut ? 'not-allowed' : 'pointer',
                fontSize: '16px',
              }}
            >
              {soldOut ? '품절' : '구매하기'}
            </button>
          </div>
        </div>
      </div>

      {(product.detailDescription || (product.detailImages && product.detailImages.length > 0)) && (
        <div style={{ marginTop: '72px', maxWidth: '760px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '24px' }}>상세설명</h2>
          {product.detailDescription && (
            <p style={{ fontSize: '16px', lineHeight: 1.9, color: '#333', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>{product.detailDescription}</p>
          )}
          {product.detailImages?.map((src, index) => (
            <img key={index} src={src} alt={`상세이미지 ${index + 1}`} style={{ width: '100%', display: 'block', marginBottom: '12px', borderRadius: '12px' }} />
          ))}
        </div>
      )}
    </>
  );
}
