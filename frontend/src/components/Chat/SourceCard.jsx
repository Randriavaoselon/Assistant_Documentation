const CATEGORY_LABELS = {
  procedure: "Procédure",
  guide: "Guide",
  technique: "Doc. technique",
  faq: "FAQ",
  autre: "Autre",
};

export default function SourceCard({ source }) {
  const confidence = Math.round((source.score ?? 0) * 100);
  const label = CATEGORY_LABELS[source.category] || source.category;

  return (
    <div className="source-card">
      <div className="source-card__tab">{label}</div>
      <div className="source-card__body">
        <span className="source-card__title">{source.document_title}</span>
        <div className="source-card__meter" title={`Pertinence : ${confidence}%`}>
          <div
            className="source-card__meter-fill"
            style={{ width: `${Math.min(confidence, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
