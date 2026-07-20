import { useCallback, useEffect, useState } from "react";
import DocumentUpload from "../components/Documents/DocumentUpload.jsx";
import DocumentList from "../components/Documents/DocumentList.jsx";
import {
  fetchDocuments,
  deleteDocument,
  reindexDocument,
} from "../api/client.js";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data.results ?? data);
    } catch (err) {
      console.error("Impossible de charger les documents", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Rafraîchit périodiquement pendant qu'un document est en cours d'indexation
  useEffect(() => {
    const hasProcessing = documents.some(
      (d) => d.status === "processing" || d.status === "pending"
    );
    if (!hasProcessing) return;
    const interval = setInterval(loadDocuments, 3000);
    return () => clearInterval(interval);
  }, [documents, loadDocuments]);

  const handleUploaded = (doc) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce document et ses données indexées ?")) return;
    await deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleReindex = async (id) => {
    const updated = await reindexDocument(id);
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
  };

  return (
    <div className="page page--documents">
      <div className="page-header">
        <h1>Documents</h1>
        <p className="page-header__subtitle">
          Gérez les procédures, guides, documentation technique et FAQ utilisés
          par l'assistant pour répondre aux employés.
        </p>
      </div>

      <div className="documents-layout">
        <div className="documents-layout__upload">
          <h3 className="documents-layout__heading">Ajouter un document</h3>
          <DocumentUpload onUploaded={handleUploaded} />
        </div>
        <div className="documents-layout__list">
          <h3 className="documents-layout__heading">
            Documents indexés {!isLoading && `(${documents.length})`}
          </h3>
          {isLoading ? (
            <div className="doc-list__empty">Chargement…</div>
          ) : (
            <DocumentList
              documents={documents}
              onDelete={handleDelete}
              onReindex={handleReindex}
            />
          )}
        </div>
      </div>
    </div>
  );
}
