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

  // draft state for modal
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
    { label: '노랑', value: '#FFDC20' },
    { label: '흰색', value: '#fff' },
    { label: '연회색', value: '#f4f6fb' },
  ];

  const textOnBg = config.heroBg === '#FFDC20' || config.heroBg === '#fff' || config.heroBg === '#f4f6fb' ? '#111' : '#fff';

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', minHeight: '100vh', background: '#fff' }}>

      {/* Hero banner */}
      <section style={{ background: config.heroBg, color: textOnBg, padding: '56px 24px 48px', position: 'relative' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', marginBottom: '12px', color: '#FFDC20', opacity: textOnBg === '#111' ? 0.7 : 1 }}>WAGGLE TAIL</p>
          <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 12px' }}>{config.heroTitle}</h1>
          <p style={{ fontSize: '16px', opacity: 0.8, margin: 0 }}>{config.heroSubtitle}</p>
        </div>
        {isAdmin && (
          <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button
              onClick={openEdit}
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', color: textOnBg, fontWeight: 700, fontSize: '13px', padding: '6px 14px', borderRadius: '999px', cursor: 'pointer', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}
            >
              ✏️ 페이지 편집
            </button>
            <Link
              href="/admin/dashboard"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', color: textOnBg, fontWeight: 700, fontSize: '13px', padding: '6px 14px', borderRadius: '999px', textDecoration: 'none', backdropFilter: 'blur(4px)', whiteSpace: 'nowrap' }}
            >
              + 이벤트 관리
            </Link>
          </div>
        )}
      </section>

      {/* Tab filter */}
      <div style={{ borderBottom: '2px solid #111', background: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0' }}>
          {([
            { key: 'all', label: '전체' },
            { key: 'ongoing', label: '진행중인 이벤트' },
            { key: 'ended', label: '종료된 이벤트' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '16px 22px',
                fontWeight: 800,
                fontSize: '14px',
                background: 'none',
                border: 'none',
                borderBottom: tab === key ? '3px solid #111' : '3px solid transparent',
                cursor: 'pointer',
                color: tab === key ? '#111' : '#888',
                marginBottom: '-2px',
                transition: 'color .15s',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
              {key === 'ongoing' && (
                <span style={{ marginLeft: '6px', background: '#0041BD', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                  {events.filter((e) => e.status === 'ongoing').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 24px 80px' }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '16px', padding: '60px 0' }}>해당 이벤트가 없습니다.</p>
        ) : (
          <div className="event-grid">
            {filtered.map((ev) => (
              <Link
                key={ev.id}
                href={`/event/${ev.id}`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
              >
                <div className="event-card" style={{ border: '2.5px solid #111', borderRadius: '20px', overflow: 'hidden', background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}>

                  {/* Banner image area */}
                  <div style={{
                    background: ev.bg,
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    gap: '8px',
                    padding: '24px',
                  }}>
                    {ev.status === 'ended' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: '18px', letterSpacing: '0.08em', border: '2px solid rgba(255,255,255,0.6)', padding: '8px 20px', borderRadius: '999px' }}>종료된 이벤트</span>
                      </div>
                    )}
                    {ev.image && (
                      <img src={ev.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                    )}
                    <div className="event-badge" style={{ position: 'relative', zIndex: 2,
                      background: ev.accentColor,
                      color: ev.accentColor === '#FFDC20' ? '#111' : '#fff',
                      fontWeight: 900, fontSize: '13px', padding: '5px 14px',
                      borderRadius: '999px', border: '2px solid rgba(0,0,0,0.15)',
                      letterSpacing: '0.04em', whiteSpace: 'nowrap',
                    }}>
                      {ev.badge}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="event-body" style={{ padding: '20px 22px 22px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                        background: ev.status === 'ongoing' ? 'rgba(0,65,189,.1)' : 'rgba(17,17,17,.08)',
                        color: ev.status === 'ongoing' ? '#0041BD' : '#888',
                        letterSpacing: '0.04em',
                      }}>
                        {ev.status === 'ongoing' ? '● 진행중' : '종료'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.3, margin: '0 0 6px', wordBreak: 'keep-all' }}>{ev.title}</h2>
                    <p className="event-sub" style={{ fontSize: '14px', color: '#666', margin: '0 0 14px', lineHeight: 1.5, wordBreak: 'keep-all' }}>{ev.subtitle}</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0, fontWeight: 600, whiteSpace: 'nowrap' }}>
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
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', border: '2.5px solid #111', padding: '32px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0 }}>이벤트 페이지 편집</h2>
              <button onClick={() => setShowEdit(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>✕</button>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              히어로 제목
              <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} style={{ padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '15px', fontWeight: 900, outline: 'none' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              히어로 부제목
              <input value={draftSubtitle} onChange={(e) => setDraftSubtitle(e.target.value)} style={{ padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              배경색
              <select value={draftBg} onChange={(e) => setDraftBg(e.target.value)} style={{ padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none' }}>
                {BG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>

            {/* Preview */}
            <div style={{ background: draftBg, borderRadius: '12px', padding: '20px 22px', color: draftBg === '#FFDC20' || draftBg === '#fff' || draftBg === '#f4f6fb' ? '#111' : '#fff' }}>
              <p style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '6px', color: '#FFDC20', opacity: 0.8 }}>WAGGLE TAIL</p>
              <p style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 6px' }}>{draftTitle || 'EVENT'}</p>
              <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>{draftSubtitle}</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEdit(false)} style={{ padding: '10px 20px', borderRadius: '999px', border: '2px solid #ddd', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>취소</button>
              <button onClick={saveEdit} style={{ padding: '10px 20px', borderRadius: '999px', border: '2px solid #111', background: '#111', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>저장</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .event-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .event-card {
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 0 rgba(17,17,17,.1);
        }
        @media (max-width: 640px) {
          .event-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .event-badge { font-size: 10px !important; padding: 3px 8px !important; }
          .event-body { padding: 10px 10px 12px !important; }
          .event-body h2 { font-size: 13px !important; margin-bottom: 4px !important; }
          .event-sub { display: none !important; }
          .event-body p { font-size: 10px !important; }
        }
      `}</style>
    </div>
  );
}
