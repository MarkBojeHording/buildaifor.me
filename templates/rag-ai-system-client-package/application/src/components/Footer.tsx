import { Building, Cpu, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Services', href: '#services', isRoute: false },
    { label: 'Portfolio', href: '#portfolio', isRoute: false },
    { label: 'About', href: '/about', isRoute: true },
    { label: 'Blog', href: '/blog', isRoute: true },
    { label: 'Process', href: '#process', isRoute: false },
    { label: 'Pricing', href: '#pricing', isRoute: false }
  ];

  const services = [
    'AI Chatbots',
    'Document Processing',
    'Data Automation',
    'Workflow Optimization',
    'RAG Systems',
    'API Integrations'
  ];

  const industries = [
    'Healthcare',
    'Finance',
    'Education',
    'Legal',
    'E-commerce',
    'Manufacturing'
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center">
                <svg width="40" height="32" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="stackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#667eea' }} />
                      <stop offset="100%" style={{ stopColor: '#764ba2' }} />
                    </linearGradient>
                  </defs>
                  <rect x="5" y="25" width="35" height="8" rx="2" fill="url(#stackGrad)" opacity="0.6"/>
                  <rect x="8" y="15" width="29" height="8" rx="2" fill="url(#stackGrad)" opacity="0.8"/>
                  <rect x="11" y="5" width="23" height="8" rx="2" fill="url(#stackGrad)"/>
                </svg>
              </div>
              <span className="text-xl font-bold">BuildAIfor.me</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Building AI solutions for businesses.
              From intelligent automation to advanced AI integrations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">contact@buildaifor.me</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <button
                      onClick={() => {
                        navigate(link.href);

                      }}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm bg-transparent border-none cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-gray-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* <div>
            <h3 className="font-bold text-lg mb-4">Industries</h3>
            <ul className="space-y-2">
              {industries.map((industry) => (
                <li key={industry} className="text-gray-400 text-sm">
                  {industry}
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 BuildAIfor.me. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
