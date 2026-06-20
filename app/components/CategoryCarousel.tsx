'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getCategoriesAction, CategoryData } from '../categories-actions';

const GAP = 16;
const SPEED = 50;
const ROLLING_MIN = 1;

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dotIndex, setDotIndex] = useState(0);
  const [cats, setCats] = useState<CategoryData[]>(initialCats);
  const pausedRef = useRef(false);

  useEffect(() => {
    const load = () => getCategoriesAction().then(setCats);
    if (initialCats.length === 0) load();
    window.addEventListener('wtCategoriesChanged', load);
    return () => window.removeEventListener('wtCategoriesChanged', load);
  }, []);

  useEffect(() => {
    if (cats.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    // scrollWidth/2가 한 세트의 너비 — 카드 실제 크기와 무관하게 동작 (모바일 CSS 크기 변경에도 안전)
    const onScroll = () => {
      const half = container.scrollWidth / 2;
      if (container.scrollLeft >= half) {
        container.scrollTo({ left: container.scrollLeft - half, behavior: 'instant' as ScrollBehavior });
      }
      const cardW = container.scrollWidth / 2 / cats.length;
      setDotIndex(Math.floor(container.scrollLeft / cardW) % cats.length);
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    let last: number | null = null;
    let rafId: number;

    const tick = (now: number) => {
      if (last !== null && !pausedRef.current) {
        const half = container.scrollWidth / 2;
        container.scrollLeft += SPEED * ((now - last) / 1000);
        if (container.scrollLeft >= half) container.scrollLeft -= half;
      }
      last = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', onScroll);
    };
  }, [cats.length]);

  if (cats.length < ROLLING_MIN) return null;

  const repeated = [...cats, ...cats];

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onTouchStart={() => { pausedRef.current = true; }}
      onTouchEnd={() => { setTimeout(() => { pausedRef.current = false; }, 2000); }}
    >
      <div
        ref={scrollRef}
        className="wt-grid-cat"
        style={{ display: 'flex', gap: `${GAP}px`, overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}
      >
        {repeated.map((cat, idx) => <CatCard key={idx} cat={cat} />)}
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
