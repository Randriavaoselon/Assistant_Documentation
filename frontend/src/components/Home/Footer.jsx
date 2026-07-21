import React from "react";
import "../../styles/Footer.css";
import ImageFooter from '../../assets/logo.webp'

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row">
          <div className="footer-col footer-brand">
            <img
              src={ImageFooter}
              alt="Logo"
              className="footer-logo"
            />
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Liens</h3>
            <ul className="footer-links">
              <li>
                <a href="#accueil">Accueil</a>
              </li>
              <li>
                <a href="#produits">Nos Produits</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Adresse</h3>
            <p className="footer-text">
              Bloc 3, Porte 22, Cité Maison Blanche
              <br />
              Fort-Duchesne
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-links">
              <li>
                <a href="mailto:selonrandriavao@gmail.com">
                  selonrandriavao@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:0321414619">032 14 146 19</a>
              </li>
              <li>
                <a
                  href="https://portfolio-avenir.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  portfolio-avenir.onrender.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;