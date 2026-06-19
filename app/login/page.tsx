'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DASHBOARD_ROLES } from '../users';
import { validateUserAction } from '../users-actions';

type View = 'login' | 'find-id' | 'find-pw';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>('login');

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // find id / find pw (UI only)
  const [findEmail, setFindEmail] = useState('');
  const [findId, setFindId] = useState('');
  const [findResult, setFindResult] = useState('');

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');
    const role = await validateUserAction(username, password);
    if (role === null) {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
      return;
    }
    const canAccessDashboard = DASHBOARD_ROLES.includes(role);
    window.localStorage.setItem('wt_role', role);
    window.localStorage.setItem('wt_user_id', username);
    window.localStorage.setItem('isAdmin', canAccessDashboard ? 'true' : 'false');
    window.dispatchEvent(new Event('isAdminChanged'));
    router.push('/');
  };

  const switchView = (v: View) => {
    setError('');
    setFindResult('');
    setView(v);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '13px 16px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .15s',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%',
    background: '#0041BD',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '15px 24px',
    fontSize: '15px',
    fontWeight: 800,
    cursor: 'pointer',
  };

  const btnGhost: React.CSSProperties = {
    flex: 1,
    background: '#fff',
    color: '#111',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F8FBFF', color: '#111' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)', padding: '36px 32px' }}>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '28px', borderBottom: '2px solid #f0f0f0' }}>
            <button
              type="button"
              onClick={() => switchView('login')}
              style={{ flex: 1, padding: '12px 0', fontWeight: 800, fontSize: '15px', background: 'none', border: 'none', borderBottom: view === 'login' ? '2.5px solid #0041BD' : '2.5px solid transparent', color: view === 'login' ? '#0041BD' : '#aaa', cursor: 'pointer', marginBottom: '-2px' }}
            >
              로그인
            </button>
            <Link
              href="/register"
              style={{ flex: 1, padding: '12px 0', fontWeight: 800, fontSize: '15px', background: 'none', border: 'none', borderBottom: '2.5px solid transparent', color: '#aaa', cursor: 'pointer', marginBottom: '-2px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              회원가입
            </Link>
          </div>

          {/* ── 로그인 ── */}
          {view === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                아이디
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디 입력" style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                비밀번호
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" style={inputStyle} />
              </label>
              {error && <p style={{ color: '#d52b1e', margin: 0, fontSize: '13px' }}>{error}</p>}
              <button type="submit" style={{ ...btnPrimary, marginTop: '4px' }}>로그인</button>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '4px' }}>
                <button type="button" onClick={() => switchView('find-id')} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#888', cursor: 'pointer', fontWeight: 600 }}>
                  아이디 찾기
                </button>
                <span style={{ color: '#ddd', fontSize: '13px' }}>|</span>
                <button type="button" onClick={() => switchView('find-pw')} style={{ background: 'none', border: 'none', fontSize: '13px', color: '#888', cursor: 'pointer', fontWeight: 600 }}>
                  비밀번호 찾기
                </button>
              </div>
            </form>
          )}

          {/* ── 아이디 찾기 ── */}
          {view === 'find-id' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>가입 시 등록한 이메일로 아이디를 찾을 수 있습니다.</p>
              <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                이메일
                <input value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder="가입한 이메일" style={inputStyle} />
              </label>
              {findResult && <p style={{ color: '#0041BD', fontWeight: 700, fontSize: '14px', margin: 0 }}>{findResult}</p>}
              <button
                type="button"
                onClick={() => setFindResult('해당 이메일로 아이디가 발송되었습니다.')}
                style={{ ...btnPrimary, marginTop: '4px' }}
              >
                아이디 찾기
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => switchView('login')} style={btnGhost}>로그인</button>
                <button type="button" onClick={() => switchView('find-pw')} style={btnGhost}>비밀번호 찾기</button>
              </div>
            </div>
          )}

          {/* ── 비밀번호 찾기 ── */}
          {view === 'find-pw' && (
            <div style={{ display: 'grid', gap: '14px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.6 }}>아이디와 이메일을 입력하면 임시 비밀번호를 발송합니다.</p>
              <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                아이디
                <input value={findId} onChange={(e) => setFindId(e.target.value)} placeholder="가입한 아이디" style={inputStyle} />
              </label>
              <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                이메일
                <input value={findEmail} onChange={(e) => setFindEmail(e.target.value)} placeholder="가입한 이메일" style={inputStyle} />
              </label>
              {findResult && <p style={{ color: '#0041BD', fontWeight: 700, fontSize: '14px', margin: 0 }}>{findResult}</p>}
              <button
                type="button"
                onClick={() => setFindResult('임시 비밀번호가 이메일로 발송되었습니다.')}
                style={{ ...btnPrimary, marginTop: '4px' }}
              >
                비밀번호 찾기
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => switchView('login')} style={btnGhost}>로그인</button>
                <button type="button" onClick={() => switchView('find-id')} style={btnGhost}>아이디 찾기</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
