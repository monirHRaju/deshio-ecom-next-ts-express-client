"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, Sparkles, X, ArrowUp } from "lucide-react";
import api from "@/lib/axios";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "model",
  content:
    "Hi! I'm your Deshio shopping assistant. Ask me about products, recommendations, or anything about our store!",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send history without the welcome message
      const history = updatedMessages
        .filter((_, i) => i > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.post("/ai/chat", {
        message: text,
        history: history.slice(0, -1), // exclude current message from history
      });

      const reply = res.data?.data?.reply || "Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: "model", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            "Sorry, I'm having trouble right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-40 flex flex-col w-[380px] max-h-[520px] rounded-2xl shadow-2xl bg-base-100 border border-base-300 transition-all duration-300 origin-bottom-right max-sm:w-[calc(100vw-2rem)] max-sm:right-4 max-sm:left-4 max-sm:bottom-24 ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary text-primary-content rounded-t-2xl px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold text-sm">Deshio Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="btn btn-ghost btn-xs btn-circle text-primary-content hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble text-sm ${
                  msg.role === "user"
                    ? "chat-bubble-primary"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-bubble bg-base-200 text-base-content">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-base-300 p-3 flex gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            disabled={isLoading}
            className="input input-bordered input-sm flex-1 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="btn btn-primary btn-sm btn-circle"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 tooltip tooltip-left" data-tip="Chat with Deshio Assistant">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-primary btn-circle w-14 h-14 shadow-lg"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
      </div>
    </>
  );
}
