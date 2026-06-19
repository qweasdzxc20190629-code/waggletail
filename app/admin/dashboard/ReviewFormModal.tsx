'use client';

import { useState } from 'react';
import { Review, addReviewAction, updateReviewAction, uploadReviewImageAction } from '../../reviews-actions';
import { inputStyle, primaryButtonStyle, ghostButtonStyle } from './styles';

type Props = {
  review?: Review;
  onClose: () => void;
  onSave: (reviews: Review[]) => void;
};

const AVATARS = ['🐶', '🐕', '🐩', '🦴', '🐾', '🐈', '🐱', '🐇'];

export default function ReviewFormModal({ review, onClose, onSave }: Props) {
  const isEdit = !!review;
  const [form, setForm] = useState({
    name: review?.name ?? '',
    avatar: review?.avatar ?? '🐶',
    breed: review?.breed ?? '',
    age: review?.age ?? '',
    star: review?.star ?? 5,
    text: review?.text ?? '',
    product: review?.product ?? '',
    verified: review?.verified ?? true,
    likes: review?.likes ?? 0,
    date: review?.date ?? new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
    imageUrl: review?.imageUrl ?? '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await uploadReviewImageAction(fd);
    setUploading(false);
    if (res.url) set('imageUrl', res.url);
    else setError(res.error ?? '업로드 실패');
  };

  const handleSave = async () => {
    if (!form.name.trim()) return setError('이름을 입력해주세요.');
    if (!form.text.trim()) return setError('후기 내용을 입력해주세요.');
    setSaving(true);
    const payload = { ...form, likes: Number(form.likes), star: Number(form.star) };
    const res = isEdit
      ? await updateReviewAction(review!.id, payload)
      : await addReviewAction(payload);
    setSaving(false);
    if (res.error) return setError(res.error);
    onSave(res.reviews);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>{isEdit ? '리뷰 수정' : '리뷰 추가'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* 이미지 */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700 }}>포토 이미지</p>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px', border: '1.5px solid #eee' }} />
          )}
          <label style={{ display: 'block', padding: '10px', background: '#f4f6fb', border: '1.5px dashed #ccc', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            {uploading ? '업로드 중...' : '📷 이미지 선택'}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        {/* 아바타 */}
        <div>
          <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700 }}>아바타</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {AVATARS.map((a) => (
              <button key={a} onClick={() => set('avatar', a)} style={{ fontSize: '22px', padding: '6px 10px', borderRadius: '10px', border: form.avatar === a ? '2.5px solid #0041BD' : '1.5px solid #ddd', background: form.avatar === a ? 'rgba(0,65,189,.08)' : '#fff', cursor: 'pointer' }}>{a}</button>
            ))}
          </div>
        </div>

        {/* 기본 정보 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            이름 *
            <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="콩이맘" style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            견종
            <input value={form.breed} onChange={(e) => set('breed', e.target.value)} placeholder="포메라니안" style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            나이
            <input value={form.age} onChange={(e) => set('age', e.target.value)} placeholder="3살" style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            별점
            <select value={form.star} onChange={(e) => set('star', Number(e.target.value))} style={inputStyle}>
              {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}점</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            상품명
            <input value={form.product} onChange={(e) => set('product', e.target.value)} placeholder="포근 도넛 베드" style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            날짜
            <input value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="2026.05.12" style={inputStyle} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
            좋아요 수
            <input type="number" value={form.likes} onChange={(e) => set('likes', e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, marginTop: '24px' }}>
            <input type="checkbox" checked={form.verified} onChange={(e) => set('verified', e.target.checked)} style={{ width: '18px', height: '18px' }} />
            구매 인증
          </label>
        </div>

        {/* 후기 내용 */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
          후기 내용 *
          <textarea value={form.text} onChange={(e) => set('text', e.target.value)} placeholder="솔직한 후기를 입력하세요." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>

        {error && <p style={{ color: '#ff4d6d', fontSize: '13px', fontWeight: 700, margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={ghostButtonStyle}>취소</button>
          <button onClick={handleSave} disabled={saving} style={primaryButtonStyle}>{saving ? '저장 중...' : '저장'}</button>
        </div>
      </div>
    </div>
  );
}
