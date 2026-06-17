'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addUser, users } from '../users';

const TERMS_TEXT = `왜글테일 서비스 이용 시 커뮤니티 가이드라인을 준수해야 하며, 불법·유해 콘텐츠 게시는 금지됩니다. 서비스 내 모든 콘텐츠의 저작권은 해당 작성자에게 있으며, 무단 복제 및 배포를 금합니다. 왜글테일은 서비스 품질 향상을 위해 운영 정책을 변경할 수 있으며, 변경 사항은 공지사항을 통해 안내됩니다.`;
const PRIVACY_TEXT = `수집 항목: 아이디, 닉네임, 이메일, 비밀번호(암호화 저장)\n수집 목적: 회원 관리, 서비스 제공\n보유 기간: 회원 탈퇴 시까지 (단, 관련 법령에 따라 일부 정보는 일정 기간 보관)`;

type CheckState = {
  age: boolean;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState('');
  const [id, setId] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [checks, setChecks] = useState<CheckState>({ age: false, terms: false, privacy: false, marketing: false });
  const [openTerms, setOpenTerms] = useState<'terms' | 'privacy' | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const allRequired = checks.age && checks.terms && checks.privacy;
  const allChecked = allRequired && checks.marketing;

  const toggleAll = () => {
    const next = !allChecked;
    setChecks({ age: next, terms: next, privacy: next, marketing: next });
  };

  const toggle = (key: keyof CheckState) => setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('이미지는 2MB 이하여야 합니다.'); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!id.trim()) errs.push('아이디를 입력해주세요.');
    if (!nickname.trim()) errs.push('닉네임을 입력해주세요.');
    if (!email.trim()) errs.push('이메일을 입력해주세요.');
    if (pw.length < 6) errs.push('비밀번호는 6자 이상이어야 합니다.');
    if (pw !== pw2) errs.push('비밀번호가 일치하지 않습니다.');
    if (!allRequired) errs.push('필수 약관에 동의해주세요.');
    if (users.some((u) => u.id === id.trim())) errs.push('이미 사용 중인 아이디입니다.');
    if (errs.length > 0) { setErrors(errs); return; }
    addUser({ id: id.trim(), password: pw });
    setErrors([]);
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '2px solid #e8e8e8', borderRadius: '12px',
    padding: '13px 16px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F8FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)', padding: '48px 36px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🐾</div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '10px' }}>가입 완료!</h2>
          <p style={{ color: '#666', lineHeight: 1.7, marginBottom: '28px' }}>왜글테일에 오신 걸 환영해요.<br />지금 바로 로그인해 보세요.</p>
          <Link href="/login" style={{ display: 'inline-block', background: '#0041BD', color: '#fff', fontWeight: 800, fontSize: '15px', padding: '14px 32px', borderRadius: '12px', textDecoration: 'none' }}>
            로그인하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F8FBFF', color: '#111' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD', margin: '0 0 8px' }}>WAGGLE TAIL</p>
          <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0 }}>회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>

          {/* ── 프로필 이미지 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '24px', background: '#fff', borderRadius: '20px', border: '2px solid #f0f0f0' }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ width: '90px', height: '90px', borderRadius: '50%', background: avatar ? 'transparent' : '#f0f4ff', border: '3px dashed #c0ccee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', flexShrink: 0 }}
            >
              {avatar
                ? <img src={avatar} alt="프로필" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px' }}>🐾</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
            <button type="button" onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', color: '#0041BD', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              프로필 사진 선택 (선택)
            </button>
          </div>

          {/* ── 계정 정보 ── */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '2px solid #f0f0f0', padding: '24px', display: 'grid', gap: '14px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '13px', color: '#0041BD', letterSpacing: '0.08em' }}>계정 정보</p>

            <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
              아이디 <span style={{ display: 'inline', color: '#ff4d6d', fontWeight: 900 }}>*</span>
              <input value={id} onChange={(e) => setId(e.target.value)} placeholder="영문·숫자 조합" style={inputStyle} />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
              닉네임 <span style={{ display: 'inline', color: '#ff4d6d', fontWeight: 900 }}>*</span>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="사용할 닉네임" style={inputStyle} />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
              이메일 <span style={{ display: 'inline', color: '#ff4d6d', fontWeight: 900 }}>*</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle} />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
              비밀번호 <span style={{ display: 'inline', color: '#ff4d6d', fontWeight: 900 }}>*</span>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="6자 이상" style={inputStyle} />
            </label>

            <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
              비밀번호 확인 <span style={{ display: 'inline', color: '#ff4d6d', fontWeight: 900 }}>*</span>
              <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="비밀번호 재입력" style={inputStyle} />
            </label>
          </div>

          {/* ── 약관 동의 ── */}
          <div style={{ background: '#fff', borderRadius: '20px', border: '2px solid #f0f0f0', padding: '24px', display: 'grid', gap: '0' }}>
            <p style={{ margin: '0 0 14px', fontWeight: 800, fontSize: '13px', color: '#0041BD', letterSpacing: '0.08em' }}>약관 동의</p>

            {/* 전체 동의 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#f8faff', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', border: '2px solid #e8eef8' }}>
              <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ width: '18px', height: '18px', accentColor: '#0041BD', cursor: 'pointer' }} />
              <span style={{ fontWeight: 800, fontSize: '15px' }}>모든 항목에 동의합니다</span>
            </label>

            <div style={{ display: 'grid', gap: '0', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
              {/* 만 14세 */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 4px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}>
                <input type="checkbox" checked={checks.age} onChange={() => toggle('age')} style={{ width: '16px', height: '16px', accentColor: '#0041BD', cursor: 'pointer' }} />
                <span style={{ fontSize: '14px', fontWeight: 700 }}>
                  만 14세 이상입니다 <span style={{ color: '#ff4d6d', fontSize: '12px' }}>(필수)</span>
                </span>
              </label>

              {/* 이용 약관 */}
              <div style={{ borderBottom: '1px solid #f5f5f5' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checks.terms} onChange={() => toggle('terms')} style={{ width: '16px', height: '16px', accentColor: '#0041BD', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>
                    이용 약관 동의 <span style={{ color: '#ff4d6d', fontSize: '12px' }}>(필수)</span>
                  </span>
                  <button type="button" onClick={() => setOpenTerms(openTerms === 'terms' ? null : 'terms')} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', cursor: 'pointer', flexShrink: 0 }}>
                    {openTerms === 'terms' ? '접기 ▲' : '보기 ▼'}
                  </button>
                </label>
                {openTerms === 'terms' && (
                  <div style={{ margin: '0 4px 10px', padding: '14px', background: '#f8f8f8', borderRadius: '10px', fontSize: '12px', color: '#666', lineHeight: 1.7 }}>
                    {TERMS_TEXT}
                  </div>
                )}
              </div>

              {/* 개인정보 */}
              <div style={{ borderBottom: '1px solid #f5f5f5' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checks.privacy} onChange={() => toggle('privacy')} style={{ width: '16px', height: '16px', accentColor: '#0041BD', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>
                    개인정보 처리방침 동의 <span style={{ color: '#ff4d6d', fontSize: '12px' }}>(필수)</span>
                  </span>
                  <button type="button" onClick={() => setOpenTerms(openTerms === 'privacy' ? null : 'privacy')} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', cursor: 'pointer', flexShrink: 0 }}>
                    {openTerms === 'privacy' ? '접기 ▲' : '보기 ▼'}
                  </button>
                </label>
                {openTerms === 'privacy' && (
                  <div style={{ margin: '0 4px 10px', padding: '14px', background: '#f8f8f8', borderRadius: '10px', fontSize: '12px', color: '#666', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {PRIVACY_TEXT}
                  </div>
                )}
              </div>

              {/* 마케팅 */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 4px', cursor: 'pointer' }}>
                <input type="checkbox" checked={checks.marketing} onChange={() => toggle('marketing')} style={{ width: '16px', height: '16px', accentColor: '#0041BD', cursor: 'pointer' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#555' }}>
                  마케팅 수신 동의 <span style={{ color: '#aaa', fontSize: '12px' }}>(선택)</span>
                </span>
              </label>
            </div>
          </div>

          {/* 에러 */}
          {errors.length > 0 && (
            <div style={{ background: '#fff5f5', border: '2px solid #ffcdd2', borderRadius: '12px', padding: '14px 16px', display: 'grid', gap: '4px' }}>
              {errors.map((err, i) => <p key={i} style={{ margin: 0, fontSize: '13px', color: '#d52b1e', fontWeight: 600 }}>· {err}</p>)}
            </div>
          )}

          {/* 버튼 */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => router.push('/login')}
              style={{ flex: 1, background: '#fff', color: '#111', border: '2px solid #e0e0e0', borderRadius: '12px', padding: '15px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
            >
              돌아가기
            </button>
            <button
              type="submit"
              style={{ flex: 2, background: '#0041BD', color: '#fff', border: 'none', borderRadius: '12px', padding: '15px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}
            >
              회원가입 완료
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
