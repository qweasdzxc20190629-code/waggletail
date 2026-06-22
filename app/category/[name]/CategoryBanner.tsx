'use client';
import { useState } from 'react';

interface Props {
  mobile: string;
  pc: string;
  overlay?: { tag: string; title: string; desc: string } | null;
}

export default function CategoryBanner({ mobile, pc, overlay }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', lineHeight: 0 }}>
      <picture>
        <source media="(min-width: 769px)" srcSet={pc} />
        <img
          src={mobile}
          alt=""
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', display: 'block', height: 'auto' }}
        />
      </picture>
      {loaded && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)', pointerEvents: 'none' }} />
          {overlay && (
            <div className="cat-banner-overlay" style={{ position: 'absolute', lineHeight: 'normal' }}>
              <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.1em', fontFamily: "'Pretendard', sans-serif", textTransform: 'uppercase' }}>{overlay.tag}</p>
              <h2 className="cat-banner-title" style={{ margin: '0 0 10px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, fontFamily: "'Pretendard', sans-serif", textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{overlay.title}</h2>
              <p className="cat-banner-desc" style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontFamily: "'Pretendard', sans-serif", fontWeight: 400, lineHeight: 1.6 }}>{overlay.desc}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
