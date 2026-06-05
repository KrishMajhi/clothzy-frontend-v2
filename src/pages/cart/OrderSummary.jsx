import React from "react";
import PromoCode from "./PromoCode";

const TRUST_BADGES = [
  { icon: "🔒", text: "Secure Checkout" },
  { icon: "↩️", text: "Free Returns" },
  { icon: "⚡", text: "Fast Delivery" },
  { icon: "💳", text: "All Cards Accepted" },
];

const OrderSummary = ({
  totals,
  onCheckout,
  onContinueShopping,
  onPromoApply,
  subtotal,
  shippingAllowedLimit,
}) => {
  return (
    <div className="cart-sidebar">
      <div className="summary-box">
        <h2 className="summary-title">Order Summary</h2>

        <div className="summary-row">
          <span>
            Subtotal (<span id="item-count">{totals.itemCount}</span> items)
          </span>
          <span className="summary-value" id="subtotal-val">
            ${totals.subtotal.toFixed(0)}
          </span>
        </div>

        {totals.savings > 0 && (
          <div className="summary-row discount">
            <span>You Save</span>
            <span className="summary-value" id="discount-val">
              −${totals.savings.toFixed(0)}
            </span>
          </div>
        )}

        <div className="summary-row">
          <span>Shipping</span>
          <span className="summary-value free-ship-badge">✓ Free</span>
        </div>

        <div className="summary-row">
          <span>Tax (est. 8%)</span>
          <span className="summary-value" id="tax-val">
            ${totals.tax.toFixed(0)}
          </span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span className="summary-value" id="total-val">
            ${totals.total.toFixed(0)}
          </span>
        </div>

        {/* Shipping progress */}
        <div className="shipping-progress-wrap">
          <div className="shipping-progress-label">
            {subtotal > shippingAllowedLimit ? (
              <span>🚚 You've unlocked free shipping!</span>
            ) : (
              <span>shipping is not free</span>
            )}
            <span style={{ color: "var(--green)", fontWeight: "600" }}>
              ${totals.subtotal.toFixed(0)} / {`$${shippingAllowedLimit}`}
            </span>
          </div>
          <div className="shipping-progress-bar">
            <div
              className="shipping-progress-fill"
              id="ship-fill"
              style={{ width: `${totals.shippingProgress}%` }}
            />
          </div>
        </div>

        <PromoCode onApply={onPromoApply} />

        <button className="checkout-btn" onClick={onCheckout}>
          Proceed to Checkout →
        </button>
        <button className="continue-shop-btn" onClick={onContinueShopping}>
          ← Continue Shopping
        </button>

        {/* Trust badges */}
        <div className="trust-badges">
          {TRUST_BADGES.map(({ icon, text }) => (
            <div key={text} className="trust-badge">
              <span className="trust-badge-icon">{icon}</span>
              <span className="trust-badge-text">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
