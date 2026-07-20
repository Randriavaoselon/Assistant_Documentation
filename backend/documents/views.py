import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Document, DocumentStatus, Category
from .serializers import DocumentSerializer, DocumentUploadSerializer
from .services.indexing import index_document, remove_document_index, IndexingError

logger = logging.getLogger(__name__)


class DocumentViewSet(viewsets.ModelViewSet):
    """
    CRUD des documents + endpoint de ré-indexation.

    - POST   /api/documents/            -> upload + indexation automatique
    - GET    /api/documents/            -> liste (filtrable par ?category=)
    - GET    /api/documents/{id}/       -> détail
    - DELETE /api/documents/{id}/       -> supprime le fichier + ses vecteurs
    - POST   /api/documents/{id}/reindex/ -> relance l'indexation
    - GET    /api/documents/categories/ -> liste des catégories disponibles
    """

    queryset = Document.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return DocumentUploadSerializer
        return DocumentSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data["file"]
        file_type = file.name.rsplit(".", 1)[-1].lower() if "." in file.name else ""

        document = serializer.save(file_type=file_type, status=DocumentStatus.TRAITEMENT)
        self._process_document(document)

        output = DocumentSerializer(document, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_201_CREATED)

    def _process_document(self, document):
        try:
            nb_chunks = index_document(document)
            document.status = DocumentStatus.PRET
            document.chunk_count = nb_chunks
            document.error_message = ""
            document.save(update_fields=["status", "chunk_count", "error_message"])
        except IndexingError as exc:
            logger.warning("Échec d'indexation pour %s : %s", document.title, exc)
            document.status = DocumentStatus.ERREUR
            document.error_message = str(exc)
            document.save(update_fields=["status", "error_message"])
        except Exception as exc:  # sécurité : jamais planter la requête HTTP
            logger.exception("Erreur inattendue lors de l'indexation")
            document.status = DocumentStatus.ERREUR
            document.error_message = f"Erreur inattendue : {exc}"
            document.save(update_fields=["status", "error_message"])

    def destroy(self, request, *args, **kwargs):
        document = self.get_object()
        remove_document_index(document)
        document.file.delete(save=False)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def reindex(self, request, pk=None):
        document = self.get_object()
        remove_document_index(document)
        document.status = DocumentStatus.TRAITEMENT
        document.save(update_fields=["status"])
        self._process_document(document)
        serializer = DocumentSerializer(document, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def categories(self, request):
        return Response(
            [{"value": value, "label": label} for value, label in Category.choices]
        )
