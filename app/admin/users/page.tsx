'use client';

import Link from 'next/link';
import { useState } from 'react';
import { users, deleteUser } from '../../users';

export default function AdminUsersPage() {
  const [userList, setUserList] = useState(users);

  const handleDelete = (id: string) => {
    deleteUser(id);
    setUserList(users.slice());
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F5F8FF', color: '#111' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 24px 60px rgba(0,0,0,0.08)', padding: '42px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '10px' }}>관리자 아이디 관리</h1>
              <p style={{ color: '#555', lineHeight: 1.8 }}>현재 등록된 관리자 계정을 확인하고 새 아이디를 추가하거나 삭제할 수 있습니다.</p>
            </div>
            <Link href="/admin/users/add" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 22px', background: '#0041BD', color: '#fff', borderRadius: '14px', fontWeight: 800, textDecoration: 'none' }}>
              새 아이디 추가
            </Link>
          </div>

          <div style={{ marginTop: '36px', display: 'grid', gap: '14px' }}>
            {userList.length === 0 ? (
              <p style={{ color: '#666' }}>등록된 관리자 계정이 없습니다.</p>
            ) : (
              userList.map((user) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 20px', border: '1px solid rgba(0,0,0,.08)', borderRadius: '18px' }}>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{user.id}</p>
                    <p style={{ fontSize: '13px', color: '#666', margin: '6px 0 0' }}>비밀번호: {user.password.replace(/./g, '•')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    style={{ background: '#ff4d6d', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
