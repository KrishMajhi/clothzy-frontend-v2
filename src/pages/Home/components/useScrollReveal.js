import { useEffect } from 'react';

/**
 * Observes every element with the `.clzv3-rv` class and adds
 * `.clzv3-in` once it scrolls into view, matching the original
 * vanilla-JS reveal behavior. Run once after the page (including
 * all sections) has mounted.
 */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('clzv3-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll('.clzv3-rv');
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default useScrollReveal;
