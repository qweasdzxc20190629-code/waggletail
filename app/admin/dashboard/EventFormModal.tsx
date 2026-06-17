'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { EventBenefit, EventItem } from '../../events';
import {
  dangerButtonStyle,
  fieldLabelStyle,
  ghostButtonStyle,
  inputStyle,
  modalCardStyle,
  modalOverlayStyle,
  primaryButtonStyle,
  sectionStyle,
  sectionTitleStyle,
  textareaStyle,
} from './styles';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const BG_OPTIONS = [
  { label: '파랑', value: '#0041BD' },
  { label: '노랑', value: '#FFDC20' },
  { label: '검정', value: '#111' },
  { label: '흰색', value: '#fff' },
  { label: '연회색', value: '#f4f6fb' },
  { label: '회색', value: '#e8edf5' },
];

const ACCENT_OPTIONS = [
  { label: '노랑', value: '#FFDC20' },
  { label: '파랑', value: '#0041BD' },
  { label: '빨강', value: '#ff4d6d' },
  { label: '검정', value: '#111' },
];

const EMPTY_BENEFIT: EventBenefit = { icon: '', label: '', desc: '' };

type Props = {
  event: EventItem | null;
  onClose: () => void;
  onSave: (ev: Omit<EventItem, 'id'>) => void;
};

