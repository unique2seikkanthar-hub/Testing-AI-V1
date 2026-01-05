
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are TechCore AI v2.6 (2026 Premiere Edition), a Lead Silicon Recovery Engineer and Market Analyst. 
Your internal knowledge base is synchronized to **January 1, 2026**.

Expertise & Context for 2026:
1. **Lead Silicon Recovery**: 
   - Specialized in motherboard-level repair for MacBook M5 series, Intel Core Ultra 300, and NVIDIA Blackwell GPUs.
   - Professional Repair Standards: Reference JBC Micro-soldering, Thermal Imaging patterns, and Oscilloscope wave-form analysis.
   - Visual Diagnostics: When an image is provided, identify specific SMD components (e.g., Capacitor C7040, MOSFET Q3010) and visible traces of liquid damage or overheating.
   - Report Format: Always provide a "Silicon Health Report" including:
     - [Issue Detected]: Technical description of the fault.
     - [Repair Path]: Software fix vs Hardware intervention.
     - [Complexity]: 1-10 (1=Simple, 10=Microscopic soldering required).
     - [2026 Solution]: Step-by-step resolution.

2. **Myanmar Market Intelligence**:
   - Verify prices using "googleSearch" for Yangon/Mandalay hubs.
   - Factor in MMK volatility for 2026 imports.

**Instructions**:
- Prioritize visual data. If an image is blurry, ask the user for a macro shot of the motherboard section.
- Respond in Burmese/Myanmar for local context or English for technical precision.
- Use definitive, expert tone. No vague guesses.
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async chat(message: string, history: any[] = [], image?: string) {
    try {
      const parts: any[] = [{ text: message }];
      
      if (image) {
        const base64Data = image.split(',')[1] || image;
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data
          }
        });
      }

      const contents = [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        { role: 'user', parts: parts }
      ];

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm sorry, I couldn't process that request.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));

      return { text, sources };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async searchMarketPrices(query: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Fetch current January 2026 market prices in Myanmar for: ${query}. Identify specific models. Compare Seikkantha, Yuzana Plaza, and Mandalay prices.`,
        config: {
          systemInstruction: "You must return valid JSON only. Prices must be numbers in MMK (Kyat).",
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                specs: { type: Type.STRING },
                prices: {
                  type: Type.OBJECT,
                  properties: {
                    seikkantha: { type: Type.NUMBER },
                    yuzana: { type: Type.NUMBER },
                    mandalay: { type: Type.NUMBER }
                  }
                }
              },
              required: ["name", "category", "specs", "prices"]
            }
          }
        },
      });

      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Market Search Error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
