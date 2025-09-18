
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(url, anonKey);

export async function getPageContent(id){
  const { data, error } = await supabase.from('pages').select('content').eq('id', id).single();
  if(error && error.code !== 'PGRST116') throw error;
  return data?.content || null;
}

export async function savePageContent(id, content){
  const { error } = await supabase.from('pages').upsert({ id, content }, { returning: 'minimal' });
  if(error) throw error;
  return true;
}

export async function getUserRole(userId){
  const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).single();
  if(error && error.code !== 'PGRST116') throw error;
  return data?.role || null;
}
