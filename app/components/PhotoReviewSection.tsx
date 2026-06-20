'use client';

import { useState, useEffect, useRef } from 'react';
import { Review, deleteReviewAction } from '../reviews-actions';
import ReviewFormModal from '../admin/dashboard/ReviewFormModal';

export default function PhotoReviewSection({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [formModal, setFormModal] = useState<{ open: boolean; review?: Review }>({ open: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    const handler = () => setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    window.addEventListener('isAdminChanged', handler);
    return () => window.removeEventListener('isAdminChanged', handler);
  }, []);

  useEffect(() => {
    // 모바일에서만 자동 롤링 — SSR 없이 클라이언트에서만 실행되므로 안전
    if (!window.matchMedia('(max-width: 768px)').matches) return;
    const container = scrollRef.current;
    if (!container) return;

    const onScroll = () => {
      const half = container.scrollWidth / 2;
      if (container.scrollLeft >= half) {
        container.scrollTo({ left: container.scrollLeft - half, behavior: 'instant' as ScrollBehavior });
      }
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    const cardWidth = (window.innerWidth - 56) / 1.5 + 12;
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }, 3000);

    return () => {
      clearInterval(interval);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('이 리뷰를 삭제하시겠습니까?')) return;
    const updated = await deleteReviewAction(id);
    setReviews(updated);
  };

  const handleSave = (updated: Review[]) => {
    setReviews(updated);
    setFormModal({ open: false });
  };

  // 모바일: 2배 복사로 seamless loop
  const displayReviews = [...reviews, ...reviews];

  const renderCard = (r: Review, key: string) => (
    <div key={key} className="wt-review-card" style={{ background: 'transparent', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'rgba(0,0,0,0.55)', position: 'relative', display: 'grid', placeItems: 'center' }}>
        {r.imageUrl
          ? <img src={r.imageUrl} alt={r.product} style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', objectFit: 'cover', borderRadius: '10px' }} />
          : <div style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)', display: 'grid', placeItems: 'center', fontSize: '40px', background: '#e8edf5', borderRadius: '10px' }}>📷</div>
        }
      </div>
      <div style={{ background: 'rgba(0,0,0,0.55)', textAlign: 'center', padding: '6px 0', fontSize: '13px', color: '#F5C400', letterSpacing: '-0.5px' }}>{'★'.repeat(r.star)}</div>
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.55)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>{r.avatar}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#fff' }}>{r.name}</p>
              {r.verified && <span style={{ fontSize: '9px', fontWeight: 700, background: '#0041BD', color: '#fff', padding: '2px 6px', borderRadius: '999px' }}>구매인증</span>}
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{r.breed} · {r.age}</p>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0 }}>{r.text}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 8px', borderRadius: '999px' }}>{r.product}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .wt-photo-section {
          background-image: url('https://i.imgur.com/aBxhGob.jpeg');
          background-size: 100% 100%;
          padding: 32px 0 24px;
        }
        .wt-photo-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
        }
        .wt-photo-header {
          margin-bottom: 16px;
        }
        .wt-photo-title {
          font-size: 24px;
        }
        .wt-photo-grid {
          display: flex;
          overflow-x: auto;
          gap: 12px;
          padding-bottom: 8px;
          -webkit-overflow-scrolling: touch;
          margin-left: -16px;
          margin-right: -16px;
          padding-left: 16px;
          padding-right: 16px;
          scrollbar-width: none;
        }
        .wt-photo-grid::-webkit-scrollbar { display: none; }
        .wt-review-card {
          flex: 0 0 calc((100vw - 56px) / 1.5);
          flex-shrink: 0;
        }
        @media (min-width: 769px) {
          .wt-photo-section {
            background-image: url('https://i.imgur.com/3aWj7X2.jpeg');
            padding: 64px 0;
            min-height: 717px;
          }
          .wt-photo-inner {
            padding-left: 24px;
            padding-right: 24px;
          }
          .wt-photo-header {
            margin-bottom: 32px;
          }
          .wt-photo-title {
            font-size: 38px;
          }
          .wt-photo-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            overflow-x: visible;
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
          }
          .wt-review-card {
            flex: none;
          }
        }
      `}</style>

      <section className="wt-photo-section">
        <div className="wt-photo-inner">
          <div className="wt-photo-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '10px', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>PHOTO REVIEW</p>
              <h2 className="wt-photo-title" style={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>우리 아이도 인정했어요 🐾</h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>실제 구매 고객의 솔직한 포토 후기예요.</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setPanelOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '8px', cursor: 'pointer', backdropFilter: 'blur(4px)', fontFamily: "'Pretendard', sans-serif" }}
              >
                ✏️ 리뷰 관리
              </button>
            )}
          </div>
          <div
            ref={scrollRef}
            className="wt-photo-grid"
            onTouchStart={() => { pausedRef.current = true; }}
            onTouchEnd={() => { setTimeout(() => { pausedRef.current = false; }, 2000); }}
          >
            {displayReviews.map((r, i) => renderCard(r, `${r.id ?? i}-${i}`))}
          </div>
        </div>
      </section>

      {/* 관리자 패널 모달 */}
      {panelOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '860px', padding: '28px', fontFamily: "'Pretendard', sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>포토리뷰 관리</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>메인 포토리뷰를 추가, 수정, 삭제할 수 있습니다.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setFormModal({ open: true })}
                  style={{ padding: '8px 18px', fontSize: '13px', fontWeight: 700, background: '#0041BD', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}
                >
                  + 새 리뷰 추가
                </button>
                <button onClick={() => setPanelOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>✕</button>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: '#bbb', textAlign: 'center', padding: '60px 0', fontSize: '14px' }}>등록된 리뷰가 없습니다.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                {reviews.map((r) => (
                  <div key={r.id} style={{ border: '1px solid #ebebeb', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {r.imageUrl
                      ? <img src={r.imageUrl} alt={r.name} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', aspectRatio: '4/3', background: '#f5f5f5', display: 'grid', placeItems: 'center', fontSize: '36px' }}>📷</div>
                    }
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '18px' }}>{r.avatar}</span>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{r.name}</p>
                        <span style={{ fontSize: '12px', color: '#F5A623', marginLeft: 'auto' }}>{'★'.repeat(r.star)}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.text}</p>
                      <span style={{ fontSize: '11px', color: '#0041BD', fontWeight: 700 }}>{r.product}</span>
                      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '8px' }}>
                        <button onClick={() => setFormModal({ open: true, review: r })} style={{ flex: 1, padding: '7px', fontSize: '12px', fontWeight: 700, border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>수정</button>
                        <button onClick={() => handleDelete(r.id)} style={{ flex: 1, padding: '7px', fontSize: '12px', fontWeight: 700, border: '1px solid #ffcdd2', borderRadius: '6px', background: '#fff5f5', color: '#e53935', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {formModal.open && (
        <ReviewFormModal
          review={formModal.review}
          onClose={() => setFormModal({ open: false })}
          onSave={handleSave}
        />
      )}
    </>
  );
}
