import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";
import "./OrderConfirmationPage.css";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => `₹${Number(n ?? 0).toFixed(0)}`;

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const estimatedDelivery = (createdAt, shippingMethod) => {
  if (!createdAt) return "—";
  const base = new Date(createdAt);
  const ranges = { standard: [5, 7], express: [2, 3], same_day: [0, 1] };
  const [min, max] = ranges[shippingMethod?.toLowerCase()] ?? [5, 7];
  const lo = new Date(base); lo.setDate(lo.getDate() + min);
  const hi = new Date(base); hi.setDate(hi.getDate() + max);
  const opts = { day: "numeric", month: "short" };
  return `${lo.toLocaleDateString("en-IN", opts)} – ${hi.toLocaleDateString("en-IN", opts)}`;
};

const shippingLabel = (method) => ({
  standard: "Standard · 5–7 days",
  express:  "Express · 2–3 days",
  same_day: "Same Day Delivery",
}[method?.toLowerCase()] ?? method ?? "Standard");

const paymentLabel = (method) => ({
  card:       "💳 Credit / Debit Card",
  upi:        "📱 UPI",
  cod:        "💵 Cash on Delivery",
  netbanking: "🏦 Net Banking",
  wallet:     "👛 Wallet",
}[method?.toLowerCase()] ?? method ?? "—");

// ─── Timeline ──────────────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: "placed",     label: "Order Placed",               icon: "✓" },
  { key: "processing", label: "Processing & Packing",        icon: "⋯" },
  { key: "dispatched", label: "Dispatched from Warehouse",   icon: "" },
  { key: "out",        label: "Out for Delivery",            icon: "" },
  { key: "delivered",  label: "Delivered",                   icon: "" },
];

// Map backend order status → which timeline index is "active"
const statusToTimelineIndex = (status) => ({
  pending:    0,
  confirmed:  1,
  processing: 1,
  shipped:    2,
  out_for_delivery: 3,
  delivered:  4,
  cancelled:  -1,
}[status?.toLowerCase()] ?? 0);

