import { GoogleGenAI } from "@google/genai";
import { NewsArticle, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
    contents: prompt
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
