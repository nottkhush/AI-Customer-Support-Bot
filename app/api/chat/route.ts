import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { geminiModel } from "@/lib/gemini";
import faqData from "@/data/faq.json"; // import your FAQ JSON

interface ChatRequestBody {
  userId: string;
  message: string;
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
      const role = m.role === "user" || m.role === "bot" ? m.role : "bot"; // fallback to 'bot' if unexpected
      return `${role === "user" ? "User" : "Assistant"}: ${m.content}`;
    })
    .join("\n");

  // Build FAQ context dynamically from JSON
  const faqContext = faqData.questions
    .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
    .join("\n\n");

  const prompt = `
You are a helpful AI customer support assistant.

- Use the FAQ context below to answer questions when applicable.
- If the user's question is not covered by the FAQs, provide a professional and concise answer using your general knowledge.
- Only escalate to a human if you truly cannot provide an answer.

FAQs:
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
