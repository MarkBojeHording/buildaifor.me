
import Hero from '../components/Hero.tsx';
// import Services from '../components/Services';
// import Industries from '../components/Industries';
import Process from '../components/Process.tsx';
import Pricing from '../components/Pricing.tsx';
import Contact from '../components/Contact.tsx';
import Header from '../components/Header.tsx';
import Footer from '../components/Footer.tsx';
import Portfolio from '../components/Portfolio.tsx';
import { useScrollRestoration } from '../hooks/useScrollRestoration.ts';

const Index = () => {
  // Initialize scroll restoration
  useScrollRestoration();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Hero />
      <Portfolio />
      <Pricing />
      {/* <Industries /> */}
      <Process />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
