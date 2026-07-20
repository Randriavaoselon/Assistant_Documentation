import { useEffect, useRef } from "react";
import { BookMarked } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";
import { useChat } from "../../context/ChatContext.jsx";

const SUGGESTIONS = [
  "Comment créer un nouvel utilisateur dans Odoo ?",
  "Quelle est la procédure de remboursement des notes de frais ?",
  "Où trouver le guide d'intégration des nouveaux employés ?",
  "Comment réinitialiser mon accès VPN ?",
];

export default function ChatWindow() {
  const { messages, isSending, sendMessage } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  return (
    <div className="chat-window">
      <div className="chat-window__scroll" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty__icon">
              <BookMarked size={26} color="var(--color-accent)" />
            </div>
            <h2 className="chat-empty__title">Que souhaitez-vous savoir ?</h2>
            <p className="chat-empty__subtitle">
              Je réponds à partir des procédures, guides, documentation technique
              et FAQ de l'entreprise indexés dans la base.
            </p>
            <div className="chat-empty__suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="chat-empty__suggestion"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-window__messages">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isSending && (
              <div className="message message--assistant">
                <div className="message__avatar">
                  <BookMarked size={15} />
                </div>
                <div className="message__content">
                  <div className="message__bubble message__bubble--typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="chat-window__input-bar">
        <ChatInput onSend={sendMessage} disabled={isSending} />
        <div className="chat-window__disclaimer">
          L'assistant peut se tromper. Vérifiez les informations sensibles auprès du
          service concerné.
        </div>
      </div>
    </div>
  );
}
