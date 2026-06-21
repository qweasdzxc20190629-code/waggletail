'use client';

import { useEffect, useRef, useState } from 'react';
import { CategoryData, uploadCategoryImageAction } from '../../categories-actions';
import { inputStyle, primaryButtonStyle, ghostButtonStyle, modalOverlayStyle, modalCardStyle } from './styles';

type Props = {
  category: CategoryData | null;
  onClose: () => void;
  onSave: (cat: CategoryData) => void;
};

export default function CategoryFormModal({ category, onClose, onSave }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  const [en, setEn] = useState(category?.en ?? 'Category');
  const [navName, setNavName] = useState(category?.navName ?? category?.name ?? '');
  const [imageUrl, setImageUrl] = useState<string | undefined>(category?.imageUrl);
  const [textColor, setTextColor] = useState(category?.textColor ?? '#111');
  const [border, setBorder] = useState(category?.border ?? true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const result = await uploadCategoryImageAction(fd);
    setUploading(false);
    if (result.error) { setError(result.error); return; }
    setImageUrl(result.url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('카테고리 이름을 입력해주세요.'); return; }
    onSave({
      name: name.trim(),
      en: en.trim() || 'Category',
      navName: navName.trim() || name.trim(),
      emoji: category?.emoji ?? '🐾',
      bg: category?.bg ?? '#fff',
      textColor,
      border,
      imageUrl,
    });
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalCardStyle, maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 20px' }}>
          {category ? '카테고리 수정' : '카테고리 추가'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
            카테고리명 *
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: Clean & Care" style={inputStyle} />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
            영문 라벨
            <input value={en} onChange={(e) => setEn(e.target.value)} placeholder="예: Cleaning" style={inputStyle} />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
            서브네비게이션명
            <input value={navName} onChange={(e) => setNavName(e.target.value)} placeholder="예: Clean" style={inputStyle} />
            <span style={{ fontSize: '11px', color: '#999', fontWeight: 400 }}>상단 카테고리 바에 표시되는 이름입니다.</span>
          </label>

          {/* 썸네일 */}
          <div style={{ display: 'grid', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>썸네일</span>
            <input
              type="file"
              ref={fileRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{ ...ghostButtonStyle, opacity: uploading ? 0.6 : 1, fontSize: '12px', padding: '8px 14px' }}
              >
                {uploading ? '업로드 중...' : '파일 선택'}
              </button>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl(undefined)}
                  style={{ background: 'none', border: 'none', color: '#d52b1e', fontWeight: 700, fontSize: '12px', cursor: 'pointer', padding: '4px' }}
                >
                  제거
                </button>
              )}
            </div>
            {imageUrl && (
              <img src={imageUrl} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ddd', marginTop: '4px' }} />
            )}
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '13px' }}>텍스트 색상</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[{ label: '검정', value: '#111' }, { label: '흰색', value: '#fff' }, { label: '노랑', value: '#F5C400' }, { label: '파랑', value: '#0041BD' }].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTextColor(t.value)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '999px',
                    border: textColor === t.value ? '2.5px solid #0041BD' : '2px solid #ddd',
                    background: t.value,
                    color: t.value === '#fff' || t.value === '#F5C400' ? '#111' : '#fff',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                title="직접 선택"
                style={{ width: '36px', height: '36px', border: '2px solid #ddd', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={border} onChange={(e) => setBorder(e.target.checked)} style={{ width: '17px', height: '17px', accentColor: '#0041BD' }} />
            테두리 표시
          </label>

          {error && <p style={{ color: '#d52b1e', margin: 0, fontSize: '13px', fontWeight: 600 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={primaryButtonStyle}>저장</button>
            <button type="button" onClick={onClose} style={ghostButtonStyle}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}
