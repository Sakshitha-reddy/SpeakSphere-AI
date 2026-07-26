import Navbar from "../components/Navbar";
import Home from "./Home";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Home />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
}