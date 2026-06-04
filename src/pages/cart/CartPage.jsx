import React from "react";
import { Link } from "react-router-dom";
import "./../css/CartPage.css";

import CartList from "./CartList";
import OrderSummary from "./OrderSummary";
import Toast from "./Toast";
import { useCart } from "../../context/CartContext";
import useToast from "./useToast";

const calculateTotals = (cartItems) => {
  let subtotal = 0;
  let originalTotal = 0;

  cartItems.forEach((item) => {
    subtotal += item.price * item.quantity;
    originalTotal += (item.original_price || item.price) * item.quantity;
  });

  const savings = originalTotal - subtotal;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const shippingProgress = Math.min((subtotal / 100) * 100, 100);

  return {
    subtotal,
    originalTotal,
    savings,
    tax,
    total,
    itemCount: cartItems.length,
    shippingProgress,
  };
};

const CartPage = () => {
  const { cartItems, cartLoading, removeFromCart, updateCartItem } = useCart();
  const toast = useToast();

  const totals = calculateTotals(cartItems);

  const handleRemove = async (cart_itemID) => {
    await removeFromCart(cart_itemID);
    toast.show("Item removed from cart", "🗑️");
  };

  const handleUpdateQty = async (cart_itemID, delta) => {
    const item = cartItems.find((i) => i.cart_id === cart_itemID);
    if (!item) return;
    const newQty = Math.max(1, item.quantity + delta);
    await updateCartItem(cart_itemID, newQty);
  };

  const handleSaveForLater = () => {
    toast.show("Saved for later", "🔖");
  };

  const handlePromoApply = (success) => {
    if (success) {
      toast.show("Promo code applied!", "🎉");
    } else {
      toast.show("Invalid promo code", "❌");
    }
  };

  const handleCheckout = () => {
    toast.show("Checkout coming soon!", "🛒");
  };

  const handleContinueShopping = () => {
    toast.show("Returning to shop…", "←");
  };

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
                <div className="stat-num">{totals.itemCount}</div>
                <div className="stat-label">Items</div>
              </div>
              <div className="header-stat">
                <div className="stat-num">${totals.total.toFixed(0)}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="header-stat">
                <div className="stat-num">${totals.savings.toFixed(0)}</div>
                <div className="stat-label">You Save</div>
              </div>
            </div>
            <div className="header-tags">
              <span className="header-tag">✓ Free shipping unlocked</span>
              <span className="header-tag">Free returns</span>
            </div>
          </div>
        </div>

        <div className="header-bottom-rule" />
      </div>

      {/* MAIN CONTAINER */}
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
          onCheckout={handleCheckout}
          onContinueShopping={handleContinueShopping}
          onPromoApply={handlePromoApply}
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
