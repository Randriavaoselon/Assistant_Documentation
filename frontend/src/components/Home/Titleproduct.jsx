import { useEffect, useRef, useState } from "react";
import "../../styles/Titleproduct.css";

const TitleProduct = () => {
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
    <section className="title-product" ref={sectionRef}>
      <div className="title-product__container">
        <div className="title-product__row">
          <h2
            className={`title-product__title ${
              isVisible ? "title-product__title--visible" : ""
            }`}
          >
           Nos solutions digitales
          </h2>
        </div>
      </div>
    </section>
  );
};

export default TitleProduct;