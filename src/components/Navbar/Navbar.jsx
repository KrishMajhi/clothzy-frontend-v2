import React, { useRef, useState } from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import logopic from "../../assets/logo.png";
import cart_icon from "../../assets/cart_icon.png";
import { useShop } from "../../Context/ShopContext";

function Navbar() {
  const { cartItems, all_products, popular_data, collection_products, addToCart } = useShop();
  const dropRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current?.classList.remove("drag-over");
    const droppedId = e.dataTransfer.getData("drag-product-id");
    const droppedType = e.dataTransfer.getData("drag-product-type");
    const pid = parseInt(droppedId);
    if (!pid || !droppedType) return;
    let product = null;
    if (droppedType === "all_product") product = all_products.find((i) => i.id === pid);
    else if (droppedType === "popular_data") product = popular_data.find((i) => i.id === pid);
    else if (droppedType === "new_collection") product = collection_products.find((i) => i.id === pid);
    if (product && !cartItems.some((i) => i.id === pid)) {
      addToCart({ id: product.id, image: product.image, name: product.name, description: product.description, product: droppedType, qty: 1, pTotal: Number(product.Price), Price: product.Price });
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); dropRef.current?.classList.add("drag-over"); };
  const handleDragLeave = () => { dropRef.current?.classList.remove("drag-over"); };

  const navLink = (to, label) => (
    <li>
      <NavLink
        className={({ isActive }) => isActive ? "navitems active" : "navitems"}
        to={to}
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </NavLink>
    </li>
  );

  return (
    <div className="mainnav">
      <div className="logo-and-name">
        <img src={logopic} alt="logo" />
        <p className="company-name">SHOPPER</p>
      </div>

      {/* Hamburger */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ opacity: menuOpen ? 0 : 1 }} />
        <span style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>

      <ul className={`navitems-container${menuOpen ? " open" : ""}`}>
        {navLink("/", "Home")}
        {navLink("/men", "Men")}
        {navLink("/women", "Women")}
        {navLink("/kids", "Kids")}
      </ul>

      <div className="nav-btn">
        <Link to="/login">
          <button className="loginbtn">Login</button>
        </Link>
        <div ref={dropRef} className="cart-drop-zone" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
          <div className="carticon" data-count={cartItems.length}>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? ".act" : null)}>
              <img src={cart_icon} id="cartimg" alt="cart" />
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
