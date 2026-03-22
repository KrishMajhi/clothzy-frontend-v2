import React from "react";
import "./css/CartPage.css";
import { useShop } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { removeFromCart, cartItems, updateincart, setCartItems } = useShop();

  const increment = (item) => {
    const newQty = item.qty + 1;
    updateincart(item.id, newQty * item.Price, newQty);
  };

  const decrement = (item) => {
    const newQty = item.qty > 1 ? item.qty - 1 : 1;
    updateincart(item.id, newQty * item.Price, newQty);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.pTotal, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* ── Left: items ── */}
        <div className="cart-items">
          <h2 className="cart-h">Your Cart 🛒</h2>

          {/* Column headers */}
          <div className="col-name">
            <span className="col-item" style={{ flex: "0 0 60px" }}></span>
            <span className="col-item" style={{ flex: "0 0 90px" }}>Product</span>
            <span className="col-item" style={{ flex: 1 }}>About</span>
            <span className="col-item" style={{ width: "100px", textAlign: "center" }}>Qty</span>
            <span className="col-item" style={{ width: "80px", textAlign: "right" }}>Price</span>
            <span className="col-item" style={{ width: "80px", textAlign: "right" }}>Total</span>
          </div>

          {cartItems.length === 0 && (
            <p style={{ color: "#aaa", padding: "32px 0", textAlign: "center" }}>
              Your cart is empty.
            </p>
          )}

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              {/* Remove */}
              <span className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</span>

              {/* Image */}
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.name} />
              </Link>

              {/* Details */}
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Clothing item</p>
              </div>

              {/* Qty */}
              <div className="qty-control">
                <button onClick={() => decrement(item)} className="qty-btn">−</button>
                <span className="qty-display">{item.qty}</span>
                <button onClick={() => increment(item)} className="qty-btn">+</button>
              </div>

              {/* Price */}
              <span className="price-sectionp">₹{item.Price}</span>

              {/* Total */}
              <span className="price-sectionp">₹{item.pTotal}</span>
            </div>
          ))}

          <hr style={{ marginTop: "16px", borderColor: "#eee" }} />
        </div>

        {/* ── Right: summary ── */}
        <div className="cart-summary">
          <h2>Summary</h2>
          <p>Total Items: {cartItems.length}</p>
          <p>Total Price: ₹{cartTotal}</p>
          <button onClick={() => setCartItems([])}>Proceed to Checkout</button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
