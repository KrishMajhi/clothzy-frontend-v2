import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./../css/CartPage.css";
import { useNavigate } from "react-router-dom";

import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Toast from "./Toast";
import { useCart, calculateOrderSummary } from "../../context/CartContext";
import useToast from "./useToast";

const getCartMeta = (cartItems) => {
  let subtotal = 0;
  let originalTotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
    originalTotal += (item.original_price || item.price) * item.quantity;
  });
  return {
    subtotal,
    savings: originalTotal - subtotal,
    itemCount: cartItems.length,
  };
};

const CartPage = () => {
  const {
    cartItems,
    cartLoading,
    removeFromCart,
    updateCartItem,
    orderSummaryConfig,
    getOrderSummaryConfig,
  } = useCart();

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    getOrderSummaryConfig();
  }, []);

  const { subtotal, savings, itemCount } = getCartMeta(cartItems);

  const calculated = calculateOrderSummary({
    subtotal,
    shippingMethod: "standard",
    config: orderSummaryConfig,
  });

  const totals = {
    subtotal,
    savings,
    itemCount,
    tax: calculated?.tax ?? subtotal * 0.08,
    deliveryCharge: calculated?.deliveryCharge ?? 0,
    shippingMethodCharge: calculated?.shippingMethodCharge ?? 0,
    total: calculated?.total ?? subtotal + subtotal * 0.08,
    shippingProgress: orderSummaryConfig
      ? Math.min(
          (subtotal / orderSummaryConfig.delivery_charge_threshold) * 100,
          100,
        )
      : Math.min((subtotal / 500) * 100, 100),
  };

  const MAX_QTY = 5;

  const handleRemove = async (cart_itemID) => {
    await removeFromCart(cart_itemID);
    toast.show("Item removed from cart", "🗑️");
  };

  const handleUpdateQty = async (cart_itemID, delta) => {
    const item = cartItems.find((i) => i.cart_id === cart_itemID);
    if (!item) return;
    const maxAllowed = item.max_qty_allowed ?? MAX_QTY;
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > maxAllowed) return;
    await updateCartItem(cart_itemID, newQty);
  };

  const handleSaveForLater = () => toast.show("Saved for later", "🔖");

  const handlePromoApply = (success) => {
    toast.show(
      success ? "Promo code applied!" : "Invalid promo code",
      success ? "🎉" : "❌",
    );
  };

  const handleCheckout = () => navigate("/checkout");
  const handleContinueShopping = () => toast.show("Returning to shop…", "←");

  const threshold = orderSummaryConfig?.delivery_charge_threshold ?? 500;

  return (
    <>
      <div className="page-header">
        <div className="header-deco-line" />
        <div className="header-deco-dot" />

        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>Cart</span>
        </div>

        <div className="header-body">
          <div className="header-left">
            <p className="header-eyebrow">Your selection</p>
            <h1 className="page-title">
              Shopping <em>Cart</em>
            </h1>
            <p className="page-subtitle">
              Review your items and proceed to checkout
            </p>
          </div>

          <div className="header-right">
            <div className="header-stat-cluster">
              <div className="header-stat">
                <div className="stat-num">{itemCount}</div>
                <div className="stat-label">Items</div>
              </div>
              <div className="header-stat">
                <div className="stat-num">₹{totals.total.toFixed(0)}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="header-stat">
                <div className="stat-num">₹{savings.toFixed(0)}</div>
                <div className="stat-label">You Save</div>
              </div>
            </div>
            <div className="header-tags">
              <span
                className="header-tag"
                style={{
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                  opacity: subtotal >= threshold ? 1 : 0,
                  transform:
                    subtotal >= threshold
                      ? "translateY(0)"
                      : "translateY(12px)",
                  pointerEvents: subtotal >= threshold ? "auto" : "none",
                }}
              >
                ✓ Free delivery unlocked
              </span>
              <span className="header-tag">Free returns</span>
            </div>
          </div>
        </div>

        <div className="header-bottom-rule" />
      </div>

      <div className="cart-container">
        <CartList
          items={cartItems}
          loading={cartLoading}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onSaveForLater={handleSaveForLater}
        />
        <OrderSummary
          totals={totals}
          threshold={threshold}
          onCheckout={handleCheckout}
          onContinueShopping={handleContinueShopping}
          onPromoApply={handlePromoApply}
          config={orderSummaryConfig}
        />
      </div>

      <Toast
        message={toast.message}
        icon={toast.icon}
        visible={toast.visible}
      />
    </>
  );
};

export default CartPage;
