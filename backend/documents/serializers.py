from rest_framework import serializers
from .models import Document, DocumentChunk


class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ["id", "chunk_index", "content_preview"]


class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(
        source="get_category_display", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "file_url",
            "file_type",
            "category",
            "category_display",
            "description",
            "status",
            "status_display",
            "error_message",
            "chunk_count",
            "uploaded_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "file_type",
            "status",
            "error_message",
            "chunk_count",
            "uploaded_at",
            "updated_at",
        ]
        extra_kwargs = {"file": {"write_only": True}}

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url if obj.file else None


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ["title", "file", "category", "description"]

    def validate_file(self, file):
        allowed_extensions = {"pdf", "docx", "txt", "md"}
        ext = file.name.rsplit(".", 1)[-1].lower() if "." in file.name else ""
        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Extension '.{ext}' non supportée. "
                f"Formats acceptés : {', '.join(sorted(allowed_extensions))}."
            )
        return file
