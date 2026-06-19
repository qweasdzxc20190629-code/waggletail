'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventItems as events } from '../events';

type Tab = 'all' | 'ongoing' | 'ended';

const PAGE_KEY = 'wt_event_page_v1';
const DEFAULT_CONFIG = {
  heroTitle: 'EVENT',
  heroSubtitle: '놓치면 아쉬운 이벤트와 혜택을 모아뒀어요.',
  heroBg: '#0041BD',
};

function loadConfig() {
  try {
    const saved = sessionStorage.getItem(PAGE_KEY);
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch { /* noop */ }
  return DEFAULT_CONFIG;
}

export default function EventPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [draftBg, setDraftBg] = useState('');

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setConfig(loadConfig());
  }, []);

  const openEdit = () => {
    setDraftTitle(config.heroTitle);
    setDraftSubtitle(config.heroSubtitle);
    setDraftBg(config.heroBg);
    setShowEdit(true);
  };

  const saveEdit = () => {
    const next = { heroTitle: draftTitle, heroSubtitle: draftSubtitle, heroBg: draftBg };
    setConfig(next);
    try { sessionStorage.setItem(PAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
    setShowEdit(false);
  };

  const filtered = events.filter((e) => {
    if (tab === 'all') return true;
    return e.status === tab;
  });

  const BG_OPTIONS = [
    { label: '파랑', value: '#0041BD' },
    { label: '검정', value: '#111' },
    { label: '노랑', value: '#F5C400' },
    { label: '흰색', value: '#fff' },
    { label: '연회색', value: '#f4f6fb' },
  ];

  const ongoingCount = events.filter((e) => e.status === 'ongoing').length;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', minHeight: '100vh', background: '#fff' }}>

      {/* Page header */}
      <section style={{ padding: '72px 24px 0', textAlign: 'center', position: 'relative' }}>
        <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.18em', color: '#aaa', marginBottom: '14px', textTransform: 'uppercase' }}>Waggle Tail</p>
        <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 16px', color: '#111' }}>Event</h1>
        <p style={{ fontSize: '15px', color: '#888', fontWeight: 500, margin: 0 }}>{config.heroSubtitle}</p>
        {isAdmin && (
          <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
            <button onClick={openEdit} style={{ background: 'none', border: '1.5px solid #ddd', color: '#888', fontWeight: 700, fontSize: '13px', padding: '6px 14px', borderRadius: '999px', cursor: 'pointer' }}>✏️ 편집</button>
            <Link href="/admin/dashboard" style={{ background: '#111', border: '1.5px solid #111', color: '#fff', fontWeight: 700, fontSize: '13px', padding: '6px 14px', borderRadius: '999px', textDecoration: 'none' }}>+ 관리</Link>
          </div>
        )}
      </section>

      {/* Tab filter */}
      <div style={{ padding: '40px 24px 0', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {([
            { key: 'all', label: '전체' },
            { key: 'ongoing', label: '진행중' },
            { key: 'ended', label: '종료' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '9px 20px',
                fontWeight: 700,
                fontSize: '14px',
                background: tab === key ? '#111' : 'transparent',
                border: '1.5px solid',
                borderColor: tab === key ? '#111' : '#e0e0e0',
                borderRadius: '999px',
                cursor: 'pointer',
                color: tab === key ? '#fff' : '#888',
                transition: 'all .15s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {label}
              {key === 'ongoing' && (
                <span style={{
                  background: tab === key ? '#F5C400' : '#0041BD',
                  color: tab === key ? '#111' : '#fff',
                  fontSize: '11px', fontWeight: 800,
                  padding: '1px 7px', borderRadius: '999px',
                  lineHeight: '18px',
                }}>
                  {ongoingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 100px' }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '15px', padding: '80px 0', fontWeight: 500 }}>해당 이벤트가 없습니다.</p>
        ) : (
          <div className="event-grid">
            {filtered.map((ev) => (
              <Link
                key={ev.id}
                href={`/event/${ev.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                <div className="event-card" style={{ borderRadius: '20px', overflow: 'hidden', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>

                  {/* Image area — 16:9 */}
                  <div style={{
                    aspectRatio: '16/9',
                    position: 'relative',
                    overflow: 'hidden',
                    background: ev.bg,
                    flexShrink: 0,
                  }}>
                    {ev.image ? (
                      <img src={ev.image} alt={ev.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <span style={{
                          fontSize: '15px', fontWeight: 900, letterSpacing: '-0.01em',
                          color: ev.bg === '#F5C400' || ev.bg === '#f4f6fb' || ev.bg === '#e8edf5' ? '#111' : '#fff',
                          textAlign: 'center', lineHeight: 1.4, wordBreak: 'keep-all',
                          maxWidth: '80%',
                          opacity: 0.6,
                        }}>
                          {ev.title}
                        </span>
                      </div>
                    )}
                    {ev.status === 'ended' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '0.06em', opacity: 0.9 }}>종료된 이벤트</span>
                      </div>
                    )}
                    {/* Period badge top-left */}
                    <div style={{
                      position: 'absolute', top: '14px', left: '14px', zIndex: 2,
                      background: 'rgba(0,0,0,0.45)',
                      color: '#fff',
                      fontSize: '11px', fontWeight: 700,
                      padding: '4px 10px', borderRadius: '999px',
                      backdropFilter: 'blur(4px)',
                      letterSpacing: '0.02em',
                    }}>
                      {ev.badge}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                        background: ev.status === 'ongoing' ? 'rgba(0,65,189,.08)' : 'rgba(17,17,17,.06)',
                        color: ev.status === 'ongoing' ? '#0041BD' : '#aaa',
                        letterSpacing: '0.04em',
                      }}>
                        {ev.status === 'ongoing' ? '● 진행중' : '종료'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '19px', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.3, margin: 0, wordBreak: 'keep-all' }}>{ev.title}</h2>
                    <p style={{ fontSize: '14px', color: '#888', margin: 0, lineHeight: 1.6, wordBreak: 'keep-all', fontWeight: 400 }}>{ev.subtitle}</p>
                    <p style={{ fontSize: '12px', color: '#bbb', margin: '4px 0 0', fontWeight: 600 }}>
                      {ev.startDate}{ev.endDate ? ` – ${ev.endDate}` : ' ~'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {showEdit && (
        <div onClick={() => setShowEdit(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', border: '1.5px solid #eee', padding: '32px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>이벤트 페이지 편집</h2>
              <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>✕</button>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              부제목
              <input value={draftSubtitle} onChange={(e) => setDraftSubtitle(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEdit(false)} style={{ padding: '10px 20px', borderRadius: '999px', border: '1.5px solid #ddd', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>취소</button>
              <button onClick={saveEdit} style={{ padding: '10px 20px', borderRadius: '999px', border: 'none', background: '#111', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>저장</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .event-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        .event-card {
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .event-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.11) !important;
        }
        @media (max-width: 640px) {
          .event-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
