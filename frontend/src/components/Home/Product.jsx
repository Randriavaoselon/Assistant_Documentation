import { useEffect, useRef, useState } from "react";
import "../../styles/Product.css";

import siteVitrine1 from "../../assets/sitevitrine/site-vitrine1.jpg"
import siteVitrine2 from "../../assets/sitevitrine/site-vitrine2.jpg"
import siteVitrine3 from "../../assets/sitevitrine/site-vitrine3.jpg"
import siteVitrine4 from "../../assets/sitevitrine/site-vitrine4.jpg"
import siteVitrine5 from "../../assets/sitevitrine/site-vitrine5.jpg"
import siteVitrine6 from "../../assets/sitevitrine/site-vitrine6.jpg"
import siteVitrine7 from "../../assets/sitevitrine/site-vitrine7.jpg"
import siteVitrine8 from "../../assets/sitevitrine/site-vitrine8.jpg"

import ecommerce1 from "../../assets/ecommerce/ecommerce1.jpg"
import ecommerce2 from "../../assets/ecommerce/ecommerce2.jpg"
import ecommerce3 from "../../assets/ecommerce/ecommerce3.jpg"
import ecommerce4 from "../../assets/ecommerce/ecommerce4.jpg"
import ecommerce5 from "../../assets/ecommerce/ecommerce5.jpg"
import ecommerce6 from "../../assets/ecommerce/ecommerce6.jpg"
import ecommerce7 from "../../assets/ecommerce/ecommerce7.jpg"
import ecommerce8 from "../../assets/ecommerce/ecommerce8.jpg"

import lerning1 from '../../assets/e-lerning/lerning.jpg'
import lerning2 from '../../assets/e-lerning/lerning2.jpg'
import lerning3 from '../../assets/e-lerning/lerning3.jpg'
import lerning4 from '../../assets/e-lerning/lerning4.jpg'
import lerning5 from '../../assets/e-lerning/lerning5.jpg'
import lerning6 from '../../assets/e-lerning/lerning6.jpg'
import lerning7 from '../../assets/e-lerning/lerning7.jpg'
import lerning8 from '../../assets/e-lerning/lerning8.jpg'

import blog1 from '../../assets/blog/blog1.jpg'
import blog2 from '../../assets/blog/blog2.jpg'
import blog3 from '../../assets/blog/blog3.jpg'
import blog4 from '../../assets/blog/blog4.jpg'
import blog5 from '../../assets/blog/blog5.jpg'
import blog6 from '../../assets/blog/blog6.jpg'
import blog7 from '../../assets/blog/blog7.jpg'
import blog8 from '../../assets/blog/blog8.jpg'

import pltreservation1 from '../../assets/plateforme-reservation/ptl-reservation1.jpg'
import pltreservation2 from '../../assets/plateforme-reservation/ptl-reservation2.jpg'
import pltreservation3 from '../../assets/plateforme-reservation/ptl-reservation3.jpg'
import pltreservation4 from '../../assets/plateforme-reservation/ptl-reservation4.jpg'
import pltreservation5 from '../../assets/plateforme-reservation/ptl-reservation5.jpg'
import pltreservation6 from '../../assets/plateforme-reservation/ptl-reservation6.jpg'
import pltreservation7 from '../../assets/plateforme-reservation/ptl-reservation7.jpg'
import pltreservation8 from '../../assets/plateforme-reservation/ptl-reservation8.jpg'

import portfolio1 from '../../assets/portfolio/portfolio1.jpg'
import portfolio2 from '../../assets/portfolio/portfolio2.jpg'
import portfolio3 from '../../assets/portfolio/portfolio3.jpg'
import portfolio4 from '../../assets/portfolio/portfolio4.jpg'
import portfolio5 from '../../assets/portfolio/portfolio5.jpg'
import portfolio6 from '../../assets/portfolio/portfolio6.jpg'
import portfolio7 from '../../assets/portfolio/portfolio7.jpg'
import portfolio8 from '../../assets/portfolio/portfolio8.jpg'


const TABS = [
  {
    id: "web",
    label: "Site vitrine",
    items: [
      { title: "Découvrir le projet", image: siteVitrine1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: siteVitrine8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
  {
    id: "mobile",
    label: "Site e-commerce",
    items: [
      { title: "Découvrir le projet", image: ecommerce1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: ecommerce8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
  {
    id: "design",
    label: "Plateforme e-learning",
    items: [
      { title: "Découvrir le projet", image: lerning1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: lerning8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
  {
    id: "data-ia",
    label: "Blog & Site d'actualités",
    items: [
      { title: "Découvrir le projet", image: blog1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: blog8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
  {
    id: "cloud",
    label: "Plateforme de réservation",
    items: [
      { title: "Découvrir le projet", image: pltreservation1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: pltreservation8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
  {
    id: "marketing",
    label: "Portfolio professionnel",
    items: [
      { title: "Découvrir le projet", image: portfolio1, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio2, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio3, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio4, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio5, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio6, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio7, href: "https://portfolio-avenir.onrender.com/" },
      { title: "Découvrir le projet", image: portfolio8, href: "https://portfolio-avenir.onrender.com/" },
    ],
  },
];

const Product = () => {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);
  const activeTab = TABS.find((tab) => tab.id === activeTabId);

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
        threshold: 0.2,
        
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section className="product" ref={sectionRef} id="produits">
      <div className="product__container">
        <div
          className={`product__row ${
            isVisible ? "product__row--visible" : ""
          }`}
        >
          <div className="product__tab-list" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeTabId}
                className={
                  tab.id === activeTabId
                    ? "product__tab product__tab--active"
                    : "product__tab"
                }
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="product__grid">
            {activeTab.items.map((item, index) => (
              <div
                className="product__card"
                key={item.href}
                style={{ "--card-index": index }}
              >
                <div className="product__card-image-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="product__card-image"
                  />
                </div>
                <h3 className="product__card-title">
                  <a href={item.href} className="product__card-link">
                    {item.title}
                  </a>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;