const Timeline = ({ order }) => {
  const activeIdx = statusToTimelineIndex(order?.status);

  return (
    <div className="cf-timeline">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone   = i < activeIdx;
        const isActive = i === activeIdx;
        const isPending = i > activeIdx;

        return (
          <div key={step.key} className="cf-tl-item">
            <div
              className={`cf-tl-dot ${isDone ? "done" : isActive ? "active" : "pending"}`}
            >
              {isDone ? "✓" : isActive ? step.icon || "⋯" : ""}
            </div>
            <div className="cf-tl-content">
              <div className={`cf-tl-title ${isPending ? "pending" : ""}`}>
                {step.label}
              </div>
              <div className="cf-tl-date">
                {i === 0 && formatDate(order?.created_at)}
                {i === 1 && (isDone || isActive) && `Expected by ${formatDate(order?.created_at)}`}
                {i === 2 && (isDone || isActive) && "In transit"}
                {i === 3 && (isDone || isActive) && "On the way"}
                {i === 4 && isDone && formatDate(order?.updated_at)}
                {isPending && i !== 0 && "—"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Trust Strip ───────────────────────────────────────────────────────────────

const TRUST = [
  { icon: "🔒", bold: "256-bit SSL",   text: "secured payment" },
  { icon: "↩️", bold: "Free 30-day",   text: "hassle-free returns" },
  { icon: "🚚", bold: "Free shipping", text: "on qualifying orders" },
  { icon: "📦", bold: "Tracked",       text: "delivery with live updates" },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const OrderConfirmationPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { fetchOrderById, downloadInvoice } = useOrders();
  const { user }  = useAuth();

  // The checkout page pushes { orderId, items, totals, payMethod, shippingMethod }
  const passedState = location.state ?? {};
  const orderId     = passedState.orderId;

  const [order,        setOrder]       = useState(null);
  const [orderItems,   setOrderItems]  = useState(passedState.items ?? []);
  const [loading,      setLoading]     = useState(true);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      try {
        const data = await fetchOrderById(orderId);
        setOrder(data);
        if (data?.items?.length) setOrderItems(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    if (!orderId) return;
    setInvoiceLoading(true);
    try {
      await downloadInvoice(orderId);
    } catch (e) {
      alert("Could not download invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Derive display values — prefer fetched order, fall back to passed state
  const savings       = passedState.totals?.savings ?? 0;
  const promoCode     = order?.promo_code;
  const email         = user?.personal_info?.email ?? "";
  const isBuyNow      = passedState.isBuyNow ?? false;

  if (loading) {
    return (
      <div className="cf-root">
        <div className="cf-bg" />
        <div className="cf-loading">
          <div className="cf-spinner" />
          <p>Loading your order…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-root">
      <div className="cf-bg" />

      {/* ── Navbar ── */}
      <nav className="cf-nav">
        <div className="cf-nav-logo">
          <div className="cf-nav-mark">C</div>
          <div className="cf-nav-wordmark">CLOTHZY</div>
        </div>
        <div className="cf-nav-secure"><span>🔒</span> Secure Checkout</div>
        <button className="cf-btn-outline cf-nav-shop-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </nav>

      {/* ── Steps ── */}
      <div className="cf-steps-bar">
        <div className="cf-steps">
          <div className="cf-step cf-step--done">
            <div className="cf-step-num">✓</div>
            <span className="cf-step-label">{isBuyNow ? "Product" : "Cart"}</span>
          </div>
          <div className="cf-step cf-step--done">
            <div className="cf-step-num">✓</div>
            <span className="cf-step-label">Checkout</span>
          </div>
          <div className="cf-step cf-step--active">
            <div className="cf-step-num">3</div>
            <span className="cf-step-label">Confirmation</span>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="cf-container">

        {/* ── LEFT COLUMN ── */}
        <div className="cf-left">

          {/* Hero Banner */}
          <div className="cf-hero">
            <div className="cf-hero-check-ring">✓</div>
            <h1 className="cf-hero-title">Order Confirmed!</h1>
            <p className="cf-hero-subtitle">
              Thank you for shopping with Clothzy. Your items will be carefully
              packed and dispatched within 24 hours.
            </p>
            <div className="cf-hero-order-badge">
              🧾&nbsp; Order ID:&nbsp;<strong>{order?.id ?? orderId}</strong>
            </div>
            <div className="cf-hero-divider" />
            <div className="cf-eta-row">
              <div className="cf-eta-chip">
                <span className="cf-eta-icon">📅</span>
                <div>
                  <span className="cf-eta-label">Order Date</span>
                  <span className="cf-eta-value">{formatDate(order?.created_at)}</span>
                </div>
              </div>
              <div className="cf-eta-chip">
                <span className="cf-eta-icon">🚚</span>
                <div>
                  <span className="cf-eta-label">Estimated Delivery</span>
                  <span className="cf-eta-value">
                    {estimatedDelivery(order?.created_at, order?.shipping_method)}
                  </span>
                </div>
              </div>
              <div className="cf-eta-chip">
                <span className="cf-eta-icon">📦</span>
                <div>
                  <span className="cf-eta-label">Shipping Method</span>
                  <span className="cf-eta-value">
                    {shippingLabel(order?.shipping_method)}
                  </span>
                </div>
              </div>
            </div>
            {email && (
              <div className="cf-email-notice">
                <span className="cf-email-icon">📧</span>
                <div>
                  A confirmation email has been sent to{" "}
                  <strong>{email}</strong> with your invoice and tracking details.
                </div>
              </div>
            )}
          </div>

          {/* Delivery Details */}
          <div className="cf-section-card">
            <div className="cf-section-head">
              <div className="cf-section-num">1</div>
              <h2 className="cf-section-title">Delivery Details</h2>
            </div>
            <div className="cf-detail-grid">
              <div className="cf-detail-block">
                <div className="cf-detail-label">Deliver To</div>
                <div className="cf-detail-value">
                  {order?.delivery_name}<br />
                  {order?.address_line_1}<br />
                  {order?.address_line_2 && <>{order.address_line_2}<br /></>}
                  {order?.city}{order?.state ? `, ${order.state}` : ""}{order?.postal_code ? ` – ${order.postal_code}` : ""}
                </div>
              </div>
              <div className="cf-detail-block">
                <div className="cf-detail-label">Contact</div>
                <div className="cf-detail-value">
                  {email || "—"}<br />
                  {order?.delivery_phone}
                </div>
              </div>
              <div className="cf-detail-block">
                <div className="cf-detail-label">Payment Method</div>
                <div className="cf-detail-value">
                  {paymentLabel(order?.payment_method)}<br />
                  {order?.payment_method === "cod"
                    ? <span style={{ color: "var(--cf-ink4)", fontSize: "12px" }}>Pay on delivery</span>
                    : <span className="cf-green">Paid · {fmt(order?.total_amount)}</span>
                  }
                </div>
              </div>
              <div className="cf-detail-block">
                <div className="cf-detail-label">Shipping Speed</div>
                <div className="cf-detail-value">
                  {shippingLabel(order?.shipping_method)}<br />
                  {Number(order?.shipping_charge ?? 0) === 0
                    ? <span className="cf-green">Free Shipping</span>
                    : <span>{fmt(order?.shipping_charge)} shipping fee</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Items Ordered */}
          <div className="cf-section-card">
            <div className="cf-section-head">
              <div className="cf-section-num">2</div>
              <h2 className="cf-section-title">Items Ordered</h2>
            </div>
            <div className="cf-order-items">
              {orderItems.length === 0 && (
                <p style={{ color: "var(--cf-sand)", fontSize: "13px" }}>
                  Item details unavailable.
                </p>
              )}
              {orderItems.map((item, i) => (
                <div
                  key={item.cart_id ?? item.product_id ?? i}
                  className="cf-order-item"
                >
                  <div className="cf-item-img-wrap">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name ?? item.product_name} className="cf-item-img" />
                      : <div className="cf-item-img cf-item-img--empty">👕</div>
                    }
                    <div className="cf-item-qty-badge">{item.quantity}</div>
                  </div>
                  <div className="cf-item-info">
                    <div className="cf-item-name">{item.name ?? item.product_name}</div>
                    <div className="cf-item-meta">
                      {[item.size ?? item.selected_size, item.color ?? item.selected_color, item.brand]
                        .filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <div className="cf-item-price">
                    {fmt((item.price ?? item.price_at_purchase) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Tracking Timeline */}
          <div className="cf-section-card">
            <div className="cf-section-head">
              <div className="cf-section-num">3</div>
              <h2 className="cf-section-title">Order Tracking</h2>
            </div>
            <Timeline order={order} />
          </div>

        </div>{/* /cf-left */}

        {/* ── RIGHT SIDEBAR ── */}
        <div className="cf-sidebar">

          {/* Order Summary */}
          <div className="cf-summary-card">
            <div className="cf-summary-heading">Order Summary</div>

            <div className="cf-s-row">
              <span>Subtotal</span>
              <span>{fmt(order?.subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="cf-s-row cf-s-row--discount">
                <span>You Saved</span>
                <span>−{fmt(savings)}</span>
              </div>
            )}
            <div className="cf-s-row">
              <span>Delivery</span>
              {Number(order?.delivery_charge ?? 0) === 0
                ? <span className="cf-s-free">Free</span>
                : <span>{fmt(order?.delivery_charge)}</span>
              }
            </div>
            {Number(order?.shipping_charge ?? 0) > 0 && (
              <div className="cf-s-row">
                <span>{shippingLabel(order?.shipping_method)}</span>
                <span>{fmt(order?.shipping_charge)}</span>
              </div>
            )}
            <div className="cf-s-row">
              <span>Tax</span>
              <span>{fmt(order?.tax)}</span>
            </div>
            {promoCode && (
              <div className="cf-s-row">
                <span>Promo</span>
                <span className="cf-promo-badge">✓ {promoCode}</span>
              </div>
            )}
            {Number(order?.discount ?? 0) > 0 && (
              <div className="cf-s-row cf-s-row--discount">
                <span>Discount</span>
                <span>−{fmt(order?.discount)}</span>
              </div>
            )}
            <div className="cf-s-row cf-s-row--total">
              <span className="cf-s-total-label">Total</span>
              <span>{fmt(order?.total_amount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cf-summary-card">
            <div className="cf-action-group">
              <button
                className="cf-btn-primary"
                onClick={() => navigate(`/orders/${orderId}`)}
              >
                📦&nbsp;&nbsp;Track My Order
              </button>
              <button
                className="cf-btn-outline"
                onClick={() => navigate("/")}
              >
                🛍️&nbsp;&nbsp;Continue Shopping
              </button>
              <button
                className="cf-btn-outline"
                onClick={handleDownloadInvoice}
                disabled={invoiceLoading}
              >
                {invoiceLoading ? (
                  <>
                    <span className="cf-spinner cf-spinner--sm" /> Downloading…
                  </>
                ) : (
                  <>🖨️&nbsp;&nbsp;Download Invoice</>
                )}
              </button>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="cf-trust-strip">
            {TRUST.map((t) => (
              <div key={t.bold} className="cf-trust-item">
                <span className="cf-trust-icon">{t.icon}</span>
                <span><strong>{t.bold}</strong> {t.text}</span>
              </div>
            ))}
          </div>

        </div>{/* /cf-sidebar */}
      </div>{/* /cf-container */}
    </div>
  );
};

export default OrderConfirmationPage;
