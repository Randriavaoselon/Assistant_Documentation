"""
Récupération (retrieval) des passages de documentation les plus pertinents
pour une question donnée.
"""
from django.conf import settings

from documents.services.embeddings import embed_query
from documents.services import vectorstore


def retrieve_relevant_chunks(question: str, top_k: int | None = None) -> list[dict]:
    """
    Retourne une liste de chunks pertinents, chacun sous la forme :
    {"text": str, "document_title": str, "document_id": str,
     "category": str, "chunk_index": int, "score": float}
    """
    top_k = top_k or settings.RAG_TOP_K
    query_embedding = embed_query(question)
    results = vectorstore.query_similar_chunks(query_embedding, top_k=top_k)

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    chunks = []
    for text, metadata, distance in zip(documents, metadatas, distances):
        # distance cosine -> score de similarité (1 = identique, 0 = opposé)
        similarity = 1 - distance
        chunks.append(
            {
                "text": text,
                "document_id": metadata.get("document_id"),
                "document_title": metadata.get("document_title"),
                "category": metadata.get("category"),
                "chunk_index": metadata.get("chunk_index"),
                "score": round(similarity, 4),
            }
        )
    return chunks
