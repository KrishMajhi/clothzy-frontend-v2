import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/OrderDetailComp.css";

const BadgeHtml = ({ status }) => (
  <span className={`badge ${status}`}>{status.replace(/_/g, " ")}</span>
);

const ItemCard = ({ item }) => (
  <div className="item-card">
    <div className="item-thumb">👕</div>
    <div className="item-name">{item.name}</div>
    <div className="item-meta">
      <div className="item-row"><span>Color</span><span>{item.color}</span></div>
      <div className="item-row"><span>Size</span><span>{item.size}</span></div>
      <div className="item-row"><span>Qty</span><span>×{item.quantity}</span></div>
      <div className="item-row"><span>Price</span><span>{item.purchasePrice}</span></div>
    </div>
  </div>
);

const Timeline = ({ timeline, progress }) => (
  <div className="timeline-container">
    <div className="progress-wrap">
      <div className="progress-label">
        <span>Order Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <div className="timeline">
      {timeline.map((t, idx) => (
        <div key={idx} className="timeline-step">
          <div className={`timeline-dot ${t.done ? "done" : t.current ? "current" : ""}`}>
            {t.done ? "✓" : t.current ? "⊙" : "○"}
          </div>
          <div className={`timeline-label ${t.done ? "done" : ""}`}>{t.status}</div>
          <div className="timeline-date">{t.date}</div>
        </div>
      ))}
    </div>
  </div>
);

export default function OrderDetailComp({ orderId, onBack }) {
  const { user } = useAuth();

  const order = user?.orders?.find((o) => o.id === orderId);

  // rating is local — rateOrder/ratings don't exist in real AuthContext
  const [currentRating, setCurrentRating] = useState(0);

  if (!order) {
    return (
      <div className="view">
        <div className="empty-state">
          <div className="empty-icon">⚠</div>
          <div className="empty-title">Order not found</div>
          <div className="empty-sub">The order you're looking for doesn't exist.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="view">
      <div className="back-link" onClick={onBack}>← Back</div>

      <div className="detail-topbar">
        <div>
          <div className="detail-id">{order.id}</div>
          <div style={{ marginTop: "6px" }}><BadgeHtml status={order.status} /></div>
          <div className="detail-date">
            Placed {order.createdAt} · Last updated {order.updatedAt}
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn">TRACK</button>
          {order.status === "delivered" && <button className="btn primary">REORDER</button>}
          <button className="btn">INVOICE</button>
        </div>
      </div>

      {/* Timeline */}
      {order.timeline && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Progress</div>
          </div>
          <Timeline timeline={order.timeline} progress={order.progress ?? 0} />
        </div>
      )}

      {/* Items */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Order Items</div>
        </div>
        <div className="items-grid">
          {(order.items || []).map((item, idx) => (
            <ItemCard key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* Payment & Shipping */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Payment & Shipping</div>
        </div>
        <div className="detail-grid three">
          <div className="detail-card">
            <div className="detail-card-label">PAYMENT METHOD</div>
            <div className="detail-card-value">{order.paymentMethod}</div>
            <div className="detail-card-sub">{order.paymentStatus}</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">SHIPPING METHOD</div>
            <div className="detail-card-value">{order.shippingMethod}</div>
            <div className="detail-card-sub">{order.shippingCharge}</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">ESTIMATED DELIVERY</div>
            <div className="detail-card-value">{order.estimatedDelivery}</div>
            <div className="detail-card-sub">Delivery date</div>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Address</div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <div className="detail-card-label">RECIPIENT</div>
              <div className="detail-card-value">{order.deliveryAddress.name}</div>
              <div className="detail-card-sub">{order.deliveryAddress.phone}</div>
            </div>
            <div className="detail-card">
              <div className="detail-card-label">ADDRESS</div>
              <div className="detail-card-value" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                {order.deliveryAddress.line1}<br />{order.deliveryAddress.line2}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
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

      {/* Rating */}
      {order.status === "delivered" && (
        <div className="rating-row">
          <div className="rating-prompt">Rate this order</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`star ${currentRating >= s ? "lit" : ""}`}
                onClick={() => setCurrentRating(s)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
