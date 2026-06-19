'use client';

import { useEffect, useState } from 'react';

export default function LikeButton({ productId, baseCount }: { productId: string; baseCount: number }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`like_${productId}`);
    if (stored === '1') setLiked(true);
  }, [productId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    localStorage.setItem(`like_${productId}`, next ? '1' : '0');
  };

  const count = baseCount + (liked ? 1 : 0);

  return (
    <button
      onClick={toggle}
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'rgba(255,255,255,0.88)',
        border: 'none',
        borderRadius: '999px',
        padding: '5px 9px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        backdropFilter: 'blur(4px)',
        fontSize: '12px',
        fontWeight: 700,
        color: '#ff4d6d',
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize: '14px' }}>❤️</span>
      {liked ? count : null}
    </button>
  );
}
