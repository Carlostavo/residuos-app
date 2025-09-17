import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(url, anonKey);

export async function getPageContent(id){
  if(!url || !anonKey) throw new Error('Supabase env vars missing');
  const { data, error } = await supabase.from('pages').select('content').eq('id', id).single();
  if(error && error.code !== 'PGRST116') throw error;
  return data?.content || null;
}

export async function savePageContent(id, content){
  if(!url || !anonKey) throw new Error('Supabase env vars missing');
  const { data, error } = await supabase.from('pages').upsert({ id, content }, { returning: 'minimal' });
  if(error) throw error;
  return data;
}

export async function getUserRole(userId){
  if(!url || !anonKey) throw new Error('Supabase env vars missing');
  const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
  if(error && error.code !== 'PGRST116') throw error;
  return data?.role || null;
}
