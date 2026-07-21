import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImageAccueil from "../../assets/hero-image.webp";
import "../../styles/HeroSection.css";

const STATS = [
  { value: 300, suffix: "+", label: "Projets livrés avec succès" },
  { value: 150, suffix: "+", label: "Clients qui nous font confiance" },
  { value: 300, suffix: "+", label: "Experts dans notre réseau" },
];

// Hook personnalisé pour l'effet compteur fluide
const useCounter = (end, duration = 2000, startDelay = 1200) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer;
    let startTime;

    // Démarre l'animation après le délai d'apparition initiale des stats (~1.2s)
    const delayTimeout = setTimeout(() => {
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);

        // Fonction d'accélération (easeOutExpo pour une fin fluide)
        const easeProgress =
          percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

        setCount(Math.floor(easeProgress * end));

        if (percentage < 1) {
          timer = requestAnimationFrame(animateCount);
        }
      };

      timer = requestAnimationFrame(animateCount);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(timer);
    };
  }, [end, duration, startDelay]);

  return count;
};

// Composant interne pour chaque carte de statistique
const StatCard = ({ stat }) => {
  const currentCount = useCounter(stat.value);

  return (
    <div className="hero__stat-card">
      <span className="hero__stat-number">
        {currentCount}
        {stat.suffix}
      </span>
      <p className="hero__stat-label">{stat.label}</p>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();

  const titleText = "Trouvez l'expert qu'il vous faut, plus vite";
  const paragraphText =
    "Avenir-Tech connecte votre entreprise à un réseau qualifié de développeurs, designers et consultants prêts à faire avancer vos projets, sans perdre de temps sur le recrutement.";

  return (
    <section className="hero" id="accueil">
      <div className="hero__container">
        <div className="hero__row">
          <div className="hero__col hero__col--left">
            <h1 className="hero__title">
              {titleText.split("").map((char, index) => (
                <span
                  key={index}
                  className="hero__char"
                  style={{ "--char-index": index }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>

            <p className="hero__text">{paragraphText}</p>

            <div className="hero__actions">
              <button
                type="button"
                className="hero__btn hero__btn--primary"
                onClick={() => navigate("/chat")}
              >
                Votre espace de travail
              </button>
              <button
                type="button"
                className="hero__btn hero__btn--outline"
                onClick={() =>
                  window.open(
                    "https://portfolio-avenir.onrender.com/",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Voir nos réalisations
              </button>
            </div>

            <div className="hero__stats">
              {STATS.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>
          </div>

          <div className="hero__col hero__col--right">
            <img
              src={heroImageAccueil}
              alt="Illustration représentant le réseau d'experts Avenir-Tech"
              className="hero__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
