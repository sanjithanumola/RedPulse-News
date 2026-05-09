import { GoogleGenAI } from "@google/genai";
import { NewsArticle, ChatMessage } from "../types";

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  console.warn('GEMINI_API_KEY missing. AI features will be limited.');
}
const ai = new GoogleGenAI({ apiKey: geminiKey || "" });

export async function generateDailyNews(): Promise<NewsArticle[]> {
  const today = new Date().toDateString();
  const prompt = `Generate 12 futuristic news articles for today (${today}). 
  Themes: India, Hyderabad, Artificial Intelligence, Space Travel, Tech Business, Gaming, Sports, Science.
  The style should be high-tech, optimistic, and data-driven ("RedPulse Intelligence").
  
  Return as a JSON array of objects with this structure:
  {
    "id": string (unique),
    "title": string,
    "description": string (one sentence),
    "content": string (at least 3 paragraphs),
    "author": string,
    "publishedAt": string (ISO date),
    "source": string,
    "url": "#",
    "urlToImage": string (Use relevant High-quality Unsplash URLs),
    "category": One of ("Technology", "AI", "Sports", "Gaming", "Business", "Science", "Hyderabad", "India"),
    "location": "Hyderabad" or "India" or null
  }
  Ensure valid JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text || "";
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Failed to parse intelligence report");
}

export async function analyzeArticleAI(article: NewsArticle): Promise<NewsArticle['aiAnalysis']> {
  const prompt = `Analyze this news article and provide:
  1. A concise 2-sentence summary.
  2. An "Explain Like I'm 10" (ELI10) version.
  3. A bias score from 0.0 to 1.0 (0 being neutral, 1 being highly biased).
  4. A brief bias analysis.
  5. Overall sentiment (Positive, Neutral, or Negative).
  6. A Truth Meter score from 0 to 100 (100 being highly verified/factual).
  7. Boolean indicating if it's likely fake news and why.
  
  Article Content:
  Title: ${article.title}
  Content: ${article.content}
  
  Return as JSON with keys: summary, eli10, biasScore, biasAnalysis, sentiment, truthMeter, isFakeNews, fakeNewsReason.`;

  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = result.text;
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}') + 1;
  return JSON.parse(text.slice(jsonStart, jsonEnd));
}

export async function chatWithNova(message: string, history: any[]): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...(history || []), { role: 'user', parts: [{ text: message }] }],
    config: {
        systemInstruction: "You are Nova, an AI News Intelligence assistant for NewsNova. You specialize in India and Hyderabad news. Be objective, slightly futuristic, and highly informative."
    }
  });

  return response.text || "I'm having trouble retrieving data from the neural network.";
}
