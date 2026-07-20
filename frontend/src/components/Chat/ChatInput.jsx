import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        className="chat-input__field"
        placeholder="Posez une question sur les procédures, guides ou la documentation technique…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
      />
      <button
        type="submit"
        className="chat-input__send"
        disabled={disabled || !value.trim()}
        aria-label="Envoyer"
      >
        <SendHorizontal size={17} />
      </button>
    </form>
  );
}
