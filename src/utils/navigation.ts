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
        // Get the header height to account for fixed positioning
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 64; // Default to 64px if header not found

        // Calculate the exact position to scroll to
        const elementTop = element.offsetTop;
        const scrollPosition = elementTop - headerHeight;

        // Scroll to the exact position
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
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
