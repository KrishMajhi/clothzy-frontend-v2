import React, { useEffect, useRef, useMemo } from "react";
import { HERO_SUBS, getRandomBanner } from "./shopCategoryConstants";

function CategoryHero({ category, categoryLabel, productCount, banner }) {
  const heroBgRef = useRef(null);

  // Pick once on mount; use passed banner prop if provided, else pick random
  const resolvedBanner = useMemo(
    () => banner || getRandomBanner(category),
    [category] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="cat-hero">
      <div
        ref={heroBgRef}
        className="cat-hero-bg"
        style={{ backgroundImage: `url('${resolvedBanner}')` }}
      />
      <div className="cat-hero-overlay" />
      <div className="cat-hero-content">
        <div className="cat-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <span style={{ color: "rgba(245,240,232,.8)" }}>{categoryLabel}</span>
        </div>
        <h1 className="cat-hero-title">{categoryLabel.toUpperCase()}'S</h1>
        <p className="cat-hero-sub">
          {HERO_SUBS[category] || `Explore our ${categoryLabel}'s collection.`}
        </p>
        <div className="cat-hero-meta">
          <div className="hero-meta-item">
            <div className="hero-meta-dot" />
            <span>{productCount} Products</span>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-dot" />
            <span>New Arrivals Weekly</span>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-dot" />
            <span>Free Shipping ₹999+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryHero;