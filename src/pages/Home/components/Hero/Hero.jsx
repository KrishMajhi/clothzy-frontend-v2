import { useEffect, useRef, useState } from 'react';
import './Hero.css';

const HERO_STATS = [
  { value: '2,400+', label: 'Styles' },
  { value: '50K+', label: 'Customers' },
  { value: '4.8★', label: 'Avg Rating' },
];

/**
 * isReady: controlled by the parent (App) once the loader has
 * finished, triggers the `.clzv3-hero-on` entrance-animation class.
 */
function Hero({ isReady }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.style.transform = 'scale(1.06)';
    const t = setTimeout(() => {
      img.style.transition = 'transform 7s ease';
      img.style.transform = 'scale(1)';
    }, 200);

    const handleScroll = () => {
      if (window.scrollY < window.innerHeight) {
        img.style.transition = 'none';
        img.style.transform = `scale(1.02) translateY(${window.scrollY * 0.16}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={`clzv3-hero ${isReady ? 'clzv3-hero-on' : ''}`}>
      <div className="clzv3-hero-left">
        <div className="clzv3-hero-eyebrow">Style That Speaks For You</div>
        <div className="clzv3-hero-vline" />
        <h1 className="clzv3-hero-heading">
          Fresh styles
          <br />
          for bold
          <br />
          confidence —
          <br />
          <em className="clzv3-hero-heading-accent">made for you</em>
        </h1>
        <p className="clzv3-hero-subtext">
          Curated fashion for every occasion. New arrivals every week — Men, Women & Kids.
        </p>
        <div className="clzv3-hero-actions">
          <a href="#" className="clzv3-btn-primary">Shop New Arrivals</a>
          <a href="#" className="clzv3-btn-text">View Lookbook</a>
        </div>
        <div className="clzv3-hero-stats">
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <div className="clzv3-hero-stat-num">{stat.value}</div>
              <div className="clzv3-hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="clzv3-hero-right">
        <img
          ref={imgRef}
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&auto=format&fit=crop"
          alt="Hero model"
        />
        <div className="clzv3-hero-float-tag">
          <div className="clzv3-hero-float-tag-sub">Just Dropped</div>
          <div className="clzv3-hero-float-tag-name">Summer Linen Co-ord</div>
          <div className="clzv3-hero-float-tag-price">₹1,799</div>
        </div>
      </div>

      <div className="clzv3-hero-scroll-indicator">
        <div className="clzv3-hero-scroll-mouse" />
        <span>Scroll</span>
      </div>
    </section>
  );
}

export default Hero;
