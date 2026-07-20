import { useLocation } from "react-router-dom";
import { Menu, BookMarked } from "lucide-react";

const TITLES = {
  "/": "Assistant",
  "/documents": "Documents",
};

export default function MobileTopBar({ onOpenMenu }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || "Assistant Documentation";

  return (
    <header className="mobile-topbar">
      <button
        className="mobile-topbar__menu-btn"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>
      <div className="mobile-topbar__title">
        <BookMarked size={16} color="var(--color-accent)" />
        <span>{title}</span>
      </div>
      <div className="mobile-topbar__spacer" />
    </header>
  );
}
