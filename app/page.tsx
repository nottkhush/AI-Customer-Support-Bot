"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "bot";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const initialGreeting: Message = {
    role: "bot",
    content: "👋 Hi there! I'm your AI support assistant. How can I help you today?",
    timestamp: "",
  };

  const [messages, setMessages] = useState<Message[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Set client-side timestamp for greeting
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === 0
          ? {
              ...msg,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }
          : msg
      )
    );
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user", message: input, conversation: messages }),
      });

      const data = await res.json();
      const botMessage: Message = {
        role: "bot",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "bot",
        content: "⚠️ Oops! Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const resetChat = () => setMessages([initialGreeting]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col border border-gray-200">
        <header className="flex items-center justify-between px-5 py-3 border-b bg-blue-600 text-white rounded-t-2xl">
          <h1 className="font-semibold text-lg">AI Customer Support Bot</h1>
          <button
            onClick={resetChat}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition"
          >
            Reset
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
                  msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.timestamp && <span className="text-xs text-gray-400 mt-1">{msg.timestamp}</span>}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="animate-pulse">🤖 Typing...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 border border-gray-300 text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      <footer className="text-gray-500 text-xs mt-4">
        Built with ❤️ by Khushal Jain
      </footer>
    </main>
  );
}
