
import Hero from '../components/Hero';
// import Services from '../components/Services';
// import Industries from '../components/Industries';
import Process from '../components/Process';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Portfolio from '../components/Portfolio';

const Index = () => {
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
