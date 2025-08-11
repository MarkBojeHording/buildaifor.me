import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useNavigationWithScroll } from "../utils/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { scrollToSection, navigateToPage } = useNavigationWithScroll();

  const handleLogoClick = () => {
    // Clear saved scroll position for home page before navigating
    const savedPositions = sessionStorage.getItem('scrollPositions');
    if (savedPositions) {
      try {
        const positions = JSON.parse(savedPositions);
        delete positions['/'];
        sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
      } catch (error) {
        console.warn('Failed to clear scroll position:', error);
      }
    }
    // Also clear the lastScrollPosition
    sessionStorage.removeItem('lastScrollPosition');

    // Navigate to home page and scroll to top
    navigate('/');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title - Clickable */}
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <svg width="32" height="26" viewBox="0 0 50 40" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <defs>
                <linearGradient id="stackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#667eea"}}/>
                  <stop offset="100%" style={{stopColor:"#764ba2"}}/>
                </linearGradient>
              </defs>
              <rect x="5" y="25" width="35" height="8" rx="2" fill="url(#stackGrad)" opacity="0.6"/>
              <rect x="8" y="15" width="29" height="8" rx="2" fill="url(#stackGrad)" opacity="0.8"/>
              <rect x="11" y="5" width="23" height="8" rx="2" fill="url(#stackGrad)"/>
            </svg>
            <span className="text-xl font-bold text-gray-900">
              <span className="text-gray-900">Build</span>
              <span className="text-blue-600">AI</span>
              <span className="text-gray-900">for.me</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigateToPage('/about')}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('ai-solutions')}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              AI Solutions
            </button>
            <button
              onClick={() => navigateToPage('/tech')}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              Tech
            </button>
            <button
              onClick={() => scrollToSection('pricing-contact')}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('pricing-contact')}
              className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection('get-started')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  navigateToPage('/about');
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection('ai-solutions');
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                AI Solutions
              </button>
              <button
                onClick={() => {
                  navigateToPage('/tech');
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Tech
              </button>
              <button
                onClick={() => {
                  scrollToSection('pricing-contact');
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  scrollToSection('pricing-contact');
                  setIsMenuOpen(false);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                Contact
              </button>
              <Button
                onClick={() => {
                  scrollToSection('get-started');
                  setIsMenuOpen(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