export default function EventFormModal({ event, onClose, onSave }: Props) {
  // Basic fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [status, setStatus] = useState<'ongoing' | 'ended'>('ongoing');
  const [badge, setBadge] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bg, setBg] = useState('#0041BD');
  const [accentColor, setAccentColor] = useState('#FFDC20');
  const [image, setImage] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  // Content fields
  const [sec1Title, setSec1Title] = useState('이벤트 안내');
  const [sec1Body, setSec1Body] = useState('');
  const [sec2Title, setSec2Title] = useState('참여 방법');
  const [sec2Body, setSec2Body] = useState('');
  const [benefits, setBenefits] = useState<EventBenefit[]>([
    { ...EMPTY_BENEFIT },
    { ...EMPTY_BENEFIT },
    { ...EMPTY_BENEFIT },
  ]);
  const [notice, setNotice] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [detailImages, setDetailImages] = useState<string[]>([]);

  const [imageError, setImageError] = useState('');
  const [detailImageError, setDetailImageError] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setSubtitle(event.subtitle);
      setStatus(event.status);
      setBadge(event.badge);
      setStartDate(event.startDate);
      setEndDate(event.endDate ?? '');
      setBg(event.bg);
      setAccentColor(event.accentColor);
      setImage(event.image);
      setPageUrl(event.pageUrl);
      setSec1Title(event.sec1Title || '이벤트 안내');
      setSec1Body(event.sec1Body || '');
      setSec2Title(event.sec2Title || '참여 방법');
      setSec2Body(event.sec2Body || '');
      const filled = event.benefits.slice(0, 3);
      while (filled.length < 3) filled.push({ ...EMPTY_BENEFIT });
      setBenefits(filled);
      setNotice(event.notice || '');
      setCtaLabel(event.ctaLabel || '');
      setDetailImages(event.detailImages || []);
    }
  }, [event]);

  const readImage = (file: File, onLoad: (b64: string) => void, onError: (msg: string) => void) => {
    if (file.size > MAX_IMAGE_SIZE) { onError('이미지는 2MB 이하여야 합니다.'); return; }
    const reader = new FileReader();
    reader.onload = () => { onLoad(reader.result as string); };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readImage(file, (b64) => { setImage(b64); setImageError(''); }, setImageError);
  };

  const handleDetailImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readImage(file, (b64) => { setDetailImages((prev) => [...prev, b64]); setDetailImageError(''); }, setDetailImageError);
    e.target.value = '';
  };

  const setBenefit = (idx: number, field: keyof EventBenefit, value: string) => {
    setBenefits((prev) => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    onSave({
      title, subtitle, status, badge, startDate,
      endDate: endDate || null,
      bg, accentColor, image, pageUrl,
      sec1Title, sec1Body, sec2Title, sec2Body,
      benefits: benefits.filter((b) => b.label),
      notice, ctaLabel, detailImages,
    });
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 900, margin: 0 }}>
            {event ? '이벤트 수정' : '새 이벤트 추가'}
          </h2>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>

          {/* ── 썸네일 이미지 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>썸네일 이미지</p>
            {image && (
              <div style={{ position: 'relative' }}>
                <img src={image} alt="썸네일" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px', border: '2px solid rgba(17,17,17,.1)' }} />
                <button type="button" onClick={() => setImage('')} style={{ ...dangerButtonStyle, position: 'absolute', top: '8px', right: '8px', padding: '4px 10px', fontSize: '12px' }}>삭제</button>
              </div>
            )}
            <label style={{ ...fieldLabelStyle, cursor: 'pointer' }}>
              {image ? '이미지 변경' : '이미지 업로드'}
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              <div style={{ ...inputStyle, textAlign: 'center', padding: '14px', color: '#888', cursor: 'pointer', background: '#fafafa' }}>
                클릭하여 이미지 선택 (최대 2MB)
              </div>
            </label>
            {imageError && <p style={{ color: '#ff4d6d', fontSize: '13px', margin: 0 }}>{imageError}</p>}
          </div>

          {/* ── 기본 정보 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>기본 정보</p>
            <label style={fieldLabelStyle}>
              제목 *
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="이벤트 제목" style={inputStyle} required />
            </label>
            <label style={fieldLabelStyle}>
              부제목
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="간단한 설명" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              뱃지 텍스트
              <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="상시 이벤트 / 2026.03.01 – 04.30" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              연결 상품 페이지 URL
              <input value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} placeholder="/category/%EB%B2%A0%EB%93%9C" style={inputStyle} />
            </label>
          </div>

          {/* ── 기간 및 상태 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>기간 및 상태</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label style={fieldLabelStyle}>
                시작일 *
                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="2026.01.01" style={inputStyle} required />
              </label>
              <label style={fieldLabelStyle}>
                종료일 (없으면 빈칸)
                <input value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="2026.12.31" style={inputStyle} />
              </label>
            </div>
            <label style={fieldLabelStyle}>
              상태
              <select value={status} onChange={(e) => setStatus(e.target.value as 'ongoing' | 'ended')} style={inputStyle}>
                <option value="ongoing">진행중</option>
                <option value="ended">종료</option>
              </select>
            </label>
          </div>

          {/* ── 배너 디자인 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>배너 디자인</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <label style={fieldLabelStyle}>
                배경색
                <select value={bg} onChange={(e) => setBg(e.target.value)} style={inputStyle}>
                  {BG_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
              <label style={fieldLabelStyle}>
                강조색
                <select value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={inputStyle}>
                  {ACCENT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            <div style={{ borderRadius: '14px', background: bg, padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '80px', justifyContent: 'flex-end' }}>
              {image && <img src={image} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '4px' }} />}
              <span style={{ background: accentColor, color: accentColor === '#FFDC20' ? '#111' : '#fff', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', display: 'inline-block', alignSelf: 'flex-start' }}>
                {badge || '뱃지 텍스트'}
              </span>
              <span style={{ fontWeight: 900, fontSize: '14px', color: bg === '#fff' || bg === '#f4f6fb' || bg === '#e8edf5' || bg === '#FFDC20' ? '#111' : '#fff' }}>
                {title || '이벤트 제목'}
              </span>
            </div>
          </div>

          {/* ── 혜택 (Benefits) ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>혜택 카드 (최대 3개)</p>
            {benefits.map((b, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '8px', alignItems: 'end' }}>
                <label style={fieldLabelStyle}>
                  아이콘
                  <input value={b.icon} onChange={(e) => setBenefit(idx, 'icon', e.target.value)} placeholder="🎁" style={inputStyle} />
                </label>
                <label style={fieldLabelStyle}>
                  혜택명
                  <input value={b.label} onChange={(e) => setBenefit(idx, 'label', e.target.value)} placeholder={`혜택 ${idx + 1}`} style={inputStyle} />
                </label>
                <label style={fieldLabelStyle}>
                  설명
                  <input value={b.desc} onChange={(e) => setBenefit(idx, 'desc', e.target.value)} placeholder="짧은 설명" style={inputStyle} />
                </label>
              </div>
            ))}
          </div>

          {/* ── 상세 이미지 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>상세 페이지 상품 이미지</p>
            {detailImages.map((src, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={src} alt="" style={{ width: '100%', borderRadius: '10px', border: '2px solid rgba(17,17,17,.08)' }} />
                <button type="button" onClick={() => setDetailImages((prev) => prev.filter((_, j) => j !== i))} style={{ ...dangerButtonStyle, position: 'absolute', top: '8px', right: '8px', padding: '4px 10px', fontSize: '12px' }}>삭제</button>
              </div>
            ))}
            <label style={{ ...fieldLabelStyle, cursor: 'pointer' }}>
              이미지 추가
              <input type="file" accept="image/*" onChange={handleDetailImageAdd} style={{ display: 'none' }} />
              <div style={{ ...inputStyle, textAlign: 'center', padding: '14px', color: '#888', cursor: 'pointer', background: '#fafafa' }}>
                클릭하여 이미지 추가 (최대 2MB)
              </div>
            </label>
            {detailImageError && <p style={{ color: '#ff4d6d', fontSize: '13px', margin: 0 }}>{detailImageError}</p>}
          </div>

          {/* ── 본문 텍스트 ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>본문 텍스트</p>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', alignItems: 'start' }}>
              <label style={fieldLabelStyle}>
                섹션1 제목
                <input value={sec1Title} onChange={(e) => setSec1Title(e.target.value)} placeholder="이벤트 안내" style={inputStyle} />
              </label>
              <label style={fieldLabelStyle}>
                내용
                <textarea value={sec1Body} onChange={(e) => setSec1Body(e.target.value)} placeholder="이벤트 상세 안내를 입력하세요" style={textareaStyle} />
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', alignItems: 'start' }}>
              <label style={fieldLabelStyle}>
                섹션2 제목
                <input value={sec2Title} onChange={(e) => setSec2Title(e.target.value)} placeholder="참여 방법" style={inputStyle} />
              </label>
              <label style={fieldLabelStyle}>
                내용
                <textarea value={sec2Body} onChange={(e) => setSec2Body(e.target.value)} placeholder="참여 방법 또는 추가 설명" style={textareaStyle} />
              </label>
            </div>
          </div>

          {/* ── 유의사항 & CTA ── */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>유의사항 및 버튼</p>
            <label style={fieldLabelStyle}>
              유의사항 (한 줄에 하나씩)
              <textarea value={notice} onChange={(e) => setNotice(e.target.value)} placeholder={'본 혜택은 신규 회원에게만 적용됩니다.\n다른 쿠폰과 중복 적용되지 않습니다.'} style={{ ...textareaStyle, minHeight: '80px' }} />
            </label>
            <label style={fieldLabelStyle}>
              참여 버튼 텍스트
              <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="지금 바로 참여하기" style={inputStyle} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={ghostButtonStyle}>취소</button>
            <button type="submit" style={primaryButtonStyle}>{event ? '수정 완료' : '추가'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
