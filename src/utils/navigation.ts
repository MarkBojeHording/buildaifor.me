import { useNavigate } from 'react-router-dom';

export const useNavigationWithScroll = () => {
  const navigate = useNavigate();

    const scrollToSection = (sectionId: string, delay: number = 200) => {
    // Save current scroll position before navigating
    const currentScrollPosition = window.scrollY;
    sessionStorage.setItem('lastScrollPosition', currentScrollPosition.toString());

    // Navigate to home page with section parameter
    navigate(`/?section=${sectionId}`);

    // Scroll to section after navigation
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, delay);
  };

    const navigateToPage = (path: string, scrollToTop: boolean = true) => {
    // Save current scroll position
    const currentScrollPosition = window.scrollY;
    sessionStorage.setItem('lastScrollPosition', currentScrollPosition.toString());

    navigate(path);

    if (scrollToTop) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 200);
    }
  };

  const restoreScrollPosition = () => {
    const savedPosition = sessionStorage.getItem('lastScrollPosition');
    if (savedPosition) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo(0, position);
      }, 100);
    }
  };

  return {
    scrollToSection,
    navigateToPage,
    restoreScrollPosition
  };
};
