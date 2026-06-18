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
  if (location.pathname === "/profile") return null;

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
            <div className="profile-wrapper" id="profileMenu">
              <button
                className="loginbtn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="avatar">{initials}</span>
                <span className="uname">{user.personal_info.username}</span>
                {/* ADD THIS chevron svg: */}
                <svg
                  className={`chevron${profileOpen ? " open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`profile-dropdown${profileOpen ? " is-open" : ""}`}
                role="menu"
              >
                <div className="profile-header">
                  {/* greeting strip like the HTML */}
                  <div className="profile-greeting">
                    <span>Signed in as</span>
                    <strong>{user.personal_info.fullname}</strong>
                  </div>
                </div>

                <ul className="dropdown-items" role="list">
                  <li>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile?section=orders"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="1" />
                        <line x1="9" y1="12" x2="15" y2="12" />
                        <line x1="9" y1="16" x2="13" y2="16" />
                      </svg>
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile?section=wishlist"
                      className="dropdown-item"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
                      </svg>
                      Wishlist
                    </Link>
                  </li>
                  <li className="dropdown-divider" role="separator" />
                  <li>
                    <button
                      className="logout-btn dropdown-item"
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      role="menuitem"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
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
