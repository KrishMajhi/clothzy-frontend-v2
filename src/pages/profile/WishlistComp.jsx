import "./css/WishlistComp.css";

const PLACEHOLDER_ITEMS = [
  { id: 1, name: "Oversized Linen Blazer", price: "₹2,499", tag: "New In",   color: "#a8c5da" },
  { id: 2, name: "Vintage Wash Denim",     price: "₹1,899", tag: "Popular", color: "#d4a5c9" },
  { id: 3, name: "Ribbed Knit Co-ord",     price: "₹3,199", tag: "Limited", color: "#a8d4b5" },
];

export default function WishlistComp() {
  return (
    <div className="wl-root">

      {/* heading */}
      <div className="wl-heading">
        <span className="wl-heading-tag">Saved</span>
        <h1 className="wl-title">Wishlist</h1>
        <p className="wl-desc">Pieces you loved — all in one place.</p>
      </div>

      {/* empty hero banner */}
      <div className="wl-empty-banner">
        <div className="wl-empty-icon-wrap">
          <span className="wl-empty-icon">♡</span>
          <span className="wl-empty-icon-bg" />
        </div>
        <h2 className="wl-empty-title">Nothing saved yet</h2>
        <p className="wl-empty-body">
          Tap the heart on any item while browsing to save it here.
        </p>
        <button className="wl-browse-btn">Browse Collections →</button>
      </div>

      {/* preview strip */}
      <div className="wl-preview-section">
        <p className="wl-preview-label">You might like</p>
        <div className="wl-preview-strip">
          {PLACEHOLDER_ITEMS.map((item, i) => (
            <div
              className="wl-preview-card"
              key={item.id}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="wl-card-swatch" style={{ background: item.color }}>
                <span className="wl-card-tag">{item.tag}</span>
              </div>
              <div className="wl-card-info">
                <p className="wl-card-name">{item.name}</p>
                <p className="wl-card-price">{item.price}</p>
              </div>
              <button className="wl-card-heart" title="Save">♡</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
