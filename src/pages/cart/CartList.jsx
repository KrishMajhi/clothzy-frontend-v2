import React, { useState, useRef } from "react";
import CartItem from "./CartItem";

const EmptyCart = () => (
  <div className="empty-cart">
    <div className="empty-icon">🛍️</div>
    <p className="empty-text">Your cart is empty</p>
    <p className="empty-subtext">Browse our collections and add something you love.</p>
  </div>
);

const CartSkeleton = () => (
  <div className="cart-items">
    {Array.from({ length: 2 }).map((_, i) => (
      <div
        key={i}
        className="cart-item"
        style={{ opacity: 0.5, pointerEvents: "none", animation: "pulse 1.5s ease-in-out infinite" }}
      >
        <div className="cart-item-image" style={{ background: "#e6e2da" }} />
        <div className="cart-item-details">
          <div style={{ height: 12, width: "40%", background: "#e0dbd3", borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 18, width: "70%", background: "#e0dbd3", borderRadius: 4, marginBottom: 10 }} />
          <div style={{ height: 12, width: "55%", background: "#e0dbd3", borderRadius: 4 }} />
        </div>
      </div>
    ))}
  </div>
);

const styles = `
  .cart-items-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .cart-items-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .cart-items-scroll::-webkit-scrollbar-thumb {
    background: #c8bfb0;
    border-radius: 999px;
  }
  .cart-items-scroll::-webkit-scrollbar-thumb:hover {
    background: #a89d8e;
  }
  .cart-items-scroll {
    scrollbar-width: thin;
    scrollbar-color: #c8bfb0 transparent;
  }

  .cart-item-wrapper {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.28s ease, transform 0.28s ease;
  }

  .cart-item-wrapper.removing {
    opacity: 0;
    transform: translateX(40px);
    pointer-events: none;
  }
`;

const REMOVE_DELAY = 380; // ms — must match the longest transition above

const CartList = ({ items, loading, onUpdateQty, onRemove, onSaveForLater }) => {
  const [removingIds, setRemovingIds] = useState(new Set());
  const timers = useRef({});

  const handleRemove = (cart_id) => {
    // Start the exit animation
    setRemovingIds((prev) => new Set(prev).add(cart_id));

    // After animation finishes, actually remove from server/context
    timers.current[cart_id] = setTimeout(() => {
      onRemove(cart_id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(cart_id);
        return next;
      });
      delete timers.current[cart_id];
    }, REMOVE_DELAY);
  };

  if (loading) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <>
      <style>{styles}</style>
      <div
        className="cart-items cart-items-scroll"
        id="cart-items"
        style={{
          maxHeight: "calc(3 * 220px)",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "6px",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.cart_id}
            className={`cart-item-wrapper${removingIds.has(item.cart_id) ? " removing" : ""}`}
            style={{ animationDelay: `${idx * 0.07}s` }}
          >
            <CartItem
              item={item}
              onUpdateQty={onUpdateQty}
              onRemove={handleRemove}
              onSaveForLater={onSaveForLater}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CartList;