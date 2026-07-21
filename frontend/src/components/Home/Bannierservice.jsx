import { useEffect, useRef, useState } from "react";
import "../../styles/BannierService.css";

const BannierService = () => {
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

  const handleContactClick = () => {
    const target = document.getElementById("contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="banner-service" ref={sectionRef}>
      <div
        className={`banner-service__shape ${
          isVisible ? "banner-service__shape--visible" : ""
        }`}
      >
        <div className="banner-service__container">
          <div className="banner-service__row">
            <div className="banner-service__text">
              <h2 className="banner-service__title">
                Prêt à lancer votre prochain projet ?
              </h2>
              <p className="banner-service__description">
                Discutons de vos besoins et trouvons ensemble le bon expert
                pour donner vie à votre projet, rapidement et sans mauvaise
                surprise.
              </p>
            </div>
            <button type="button" className="banner-service__btn" onClick={handleContactClick}>
              Contactez-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannierService;