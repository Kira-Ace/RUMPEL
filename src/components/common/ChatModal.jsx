import React, { useState, useRef, useEffect } from "react";
import { X, Loader2, Send } from "lucide-react";
import rumpelIcon from "../assets/rumpel.png";
import "../../styles/chatmodal.css";

/**
 * Chat Modal component for talking to Rumpel AI.
 * Full-screen modal that manages conversation history with Gemini API.
 */
export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "API key not configured 🤷" },
        ]);
        setLoading(false);
        return;
      }

      const url = "https://router.huggingface.co/v1/chat/completions";

      // Build conversation history (OpenAI-compatible format)
      const chatMessages = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.text,
          VITE_GOOGLE_API_KEY=AIzaSyABZpfBDr4uKCqAwCddDc3TOTnzyfm6m64      })),
        {
          role: "user",
          content: userMessage,
        },
      ];

      const payload = {
        model: "moonshotai/Kimi-K2-Instruct-0905",
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.8,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.[0]?.message || error.error || "API request failed");
      }

      const data = await res.json();
      const responseText =
        data.choices?.[0]?.message?.content ||
        "Hmm, didn't quite catch that! 🤔";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Error: ${err.message || "Failed to connect"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        {/* Header */}
        <div className="chat-modal-header">
          <div className="chat-modal-title">
            <img src={rumpelIcon} alt="Rumpel" className="chat-modal-icon" />
            <h2>Rumpel</h2>
          </div>
          <button className="chat-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-modal-messages">
          {messages.length === 0 && (
            <div className="chat-modal-empty">
              <img src={rumpelIcon} alt="Rumpel" className="chat-modal-welcome-icon" />
              <h3>Hey! I'm Rumpel 🧙</h3>
              <p>Ask me anything about your study plans, notes, or anything else!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message chat-message-${msg.role}`}>
              {msg.role === "assistant" && (
                <img src={rumpelIcon} alt="Rumpel" className="chat-avatar" />
              )}
              <div className={`chat-bubble chat-bubble-${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message chat-message-assistant">
              <img src={rumpelIcon} alt="Rumpel" className="chat-avatar" />
              <div className="chat-bubble chat-bubble-assistant chat-bubble-loading">
                <Loader2 size={18} className="spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-modal-input-area">
          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask Rumpel…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && send()}
              disabled={loading}
            />
            <button
              className="chat-send-btn"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 size={18} className="spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
