import { FileText, RefreshCcw, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const CATEGORY_LABELS = {
  procedure: "Procédure",
  guide: "Guide",
  technique: "Doc. technique",
  faq: "FAQ",
  autre: "Autre",
};

const STATUS_CONFIG = {
  ready: { icon: CheckCircle2, label: "Prêt", className: "status--ready" },
  processing: { icon: Loader2, label: "Indexation…", className: "status--processing" },
  pending: { icon: Loader2, label: "En attente", className: "status--processing" },
  error: { icon: XCircle, label: "Erreur", className: "status--error" },
};

export default function DocumentList({ documents, onDelete, onReindex }) {
  if (documents.length === 0) {
    return (
      <div className="doc-list__empty">
        Aucun document indexé pour l'instant. Ajoutez votre première procédure,
        guide ou FAQ ci-contre.
      </div>
    );
  }

  return (
    <div className="doc-list">
      {documents.map((doc) => {
        const status = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
        const StatusIcon = status.icon;
        return (
          <div className="doc-card" key={doc.id}>
            <div className="doc-card__icon">
              <FileText size={17} />
            </div>
            <div className="doc-card__info">
              <div className="doc-card__title-row">
                <span className="doc-card__title">{doc.title}</span>
                <span className="doc-card__category">
                  {CATEGORY_LABELS[doc.category] || doc.category}
                </span>
              </div>
              {doc.description && (
                <p className="doc-card__description">{doc.description}</p>
              )}
              <div className="doc-card__meta">
                <span className={"doc-card__status " + status.className}>
                  <StatusIcon
                    size={12}
                    className={doc.status === "processing" ? "spin" : ""}
                  />
                  {status.label}
                </span>
                {doc.status === "ready" && <span>{doc.chunk_count} fragments indexés</span>}
                {doc.status === "error" && (
                  <span className="doc-card__error" title={doc.error_message}>
                    {doc.error_message}
                  </span>
                )}
              </div>
            </div>
            <div className="doc-card__actions">
              <button
                className="doc-card__action-btn"
                title="Réindexer"
                onClick={() => onReindex(doc.id)}
              >
                <RefreshCcw size={14} />
              </button>
              <button
                className="doc-card__action-btn doc-card__action-btn--danger"
                title="Supprimer"
                onClick={() => onDelete(doc.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
