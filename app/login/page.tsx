'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateUser } from '../users';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateUser(username, password)) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('isAdmin', 'true');
        window.dispatchEvent(new Event('isAdminChanged'));
      }
      router.push('/admin/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F8FBFF', color: '#111' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)', padding: '42px 36px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: 900, marginBottom: '18px' }}>로그인</h1>
          <p style={{ color: '#555', marginBottom: '32px', lineHeight: 1.7 }}>관리자 계정으로 로그인하면 관리자 페이지로 이동합니다.</p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '18px' }}>
            <label style={{ display: 'grid', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              아이디
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                style={{ width: '100%', border: '2px solid #111', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', outline: 'none' }}
              />
            </label>
            <label style={{ display: 'grid', gap: '8px', fontWeight: 700, fontSize: '14px' }}>
              비밀번호
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="1234"
                style={{ width: '100%', border: '2px solid #111', borderRadius: '14px', padding: '14px 16px', fontSize: '15px', outline: 'none' }}
              />
            </label>
            {error && <p style={{ color: '#d52b1e', margin: 0 }}>{error}</p>}
            <button type="submit" style={{ background: '#0041BD', color: '#fff', border: 'none', borderRadius: '14px', padding: '16px 24px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
