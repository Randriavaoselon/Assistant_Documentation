import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { uploadDocument } from "../../api/client.js";

const CATEGORIES = [
  { value: "procedure", label: "Procédure interne" },
  { value: "guide", label: "Guide" },
  { value: "technique", label: "Documentation technique" },
  { value: "faq", label: "FAQ" },
  { value: "autre", label: "Autre" },
];

export default function DocumentUpload({ onUploaded }) {
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("procedure");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selected) => {
    if (!selected) return;
    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    handleFileChange(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Sélectionnez un fichier (PDF, DOCX, TXT ou MD).");
      return;
    }
    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title || file.name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const doc = await uploadDocument(formData);
      onUploaded?.(doc);
      setTitle("");
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const message =
        err?.response?.data?.file?.[0] ||
        err?.response?.data?.detail ||
        "Échec de l'envoi du document. Vérifiez le format et réessayez.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form className="doc-upload" onSubmit={handleSubmit}>
      <div
        className={"doc-upload__dropzone" + (isDragging ? " doc-upload__dropzone--active" : "")}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={22} color="var(--color-accent)" />
        <p className="doc-upload__dropzone-text">
          {file ? file.name : "Glissez un fichier ici ou cliquez pour parcourir"}
        </p>
        <span className="doc-upload__dropzone-hint">PDF, DOCX, TXT, MD — 25 Mo max</span>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          hidden
          onChange={(e) => handleFileChange(e.target.files?.[0])}
        />
      </div>

      <div className="doc-upload__row">
        <div className="doc-upload__field">
          <label>Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Procédure création utilisateur Odoo"
          />
        </div>
        <div className="doc-upload__field doc-upload__field--small">
          <label>Catégorie</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="doc-upload__field">
        <label>Description (optionnel)</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Contexte utile pour retrouver ce document plus tard"
        />
      </div>

      {error && <div className="doc-upload__error">{error}</div>}

      <button className="doc-upload__submit" type="submit" disabled={isUploading}>
        {isUploading ? (
          <>
            <Loader2 size={15} className="spin" /> Indexation en cours…
          </>
        ) : (
          "Ajouter et indexer"
        )}
      </button>
    </form>
  );
}
