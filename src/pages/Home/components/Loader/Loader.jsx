import { useEffect, useState } from 'react';
import './Loader.css';

/**
 * Full-screen brand loader. Calls onDone() after the loader
 * has finished animating out so the parent can trigger the
 * hero's entrance animation in sync.
 */
function Loader({ onDone }) {
  const [isOut, setIsOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const outTimer = setTimeout(() => {
      setIsOut(true);
      if (onDone) onDone();
    }, 1000);

    return () => clearTimeout(outTimer);
  }, [onDone]);

  useEffect(() => {
    if (!isOut) return;
    const removeTimer = setTimeout(() => setIsRemoved(true), 1000);
    return () => clearTimeout(removeTimer);
  }, [isOut]);

  if (isRemoved) return null;

  return (
    <div className={`clzv3-loader ${isOut ? 'clzv3-loader-out' : ''}`}>
      <div className="clzv3-loader-word">CLOTHZY</div>
      <div className="clzv3-loader-bar" />
    </div>
  );
}

export default Loader;
