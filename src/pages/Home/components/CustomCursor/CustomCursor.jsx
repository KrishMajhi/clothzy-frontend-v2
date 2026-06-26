import { useEffect, useRef } from 'react';
import './CustomCursor.css';

/**
 * Renders the custom dot+ring cursor and wires up hover-state
 * detection on interactive elements (links, buttons, cards).
 * Attach the returned `clzv3-hov` toggling to a root element
 * via document.body class for global effect — kept self-contained
 * here by toggling document.body class, matching original behavior.
 */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = -100, my = -100, rx = -100, ry = -100;
    let rafId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animateRing);

    const hoverTargets = document.querySelectorAll(
      'a, button, .clzv3-cat-card, .clzv3-journal-main, .clzv3-journal-sub, .clzv3-testimonial-card, .clzv3-product-card'
    );

    const addHov = () => document.body.classList.add('clzv3-hov');
    const removeHov = () => document.body.classList.remove('clzv3-hov');

    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', addHov);
      el.addEventListener('mouseleave', removeHov);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', addHov);
        el.removeEventListener('mouseleave', removeHov);
      });
    };
  }, []);

  return (
    <>
      <div className="clzv3-cursor-dot" ref={dotRef} />
      <div className="clzv3-cursor-ring" ref={ringRef} />
    </>
  );
}

export default CustomCursor;
