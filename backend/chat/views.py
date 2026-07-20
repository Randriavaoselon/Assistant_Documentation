from rest_framework import viewsets, views, status
from rest_framework.response import Response

from .models import Conversation, Message, MessageRole
from .serializers import (
    ConversationSerializer,
    ConversationDetailSerializer,
    AskQuestionSerializer,
)
from .services.rag_pipeline import answer_question

MAX_HISTORY_MESSAGES = 10


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    - GET /api/chat/conversations/          -> liste des conversations
    - GET /api/chat/conversations/{id}/     -> détail + messages
    - DELETE /api/chat/conversations/{id}/  -> suppression
    """

    queryset = Conversation.objects.all()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ConversationDetailSerializer
        return ConversationSerializer

    def destroy(self, request, *args, **kwargs):
        conversation = self.get_object()
        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AskQuestionView(views.APIView):
    """
    POST /api/chat/ask/
    Body: {"question": str, "conversation_id": str | null}

    Exécute le pipeline RAG (retrieval + génération) et persiste l'échange
    dans la conversation (créée si nécessaire).
    """

    def post(self, request):
        serializer = AskQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question = serializer.validated_data["question"]
        conversation_id = serializer.validated_data.get("conversation_id")

        if conversation_id:
            conversation, _ = Conversation.objects.get_or_create(id=conversation_id)
        else:
            conversation = Conversation.objects.create(
                title=question[:60] + ("…" if len(question) > 60 else "")
            )

        history_qs = conversation.messages.order_by("-created_at")[
            :MAX_HISTORY_MESSAGES
        ]
        history = [
            {"role": m.role, "content": m.content} for m in reversed(list(history_qs))
        ]

        Message.objects.create(
            conversation=conversation, role=MessageRole.USER, content=question
        )

        result = answer_question(question, history=history)

        assistant_message = Message.objects.create(
            conversation=conversation,
            role=MessageRole.ASSISTANT,
            content=result["answer"],
            sources=result["sources"],
        )

        conversation.save(update_fields=["updated_at"])

        return Response(
            {
                "conversation_id": str(conversation.id),
                "answer": result["answer"],
                "sources": result["sources"],
                "message_id": str(assistant_message.id),
            },
            status=status.HTTP_200_OK,
        )
