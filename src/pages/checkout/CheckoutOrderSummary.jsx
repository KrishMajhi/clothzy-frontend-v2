import React from "react";

const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const TRUST = [
  { icon:"🔒", bold:"256-bit SSL",  text:"secured payment" },
  { icon:"↩️", bold:"Free 30-day", text:"hassle-free returns" },
  { icon:"🚚", bold:"Free shipping",text:"on qualifying orders" },
  { icon:"📦", bold:"Tracked",      text:"delivery with live updates" },
];

const CheckoutOrderSummary = ({ items, totals, shippingMethod, config, payMethod }) => {
  const { subtotal, savings, tax, deliveryCharge, shippingMethodCharge, total } = totals;
  const codFee     = payMethod === "cod" ? 49 : 0;
  const finalTotal = total + codFee;

  return (
    <div className="co-sidebar">
      <div className="co-summary-card">
        <h2 className="co-summary-heading">Order Summary</h2>

        {/* Items list */}
        <div className="co-s-items">
          {items.map((item, i) => (
            <div key={item.cart_id ?? item.product_id ?? i} className="co-s-item">
              <div className="co-s-img-wrap">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name} className="co-s-img"/>
                  : <div className="co-s-img co-s-img--empty">👕</div>
                }
                <div className="co-s-qty-badge">{item.quantity}</div>
              </div>
              <div className="co-s-info">
                <div className="co-s-name">{item.name}</div>
                <div className="co-s-meta">
                  {[item.size, item.color, item.brand].filter(Boolean).join(" · ")}
                </div>
              </div>
              <div className="co-s-price">{fmt(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="co-s-divider"/>

        <div className="co-s-row">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>

        {savings > 0 && (
          <div className="co-s-row co-s-row--discount">
            <span>You Save</span>
            <span>−{fmt(savings)}</span>
          </div>
        )}

        <div className="co-s-row">
          <span>Delivery</span>
          {deliveryCharge === 0
            ? <span className="co-s-free">Free</span>
            : <span>{fmt(deliveryCharge)}</span>
          }
        </div>

        {shippingMethodCharge > 0 && (
          <div className="co-s-row">
            <span>{shippingMethod === "express" ? "Express" : "Same Day"} Shipping</span>
            <span>{fmt(shippingMethodCharge)}</span>
          </div>
        )}

        <div className="co-s-row">
          <span>Tax ({config?.tax_percentage ?? 8}%)</span>
          <span>{fmt(tax)}</span>
        </div>

        {codFee > 0 && (
          <div className="co-s-row">
            <span>COD Handling Fee</span>
            <span>₹{codFee}</span>
          </div>
        )}

        <div className="co-s-row co-s-row--total">
          <span className="co-s-total-label">Total</span>
          <span>{fmt(finalTotal)}</span>
        </div>
      </div>

      {/* Trust strip */}
      <div className="co-trust-strip">
        {TRUST.map(t => (
          <div key={t.bold} className="co-trust-item">
            <span className="co-trust-icon">{t.icon}</span>
            <span><strong>{t.bold}</strong> {t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
