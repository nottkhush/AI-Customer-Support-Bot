# AI Customer Support Bot

## Demo video link
https://drive.google.com/file/d/1CaD2xLHVBttt0KRzyQNSLLrBbprWkzjk/view?usp=sharing

## 🚀 Project Overview

**AI Customer Support Bot** is a modern AI-powered chatbot built with **Next.js 13**, **Drizzle ORM**, **Neon PostgreSQL**, and the **Google Gemini API**. It simulates real-time customer support, answering FAQs and escalating queries that it cannot handle.  

The bot features **contextual conversation memory**, session tracking, and a responsive frontend interface.

---

## 🌟 Features

- AI-powered responses using **Google Gemini LLM**.  
- Persistent conversation history per user session.  
- FAQ-based response generation for common queries.  
- Escalation simulation when the bot cannot answer.  
- Session and message storage in **Neon PostgreSQL** via **Drizzle ORM**.  
- Responsive chat interface built with **Next.js 13 App Router** and **Tailwind CSS**.  
- Easy deployment on **Vercel**.  

---

## 🛠️ Tech Stack

| Layer             | Technology |
|------------------|------------|
| Frontend          | Next.js 13, Tailwind CSS, React |
| Backend / API     | Next.js API Routes (App Router), TypeScript |
| Database          | PostgreSQL (Neon) |
| ORM / Query       | Drizzle ORM |
| AI / LLM          | Google Gemini API |

---


## 📁 Project Structure

ai-chat-bot/
├─ app/
│ ├─ api/chat/route.ts # API route for chat interactions
│ └─ page.tsx # Frontend chat interface
├─ db/
│ ├─ index.ts # Drizzle database setup
│ └─ schema.ts # Database table definitions
├─ drizzle/
│ └─ 0000_spooky_baron_strucker.sql # Initial migration
├─ lib/
│ └─ gemini.ts # Google Gemini API integration
├─ package.json
├─ tsconfig.json
├─ next.config.js
└─ README.md


---


## 📝 Usage

- Type your question in the input box and press **Enter** or click **Send**.
- The bot uses stored conversation history and FAQ context to respond.
- Example questions:
  - `Where can I buy a shirt?`
  - `How can I reset my password?`
  - `What are your support hours?`
- If the bot cannot answer a question, it responds with:
      Sorry, I’ll escalate this to a human representative.
- Use the **Reset** button to start a new chat session.


## 💻 API Route

**POST** `/api/chat`

**Request Body:**

```json
{
  "userId": "demo-user",
  "message": "Where can I buy a shirt?",
  "conversation": [
    { "role": "user", "content": "hello" },
    { "role": "bot", "content": "Hi! How can I help you?" }
  ]
}
{
  "response": "You can buy shirts at https://example.com/shop"
}
```

## 🧠 AI Integration

- Uses **Google Gemini 2.0 Flash** model.
- System instruction ensures the bot:
  - Answers FAQs.
  - Provides professional, concise responses.
  - Only escalates when it cannot answer.
- Supports **conversation history** to maintain context across messages.

---

## ❤️ Acknowledgements

- Built with **Next.js**, **Drizzle ORM**, **Tailwind CSS**, and **Google Gemini**.
- Inspired by modern AI-powered customer support systems.

