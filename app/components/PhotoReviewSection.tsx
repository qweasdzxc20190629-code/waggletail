'use client';

import { useState, useEffect } from 'react';
import { Review, deleteReviewAction, getReviewsAction } from '../reviews-actions';
import ReviewFormModal from '../admin/dashboard/ReviewFormModal';

export default function PhotoReviewSection({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isAdmin, setIsAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [formModal, setFormModal] = useState<{ open: boolean; review?: Review }>({ open: false });

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    const handler = () => setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    window.addEventListener('isAdminChanged', handler);
    return () => window.removeEventListener('isAdminChanged', handler);
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

  return (
    <>
      <section className="wt-review-section" style={{ backgroundImage: 'url(https://i.imgur.com/3aWj7X2.jpeg)', backgroundSize: '100% 100%', padding: '64px 0', minHeight: '717px' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="wt-review-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '10px', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>PHOTO REVIEW</p>
              <h2 style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>우리 아이도 인정했어요 🐾</h2>
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
          <div className="wt-review-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {reviews.map((r, i) => (
              <div key={r.id ?? i} style={{ background: 'transparent', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .wt-review-section {
              background-image: url(https://i.imgur.com/aBxhGob.jpeg) !important;
              background-size: 100% 100% !important;
              padding: 0 !important;
              display: flex !important;
              align-items: center !important;
            }
            .wt-review-header { margin-bottom: 16px !important; }
            .wt-review-grid {
              display: flex !important;
              overflow-x: auto !important;
              scroll-snap-type: x mandatory !important;
              gap: 12px !important;
              padding-bottom: 8px !important;
            }
          }
        `}</style>
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
