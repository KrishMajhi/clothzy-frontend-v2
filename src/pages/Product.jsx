import React, { useEffect, useState } from "react";
import "./css/Product.css";
import { useParams } from "react-router-dom";
import { useShop } from "../Context/ShopContext";
import { useCart } from "../Context/CartContext";

function Product() {
  const { productid } = useParams();
  const { fetchProductByID } = useShop();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const isInCart = cartItems.some(
    (item) =>
      item.product_id === productid &&
      item.selected_size === selectedSize &&
      item.selected_color === selectedColor,
  );
  console.log(isInCart);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await fetchProductByID(productid);
      setProduct(data || null);
      setLoading(false);
    };
    loadProduct();
  }, [productid]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    console.log({
      product_id: product?.id,
      selectedSize,
      selectedColor,
    });
    addToCart({
      product_id: productid,
      quantity: 1,
      selected_size: selectedSize,
      selected_color: selectedColor,
    });
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1800);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="product-page-wrapper">
        <div className="product-page skeleton-page">
          <div className="skeleton-gallery">
            <div className="skeleton-thumbs">
              {[0, 1].map((i) => (
                <div key={i} className="skeleton skeleton-thumb" />
              ))}
            </div>
            <div className="skeleton skeleton-main-img" />
          </div>
          <div className="skeleton-info">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line title" />
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-line long" />
            <div className="skeleton skeleton-line long" />
            <div className="skeleton skeleton-line medium" />
            <div className="skeleton skeleton-chips" />
            <div className="skeleton skeleton-btn" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="product-page-wrapper">
        <div className="product-not-found">Product not found.</div>
      </div>
    );
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const thumbs = product.images || [];
  const tags = product.tags || [];

  // console.log(thumbs);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100,
        )
      : 0;

  const hasRating = product.rating > 0;
  const fullStars = hasRating ? Math.floor(product.rating) : 0;
  const hasHalf = hasRating && product.rating % 1 >= 0.5;

  const stockStatus =
    product.stock <= 0
      ? { label: "Out of stock", cls: "stock-out" }
      : product.stock <= 10
        ? { label: `Only ${product.stock} left`, cls: "stock-low" }
        : { label: `${product.stock} in stock`, cls: "stock-ok" };

  return (
    <div className="product-page-wrapper">
      <div className="product-page">
        {/* ── LEFT: Gallery ── */}
        <div className="product-gallery-col">
          <div className="thumb-list">
            {thumbs.map((img, i) => (
              <button
                key={i}
                className={`thumb-btn ${activeThumb === i ? "active" : ""}`}
                onClick={() => setActiveThumb(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt={`${product.name} view ${i + 1}`} />
              </button>
            ))}
          </div>

          <div className="main-image-wrap">
            {discount > 0 && (
              <span className="badge-discount">-{discount}%</span>
            )}
            <img
              src={thumbs[activeThumb]}
              alt={product.name}
              className="main-product-img"
            />
          </div>
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="product-info-col">
          <div className="product-eyebrow">
            {[product.category, product.brand, product.gender]
              .filter(Boolean)
              .join("\u00a0\u00b7\u00a0")}
          </div>

          <h1 className="product-title">{product.name}</h1>

          {/* Rating */}
          {hasRating ? (
            <div className="product-rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => {
                  if (i < fullStars)
                    return (
                      <svg key={i} viewBox="0 0 20 20" className="star filled">
                        <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.3l-5.2 2.8 1-5.8L1.5 7.2l5.9-.9z" />
                      </svg>
                    );
                  if (i === fullStars && hasHalf)
                    return (
                      <svg key={i} viewBox="0 0 20 20" className="star half">
                        <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.3l-5.2 2.8 1-5.8L1.5 7.2l5.9-.9z" />
                      </svg>
                    );
                  return (
                    <svg key={i} viewBox="0 0 20 20" className="star empty">
                      <path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.3l-5.2 2.8 1-5.8L1.5 7.2l5.9-.9z" />
                    </svg>
                  );
                })}
              </div>
              <span className="review-count">
                {product.rating} · {product.review_count} reviews
              </span>
            </div>
          ) : (
            <div className="product-rating">
              <span className="review-count no-reviews">No reviews yet</span>
            </div>
          )}

          {/* Price */}
          <div className="price-row">
            <span className="price-new">Rs.{product.price}</span>
            {product.original_price &&
              product.original_price > product.price && (
                <span className="price-old">Rs.{product.original_price}</span>
              )}
            {discount > 0 && (
              <span className="price-save">Save {discount}%</span>
            )}
          </div>

          <p className="product-desc">{product.description}</p>

          <div className="divider" />

          {/* Material + Stock */}
          <div className="detail-chips-row">
            {product.material && (
              <div className="detail-chip">
                <span className="detail-chip-label">Material</span>
                <span className="detail-chip-value">{product.material}</span>
              </div>
            )}
            <div className="detail-chip">
              <span className="detail-chip-label">Availability</span>
              <span className={`detail-chip-value ${stockStatus.cls}`}>
                {stockStatus.label}
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Color picker */}
          {colors.length > 0 && (
            <>
              <div className="size-section">
                <div className="size-header">
                  <span className="size-label">Color</span>
                  {selectedColor && (
                    <span className="size-chosen">— {selectedColor}</span>
                  )}
                </div>
                <div className="color-grid">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? "selected" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divider" />
            </>
          )}

          {/* Size picker */}
          {sizes.length > 0 && (
            <>
              <div className="size-section">
                <div className="size-header">
                  <span className="size-label">Select Size</span>
                  {selectedSize && (
                    <span className="size-chosen">— {selectedSize}</span>
                  )}
                </div>
                <div className="size-grid">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divider" />
            </>
          )}

          {/* Actions */}
          <div className="action-row">
            <button
              className={`btn-cart ${isInCart ? "in-cart" : ""} ${addedAnim ? "anim" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isInCart}
            >
              <span className="btn-cart-inner">
                {product.stock <= 0 ? (
                  "Out of Stock"
                ) : isInCart ? (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="cart-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      className="cart-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </span>
            </button>

            <button
              className={`btn-wishlist ${wishlisted ? "active" : ""}`}
              aria-label="Add to wishlist"
              onClick={() => setWishlisted((w) => !w)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="3" width="15" height="13" rx="1" />
                <path d="M16 8h4l3 3v5h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Free shipping on orders over Rs.999
            </div>
            <div className="meta-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Free 30-day returns
            </div>
            <div className="meta-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure checkout
            </div>
          </div>

          <div className="product-tags">
            {product.brand && (
              <span>
                Brand: <strong>{product.brand}</strong>
              </span>
            )}
            {product.category && (
              <span>
                Category: <strong>{product.category}</strong>
              </span>
            )}
            {product.gender && (
              <span>
                Gender: <strong>{product.gender}</strong>
              </span>
            )}
            {tags.length > 0 && (
              <span>
                Tags: <strong>{tags.join(", ")}</strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
