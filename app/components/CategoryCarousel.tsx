'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getCategoriesAction, CategoryData } from '../categories-actions';

const CARD_W = 168;
const GAP = 16;
const SPEED = 50; // px/s

function CatCard({ cat }: { cat: CategoryData }) {
  if (cat.imageUrl) {
    return (
      <Link
        href={`/category/${encodeURIComponent(cat.name)}`}
        className="wt-cat-card"
        style={{
          border: cat.border ? '2.5px solid #111' : 'none',
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'transform .15s ease, box-shadow .15s ease',
          background: '#fff',
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '1', width: '100%', flexShrink: 0 }}>
          <img
            src={cat.imageUrl}
            alt={cat.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ padding: '10px 12px 12px', background: '#fff' }}>
          <div className="wt-cat-en" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Category</div>
          <div className="wt-cat-name" style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111', lineHeight: 1.2 }}>{cat.name}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${encodeURIComponent(cat.name)}`}
      className="wt-cat-card"
      style={{
        border: cat.border ? '2.5px solid #111' : 'none',
        borderRadius: '18px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'space-between',
        background: cat.bg,
        color: cat.textColor,
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform .15s ease, box-shadow .15s ease',
        aspectRatio: '1',
      }}
    >
      <div className="wt-cat-emoji" style={{ fontSize: '52px' }}>{cat.emoji}</div>
      <div>
        <div className="wt-cat-en" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>{cat.en}</div>
        <div className="wt-cat-name" style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em' }}>{cat.name}</div>
      </div>
    </Link>
  );
}

export default function CategoryCarousel({ initialCats = [] }: { initialCats?: CategoryData[] }) {
  const [cats, setCats] = useState<CategoryData[]>(initialCats);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const load = () => getCategoriesAction().then(setCats);
    if (initialCats.length === 0) load();
    window.addEventListener('wtCategoriesChanged', load);
    return () => window.removeEventListener('wtCategoriesChanged', load);
  }, []);

  useEffect(() => {
    if (cats.length === 0) return;
    const oneSetPx = cats.length * (CARD_W + GAP);
    let last: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (last !== null && !pausedRef.current) {
        posRef.current += SPEED * ((now - last) / 1000);
        if (posRef.current >= oneSetPx) posRef.current -= oneSetPx;
        if (innerRef.current) {
          innerRef.current.style.transform = `translateX(-${posRef.current}px)`;
        }
      }
      last = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cats.length]);

  if (cats.length === 0) return null;

  const repeated = [...cats, ...cats];

  return (
    <div
      style={{ overflow: 'hidden', paddingBottom: '4px' }}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div ref={innerRef} style={{ display: 'flex', willChange: 'transform' }}>
        {repeated.map((cat, idx) => (
          <div key={idx} style={{ width: `${CARD_W}px`, marginRight: `${GAP}px`, flexShrink: 0 }}>
            <CatCard cat={cat} />
          </div>
        ))}
      </div>
    </div>
  );
}
