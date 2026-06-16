import "./css/OrdersComp.css";

const ORDER_STATUSES = [
  { icon: "📋", label: "Placed",    desc: "Order confirmed by Clothzy" },
  { icon: "🏭", label: "Packed",    desc: "Items packed and ready" },
  { icon: "🚚", label: "Shipped",   desc: "Out for delivery" },
  { icon: "✅", label: "Delivered", desc: "Arrived at your door" },
];

export default function OrdersComp() {
  return (
    <div className="ord-root">

      {/* heading */}
      <div className="ord-heading">
        <span className="ord-heading-tag">History</span>
        <h1 className="ord-title">Orders</h1>
        <p className="ord-desc">Track every purchase from placed to delivered.</p>
      </div>

      {/* empty state */}
      <div className="ord-empty">
        <div className="ord-empty-icon-wrap">
          <span className="ord-empty-icon">📦</span>
        </div>
        <h2 className="ord-empty-title">No orders yet</h2>
        <p className="ord-empty-body">
          Once you place an order, you'll see it tracked live right here.
        </p>
        <button className="ord-shop-btn">Shop Now →</button>
      </div>

      {/* order lifecycle diagram */}
      <div className="ord-lifecycle">
        <p className="ord-lifecycle-label">How order tracking works</p>
        <div className="ord-steps">
          {ORDER_STATUSES.map((s, i) => (
            <div className="ord-step" key={s.label} style={{ animationDelay: `${i * 90}ms` }}>
              <div className="ord-step-node">
                <span className="ord-step-icon">{s.icon}</span>
                {i < ORDER_STATUSES.length - 1 && (
                  <span className="ord-step-connector" />
                )}
              </div>
              <p className="ord-step-label">{s.label}</p>
              <p className="ord-step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
