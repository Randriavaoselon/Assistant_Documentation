"""
Génération des embeddings via sentence-transformers.

Le modèle est chargé une seule fois (singleton) car son chargement est
coûteux : on évite de le recharger à chaque requête.
"""
from functools import lru_cache
from django.conf import settings


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(settings.EMBEDDING_MODEL)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Génère les embeddings pour une liste de textes."""
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return embeddings.tolist()


def embed_query(query: str) -> list[float]:
    """Génère l'embedding pour une seule requête utilisateur."""
    return embed_texts([query])[0]
