from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ConversationViewSet, AskQuestionView

router = DefaultRouter()
router.register(r"conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path("ask/", AskQuestionView.as_view(), name="ask-question"),
] + router.urls
