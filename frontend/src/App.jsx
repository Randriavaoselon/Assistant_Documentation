import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar.jsx";
import MobileTopBar from "./components/Layout/MobileTopBar.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import "./styles/App.css";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <ChatProvider>
      <div className="app">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div
          className={"app__overlay" + (isSidebarOpen ? " app__overlay--visible" : "")}
          onClick={closeSidebar}
          aria-hidden="true"
        />
        <main className="app__main">
          <MobileTopBar onOpenMenu={() => setIsSidebarOpen(true)} />
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Routes>
        </main>
      </div>
    </ChatProvider>
  );
}
