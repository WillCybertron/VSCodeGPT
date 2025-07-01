import React from "react";
import styles from "./ChatInput.module.css";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

/**
 * Controlled chat message input with VS Code codicon send button.
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSend();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.inputBar}
      autoComplete="off"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
        placeholder="Type your message…"
        autoFocus
        disabled={disabled}
        aria-label="Type a message"
      />
      <button
        type="submit"
        aria-label="Send message"
        className={styles.sendButton}
        disabled={disabled || !value.trim()}
        tabIndex={0}
      >
        <span className={`codicon codicon-mail ${styles.sendIcon}`} />
      </button>
    </form>
  );
};