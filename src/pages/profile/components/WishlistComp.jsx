import "./../css/WishlistComp.css";
import { useWishlist } from "../../../context/WishListContext";
const PLACEHOLDER_ITEMS = [
  {
    id: 1,
    name: "Oversized Linen Blazer",
    price: "₹2,499",
    tag: "New In",
    color: "#a8c5da",
  },
  {
    id: 2,
    name: "Vintage Wash Denim",
    price: "₹1,899",
    tag: "Popular",
    color: "#d4a5c9",
  },
  {
    id: 3,
    name: "Ribbed Knit Co-ord",
    price: "₹3,199",
    tag: "Limited",
    color: "#a8d4b5",
  },
];

export default function WishlistComp() {
  const{wishlistItems}=useWishlist()
  
  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">COLLECTIONS</div>
        <h1 className="page-title">My Wishlist</h1>
        <p className="page-sub">Pieces you loved — all in one place.</p>
      </div>

      <div className="empty-state">
        <div className="empty-icon">♡</div>
        <div className="empty-title">Nothing saved yet</div>
        <div className="empty-sub">
          Tap the heart on any item while browsing to save it here.
        </div>
        <button className="btn primary" style={{ marginTop: "16px" }}>
          Browse Collections →
        </button>
      </div>

      {/* Preview Strip */}
      <div className="section-block" style={{ marginTop: "32px" }}>
        <div className="section-header">
          <div className="section-title">
            Saved Items ({wishlistItems.length})
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div className="wishlist-card" key={item.wishlist_id}>
              <div className="wishlist-image-wrapper">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="wishlist-image"
                />

                <button className="wishlist-heart">♥</button>
              </div>

              <div className="wishlist-content">
                <div className="wishlist-category">{item.category}</div>

                <h3 className="wishlist-name">{item.name}</h3>

                <div className="wishlist-rating">
                  ★★★★★ ({item.review_count})
                </div>

                <div className="wishlist-price">
                  <span className="current-price">₹{item.price}</span>

                  {item.original_price && (
                    <>
                      <span className="original-price">
                        ₹{item.original_price}
                      </span>

                      <span className="discount-badge">
                        -{item.discount_percentage}%
                      </span>
                    </>
                  )}
                </div>

                <div className="wishlist-colors">
                  {item.colors?.map((color, idx) => (
                    <span
                      key={idx}
                      className="wishlist-color"
                      style={{
                        background: color,
                      }}
                    />
                  ))}
                </div>

                <div className="wishlist-actions">
                  <button className="btn primary">ADD TO CART</button>

                  <button className="btn">VIEW</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
