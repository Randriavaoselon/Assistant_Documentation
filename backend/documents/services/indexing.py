"""
Pipeline d'ingestion d'un document :
extraction du texte -> découpage en chunks -> embeddings -> stockage vectoriel.

Ce pipeline s'exécute de façon synchrone dans la vue d'upload pour ce MVP.
Pour des volumes importants en production, on le déplacerait vers une tâche
asynchrone (Celery + Redis, ou django-q).
"""
import uuid
import logging

from .extraction import extract_text, ExtractionError
from .chunking import chunk_text
from .embeddings import embed_texts
from . import vectorstore

logger = logging.getLogger(__name__)


class IndexingError(Exception):
    pass


def index_document(document):
    """
    Traite un objet Document : extrait le texte, le découpe, calcule les
    embeddings et les stocke dans ChromaDB. Crée les DocumentChunk associés.

    Lève IndexingError en cas de problème (le statut du document est mis à
    jour par l'appelant).
    """
    from documents.models import DocumentChunk

    try:
        raw_text = extract_text(document.file.path, document.file_type)
    except ExtractionError as exc:
        raise IndexingError(str(exc)) from exc

    chunks = chunk_text(raw_text)
    if not chunks:
        raise IndexingError("Le document ne contient aucun texte exploitable.")

    texts = [c.text for c in chunks]
    embeddings = embed_texts(texts)

    vector_ids = [str(uuid.uuid4()) for _ in chunks]
    metadatas = [
        {
            "document_id": str(document.id),
            "document_title": document.title,
            "category": document.category,
            "chunk_index": c.index,
        }
        for c in chunks
    ]

    vectorstore.add_chunks(
        vector_ids=vector_ids,
        embeddings=embeddings,
        documents=texts,
        metadatas=metadatas,
    )

    DocumentChunk.objects.bulk_create(
        [
            DocumentChunk(
                id=uuid.uuid4(),
                document=document,
                chunk_index=c.index,
                content_preview=c.text[:300],
                vector_id=vector_ids[i],
            )
            for i, c in enumerate(chunks)
        ]
    )

    return len(chunks)


def remove_document_index(document):
    """Supprime les vecteurs et les chunks associés à un document."""
    vectorstore.delete_document_vectors(document.id)
    document.chunks.all().delete()
