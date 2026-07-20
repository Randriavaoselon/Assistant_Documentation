import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Documents ---
export const fetchDocuments = (params = {}) =>
  apiClient.get("/documents/", { params }).then((res) => res.data);

export const fetchCategories = () =>
  apiClient.get("/documents/categories/").then((res) => res.data);

export const uploadDocument = (formData, onUploadProgress) =>
  apiClient
    .post("/documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    })
    .then((res) => res.data);

export const deleteDocument = (id) => apiClient.delete(`/documents/${id}/`);

export const reindexDocument = (id) =>
  apiClient.post(`/documents/${id}/reindex/`).then((res) => res.data);

// --- Chat ---
export const askQuestion = (question, conversationId) =>
  apiClient
    .post("/chat/ask/", { question, conversation_id: conversationId })
    .then((res) => res.data);

export const fetchConversations = () =>
  apiClient.get("/chat/conversations/").then((res) => res.data);

export const fetchConversation = (id) =>
  apiClient.get(`/chat/conversations/${id}/`).then((res) => res.data);

export const deleteConversation = (id) =>
  apiClient.delete(`/chat/conversations/${id}/`);
