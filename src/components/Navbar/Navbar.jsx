import React, { useRef, useState, useEffect, useCallback } from "react";
import "./navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";

import logopic from "../../assets/logo.png";
import cart_icon from "../../assets/cart_icon.png";

// import { useShop } from "../../context/ShopContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/kids", label: "Kids" },
];

function Navbar() {
  const { cartItems, addToCart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  if (location.pathname === "/checkout") return null;

  /* ── UI state ─────────────────────────────────────── */
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  /* ── Refs ─────────────────────────────────────────── */
  const dropRef = useRef(null);
  const navRef = useRef(null);
  const linkRefs = useRef([]);
  const prevCartLen = useRef(cartItems?.length);

  /* ── Scroll listener ──────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Cart badge bounce ────────────────────────────── */
  useEffect(() => {
    if (cartItems?.length > prevCartLen.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCartLen.current = cartItems?.length;
  }, [cartItems?.length]);

  /* ── Sliding active indicator ─────────────────────── */
  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const activeIndex = NAV_LINKS.findIndex(({ to }) =>
      to === "/" ? location.pathname === "/" : location.pathname.startsWith(to),
    );
    if (activeIndex === -1) {
      setIndicator((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const el = linkRefs.current[activeIndex];
    if (!el) return;
    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = el.getBoundingClientRect();
    setIndicator({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    });
  }, [location.pathname]);

  useEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  /* ── Close profile on outside click ──────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (profileOpen && !e.target.closest(".profile-wrapper"))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  /* ── Drag & Drop ──────────────────────────────────── */
  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current?.classList.remove("drag-over");
    const pid = parseInt(e.dataTransfer.getData("drag-product-id"));
    const type = e.dataTransfer.getData("drag-product-type");
    if (!pid || !type) return;
    const sources = {
      all_product: all_products,
      popular_data,
      new_collection: collection_products,
    };
    const product = sources[type]?.find((i) => i.id === pid);
    if (product && !cartItems?.some((i) => i.id === pid)) {
      addToCart({
        id: product.id,
        image: product.image,
        name: product.name,
        description: product.description,
        product: type,
        qty: 1,
        pTotal: Number(product.Price),
        Price: product.Price,
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current?.classList.add("drag-over");
  };
  const handleDragLeave = () => dropRef.current?.classList.remove("drag-over");

  /* ── Helpers ──────────────────────────────────────── */
  const initials = user
    ? (user.personal_info.fullname || user.personal_info.username)
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className={`mainnav-wrapper${isScrolled ? " is-scrolled" : ""}`}>
      {/* ── Floating pill ───────────────────────────── */}
      <nav
        ref={navRef}
        className={`mainnav${isScrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Shimmer border (pseudo-layer rendered in CSS, just needs the class) */}

        {/* LOGO */}
        <Link to="/" className="logo-and-name" aria-label="Clothzy home">
          {/* <img src={logopic} alt="" className="logo-img" aria-hidden="true" /> */}
          <div className="clothzy-brand-icon">🛍</div>
          <span className="company-name">CLOTHZY</span>
        </Link>

        {/* HAMBURGER */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* NAV LINKS */}
        <ul
          className={`navitems-container${menuOpen ? " open" : ""}`}
          role="list"
        >
          {/* Sliding pill indicator — only mount when visible */}
          {indicator.opacity > 0 && (
            <li
              className="nav-indicator"
              aria-hidden="true"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}

          {NAV_LINKS.map(({ to, label }, i) => (
            <li key={to} role="listitem">
              <NavLink
                ref={(el) => (linkRefs.current[i] = el)}
                className={({ isActive }) =>
                  `navitem${isActive ? " active" : ""}`
                }
                to={to}
                onClick={() => setMenuOpen(false)}
                end={to === "/"}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* RIGHT: LOGIN + CART */}
        <div className="nav-btn">
          {user ? (
            <div className="profile-wrapper">
              <button
                className="loginbtn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="avatar">{initials}</span>
                <span className="uname">{user.personal_info.username}</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="profile-header">
                    <span className="avatar lg">{initials}</span>
                    <div>
                      <strong>{user.personal_info.fullname}</strong>
                      <span>{user.personal_info.email}</span>
                    </div>
                  </div>
                  <div className="profile-role">{user.personal_info.role}</div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileOpen(false)}
                    role="menuitem"
                  >
                    View Profile
                  </Link>
                  <button
                    className="logout-btn"
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="loginbtn">Login</button>
            </Link>
          )}

          {/* CART */}
          <div
            ref={dropRef}
            className="cart-drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            aria-label="Drop product here to add to cart"
          >
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `carticon${isActive ? " act" : ""}${cartBounce ? " bounce" : ""}`
              }
              data-count={cartItems?.length}
              aria-label={`Cart, ${cartItems?.length} items`}
            >
              <img src={cart_icon} id="cartimg" alt="" aria-hidden="true" />
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
