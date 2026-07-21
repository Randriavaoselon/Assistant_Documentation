import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import "./styles/App.css";

export default function App() {
  return (
    <ChatProvider>
      <Routes>
        {/* Page publique, sans le shell (sidebar / barre mobile) de l'application */}
        <Route path="/" element={<HomePage />} />

        {/* Application (Dashboard / Assistant + Documents) */}
        <Route element={<AppLayout />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
}
