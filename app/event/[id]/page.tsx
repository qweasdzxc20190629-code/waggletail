'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { eventItems, EventItem } from '../../events';

export default function EventDetailPage() {
  const params = useParams();
  const [ev, setEv] = useState<EventItem | null | undefined>(undefined);

  useEffect(() => {
    const found = eventItems.find((e) => e.id === Number(params.id));
    setEv(found ?? null);
  }, [params.id]);

  if (ev === undefined) return null;
  if (ev === null) return (
    <div style={{ padding: '80px 24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <p style={{ fontSize: '20px', fontWeight: 700 }}>이벤트를 찾을 수 없습니다.</p>
      <Link href="/event" style={{ color: '#0041BD', fontWeight: 700 }}>← 이벤트 목록</Link>
    </div>
  );

  const isLight = ev.bg === '#fff' || ev.bg === '#f4f6fb' || ev.bg === '#e8edf5' || ev.bg === '#F5C400';
  const textOnBg = isLight ? '#111' : '#fff';
  const noticeLines = ev.notice.split('\n').filter(Boolean);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff' }}>

      {/* Hero */}
      <section style={{ background: ev.image ? '#000' : ev.bg, color: textOnBg, padding: '64px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        {ev.image && (
          <img src={ev.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 1 }} />
        )}
        {ev.image && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 0 }} />}
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ background: ev.accentColor, color: ev.accentColor === '#F5C400' ? '#111' : '#fff', fontSize: '12px', fontWeight: 900, padding: '4px 14px', borderRadius: '999px', letterSpacing: '0.04em' }}>
              {ev.badge}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, opacity: 0.6 }}>
              {ev.status === 'ongoing' ? '● 진행중' : '종료'}
            </span>
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 14px', wordBreak: 'keep-all' }}>{ev.title}</h1>
          <p style={{ fontSize: '18px', opacity: 0.8, margin: 0, lineHeight: 1.6, wordBreak: 'keep-all' }}>{ev.subtitle}</p>
          <p style={{ fontSize: '13px', opacity: 0.55, marginTop: '16px', fontWeight: 600 }}>
            {ev.startDate}{ev.endDate ? ` – ${ev.endDate}` : ' ~'}
          </p>
        </div>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', zIndex: 0 }} />
      </section>

      {/* Benefits */}
      {ev.benefits.length > 0 && (
        <section style={{ background: '#f6f7fb', padding: '48px 24px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', color: '#0041BD', marginBottom: '20px' }}>EVENT BENEFITS</h2>
            <div className="ev-benefits">
              {ev.benefits.map((b, i) => (
                <div key={i} style={{ background: '#fff', border: '2px solid #111', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '36px' }}>{b.icon}</div>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: 900, marginBottom: '4px' }}>{b.label}</div>
                    <div style={{ fontSize: '13px', color: '#666', wordBreak: 'keep-all' }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Detail images */}
      {ev.detailImages.length > 0 && (
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ev.detailImages.map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: '100%', borderRadius: '16px', border: '2px solid rgba(17,17,17,.08)' }} />
            ))}
          </div>
        </section>
      )}

      {/* Text sections */}
      <section style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {ev.sec1Title && (
            <div style={{ borderLeft: '4px solid #0041BD', paddingLeft: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.01em' }}>{ev.sec1Title}</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#444', margin: 0, whiteSpace: 'pre-line', wordBreak: 'keep-all' }}>{ev.sec1Body}</p>
            </div>
          )}
          {ev.sec2Title && (
            <div style={{ borderLeft: '4px solid #0041BD', paddingLeft: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '14px', letterSpacing: '-0.01em' }}>{ev.sec2Title}</h2>
              <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#444', margin: 0, whiteSpace: 'pre-line', wordBreak: 'keep-all' }}>{ev.sec2Body}</p>
            </div>
          )}
        </div>
      </section>

      {/* Notice */}
      {noticeLines.length > 0 && (
        <section style={{ padding: '0 24px 64px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto', background: '#f6f7fb', borderRadius: '16px', padding: '24px 28px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '14px', color: '#555' }}>유의사항</h3>
            <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {noticeLines.map((n, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#777', lineHeight: 1.6, wordBreak: 'keep-all' }}>{n}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      {ev.status === 'ongoing' && ev.ctaLabel && (
        <section style={{ background: ev.bg, padding: '56px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.1em', color: textOnBg, opacity: 0.6, marginBottom: '16px' }}>지금 바로 참여하세요</p>
          <Link
            href={ev.pageUrl || '/event'}
            style={{ display: 'inline-block', background: ev.accentColor, color: ev.accentColor === '#F5C400' ? '#111' : '#fff', fontWeight: 900, fontSize: '17px', padding: '16px 36px', borderRadius: '999px', border: '2.5px solid #111', textDecoration: 'none', boxShadow: '0 6px 0 #111' }}
          >
            {ev.ctaLabel}
          </Link>
        </section>
      )}

      {ev.status === 'ended' && (
        <section style={{ background: '#111', padding: '56px 24px', textAlign: 'center' }}>
          <p style={{ color: '#888', fontSize: '15px', marginBottom: '20px' }}>이 이벤트는 종료되었습니다.</p>
          <Link href="/event" style={{ display: 'inline-block', background: '#F5C400', color: '#111', fontWeight: 900, fontSize: '16px', padding: '14px 32px', borderRadius: '999px', border: '2.5px solid #fff', textDecoration: 'none' }}>
            진행중인 이벤트 보기
          </Link>
        </section>
      )}

      <style>{`
        .ev-benefits {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .ev-benefits { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>
    </div>
  );
}
