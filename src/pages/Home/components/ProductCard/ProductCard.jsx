import { useState } from 'react';
import './ProductCard.css';

const HeartIcon = () => (
  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-ink)" strokeWidth="1.5">
    <path
      strokeLinecap="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

/**
 * Shared product card. Used both inside the horizontal drag
 * carousel (New Arrivals) and the static grid (Popular Collections).
 * Pass `variant="grid"` to drop the carousel-specific flex-basis.
 *
 * Shape of `product`:
 * {
 *   id, image, badge, category, name,
 *   price, originalPrice, discount,
 *   rating: { stars, count },
 *   swatches: [{ color, active }]
 * }
 */
function ProductCard({ product, variant = 'carousel' }) {
  const [activeSwatchIndex, setActiveSwatchIndex] = useState(
    product.swatches?.findIndex((s) => s.active) ?? 0
  );

  const cardClass = `clzv3-product-card ${variant === 'grid' ? 'clzv3-product-card-grid' : ''}`;

  return (
    <div className={cardClass}>
      <div className="clzv3-pc-image-wrap">
        <img src={product.image} alt={product.name} />
        {product.badge && <div className="clzv3-pc-badge">{product.badge}</div>}
        <button className="clzv3-pc-wishlist-btn" aria-label="Add to wishlist">
          <HeartIcon />
        </button>
        <button className="clzv3-pc-quickadd-btn">Quick Add</button>
      </div>

      <p className="clzv3-pc-category">{product.category}</p>
      <h3 className="clzv3-pc-name">{product.name}</h3>

      <div className="clzv3-pc-row">
        <div>
          {product.originalPrice && (
            <span className="clzv3-pc-price-original">{product.originalPrice}</span>
          )}
          <span className="clzv3-pc-price">{product.price}</span>
          {product.discount && <span className="clzv3-pc-discount">{product.discount}</span>}
        </div>
        <div className="clzv3-pc-rating">
          <span className="clzv3-pc-stars">{product.rating.stars}</span>
          <span className="clzv3-pc-rating-count">{product.rating.count}</span>
        </div>
      </div>

      {product.swatches?.length > 0 && (
        <div className="clzv3-pc-swatches">
          {product.swatches.map((swatch, idx) => (
            <span
              key={idx}
              role="button"
              tabIndex={0}
              aria-label={`Select color ${idx + 1}`}
              className={`clzv3-pc-swatch ${idx === activeSwatchIndex ? 'clzv3-pc-swatch-active' : ''}`}
              style={{ background: swatch.color, borderColor: swatch.borderColor }}
              onClick={() => setActiveSwatchIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
