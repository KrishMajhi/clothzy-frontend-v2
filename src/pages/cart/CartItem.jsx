import React from "react";

const StarRating = ({ rating, review_count }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="item-rating">
      <div className="stars">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`star ${i >= fullStars ? "empty" : ""}`}
            viewBox="0 0 12 12"
          >
            <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,9 2.5,11 3.5,7 1,4.5 4.5,4.5" />
          </svg>
        ))}
      </div>
      <span className="rating-text">
        {rating} ({review_count} reviews)
      </span>
    </div>
  );
};

const CartItem = ({ item, onUpdateQty, onRemove, onSaveForLater }) => {
  const MAX_QTY = 5;
  const maxAllowed = item.max_qty_allowed ?? MAX_QTY;
  const hasDiscount = item.original_price && item.original_price > item.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((item.original_price - item.price) / item.original_price) * 100,
      )
    : null;

  return (
    <div
      className="cart-item"
      data-price={item.price}
      data-original={item.original_price}
      data-qty={item.quantity}
      data-id={item.cart_id}
    >
      {/* Image */}
      <div className="cart-item-image">
        {discountPct && (
          <div className="item-discount-badge">{discountPct}% OFF</div>
        )}
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <svg viewBox="0 0 148 192" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id={`g${item.cart_id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" style={{ stopColor: "#e6e2da" }} />
                <stop offset="100%" style={{ stopColor: "#dad4cc" }} />
              </linearGradient>
            </defs>
            <rect width="148" height="192" fill={`url(#g${item.cart_id})`} />
            <text
              x="74"
              y="100"
              textAnchor="middle"
              dy=".35em"
              fontSize="52"
              fontFamily="serif"
            >
              👕
            </text>
          </svg>
        )}
      </div>

      {/* Details */}
      <div className="cart-item-details">
        <div className="item-category">
          {item.category} · {item.gender}
        </div>
        <h3 className="item-name">{item.name}</h3>

        <div className="item-meta">
          {item.brand && (
            <span className="meta-tag">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle
                  cx="5"
                  cy="5"
                  r="4"
                  stroke="#b8a98e"
                  strokeWidth="1.5"
                />
                <circle cx="5" cy="5" r="1.5" fill="#b8a98e" />
              </svg>
              {item.brand}
            </span>
          )}
          {item.material && (
            <span className="meta-tag">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 8c0-2 1.5-4 3-4s3 2 3 4"
                  stroke="#b8a98e"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="5"
                  cy="3.5"
                  rx="2"
                  ry="1.5"
                  stroke="#b8a98e"
                  strokeWidth="1.2"
                />
              </svg>
              {item.material}
            </span>
          )}
        </div>

        <StarRating rating={item.rating} review_count={item.review_count} />

        <div className="item-options">
          <div className="option-pill">
            <span className="option-label">Size</span>
            <span className="option-value">{item.selected_size}</span>
          </div>
          <div className="option-pill">
            <span className="option-label">Color</span>
            <span className="option-value">{item.selected_color}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <span
            className={`stock-indicator ${item.stock > 0 ? "in-stock" : "low-stock"}`}
          >
            <span
              className={`stock-dot ${item.stock > 0 ? "in-stock" : "low-stock"}`}
            ></span>
            <span className="stock-text">
              {item.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </span>
          <span
            className="save-later"
            onClick={() => onSaveForLater(item.cart_id)}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1 1h9v9L5.5 7 1 10V1z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            Save for later
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="item-price-section">
        <div className="price-stack">
          <div className="item-price">${item.price.toFixed(2)}</div>
          {hasDiscount && (
            <>
              <div className="item-original-price">
                ${item.original_price.toFixed(2)}
              </div>
              <div className="item-savings">
                Save ${(item.original_price - item.price).toFixed(2)}
              </div>
            </>
          )}
        </div>

        <div className="qty-wrap">
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => onUpdateQty(item.cart_id, -1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>{" "}
            <input
              type="number"
              className="qty-input"
              value={item.quantity}
              readOnly
            />
            <button
              className="qty-btn"
              onClick={() => onUpdateQty(item.cart_id, 1)}
              disabled={item.quantity >= maxAllowed}
            >
              +
            </button>
          </div>
        </div>

        <div className="item-subtotal">
          Subtotal: <strong>${item.subtotal.toFixed(2)}</strong>
        </div>

        <button className="remove-link" onClick={() => onRemove(item.cart_id)}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 2l6 6M8 2L2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
