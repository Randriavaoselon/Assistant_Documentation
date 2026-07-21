import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileTopBar from "./MobileTopBar.jsx";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div
        className={"app__overlay" + (isSidebarOpen ? " app__overlay--visible" : "")}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <main className="app__main">
        <MobileTopBar onOpenMenu={() => setIsSidebarOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}
