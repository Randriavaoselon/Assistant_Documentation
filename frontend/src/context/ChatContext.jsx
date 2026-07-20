import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  askQuestion,
  fetchConversation,
  fetchConversations,
  deleteConversation as apiDeleteConversation,
} from "../api/client.js";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const refreshConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data.results ?? data);
    } catch (err) {
      console.error("Impossible de charger les conversations", err);
    }
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  const startNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const selectConversation = useCallback(async (id) => {
    setActiveConversationId(id);
    try {
      const data = await fetchConversation(id);
      setMessages(data.messages ?? []);
    } catch (err) {
      console.error("Impossible de charger la conversation", err);
    }
  }, []);

  const deleteConversation = useCallback(
    async (id) => {
      await apiDeleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        startNewConversation();
      }
    },
    [activeConversationId, startNewConversation]
  );

  const sendMessage = useCallback(
    async (question) => {
      const optimisticUserMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: question,
        sources: [],
      };
      setMessages((prev) => [...prev, optimisticUserMessage]);
      setIsSending(true);

      try {
        const data = await askQuestion(question, activeConversationId);
        setActiveConversationId(data.conversation_id);
        setMessages((prev) => [
          ...prev,
          {
            id: data.message_id,
            role: "assistant",
            content: data.answer,
            sources: data.sources,
          },
        ]);
        refreshConversations();
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content:
              "Une erreur est survenue lors de la communication avec le serveur. Vérifiez que le backend est bien démarré.",
            sources: [],
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [activeConversationId, refreshConversations]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        messages,
        isSending,
        startNewConversation,
        selectConversation,
        deleteConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat doit être utilisé dans un ChatProvider");
  return ctx;
}
