import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(url, anonKey);
export async function savePageContent(id, html){ 
  if(!url || !anonKey) throw new Error('Supabase env vars missing');
  // Example: save to table 'pages' with columns id, content
  const { data, error } = await supabase.from('pages').upsert({ id, content: html });
  if(error) throw error;
  return data;
}
