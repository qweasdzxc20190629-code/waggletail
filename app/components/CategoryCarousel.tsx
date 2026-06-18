'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getCategoriesAction, CategoryData } from '../categories-actions';

const CARD_W = 168;
const GAP = 16;
const SPEED = 50;
const ROLLING_MIN = 6;

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
          position: 'relative',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'transform .15s ease, box-shadow .15s ease',
          aspectRatio: '1',
        }}
      >
        <img
          src={cat.imageUrl}
          alt={cat.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'relative', marginTop: 'auto', padding: '12px 14px', color: '#fff' }}>
          <div className="wt-cat-en" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.75 }}>{cat.en}</div>
          <div className="wt-cat-name" style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em' }}>{cat.name}</div>
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

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dotIndex, setDotIndex] = useState(0);
  const [cats, setCats] = useState<CategoryData[]>([]);

  useEffect(() => {
    const load = () => getCategoriesAction().then(setCats);
    load();
    window.addEventListener('wtCategoriesChanged', load);
    return () => window.removeEventListener('wtCategoriesChanged', load);
  }, []);

  const useRolling = cats.length >= ROLLING_MIN;

  useEffect(() => {
    if (!useRolling || isHovered || cats.length === 0) return;
    let rafId: number;
    let last: number | null = null;
    const tick = (now: number) => {
      if (last !== null) {
        const el = scrollRef.current;
        if (el) {
          const half = el.scrollWidth / 2;
          el.scrollLeft += SPEED * ((now - last) / 1000);
          if (el.scrollLeft >= half) el.scrollLeft -= half;
          setDotIndex(Math.floor(el.scrollLeft / (CARD_W + GAP)) % cats.length);
        }
      }
      last = now;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, useRolling, cats.length]);

  if (!useRolling) {
    return (
      <div style={{ display: 'flex', gap: `${GAP}px`, flexWrap: 'wrap' }}>
        {cats.map((cat) => <CatCard key={cat.name} cat={cat} />)}
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div ref={scrollRef} style={{ display: 'flex', gap: `${GAP}px`, overflow: 'hidden', paddingBottom: '4px' }}>
        {[...cats, ...cats].map((cat, idx) => <CatCard key={idx} cat={cat} />)}
      </div>
      <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {cats.map((_, i) => (
          <div key={i} style={{
            width: i === dotIndex ? '20px' : '6px',
            height: '6px',
            borderRadius: '999px',
            background: i === dotIndex ? '#111' : 'rgba(17,17,17,.2)',
            transition: 'width 0.3s ease, background 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}
