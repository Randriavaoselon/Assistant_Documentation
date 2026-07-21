import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Menu, X } from "lucide-react";

import logoImage from '../../assets/logo.webp';

const MENU_ITEMS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos Produits", href: "#produits" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogin = () => {
    closeMenu();
    navigate("/chat");
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    closeMenu();

    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="navbar">
      <div className="navbar__container">
        <div className="navbar__row">
          <a
            href="#accueil"
            className="navbar__logo"
            onClick={(e) => handleNavClick(e, "#accueil")}
          >
            <img src={logoImage} alt="Assistant Documentation Entreprise" />
          </a>

          <nav
            className={"navbar__menu" + (isMenuOpen ? " navbar__menu--open" : "")}
            aria-label="Navigation principale"
          >
            {MENU_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="navbar__menu-item"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="navbar__login-btn"
              onClick={handleLogin}
              aria-label="Connexion"
              title="Connexion"
            >
              <Lock size={17} />
            </button>

            <button
              type="button"
              className="navbar__burger"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="navbar__overlay" onClick={closeMenu} aria-hidden="true" />
      )}
    </section>
  );
}