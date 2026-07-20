"""
Appel au LLM (via Groq) pour générer une réponse à partir du contexte
récupéré (RAG). Le prompt système contraint le modèle à ne répondre qu'à
partir des documents fournis, et à signaler explicitement quand
l'information n'est pas disponible.
"""
from django.conf import settings

SYSTEM_PROMPT = """Tu es l'assistant documentaire interne d'une entreprise. \
Tu réponds aux questions des employés UNIQUEMENT à partir des extraits de \
documentation fournis ci-dessous (procédures, guides, documentation \
technique, FAQ).

Règles strictes :
1. Base ta réponse exclusivement sur le CONTEXTE fourni. N'invente rien.
2. Si le contexte ne contient pas la réponse, dis clairement que tu ne \
trouves pas cette information dans la documentation, et suggère à \
l'utilisateur de contacter le service concerné ou de reformuler sa question.
3. Sois précis et actionnable : si c'est une procédure, donne les étapes \
dans l'ordre.
4. Cite la ou les sources (titre du document) sur lesquelles tu t'appuies, \
à la fin de ta réponse.
5. Réponds dans la même langue que la question posée.
6. Reste concis et professionnel.
"""


class GroqClientError(Exception):
    pass


def _build_context_block(chunks: list[dict]) -> str:
    if not chunks:
        return "(Aucun document pertinent trouvé dans la base documentaire.)"

    blocks = []
    for i, chunk in enumerate(chunks, start=1):
        blocks.append(
            f"--- Extrait {i} (source : {chunk['document_title']}) ---\n"
            f"{chunk['text']}"
        )
    return "\n\n".join(blocks)


def _build_history_messages(history: list[dict]) -> list[dict]:
    """Convertit l'historique de conversation (role/content) au format Groq."""
    messages = []
    for msg in history:
        role = "assistant" if msg["role"] == "assistant" else "user"
        messages.append({"role": role, "content": msg["content"]})
    return messages


def generate_answer(question: str, chunks: list[dict], history: list[dict] | None = None) -> str:
    """Génère la réponse finale en utilisant Groq, à partir du contexte RAG."""
    if not settings.GROQ_API_KEY:
        raise GroqClientError(
            "GROQ_API_KEY n'est pas configurée. Ajoutez-la dans le fichier .env "
            "(voir https://console.groq.com/keys)."
        )

    from groq import Groq

    client = Groq(api_key=settings.GROQ_API_KEY)

    context_block = _build_context_block(chunks)
    user_message = (
        f"CONTEXTE (documentation interne) :\n{context_block}\n\n"
        f"QUESTION DE L'EMPLOYÉ :\n{question}"
    )

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        messages.extend(_build_history_messages(history))
    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.2,
            max_tokens=1024,
        )
    except Exception as exc:
        raise GroqClientError(f"Erreur lors de l'appel à Groq : {exc}") from exc

    return response.choices[0].message.content
