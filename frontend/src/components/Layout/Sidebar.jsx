import { NavLink } from "react-router-dom";
import {
  MessageSquareText,
  FolderArchive,
  Plus,
  Trash2,
  BookMarked,
  X,
} from "lucide-react";
import { useChat } from "../../context/ChatContext.jsx";

export default function Sidebar({ isOpen, onClose }) {
  const {
    conversations,
    activeConversationId,
    startNewConversation,
    selectConversation,
    deleteConversation,
  } = useChat();

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Supprimer cette conversation ?")) {
      deleteConversation(id);
    }
  };

  const handleNewConversation = () => {
    startNewConversation();
    onClose?.();
  };

  const handleSelectConversation = (id) => {
    selectConversation(id);
    onClose?.();
  };

  return (
    <aside className={"sidebar" + (isOpen ? " sidebar--open" : "")}>
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark">
          <BookMarked size={20} color="var(--color-accent)" />
          <span className="sidebar__brand-title">Assistant Documentation</span>
        </div>
        <div className="sidebar__brand-subtitle">Base de connaissance interne</div>
        <button
          className="sidebar__close-btn"
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar__nav">
        <NavLink
          to="/"
          end
          onClick={handleNewConversation}
          className={({ isActive }) =>
            "sidebar__nav-link" + (isActive ? " sidebar__nav-link--active" : "")
          }
        >
          <MessageSquareText size={16} />
          Assistant
        </NavLink>
        <NavLink
          to="/documents"
          onClick={onClose}
          className={({ isActive }) =>
            "sidebar__nav-link" + (isActive ? " sidebar__nav-link--active" : "")
          }
        >
          <FolderArchive size={16} />
          Documents
        </NavLink>
      </nav>

      <button className="sidebar__new-btn" onClick={handleNewConversation}>
        <Plus size={15} />
        Nouvelle conversation
      </button>

      <div className="sidebar__section-label">Historique</div>
      <div className="sidebar__history">
        {conversations.length === 0 && (
          <div style={{ padding: "8px 12px", color: "var(--color-text-faint)", fontSize: 13 }}>
            Aucune conversation pour l'instant.
          </div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className={
              "sidebar__history-item" +
              (conv.id === activeConversationId ? " sidebar__history-item--active" : "")
            }
            onClick={() => handleSelectConversation(conv.id)}
          >
            <span className="sidebar__history-title">{conv.title || "Sans titre"}</span>
            <span
              className="sidebar__history-delete"
              onClick={(e) => handleDelete(e, conv.id)}
              role="button"
              aria-label="Supprimer"
            >
              <Trash2 size={13} />
            </span>
          </button>
        ))}
      </div>

      <div className="sidebar__footer">Archiviste RAG · v1.0</div>
    </aside>
  );
}
