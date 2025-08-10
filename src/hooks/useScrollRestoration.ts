import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = () => {
  const location = useLocation();
  const scrollPositions = useRef<{ [key: string]: number }>({});

  // Save scroll position before leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        scrollPositions.current[location.pathname] = window.scrollY;
        sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

    // Restore scroll position when returning to the page
  useEffect(() => {
    const savedPositions = sessionStorage.getItem('scrollPositions');
    if (savedPositions) {
      try {
        const positions = JSON.parse(savedPositions);
        const savedPosition = positions[location.pathname];

        if (savedPosition !== undefined) {
          // Use setTimeout to ensure the page has fully loaded
          setTimeout(() => {
            window.scrollTo(0, savedPosition);
          }, 200);
        }
      } catch (error) {
        console.warn('Failed to restore scroll position:', error);
      }
    }
  }, [location.pathname]);

  // Save scroll position on scroll events
  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current));
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [location.pathname]);

  // Handle anchor links (hash navigation) and section navigation
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
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
        }, 100);
      }
    } else if (location.pathname === '/' && location.search) {
      // Handle section navigation from search params
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          setTimeout(() => {
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
          }, 100);
        }
      }
    }
  }, [location.hash, location.search, location.pathname]);

  return {
    saveScrollPosition: (path: string, position: number) => {
      scrollPositions.current[path] = position;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.current));
    },
    getScrollPosition: (path: string) => {
      return scrollPositions.current[path] || 0;
    }
  };
};
