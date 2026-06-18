import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../css/OrderDetailComp.css";

export default function OrderDetailComp({ orderId, onBack }) {
  const { user } = useAuth();

  const order = (user?.orders || []).find(o => o.id === orderId);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (!order) {
    return (
      <div className="view">
        <button className="back-link" onClick={onBack}>Back to Orders</button>
        <div className="empty-state">
          <div className="empty-icon">⚠</div>
          <div className="empty-title">Order not found</div>
          <div className="empty-sub">This order doesn't exist or may have been removed.</div>
        </div>
      </div>
    );
  }

  const actionBtns = [];
  actionBtns.push(<button key="track"   className="btn" onClick={() => alert("Tracking…")}>TRACK</button>);
  if (["pending", "confirmed"].includes(order.status))
    actionBtns.push(<button key="cancel" className="btn danger" onClick={() => alert("Cancel?")}>CANCEL</button>);
  if (order.status === "delivered") {
    actionBtns.push(<button key="reorder" className="btn primary" onClick={() => alert("Reorder")}>REORDER</button>);
    actionBtns.push(<button key="return"  className="btn"         onClick={() => alert("Return")}>RETURN</button>);
  }
  actionBtns.push(<button key="invoice" className="btn" onClick={() => alert("Invoice")}>INVOICE</button>);

  return (
    <div className="view">
      <button className="back-link" onClick={onBack}>Back to Orders</button>

      {/* ── Top bar ── */}
      <div className="detail-topbar">
        <div>
          <div className="detail-id">{order.id}</div>
          <div style={{ marginTop: "8px" }}>
            <span className={`badge ${order.status}`}>{order.status.replace(/_/g, " ")}</span>
          </div>
          <div className="detail-date">Placed {order.createdAt} · Last updated {order.updatedAt}</div>
        </div>
        <div className="detail-actions">{actionBtns}</div>
      </div>

      {/* ── Progress / Timeline ── */}
      {order.timeline && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Progress</div>
          </div>
          <div className="progress-wrap">
            <div className="progress-label">
              <span>Order Progress</span>
              <span>{order.progress ?? 0}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${order.progress ?? 0}%` }} />
            </div>
          </div>
          <div className="timeline">
            {order.timeline.map((t, i) => (
              <div className="timeline-step" key={i}>
                <div className={`timeline-dot ${t.done ? "done" : t.current ? "current" : ""}`}>
                  {t.done ? "✓" : t.current ? "⊙" : "○"}
                </div>
                <div className={`timeline-label ${t.done ? "done" : ""}`}>{t.status}</div>
                <div className="timeline-date">{t.date || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Items ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Order Items</div>
        </div>
        <div className="items-grid">
          {(order.items || []).map((item, i) => (
            <div className="item-card" key={i}>
              {item.img ? (
                <img
                  className="item-thumb"
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  onError={e => { e.target.style.display = "none"; }}
                  style={{ height: "160px", width: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="item-thumb">👕</div>
              )}
              <div className="item-body">
                <div className="item-name">{item.name}</div>
                <div className="item-meta">
                  <div className="item-row"><span>Colour</span><span>{item.color}</span></div>
                  <div className="item-row"><span>Size</span><span>{item.size}</span></div>
                  <div className="item-row"><span>Qty</span><span>×{item.quantity}</span></div>
                  <div className="item-row"><span>Price</span><span><strong>{item.purchasePrice}</strong></span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment & Shipping ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Payment & Shipping</div>
        </div>
        <div className="detail-grid three">
          <div className="detail-card">
            <div className="detail-card-label">Payment Method</div>
            <div className="detail-card-value">{order.paymentMethod}</div>
            <div className="detail-card-sub">{order.paymentStatus}</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Shipping Method</div>
            <div className="detail-card-value">{order.shippingMethod}</div>
            <div className="detail-card-sub">{order.shippingCharge} shipping</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Est. Delivery</div>
            <div className="detail-card-value">{order.estimatedDelivery}</div>
            <div className="detail-card-sub">Expected date</div>
          </div>
        </div>
      </div>

      {/* ── Delivery Address ── */}
      {order.deliveryAddress && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Address</div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <div className="detail-card-label">Recipient</div>
              <div className="detail-card-value">{order.deliveryAddress.name}</div>
              <div className="detail-card-sub">{order.deliveryAddress.phone}</div>
            </div>
            <div className="detail-card">
              <div className="detail-card-label">Address</div>
              <div className="detail-card-value" style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.7 }}>
                {order.deliveryAddress.line1}<br />{order.deliveryAddress.line2}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Price Breakdown ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Price Breakdown</div>
        </div>
        <div className="price-table">
          <div className="price-row"><span className="price-label">Subtotal</span><span className="price-val">{order.subtotal}</span></div>
          <div className="price-row"><span className="price-label">Tax</span><span className="price-val">{order.tax}</span></div>
          <div className="price-row"><span className="price-label">Shipping</span><span className="price-val">{order.shipping}</span></div>
          <div className="price-row"><span className="price-label">Total</span><span className="price-val gold">{order.total}</span></div>
        </div>
      </div>

      {/* ── Rating (delivered only) ── */}
      {order.status === "delivered" && (
        <div className="rating-row">
          <div className="rating-prompt">Rate this order</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                className={`star ${(hovered || rating) >= s ? "lit" : ""}`}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "8px" }}>
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
