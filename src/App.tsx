import { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import Lenis from 'lenis';
import Navbar from './sections/Navbar';
import HeroSection from './sections/HeroSection';
import ProductShowcase from './sections/ProductShowcase';
import ServiceHub from './sections/ServiceHub';
import DataFalls from './sections/DataFalls';
import FooterCTA from './sections/FooterCTA';
import AdminLeads from './pages/AdminLeads';
import AdminLogin from './pages/AdminLogin';

function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1f38 50%, #0a1628 100%)' }}>
      <Navbar />
      <HeroSection />
      <ProductShowcase />
      <ServiceHub />
      <DataFalls />
      <FooterCTA />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLeads />} />
    </Routes>
  );
}
