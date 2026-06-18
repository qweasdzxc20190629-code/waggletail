'use server';

import { supabase } from './lib/supabase';
import { UserRole } from './users';

export type DbUser = { id: string; password: string; role: UserRole };

export async function getUsersAction(): Promise<DbUser[]> {
  const { data, error } = await supabase.from('users').select('*').order('id');
  if (error) { console.error(error); return []; }
  return data as DbUser[];
}

export async function validateUserAction(id: string, password: string): Promise<UserRole | null> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', id)
    .eq('password', password)
    .single();
  if (error || !data) return null;
  return data.role as UserRole;
}

export async function addUserAction(id: string, password: string, role: UserRole = '회원'): Promise<{ error?: string }> {
  const { error } = await supabase.from('users').insert({ id, password, role });
  if (error) {
    if (error.code === '23505') return { error: '이미 사용 중인 아이디입니다.' };
    return { error: error.message };
  }
  return {};
}

export async function updateUserRoleAction(id: string, role: UserRole): Promise<void> {
  await supabase.from('users').update({ role }).eq('id', id);
}

export async function deleteUserAction(id: string): Promise<void> {
  await supabase.from('users').delete().eq('id', id);
}
