import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useOrders } from "../../../context/OrderContext";
import "../css/OrderDetailComp.css";

export default function OrderDetailComp({ orderId, onBack,order_number }) {
  const { user } = useAuth();
  const { fetchOrderById, selectedOrder,downloadInvoice } = useOrders();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);
  const order = selectedOrder;

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (!order) {
    return (
      <div className="backbtnview">
        <button className="back-link" onClick={onBack}>
          Back to Orders
        </button>
        <div className="empty-state">
          <div className="empty-icon">⚠</div>
          <div className="empty-title">Order not found</div>
          <div className="empty-sub">
            This order doesn't exist or may have been removed.
          </div>
        </div>
      </div>
    );
  }

  const actionBtns = [];
  actionBtns.push(
    <button
      key="track"
      className="orderdetailTopbuttons"
      onClick={() => alert("Tracking…")}
    >
      TRACK
    </button>,
  );
  if (["pending", "confirmed"].includes(order.status))
    actionBtns.push(
      <button
        key="cancel"
        className="orderdetailTopbuttons danger"
        onClick={() => alert("Cancel?")}
      >
        CANCEL
      </button>,
    );
  if (order.status === "delivered") {
    actionBtns.push(
      <button
        key="reorder"
        className="orderdetailTopbuttons primary"
        onClick={() => alert("Reorder")}
      >
        REORDER
      </button>,
    );
    actionBtns.push(
      <button
        key="return"
        className="orderdetailTopbuttons"
        onClick={() => alert("Return")}
      >
        RETURN
      </button>,
    );
  }
  actionBtns.push(
    <button
      key="invoice"
      className="orderdetailTopbuttons"
      onClick={() => downloadInvoice(orderId)}
    >
      INVOICE
    </button>,
  );

  return (
    <div className="view">
      <button className="back-link" onClick={onBack}>
        Back to Orders
      </button>

      {/* ── Top bar ── */}
      <div className="detail-topbar">
        <div>
          <div className="detail-id">{order_number}</div>
          <div style={{ marginTop: "8px" }}>
            <span className={`orderrecentbadge ${order.status}`}>
              {/* {order.status.replace(/_/g, " ")}
               */}
              {order.status}
            </span>
          </div>
          <div className="detail-date">
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            Last updated{" "}
            {new Date(order.updated_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>  
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
              <div
                className="progress-fill"
                style={{ width: `${order.progress ?? 0}%` }}
              />
            </div>
          </div>
          <div className="timeline">
            {order.timeline.map((t, i) => (
              <div className="timeline-step" key={i}>
                <div
                  className={`timeline-dot ${t.done ? "done" : t.current ? "current" : ""}`}
                >
                  {t.done ? "✓" : t.current ? "⊙" : "○"}
                </div>
                <div className={`timeline-label ${t.done ? "done" : ""}`}>
                  {t.status}
                </div>
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
            <div className="item-card" key={item.product_id}>
              {item.img ? (
                // >remaining
                <img
                  className="item-thumb"
                  src={item.img}
                  alt={item.product_name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  style={{ height: "160px", width: "100%", objectFit: "cover" }}
                />
              ) : (
                <div className="item-thumb">👕</div>
              )}
              <div className="item-body">
                <div className="item-category">{item.category}</div>

                <div className="orderdetailitem-name">{item.product_name}</div>
                <div className="orderdetailitem-meta">
                  <div className="item-row">
                    <span>Colour:</span>
                    <span>{item.selected_color}</span>
                  </div>
                  <div className="item-row">
                    <span>Size:</span>
                    <span>{item.selected_size}</span>
                  </div>
                  <div className="item-row">
                    <span>Qty:</span>
                    <span>×{item.quantity}</span>
                  </div>
                  <div className="item-row">
                    <span>Price:</span>
                    <span>
                      <strong>{item.price_at_purchase}</strong>
                    </span>
                  </div>
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
            <div className="detail-card-value">{order.payment_method}</div>
            <div className="detail-card-sub">{order.payment_status}</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Shipping Method</div>
            <div className="detail-card-value">{order.shipping_method}</div>
            <div className="detail-card-sub">
              {order.shipping_charge} shipping
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Est. Delivery</div>
            <div className="detail-card-value">
              {order.estimatedDelivery
                ? order.estimatedDelivery
                : "maybe tommorow"}
            </div>
            <div className="detail-card-sub">Expected date</div>
          </div>
        </div>
      </div>

      {/* ── Delivery Address ── */}
      {order.address_line_1 && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Address</div>
          </div>
          <div className="detail-grid">
            <div className="detail-card">
              <div className="detail-card-label">Recipient</div>
              <div className="detail-card-value">{order.delivery_name}</div>
              <div className="detail-card-sub">{order.delivery_phone}</div>
            </div>
            <div className="detail-card">
              <div className="detail-card-label">Address</div>
              <div
                className="detail-card-value"
                style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.7 }}
              >
                {order.address_line_1}
                <br />
                {order.address_line_2}
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
          <div className="Orderdetailprice-row">
            <span className="price-label">Subtotal</span>
            <span className="price-val">{order.subtotal}</span>
          </div>
          <div className="Orderdetailprice-row">
            <span className="price-label">Tax</span>
            <span className="price-val">{order.tax}</span>
          </div>
          <div className="Orderdetailprice-row">
            <span className="price-label">Shipping</span>
            <span className="price-val">{order.shipping_charge}</span>
          </div>
          <div className="Orderdetailprice-row">
            <span className="price-label">Total</span>
            <span className="price-val gold">{order.total_amount}</span>
          </div>
        </div>
      </div>

      {/* ── Rating (delivered only) ── */}
      {order.status === "delivered" && (
        <div className="rating-row">
          <div className="rating-prompt">Rate this order</div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((s) => (
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
            <span
              style={{
                fontSize: "11px",
                color: "var(--muted)",
                marginLeft: "8px",
              }}
            >
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
