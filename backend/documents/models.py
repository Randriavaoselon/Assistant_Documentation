import uuid
from django.db import models


class Category(models.TextChoices):
    PROCEDURE = "procedure", "Procédure interne"
    GUIDE = "guide", "Guide"
    TECHNIQUE = "technique", "Documentation technique"
    FAQ = "faq", "FAQ"
    AUTRE = "autre", "Autre"


class DocumentStatus(models.TextChoices):
    EN_ATTENTE = "pending", "En attente"
    TRAITEMENT = "processing", "En cours de traitement"
    PRET = "ready", "Prêt"
    ERREUR = "error", "Erreur"


def document_upload_path(instance, filename):
    return f"documents/{instance.id}/{filename}"


class Document(models.Model):
    """Un document source (procédure, guide, doc technique, FAQ...)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=document_upload_path)
    file_type = models.CharField(max_length=20, blank=True)  # pdf, docx, txt, md
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.AUTRE
    )
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=DocumentStatus.choices, default=DocumentStatus.EN_ATTENTE
    )
    error_message = models.TextField(blank=True)
    chunk_count = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title


class DocumentChunk(models.Model):
    """
    Un fragment de texte issu du découpage d'un document.
    Le texte et son embedding vivent dans ChromaDB (vector store) ;
    cette table sert de registre relationnel (traçabilité, suppression en cascade).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(
        Document, related_name="chunks", on_delete=models.CASCADE
    )
    chunk_index = models.PositiveIntegerField()
    content_preview = models.TextField(help_text="Aperçu du texte (pour debug/admin)")
    vector_id = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["document", "chunk_index"]

    def __str__(self):
        return f"{self.document.title} - chunk {self.chunk_index}"
