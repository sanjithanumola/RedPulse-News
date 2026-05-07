export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  source: string;
  url: string;
  urlToImage: string;
  category: string;
  location?: string;
  aiAnalysis?: {
    summary: string;
    eli5: string;
    biasScore: number; // 0 to 1
    biasAnalysis: string;
    isFakeNews: boolean;
    fakeNewsReason?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  bookmarks: string[]; // array of article IDs
}

export type Category = 'General' | 'Technology' | 'AI' | 'Sports' | 'Gaming' | 'Business' | 'Science' | 'Politics' | 'Entertainment' | 'Hyderabad' | 'India';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
