import React, { useEffect, useRef, useState } from "react";
import "../../styles/Services.css";
import serviceImage from "../../assets/service-Image.webp";

const Services = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section className="services-section" ref={sectionRef} id="services">
      <div className="container">
        <div className={`row ${isVisible ? "row--visible" : ""}`}>
          {/* Colonne gauche : image */}
          <div className="col col-image">
            <img
              src={serviceImage}
              alt="Nos services"
              className="services-image"
            />
          </div>

          {/* Colonne droite : titre, description, bouton */}
          <div className="col col-content">
            <h2 className="services-title">Nos services</h2>
            <p className="services-description">
              Nous accompagnons nos clients à chaque étape de leur projet en
              proposant des solutions numériques entièrement personnalisées.
              Grâce à notre expertise technique et à notre sens de la
              créativité, nous concevons des sites web, applications et
              solutions digitales qui répondent précisément à leurs objectifs,
              leurs besoins et leur secteur d'activité. Notre priorité est de
              créer des produits performants, modernes, intuitifs et évolutifs,
              capables de renforcer leur présence en ligne, d'améliorer leur
              efficacité et de soutenir durablement leur croissance.
            </p>
            <button
              className="services-button"
              onClick={() =>
                window.open(
                  "https://portfolio-avenir.onrender.com/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
