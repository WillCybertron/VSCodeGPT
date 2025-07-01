import React, { useEffect, useRef, useState } from "react";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

const vscode = window.acquireVsCodeApi();

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for responses from extension backend
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const msg = event.data;
      if (msg?.type === "chat-response" && typeof msg.text === "string") {
        setMessages((prev) => [
          ...prev,
          { sender: "assistant", text: msg.text },
        ]);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    vscode.postMessage({ type: "chat-message", text: trimmed });
    setInput("");
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", minHeight: "100vh",
      background: "#1e1e1e", color: "#fff"
    }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              margin: "8px 0",
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "#2d8fff" : "#333",
                color: msg.sender === "user" ? "#fff" : "#eee",
                padding: "10px 16px",
                borderRadius: 16,
                maxWidth: "70%",
                whiteSpace: "pre-wrap",
                fontSize: 15
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          padding: 12,
          borderTop: "1px solid #333",
          background: "#252526",
        }}
      >
        <input
          type="text"
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #444",
            marginRight: 8,
            fontSize: 16,
            background: "#1e1e1e",
            color: "#fff"
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          autoFocus
        />
        <button
          type="submit"
          style={{
            background: "#2d8fff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: 16
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}