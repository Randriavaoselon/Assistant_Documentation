
import Navbar from "../components/Home/Navbar.jsx";
import HeroSection from "../components/Home/Herosection.jsx";
import BannierInfo from "../components/Home/Bannierinfo.jsx";
import TitleProduct from "../components/Home/Titleproduct.jsx";
import Product from "../components/Home/Product.jsx";
import BannierService from "../components/Home/Bannierservice.jsx";
import Services from "../components/Home/Services.jsx";
import TitleContact from "../components/Home/Titlecontact.jsx";
import Contact from "../components/Home/Contact.jsx";
import Footer from "../components/Home/Footer.jsx";
import BoutonUp from "../components/Home/BoutonUp.jsx";

export default function HomePage() {

  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <BannierInfo />
      <TitleProduct />
      <Product />
      <BannierService />
      <Services />
      <TitleContact />
      <Contact />
      <Footer />
      <BoutonUp />
    </div>
  );
}
