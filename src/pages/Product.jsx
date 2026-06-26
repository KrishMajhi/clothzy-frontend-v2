import React, { useEffect, useState } from "react";
import "./css/Product.css";
import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useCart } from "../context/CartContext";

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
      item.selected_color === selectedColor
  );

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
      <div className="clothzy-prod-wrapper">
        <div className="clothzy-prod-skeleton-page">
          <div className="clothzy-prod-skeleton-gallery">
            <div className="clothzy-prod-skeleton-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="clothzy-prod-skeleton clothzy-prod-skeleton-thumb" />
              ))}
            </div>
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-main-img" />
          </div>
          <div className="clothzy-prod-skeleton-info">
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-line clothzy-prod-skeleton-line-short" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-line clothzy-prod-skeleton-line-title" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-line clothzy-prod-skeleton-line-medium" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-line clothzy-prod-skeleton-line-long" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-line clothzy-prod-skeleton-line-long" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-chips" />
            <div className="clothzy-prod-skeleton clothzy-prod-skeleton-btn" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="clothzy-prod-wrapper">
        <div className="clothzy-prod-not-found">Product not found.</div>
      </div>
    );
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const thumbs = product.images || [];
  const tags = product.tags || [];

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
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
    <div className="clothzy-prod-wrapper">
      {/* BREADCRUMB */}
      <div className="clothzy-prod-breadcrumb">
        <span style={{ color: "#A89F94" }}>
          {product.category || "CATEGORY"}
        </span>
        <span style={{ color: "#CCC" }}>·</span>
        <span style={{ color: "#A89F94" }}>{product.brand || "BRAND"}</span>
        <span style={{ color: "#CCC" }}>·</span>
        <span>{product.gender || "UNISEX"}</span>
      </div>

      {/* PRODUCT GRID */}
      <div className="clothzy-prod-product-grid">
        {/* THUMBNAILS */}
        <div className="clothzy-prod-thumbs">
          {thumbs.map((img, i) => (
            <div
              key={i}
              className={`clothzy-prod-thumb ${activeThumb === i ? "clothzy-prod-thumb-active" : ""}`}
              onClick={() => setActiveThumb(i)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && setActiveThumb(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt={`${product.name} view ${i + 1}`} className="clothzy-prod-thumb-img" />
            </div>
          ))}
        </div>

        {/* MAIN IMAGE */}
        <div className="clothzy-prod-main-img">
          {discount > 0 && <span className="clothzy-prod-img-badge">— {discount}%</span>}
          <img
            src={thumbs[activeThumb]}
            alt={product.name}
            className="clothzy-prod-main-product-image"
          />
          <span className="clothzy-prod-img-counter">
            {String(activeThumb + 1).padStart(2, "0")} ·{" "}
            {String(thumbs.length).padStart(2, "0")}
          </span>
        </div>

        {/* INFO */}
        <div className="clothzy-prod-info">
          <div className="clothzy-prod-brand-line">
            {[product.brand, product.gender].filter(Boolean).join(" · ")}
          </div>
          <h1 className="clothzy-prod-product-name">{product.name}</h1>

          {/* PRICE ROW */}
          <div className="clothzy-prod-price-row">
            <span className="clothzy-prod-price-current">Rs.{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="clothzy-prod-price-og">Rs.{product.original_price}</span>
            )}
            {discount > 0 && <span className="clothzy-prod-save-badge">SAVE {discount}%</span>}
          </div>

          <p style={{ fontSize: "12px", color: "#888", lineHeight: "1.7", marginBottom: "20px" }}>
            {product.description}
          </p>

          {/* STOCK ROW */}
          <div className="clothzy-prod-stock-row">
            {product.material && (
              <div className="clothzy-prod-stock-item">
                <div className="clothzy-prod-stock-key">MATERIAL</div>
                <div className="clothzy-prod-stock-val">{product.material}</div>
              </div>
            )}
            <div className="clothzy-prod-stock-item">
              <div className="clothzy-prod-stock-key">AVAILABILITY</div>
              <div className={`clothzy-prod-stock-val clothzy-prod-stock-val-${stockStatus.cls}`}>
                {stockStatus.label}
              </div>
            </div>
          </div>

          {/* COLOR SWATCHES */}
          {colors.length > 0 && (
            <>
              <div className="clothzy-prod-section-label">COLOUR</div>
              <div className="clothzy-prod-color-row">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`clothzy-prod-color-swatch ${selectedColor === color ? "clothzy-prod-color-swatch-active" : ""}`}
                    style={{
                      background: getColorValue(color),
                    }}
                    onClick={() => setSelectedColor(color)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === "Enter" && setSelectedColor(color)}
                    title={color}
                    aria-label={`Select ${color}`}
                  />
                ))}
                {selectedColor && <span className="clothzy-prod-color-name">{selectedColor}</span>}
              </div>
            </>
          )}

          {/* SIZES */}
          {sizes.length > 0 && (
            <>
              <div className="clothzy-prod-section-label">SELECT SIZE</div>
              <div className="clothzy-prod-size-grid">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`clothzy-prod-size-btn ${selectedSize === size ? "clothzy-prod-size-btn-active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* BUTTONS */}
          <div className="clothzy-prod-btn-group">
            <button
              className={`clothzy-prod-btn-cart ${isInCart ? "clothzy-prod-btn-cart-in-cart" : ""} ${addedAnim ? "clothzy-prod-btn-cart-anim" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isInCart}
            >
              {product.stock <= 0 ? (
                "OUT OF STOCK"
              ) : isInCart ? (
                <>
                  <i className="ti ti-check" aria-hidden="true"></i>
                  ADDED TO CART
                </>
              ) : (
                <>
                  <i className="ti ti-shopping-bag" aria-hidden="true"></i>
                  ADD TO CART
                </>
              )}
            </button>
            <button
              className={`clothzy-prod-btn-wish ${wishlisted ? "clothzy-prod-btn-wish-active" : ""}`}
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Add to wishlist"
            >
              <i className="ti ti-heart" aria-hidden="true"></i>
            </button>
          </div>

          {/* PERKS */}
          <div className="clothzy-prod-perks">
            <div className="clothzy-prod-perk">
              <i className="ti ti-truck-delivery" aria-hidden="true"></i>
              Free shipping on orders over Rs.999
            </div>
            <div className="clothzy-prod-perk">
              <i className="ti ti-refresh" aria-hidden="true"></i>
              Free 30-day returns
            </div>
            <div className="clothzy-prod-perk">
              <i className="ti ti-shield-check" aria-hidden="true"></i>
              Secure checkout
            </div>
          </div>

          {/* METADATA */}
          <div className="clothzy-prod-meta-row">
            {product.brand && (
              <div className="clothzy-prod-meta-pill">
                <strong>Brand</strong> {product.brand}
              </div>
            )}
            {product.category && (
              <div className="clothzy-prod-meta-pill">
                <strong>Category</strong> {product.category}
              </div>
            )}
            {product.gender && (
              <div className="clothzy-prod-meta-pill">
                <strong>Gender</strong> {product.gender}
              </div>
            )}
            {tags.length > 0 && (
              <div className="clothzy-prod-meta-pill">
                <strong>Tags</strong> {tags.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REVIEW SECTION */}
      <div className="clothzy-prod-reviews-section">
        <div className="clothzy-prod-reviews-header">
          <h2 className="clothzy-prod-reviews-title">Customer Reviews</h2>
        </div>

        <div className="clothzy-prod-review-empty">
          <div className="clothzy-prod-empty-icon">
            <i className="ti ti-message-circle" aria-hidden="true"></i>
          </div>
          <div className="clothzy-prod-empty-title">No reviews yet</div>
          <p className="clothzy-prod-empty-sub">
            Be the first to share your experience.
            <br />
            Your review helps others make confident choices.
          </p>
          <button className="clothzy-prod-empty-btn">✎ &nbsp;WRITE A REVIEW</button>
          <div className="clothzy-prod-empty-divider">or share this product</div>
          <div className="clothzy-prod-share-row">
            <button className="clothzy-prod-share-btn">
              <i
                className="ti ti-brand-instagram"
                style={{ fontSize: "13px", marginRight: "4px" }}
                aria-hidden="true"
              ></i>
              INSTAGRAM
            </button>
            <button className="clothzy-prod-share-btn">
              <i
                className="ti ti-link"
                style={{ fontSize: "13px", marginRight: "4px" }}
                aria-hidden="true"
              ></i>
              COPY LINK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* HELPER: Map color names to hex values */
function getColorValue(colorName) {
  const colorMap = {
    "Dark Blue": "#1B2A45",
    "Jet Black": "#1A1A1A",
    "Washed Blue": "#6B8299",
    "Navy": "#1B2A45",
    "Black": "#1A1A1A",
    "Blue": "#1B2A45",
    "Beige": "#C9B8A8",
    "White": "#F5F5F5",
    "Red": "#C0392B",
    "Green": "#2A7A5A",
    "Brown": "#6B4E2A",
  };
  return colorMap[colorName] || "#D5CFC6";
}

export default Product;