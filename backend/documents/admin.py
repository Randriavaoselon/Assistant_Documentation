from django.contrib import admin
from .models import Document, DocumentChunk


class DocumentChunkInline(admin.TabularInline):
    model = DocumentChunk
    extra = 0
    readonly_fields = ["chunk_index", "content_preview", "vector_id", "created_at"]
    can_delete = False


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "status",
        "chunk_count",
        "uploaded_at",
    ]
    list_filter = ["category", "status"]
    search_fields = ["title", "description"]
    readonly_fields = ["id", "chunk_count", "uploaded_at", "updated_at", "error_message"]
    inlines = [DocumentChunkInline]


@admin.register(DocumentChunk)
class DocumentChunkAdmin(admin.ModelAdmin):
    list_display = ["document", "chunk_index", "vector_id"]
    search_fields = ["content_preview"]
