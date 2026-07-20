"""
Interface avec le vector store ChromaDB (persistant sur disque).

Une seule collection ("company_docs") contient les chunks de tous les
documents. Chaque vecteur porte des métadonnées (document_id, titre,
catégorie, chunk_index) qui permettent de filtrer et de retrouver la source.
"""
from functools import lru_cache
from django.conf import settings


@lru_cache(maxsize=1)
def get_chroma_client():
    import chromadb

    return chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)


def get_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=settings.CHROMA_COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def add_chunks(vector_ids, embeddings, documents, metadatas):
    """Ajoute des chunks (avec leurs embeddings déjà calculés) à la collection."""
    collection = get_collection()
    collection.add(
        ids=vector_ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )


def delete_document_vectors(document_id: str):
    """Supprime tous les vecteurs appartenant à un document donné."""
    collection = get_collection()
    collection.delete(where={"document_id": str(document_id)})


def query_similar_chunks(query_embedding: list[float], top_k: int = 5, where=None):
    """Retourne les chunks les plus proches sémantiquement de la requête."""
    collection = get_collection()
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where,
    )
    return results
