import ReactMarkdown from "react-markdown";
import { User, BookMarked } from "lucide-react";
import SourceCard from "./SourceCard.jsx";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={"message" + (isUser ? " message--user" : " message--assistant")}>
      <div className="message__avatar">
        {isUser ? <User size={15} /> : <BookMarked size={15} />}
      </div>
      <div className="message__content">
        <div className="message__bubble">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="message__sources">
            <div className="message__sources-label">Sources consultées</div>
            <div className="message__sources-list">
              {message.sources.map((source) => (
                <SourceCard key={source.document_id} source={source} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
