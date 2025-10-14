// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// interface Message {
//   role: "user" | "bot";
//   content: string;
// }

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);
// const model = genAI.getGenerativeModel({
//   model: "gemini-2.0-flash",
//   systemInstruction: `
//     You are a helpful AI customer support assistant.
//     - Answer customer questions based on your knowledge or provided FAQs.
//     - Be friendly, concise, and professional.
//     - Only respond with "Sorry, I’ll escalate this to a human representative" if you truly cannot answer.
//   `,
// });

// // Optional: small FAQ context
// const faqContext = `
// FAQs:
// Q: How can I reset my password?
// A: You can reset your password from the settings page.

// Q: What are your support hours?
// A: Our support is available 24/7.

// Q: Where can I buy a shirt?
// A: You can buy shirts at our online store: https://example.com/shop
// `;

// export async function POST(req: NextRequest) {
//   try {
//     const {
//       userId,
//       message,
//       conversation = [],
//     }: {
//       userId: string;
//       message: string;
//       conversation?: Message[];
//     } = await req.json();

//     // Map using the Message type
//     const historyText = conversation
//       .map(
//         (msg: Message) =>
//           `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
//       )
//       .join("\n");

//     const prompt = `
// You are a helpful AI customer support assistant.
// Use the FAQ context to answer questions:
// ${faqContext}

// Conversation history:
// ${historyText}

// User: ${message}

// Assistant:
// `;

//     const result = await model.generateContent(prompt);
//     const aiResponse = result.response.text();

//     return NextResponse.json({ response: aiResponse });
//   } catch (err) {
//     console.error("Chat error:", err);
//     return NextResponse.json({
//       response: "⚠️ Oops! Something went wrong. Please try again.",
//     });
//   }
// }

//💔💔💔💔

// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { messages, sessions } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { geminiModel } from "@/lib/gemini";

// interface ChatRequestBody {
//   userId: string;
//   message: string;
// }

// export async function POST(req: Request) {
//   const body: ChatRequestBody = await req.json();
//   const { userId, message } = body;

//   // Find or create session
//   let session = await db.query.sessions.findFirst({
//     where: eq(sessions.userId, userId),
//   });

//   if (!session) {
//     const [newSession] = await db
//       .insert(sessions)
//       .values({ userId })
//       .returning();
//     session = newSession;
//   }

//   // Get previous messages
//   const history = await db.query.messages.findMany({
//     where: eq(messages.sessionId, session.id),
//     orderBy: (m, { asc }) => [asc(m.createdAt)],
//   });

//   const historyText = history.map((m) => `${m.role}: ${m.content}`).join("\n");

//   const faqContext = `
// FAQs:
// Q: How can I reset my password?
// A: You can reset your password from the settings page.

// Q: What are your support hours?
// A: Our support is available 24/7.
// `;

//   const prompt = `
// You are a helpful AI customer support assistant.
// Use the FAQ context to answer questions if possible.


// ${faqContext}

// Conversation history:
// ${historyText}

// User: ${message}

// Assistant:
// `;

//   // Generate AI response
//   const result = await geminiModel.generateContent(prompt);
//   const aiResponse = result.response.text();

//   // Save new messages
//   await db.insert(messages).values([
//     { sessionId: session.id, role: "user", content: message },
//     { sessionId: session.id, role: "bot", content: aiResponse },
//   ]);

//   return NextResponse.json({ response: aiResponse });
// }
//💔💔💔💔

import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { geminiModel } from "@/lib/gemini";

interface ChatRequestBody {
  userId: string;
  message: string;
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export async function POST(req: Request) {
  const body: ChatRequestBody = await req.json();
  const { userId, message } = body;

  // Find or create session
  let session = await db.query.sessions.findFirst({
    where: eq(sessions.userId, userId),
  });

  if (!session) {
    const [newSession] = await db
      .insert(sessions)
      .values({ userId })
      .returning();
    session = newSession;
  }

  // Get previous messages
  const history = await db.query.messages.findMany({
    where: eq(messages.sessionId, session.id),
    orderBy: (m, { asc }) => [asc(m.createdAt)],
  });

 const historyText = history
  .map((m) => {
    const role = m.role === "user" || m.role === "bot" ? m.role : "bot"; // fallback to 'bot' if something unexpected
    return `${role === "user" ? "User" : "Assistant"}: ${m.content}`;
  })
  .join("\n");

  // FAQ context
  const faqContext = `
FAQs:
Q: How can I reset my password?
A: You can reset your password from the settings page.

Q: What are your support hours?
A: Our support is available 24/7.

Q: Where can I buy a shirt?
A: You can buy shirts at https://example.com/shop
`;

  const prompt = `
You are a helpful AI customer support assistant.
Use the FAQ context to answer questions if possible.

${faqContext}

Conversation history:
${historyText}

User: ${message}

Assistant:
`;

  // Generate AI response
  const result = await geminiModel.generateContent(prompt);
  const aiResponse = result.response.text();

  // Save new messages
  await db.insert(messages).values([
    { sessionId: session.id, role: "user", content: message },
    { sessionId: session.id, role: "bot", content: aiResponse },
  ]);

  return NextResponse.json({ response: aiResponse });
}
