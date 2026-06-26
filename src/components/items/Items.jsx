import React from "react";
import "./Items.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishListContext";

function Items({ Pimg, Pname, Nprice, Oprice, id, product, colors, sizes }) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { cartItems, addToCart, removeFromCart } = useCart();

  const wishactive = isWishlisted(id);
  const isincart = cartItems.some(
    (item) =>
      item.product_id === id &&
      item.selected_size === sizes?.[0] &&
      item.selected_color === colors?.[0]
  );

  const handleCartClick = () => {
    if (isincart) {
      removeFromCart(id);
    } else {
      addToCart({
        product_id: id,
        quantity: 1,
        selected_size: sizes?.[0],
        selected_color: colors?.[0],
      });
    }
  };

  const handleWishlist = () => {
    wishactive ? removeFromWishlist(id) : addToWishlist(id);
  };

  const discount = Math.round(((Oprice - Nprice) / Oprice) * 100);

  return (
    <div className="itm-card">
      <div className="itm-img">
        <Link to={`/products/${id}`}>
          <img src={Pimg?.[0]} alt={Pname} />
        </Link>

        <span className="itm-badge itm-badge--sale">Sale</span>

        <button
          className={`itm-wish ${wishactive ? "itm-wish--active" : ""}`}
          onClick={handleWishlist}
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <div className="itm-quick-bar">
          <button className="itm-quick-add" onClick={handleCartClick}>
            {isincart ? "Remove" : "Add to Cart"}
          </button>
          <Link to={`/products/${id}`} className="itm-quick-view">
            <svg viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="itm-info">
        <p className="itm-category">{product}</p>
        <p className="itm-name">{Pname}</p>
        <div className="itm-prices">
          <span className="itm-price-new">₹{Nprice}</span>
          <span className="itm-price-old">₹{Oprice}</span>
          {discount > 0 && <span className="itm-price-off">-{discount}%</span>}
        </div>
        <div className="itm-rating">
          <span className="itm-stars">★★★★★</span>
          <span className="itm-count">(84)</span>
        </div>
      </div>
    </div>
  );
}

export default Items;