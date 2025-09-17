// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!url || !anonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(url, anonKey);

export async function getPageContent(id) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('content')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.content || null;
  } catch (error) {
    console.error('Error getting page content:', error);
    return null;
  }
}

export async function savePageContent(id, content) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .upsert({ id, content }, { returning: 'minimal' });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving page content:', error);
    throw error;
  }
}

export async function getUserRole(userId) {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.warn('Error getting user role:', error);
      return null;
    }
    
    return data?.role || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}
