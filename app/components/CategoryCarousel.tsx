'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Category = {
  name: string;
  en: string;
  emoji: string;
  bg: string;
  textColor: string;
  border?: boolean;
};

const categories: Category[] = [
  { name: '베드', en: 'Bed', emoji: '🛏️', bg: '#fff', textColor: '#111', border: true },
  { name: '간식', en: 'Treats', emoji: '🍗', bg: '#0041BD', textColor: '#fff' },
  { name: '영양제', en: 'Supplements', emoji: '💊', bg: '#FFDC20', textColor: '#111' },
  { name: '산책용품', en: 'Walk Gear', emoji: '🐕', bg: '#fff', textColor: '#111', border: true },
  { name: '배변·위생', en: 'Hygiene', emoji: '🧻', bg: '#fff', textColor: '#111', border: true },
  { name: '의류', en: 'Apparel', emoji: '🧥', bg: '#fff', textColor: '#111', border: true },
  { name: '장난감', en: 'Toys', emoji: '🎾', bg: '#fff', textColor: '#111', border: true },
  { name: '목욕·미용', en: 'Bath & Grooming', emoji: '🛁', bg: '#fff', textColor: '#111', border: true },
];

const arrowButtonStyle = (visible: boolean): React.CSSProperties => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  border: '2px solid #111',
  background: '#fff',
  display: visible ? 'grid' : 'none',
  placeItems: 'center',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 900,
  boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
  zIndex: 1,
});

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);

  // A plain vertical mouse wheel has nothing to scroll here (overflow-y is hidden), so by
  // default it just scrolls the page and the row looks "stuck". Redirect vertical wheel
  // input into horizontal scroll, but only when the row actually has somewhere to go —
  // otherwise we'd swallow the page scroll for no reason once the carousel is exhausted.
  //
  // This has to be a native addEventListener with { passive: false }, not a JSX onWheel
  // prop: React (17+) registers its own root-level wheel listener as passive for
  // performance, which means event.preventDefault() inside an onWheel handler is silently
  // ignored — the page scrolls anyway. Attaching directly to the element sidesteps that.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (event: globalThis.WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return; // already horizontal (trackpad/shift+wheel) — let it through natively

      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return; // nothing left to scroll this way — fall back to page scroll

      event.preventDefault();
      el.scrollBy({ left: event.deltaY, behavior: 'auto' });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.wt-cat-card');
    const step = (card?.offsetWidth ?? 168) + 16; // card width + gap
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="이전 카테고리"
        onClick={() => scrollByCard(-1)}
        style={{ ...arrowButtonStyle(canScrollLeft), left: '-4px' }}
      >
        ‹
      </button>
      <div
        ref={scrollRef}
        className="wt-grid-cat"
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '4px',
        }}
      >
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={`/category/${encodeURIComponent(cat.name)}`}
            className="wt-cat-card"
            style={{
              border: cat.border ? '2.5px solid #111' : 'none',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              minHeight: '130px',
              justifyContent: 'space-between',
              background: cat.bg,
              color: cat.textColor,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'transform .15s ease, box-shadow .15s ease',
              flex: '0 0 auto',
              width: '168px',
              scrollSnapAlign: 'start',
            }}
          >
            <div className="wt-cat-emoji" style={{ fontSize: '52px' }}>{cat.emoji}</div>
            <div>
              <div className="wt-cat-en" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>{cat.en}</div>
              <div className="wt-cat-name" style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em' }}>{cat.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label="다음 카테고리"
        onClick={() => scrollByCard(1)}
        style={{ ...arrowButtonStyle(canScrollRight), right: '-4px' }}
      >
        ›
      </button>
    </div>
  );
}
