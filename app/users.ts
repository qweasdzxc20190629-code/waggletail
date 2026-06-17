export type UserRole = '관리자' | '마스터' | '직원' | '회원';

export type User = {
  id: string;
  password: string;
  role: UserRole;
};

export const DASHBOARD_ROLES: UserRole[] = ['관리자', '마스터'];

const STORAGE_KEY = 'wt_users_v3';

const DEFAULT_USERS: User[] = [{ id: 'admin', password: '1234', role: '관리자' }];

export const users: User[] = DEFAULT_USERS.slice();

function persist() {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch { /* noop */ }
  }
}

function migrateRole(raw?: string, id?: string): UserRole {
  if (raw === '관리자' || raw === '마스터' || raw === '직원' || raw === '회원') return raw;
  // 이전 형식 (admin/user)
  if (raw === 'admin' || id === 'admin') return '관리자';
  return '회원';
}

if (typeof window !== 'undefined') {
  try {
    const legacyKeys = [
      () => localStorage.getItem('wt_users_v1'),
      () => sessionStorage.getItem('wt_users_v2'),
      () => sessionStorage.getItem('wt_users_v1'),
    ];

    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const getter of legacyKeys) {
        try { raw = getter(); } catch { /* noop */ }
        if (raw) break;
      }
    }

    if (raw) {
      const parsed = JSON.parse(raw) as Array<{ id: string; password: string; role?: string }>;
      const normalized: User[] = parsed.map((u) => ({
        id: u.id,
        password: u.password,
        role: migrateRole(u.role, u.id),
      }));
      const deduped = normalized.filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);
      if (!deduped.some((u) => DASHBOARD_ROLES.includes(u.role))) {
        deduped.unshift(DEFAULT_USERS[0]);
      }
      users.splice(0, users.length, ...deduped);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch { /* noop */ }
}

export function validateUser(id: string, password: string): UserRole | null {
  const found = users.find((u) => u.id === id && u.password === password);
  return found ? found.role : null;
}

export function addUser(user: Omit<User, 'role'>, role: UserRole = '회원') {
  const exists = users.some((item) => item.id === user.id);
  if (!exists) {
    users.push({ ...user, role });
    persist();
  }
}

export function updateUserRole(id: string, role: UserRole) {
  const user = users.find((u) => u.id === id);
  if (user) {
    user.role = role;
    persist();
  }
}

export function deleteUser(id: string) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    persist();
  }
}
