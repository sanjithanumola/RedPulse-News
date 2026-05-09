import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for client-side environment variables in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mtvqpbcqmbfwqpvwspgx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dnFwYmNxbWJmd3FwdndzcGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNDk0NzIsImV4cCI6MjA5MzcyNTQ3Mn0.AEmqLSSrus1G47ivsvzNDta6g-nFT58livEvYOaQoTQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function toggleBookmark(userId: string, articleId: string) {
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('article_id', articleId)
    .single();

  if (existing) {
    await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id);
    return false;
  } else {
    await supabase
      .from('bookmarks')
      .insert({ user_id: userId, article_id: articleId });
    return true;
  }
}

export async function getBookmarks(userId: string) {
  const { data } = await supabase
    .from('bookmarks')
    .select('article_id')
    .eq('user_id', userId);
  return data?.map(b => b.article_id) || [];
}

export async function getCachedNews(date: string) {
  const { data } = await supabase
    .from('news_cache')
    .select('articles')
    .eq('date', date)
    .single();
  return data?.articles || null;
}

export async function cacheNews(date: string, articles: any[]) {
  const { error } = await supabase
    .from('news_cache')
    .insert({ date, articles });
  return !error;
}
