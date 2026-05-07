import { NewsArticle, ChatMessage, Category } from '../types';

export async function fetchNews(category?: Category, location?: string): Promise<NewsArticle[]> {
  const url = new URL('/api/news', window.location.origin);
  if (category) url.searchParams.append('category', category);
  if (location) url.searchParams.append('location', location);
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}
