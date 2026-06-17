import "./../css/WishlistComp.css";

const PLACEHOLDER_ITEMS = [
  { id: 1, name: "Oversized Linen Blazer", price: "₹2,499", tag: "New In",   color: "#a8c5da" },
  { id: 2, name: "Vintage Wash Denim",     price: "₹1,899", tag: "Popular",  color: "#d4a5c9" },
  { id: 3, name: "Ribbed Knit Co-ord",     price: "₹3,199", tag: "Limited",  color: "#a8d4b5" },
];

export default function WishlistComp() {
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
        <div className="empty-sub">Tap the heart on any item while browsing to save it here.</div>
        <button className="btn primary" style={{ marginTop: "16px" }}>Browse Collections →</button>
      </div>

      {/* Preview Strip */}
      <div className="section-block" style={{ marginTop: "32px" }}>
        <div className="section-header">
          <div className="section-title">You might like</div>
        </div>
        <div className="detail-grid">
          {PLACEHOLDER_ITEMS.map((item, i) => (
            <div className="detail-card" key={item.id} style={{ animationDelay: `${i * 80}ms` }}>
              <div
                className="wl-swatch"
                style={{ background: item.color, height: "60px", borderRadius: "4px", marginBottom: "10px" }}
              >
                <span className="badge confirmed" style={{ margin: "8px" }}>{item.tag}</span>
              </div>
              <div className="detail-card-label">{item.name}</div>
              <div className="detail-card-value">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
