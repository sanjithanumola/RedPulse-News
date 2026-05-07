import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { NewsArticle, Category } from "./src/types";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data Store (In-memory for this prototype)
  const articles: NewsArticle[] = [
    {
      id: "1",
      title: "Hyderabad's Tech Corridor Sees Massive Expansion in 2026",
      description: "Cloud infrastructures and AI research labs are mushrooming in HITEC City, driving a new wave of employment.",
      content: "Hyderabad continues its journey as India's premier tech hub. In Q1 2026, several global tech giants announced new campus expansions in the HITEC City and Gachibowli areas. The focus has shifted significantly towards Generative AI and green data centers. Local authorities are also investing in faster commute options including the new Metro Phase 3 extensions...",
      author: "Priya Sharma",
      publishedAt: new Date().toISOString(),
      source: "Nova India",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
      category: "Technology",
      location: "Hyderabad"
    },
    {
      id: "2",
      title: "India's New AI Regulation Framework Announced",
      description: "The government unveils a balanced approach to encourage innovation while ensuring data privacy and ethical AI usage.",
      content: "The Ministry of Electronics and IT has released the 2026 AI Governance Framework. It mandates transparency for large models while offering sandboxes for startups to experiment. This move is seen as a major step in position India as a global AI leader...",
      author: "Rahul Varma",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: "Business Nova",
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      category: "AI",
      location: "India"
    },
    {
       id: "3",
       title: "Major Infrastructure Breakthrough in Hyderabad Metro",
       description: "The new underground section connecting old city to the airport is now 90% complete.",
       content: "A major engineering milestone was achieved today as the tunnel boring machines completed the final stretch of the Musi river crossing. This critical link is expected to reduce travel time from Charminar to Shamshabad to under 40 minutes...",
       author: "Mohammed Ali",
       publishedAt: new Date(Date.now() - 7200000).toISOString(),
       source: "City News",
       url: "#",
       urlToImage: "https://images.unsplash.com/photo-1605623049386-88d447d6d37a?auto=format&fit=crop&q=80&w=800",
       category: "Hyderabad",
       location: "Hyderabad"
    },
    {
        id: "4",
        title: "T20 World Cup 2026: India Takes on Australia in Semi-Finals",
        description: "The nation holds its breath as the Men in Blue prepare for a high-stakes clash at the MCG.",
        content: "Cricket fever has reached a boiling point. Captain Hardik Pandya expressed confidence in the team's depth. Fans in Hyderabad and Mumbai have planned massive screenings...",
        author: "Sanjay Rao",
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: "Nova Sports",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
        category: "Sports"
    },
    {
        id: "5",
        title: "Hyderabad's Aerospace Sector Gets $500M Boost",
        description: "New manufacturing unit for satellite components to be set up near Adibatla.",
        content: "The state government has signed a multi-year deal with a leading aerospace consortium. This facility will specialize in 3D-printed composite materials for low-earth orbit satellites...",
        author: "Vikram Seth",
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: "Economic Nova",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
        category: "Business",
        location: "Hyderabad"
    },
    {
        id: "6",
        title: "Gaming Revolution: India's First AAA Title 'Garuda' Breaks Records",
        description: "Developed primarily in Bengaluru and Hyderabad, the game sells 2M copies in its first week.",
        content: "Garuda: The Awakening, an action RPG inspired by Indian mythology, has taken the world by storm. Its hyper-realistic graphics and deep narrative have earned it praise from global critics...",
        author: "Anish Gupta",
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        source: "Nova Gaming",
        url: "#",
        urlToImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
        category: "Gaming"
    }
  ];

  // API Routes
  app.get("/api/news", (req, res) => {
    const { category, location } = req.query;
    let filtered = [...articles];
    if (category && category !== 'General') {
      filtered = filtered.filter(a => a.category === category);
    }
    if (location) {
        filtered = filtered.filter(a => a.location === (location as string));
    }
    res.json(filtered);
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
