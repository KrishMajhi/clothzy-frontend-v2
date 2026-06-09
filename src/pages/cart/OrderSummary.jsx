import React from "react";
import PromoCode from "./PromoCode";
import { NavLink, Link } from "react-router-dom";

const TRUST_BADGES = [
  { icon: "🔒", text: "Secure Checkout" },
  { icon: "↩️", text: "Free Returns" },
  { icon: "⚡", text: "Fast Delivery" },
  { icon: "💳", text: "All Cards Accepted" },
];

const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const OrderSummary = ({
  totals,
  threshold,
  onCheckout,
  onContinueShopping,
  onPromoApply,
  config,
}) => {
  const {
    subtotal,
    savings,
    itemCount,
    tax,
    deliveryCharge,
    total,
    shippingProgress,
  } = totals;

  return (
    <div className="cart-sidebar">
      <div className="summary-box">
        <h2 className="summary-title">Order Summary</h2>

        <div className="summary-row">
          <span>Subtotal ({itemCount} items)</span>
          <span className="summary-value">{fmt(subtotal)}</span>
        </div>

        {savings > 0 && (
          <div className="summary-row discount">
            <span>You Save</span>
            <span className="summary-value">−{fmt(savings)}</span>
          </div>
        )}

        <div className="summary-row">
          <span>Delivery</span>
          {deliveryCharge === 0 ? (
            <span className="summary-value free-ship-badge">✓ Free</span>
          ) : (
            <span className="summary-value">{fmt(deliveryCharge)}</span>
          )}
        </div>

        <div className="summary-row">
          <span>Tax ({config?.tax_percentage ?? 8}%)</span>
          <span className="summary-value">{fmt(tax)}</span>
        </div>

        <div className="summary-row total">
          <span>Total</span>
          <span className="summary-value">{fmt(total)}</span>
        </div>

        <div className="shipping-progress-wrap">
          <div className="shipping-progress-label">
            {subtotal >= threshold ? (
              <span>🚚 Free delivery unlocked!</span>
            ) : (
              <span>
                Add {fmt(threshold - subtotal)} more for free delivery
              </span>
            )}
            <span style={{ color: "var(--green)", fontWeight: "600" }}>
              {fmt(subtotal)} / {fmt(threshold)}
            </span>
          </div>
          <div className="shipping-progress-bar">
            <div
              className="shipping-progress-fill"
              style={{ width: `${shippingProgress}%` }}
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
