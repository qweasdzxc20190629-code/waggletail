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

const CARD_W = 168;
const GAP = 16;
const SPEED = 50; // px/s

export default function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dotIndex, setDotIndex] = useState(0);

  // Continuous one-direction scroll via RAF
  useEffect(() => {
    if (isHovered) return;

    let rafId: number;
    let last: number | null = null;

    const tick = (now: number) => {
      if (last !== null) {
        const el = scrollRef.current;
        if (el) {
          const half = el.scrollWidth / 2;
          el.scrollLeft += SPEED * ((now - last) / 1000);
          // Seamless loop: when we've scrolled through the first copy, jump back
          if (el.scrollLeft >= half) {
            el.scrollLeft -= half;
          }
          const idx = Math.floor(el.scrollLeft / (CARD_W + GAP)) % categories.length;
          setDotIndex(idx);
        }
      }
      last = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: `${GAP}px`,
          overflow: 'hidden',
          paddingBottom: '4px',
        }}
      >
        {[...categories, ...categories].map((cat, idx) => (
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
              flex: `0 0 ${CARD_W}px`,
              width: `${CARD_W}px`,
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

      {/* Dot indicator */}
      <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {categories.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === dotIndex ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === dotIndex ? '#111' : 'rgba(17,17,17,.2)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
