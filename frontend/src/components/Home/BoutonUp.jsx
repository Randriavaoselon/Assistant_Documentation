import React, { useState, useEffect } from "react";
import "../../styles/BoutonUp.css";

const BoutonUp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // On cible le conteneur .home au lieu de window
    const homeContainer = document.querySelector(".home");

    if (!homeContainer) return;

    const handleScroll = () => {
      // On vérifie le scrollTop de la div .home
      setVisible(homeContainer.scrollTop > 300);
    };

    homeContainer.addEventListener("scroll", handleScroll);
    return () => homeContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    const homeContainer = document.querySelector(".home");
    if (homeContainer) {
      homeContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      className={`bouton-up ${visible ? "bouton-up-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
};

export default BoutonUp;