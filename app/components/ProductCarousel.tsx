'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type ProductCarouselItem = {
  id: string;
  name: string;
  desc: string;
  category: string;
  image: string;
  basePrice: number;
  finalPrice: number;
  discountPercent: number;
};

const TRACK_W = 160;
const INTERVAL_MS = 2500;

export default function ProductCarousel({ products }: { products: ProductCarouselItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(TRACK_W);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const viewRatio = el.clientWidth / el.scrollWidth;
    const tw = Math.max(24, Math.round(viewRatio * TRACK_W));
    const max = el.scrollWidth - el.clientWidth;
    const tl = max > 0 ? Math.round((el.scrollLeft / max) * (TRACK_W - tw)) : 0;
    setThumbWidth(tw);
    setThumbLeft(tl);
  }, []);

  const advance = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : 280;
    const max = el.scrollWidth - el.clientWidth;
    if (el.scrollLeft + step >= max) {
      el.scrollLeft = 0;
    } else {
      el.scrollBy({ left: step, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateThumb();
    el.addEventListener('scroll', updateThumb, { passive: true });
    window.addEventListener('resize', updateThumb);
    return () => {
      el.removeEventListener('scroll', updateThumb);
      window.removeEventListener('resize', updateThumb);
    };
  }, [updateThumb]);

  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, advance]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        className="wt-prod-carousel"
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              flex: '0 0 auto',
              width: 'calc((100% - 60px) / 4)',
              minWidth: '180px',
              scrollSnapAlign: 'start',
            }}
          >
            <div
              className="wt-prod-card"
              style={{
                border: '2px solid rgba(17,17,17,.14)',
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
              }}
            >
              <div className="wt-prod-img" style={{ aspectRatio: '1', background: '#f4f6fb', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                {p.image ? (
                  <img src={p.image} alt={p.name} className="wt-prod-photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '40px', opacity: 0.3 }}>📦</span>
                )}
              </div>
              <div className="wt-prod-body" style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
                <p className="wt-prod-cat" style={{ fontSize: '12px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em' }}>{p.category}</p>
                <h3 className="wt-prod-name" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.34' }}>{p.name}</h3>
                <p className="wt-prod-desc" style={{ fontSize: '13px', color: '#666' }}>{p.desc}</p>
                <div className="wt-prod-price-row" style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  {p.discountPercent > 0 && (
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#ff4d6d' }}>{p.discountPercent}%</span>
                  )}
                  <span className="wt-prod-price" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                    {p.finalPrice.toLocaleString()}
                    <span className="wt-prod-won" style={{ fontSize: '14px', fontWeight: 800 }}>원</span>
                  </span>
                  {p.discountPercent > 0 && (
                    <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>{p.basePrice.toLocaleString()}원</span>
                  )}
                </div>
                <button className="wt-prod-btn" style={{
                  background: '#FFDC20',
                  border: '2px solid #111',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginTop: '8px',
                }}>
                  담기
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Scrollbar indicator */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: `${TRACK_W}px`,
          height: '4px',
          background: 'rgba(17,17,17,.12)',
          borderRadius: '999px',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: `${thumbLeft}px`,
            width: `${thumbWidth}px`,
            height: '100%',
            background: '#111',
            borderRadius: '999px',
            transition: 'left 0.4s ease',
          }} />
        </div>
      </div>
    </div>
  );
}
