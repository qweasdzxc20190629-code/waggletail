'use client';

import { useEffect, useState } from 'react';
import { CategoryData } from '../../categories-actions';
import { inputStyle, primaryButtonStyle, ghostButtonStyle, modalOverlayStyle, modalCardStyle } from './styles';

type Props = {
  category: CategoryData | null;
  onClose: () => void;
  onSave: (cat: CategoryData) => void;
};

export default function CategoryFormModal({ category, onClose, onSave }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  const [en, setEn] = useState(category?.en ?? '');
  const [navName, setNavName] = useState(category?.navName ?? category?.name ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('카테고리명을 입력해주세요.'); return; }
    onSave({
      ...category,
      name: name.trim(),
      en: en.trim(),
      navName: navName.trim() || name.trim(),
      emoji: category?.emoji ?? '🐾',
      bg: category?.bg ?? '#fff',
      textColor: category?.textColor ?? '#111',
      border: category?.border ?? true,
    });
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalCardStyle, maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 24px' }}>
          {category ? '카테고리 수정' : '카테고리 추가'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
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
