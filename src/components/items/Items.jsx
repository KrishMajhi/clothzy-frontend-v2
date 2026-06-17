import React, { useState } from "react";
import "./Items.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import { useShop } from "../../context/ShopContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishListContext";
function Items({
  Pimg,
  Pname,
  Nprice,
  Oprice,
  id,
  desc,
  product,
  colors,
  sizes,
}) {
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const wishactive = isWishlisted(id);

  console.log("Product ID:", id, "Wishlisted:", wishactive);
  const isincart = cartItems.some(
    (item) =>
      item.product_id === id &&
      item.selected_size === sizes[0] &&
      item.selected_color === colors[0],
  );
  const handleCartClick = (itemId) => {
    let item = null;

    item;
    if (!item) return;

    if (isincart) {
      removeFromCart(itemId);
    } else {
      addToCart({
        product_id: id,
        quantity: 1,
        selected_size: sizes[0],
        selected_color: colors[0],
      });
    }
  };
  const handlewishlist = async () => {
    if (wishactive) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };
  console.log(`wish-btn ${wishactive ? "activewish" : ""}`);
  return (
    <div className="product-card">
      <div className="product-card-img">
        <Link to={`/products/${id}`}>
          <img src={Pimg[0]} alt={Pname} />
        </Link>

        <span className="badge badge-sale">Sale</span>

        <button
          className={`wish-btn ${wishactive ? "activewish" : ""}`}
          onClick={handlewishlist}
        >
          ♥
        </button>

        <div className="quick-bar">
          <button className="quick-add" onClick={() => handleCartClick(id)}>
            {isincart ? "Remove" : "Add to Cart"}
          </button>

          <Link to={`/products/${id}`} className="quick-view">
            👁
          </Link>
        </div>
      </div>

      <div className="product-info">
        <p className="product-cat">{product}</p>

        <p className="product-name">{Pname}</p>

        <div className="product-prices">
          <span className="price-new">${Nprice}</span>

          <span className="price-old">${Oprice}</span>

          <span className="price-off">
            -{Math.round(((Oprice - Nprice) / Oprice) * 100)}%
          </span>
        </div>

        <div className="product-rating">
          <span className="stars">★★★★★</span>

          <span className="rating-count">(84)</span>
        </div>
      </div>
    </div>
  );
}

export default Items;
