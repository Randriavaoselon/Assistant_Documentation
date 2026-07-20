"""
Découpage du texte en chunks (fragments) adaptés à l'embedding et à la
recherche sémantique.

Stratégie : découpage récursif par paragraphes / phrases, avec une taille
cible en caractères et un chevauchement (overlap) pour ne pas couper le
contexte au milieu d'une idée.
"""
import re
from dataclasses import dataclass

CHUNK_SIZE = 1000  # caractères, cible
CHUNK_OVERLAP = 150  # caractères de chevauchement entre chunks consécutifs
MIN_CHUNK_SIZE = 50  # ignore les chunks résiduels trop petits


@dataclass
class Chunk:
    index: int
    text: str


def _split_into_paragraphs(text: str) -> list[str]:
    # Sépare sur les doubles sauts de ligne (paragraphes) en priorité
    paragraphs = re.split(r"\n\s*\n", text)
    return [p.strip() for p in paragraphs if p.strip()]


def _split_long_paragraph(paragraph: str, max_size: int) -> list[str]:
    """Découpe un paragraphe trop long sur les limites de phrases."""
    if len(paragraph) <= max_size:
        return [paragraph]

    sentences = re.split(r"(?<=[.!?])\s+", paragraph)
    pieces, current = [], ""
    for sentence in sentences:
        if len(current) + len(sentence) + 1 <= max_size:
            current = f"{current} {sentence}".strip()
        else:
            if current:
                pieces.append(current)
            # Phrase elle-même trop longue : découpage brut par blocs
            if len(sentence) > max_size:
                for i in range(0, len(sentence), max_size):
                    pieces.append(sentence[i : i + max_size])
                current = ""
            else:
                current = sentence
    if current:
        pieces.append(current)
    return pieces


def chunk_text(
    text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP
) -> list[Chunk]:
    """Découpe un texte en une liste de Chunk avec chevauchement."""
    paragraphs = _split_into_paragraphs(text)

    # Sécurité : découpe les paragraphes trop longs
    normalized = []
    for p in paragraphs:
        normalized.extend(_split_long_paragraph(p, chunk_size))

    chunks: list[str] = []
    buffer = ""
    for piece in normalized:
        candidate = f"{buffer}\n\n{piece}".strip() if buffer else piece
        if len(candidate) <= chunk_size:
            buffer = candidate
        else:
            if buffer:
                chunks.append(buffer)
            # Démarre le prochain buffer avec un chevauchement de la fin du précédent
            overlap_text = buffer[-overlap:] if buffer and overlap else ""
            buffer = f"{overlap_text}\n\n{piece}".strip() if overlap_text else piece
    if buffer:
        chunks.append(buffer)

    result = [
        Chunk(index=i, text=c) for i, c in enumerate(chunks) if len(c) >= MIN_CHUNK_SIZE
    ]

    # Si le document est très court, on garde au moins un chunk
    if not result and text.strip():
        result = [Chunk(index=0, text=text.strip())]

    return result
