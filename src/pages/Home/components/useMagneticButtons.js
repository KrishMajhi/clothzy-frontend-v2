import { useEffect } from 'react';

/**
 * Applies the "magnetic" pull effect to every `.clzv3-btn-primary`
 * element on the page — the button subtly follows the cursor on
 * hover. Matches the original vanilla-JS behavior.
 */
function useMagneticButtons() {
  useEffect(() => {
    const buttons = document.querySelectorAll('.clzv3-btn-primary');

    const handleMouseMove = (e, btn) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.14;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    };

    const handleMouseLeave = (btn) => {
      btn.style.transform = '';
    };

    const listeners = [];

    buttons.forEach((btn) => {
      const moveHandler = (e) => handleMouseMove(e, btn);
      const leaveHandler = () => handleMouseLeave(btn);
      btn.addEventListener('mousemove', moveHandler);
      btn.addEventListener('mouseleave', leaveHandler);
      listeners.push({ btn, moveHandler, leaveHandler });
    });

    return () => {
      listeners.forEach(({ btn, moveHandler, leaveHandler }) => {
        btn.removeEventListener('mousemove', moveHandler);
        btn.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);
}

export default useMagneticButtons;
