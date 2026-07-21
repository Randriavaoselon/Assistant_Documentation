import React, { useEffect, useRef, useState } from "react";
import "../../styles/TitleContact.css";

const TitleContact = () => {
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
    <section className="title-contact-section" ref={sectionRef}>
      <div className="container">
        <div className="row">
          <div
            className={`title-contact-wrapper ${
              isVisible ? "title-contact-wrapper--visible" : ""
            }`}
          >
            <h2 className="title-contact-title">Contactez-nous</h2>
            <span className="title-contact-line"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TitleContact;