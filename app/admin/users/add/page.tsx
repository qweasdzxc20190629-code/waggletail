'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUser, users } from '../../../users';

export default function AddUserPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (users.some((user) => user.id === id)) {
      setError('이미 존재하는 아이디입니다.');
      return;
    }

    addUser({ id, password });
    router.push('/admin/users');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F8FBFF', color: '#111' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)', padding: '42px 36px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: 900, marginBottom: '18px' }}>새 관리자 아이디 추가</h1>
          <p style={{ color: '#555', marginBottom: '32px', lineHeight: 1.7 }}>새 관리자 계정을 등록하면 로그인 시 해당 아이디로 접속할 수 있습니다.</p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
            <label style={{ display: 'grid', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              아이디
              <input
                value={id}
                onChange={(event) => setId(event.target.value)}
                placeholder="새 관리자 아이디"
                style={{ width: '100%', border: '2px solid #111', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                style={{ width: '100%', border: '2px solid #111', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              비밀번호 확인
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="비밀번호 확인"
                style={{ width: '100%', border: '2px solid #111', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', outline: 'none' }}
              />
            </label>
            {error && <p style={{ color: '#d52b1e', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button type="submit" style={{ background: '#0041BD', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px 24px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
                추가
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                style={{ background: '#fff', color: '#111', border: '2px solid #111', borderRadius: '14px', padding: '16px 24px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
