// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: `
    You are a helpful AI customer support assistant.
    - Answer customer questions based on your knowledge and provided FAQs.
    - Be friendly, concise, and professional.
    - Only respond with "Sorry, I’ll escalate this to a human representative" if you truly cannot answer.
  `,
});

// Helper function to generate AI responses
export async function generateChatResponse(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export { geminiModel };
