import React, { useEffect, useRef } from "react";
import styles from "./Chat.module.css";

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export interface ChatProps {
  messages: ChatMessage[];
}

/**
 * Displays the chat history.
 * Scrolls smoothly when new messages arrive.
 */
export const Chat: React.FC<ChatProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.messages}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={
            msg.sender === "user"
              ? `${styles.msgRow} ${styles.msgRowUser}`
              : `${styles.msgRow} ${styles.msgRowAssistant}`
          }
        >
          <div
            className={
              msg.sender === "user"
                ? `${styles.messageBubble} ${styles.messageBubbleUser}`
                : styles.messageBubble
            }
          >
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};