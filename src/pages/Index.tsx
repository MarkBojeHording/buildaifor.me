
import Hero from '../components/Hero.tsx';
// import Services from '../components/Services';
// import Industries from '../components/Industries';
import PricingContact from '../components/PricingContact.tsx';
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
      <PricingContact />
      {/* <Industries /> */}
      <Footer />
    </div>
  );
};

export default Index;
