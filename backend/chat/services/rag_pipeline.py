"""
Orchestration du pipeline RAG complet : récupération des chunks pertinents
puis génération de la réponse via le LLM.
"""
from .retriever import retrieve_relevant_chunks
from .groq_client import generate_answer, GroqClientError

# En dessous de ce score de similarité, on considère qu'aucun document
# pertinent n'a été trouvé (le LLM devra le dire honnêtement).
MIN_RELEVANCE_SCORE = 0.15


def answer_question(question: str, history: list[dict] | None = None) -> dict:
    """
    Exécute le pipeline RAG pour une question donnée.

    Retourne : {"answer": str, "sources": list[dict]}
    """
    chunks = retrieve_relevant_chunks(question)
    relevant_chunks = [c for c in chunks if c["score"] >= MIN_RELEVANCE_SCORE]

    try:
        answer = generate_answer(question, relevant_chunks, history=history)
    except GroqClientError as exc:
        answer = (
            "Désolé, je ne peux pas générer de réponse pour le moment "
            f"({exc}). Contactez votre administrateur système."
        )
        relevant_chunks = []

    sources = [
        {
            "document_id": c["document_id"],
            "document_title": c["document_title"],
            "category": c["category"],
            "score": c["score"],
        }
        for c in relevant_chunks
    ]
    # Déduplique les sources par document (garde le meilleur score)
    seen = {}
    for s in sources:
        key = s["document_id"]
        if key not in seen or s["score"] > seen[key]["score"]:
            seen[key] = s
    deduped_sources = sorted(seen.values(), key=lambda s: s["score"], reverse=True)

    return {"answer": answer, "sources": deduped_sources}
