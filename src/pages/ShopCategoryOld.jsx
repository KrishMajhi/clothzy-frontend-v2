import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import Items from "../components/items/Items";
import "./css/ShopCategory.css";
import FooterShop from "../components/footershop/FooterShop";

/* ─── Filter sidebar data ─── */
const CATEGORY_FILTERS = ["Jackets & Coats", "T-Shirts", "Shirts", "Kurtas", "Hoodies"];
const CATEGORY_COUNTS  = { "Jackets & Coats": 12, "T-Shirts": 9, "Shirts": 8, "Kurtas": 4, "Hoodies": 3 };
const SIZES            = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { hex: "#1a1612", name: "Black" },
  { hex: "#fff",    name: "White", border: true },
  { hex: "#4a5568", name: "Grey" },
  { hex: "#2c5f2e", name: "Olive" },
  { hex: "#c0392b", name: "Red" },
  { hex: "#1a3a5c", name: "Navy" },
  { hex: "#8b6914", name: "Khaki" },
  { hex: "#6b4c3b", name: "Brown" },
];
const ALSO_LIKED = [
  { name: "Polo Neck Sweater",  price: "$45", img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=300&q=80&fit=crop&crop=top" },
  { name: "Chinos Slim Fit",    price: "$55", img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&q=80&fit=crop&crop=top" },
  { name: "Cargo Jogger Pants", price: "$60", img: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=300&q=80&fit=crop&crop=top" },
  { name: "Marble Print Jacket",price: "$75", img: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80&fit=crop&crop=top" },
  { name: "Classic White Tee",  price: "$30", img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80&fit=crop&crop=top" },
  { name: "Camo Print Jacket",  price: "$90", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80&fit=crop&crop=top" },
];

/* ─── Hero sub-text per category ─── */
const HERO_SUBS = {
  men:   "Crafted for the modern man — bold, refined, effortless.",
  women: "Elegance that moves with you — free, fierce, timeless.",
  kid:   "Playful styles for little ones — bright, comfy, durable.",
};

/* ─── Scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); io.unobserve(el); } },
      { threshold: 0.07 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─── Collapsible filter section ─── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <div className={`filter-title${open ? " open" : ""}`} onClick={() => setOpen(o => !o)}>
        {title}
        <svg viewBox="0 0 24 24" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <div className={`filter-body${open ? "" : " collapsed"}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Individual product card ─── */
function ProductCard({ item }) {
  const [wished, setWished] = useState(false);

  const discountPct = item.old_price
    ? Math.round((1 - item.new_price / item.old_price) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="product-card-img">
        <img src={item.image} alt={item.name} loading="lazy" />

        {item.badge && (
          <span className={`badge badge-${item.badge.toLowerCase()}`}>{item.badge}</span>
        )}

        <button
          className={`wish-btn${wished ? " wished" : ""}`}
          onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          aria-label="Wishlist"
        >
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        <div className="quick-bar">
          <button className="quick-add">Add to Cart</button>
          <button className="quick-view" aria-label="Quick view">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <div className="product-info">
        {item.subcategory && <p className="product-cat">{item.subcategory}</p>}
        <p className="product-name">{item.name}</p>
        <div className="product-prices">
          <span className="price-new">${item.new_price}</span>
          {item.old_price && <span className="price-old">${item.old_price}</span>}
          {discountPct && <span className="price-off">-{discountPct}%</span>}
        </div>
        {item.rating !== undefined && (
          <div className="product-rating">
            <span className="stars">{"★".repeat(Math.floor(item.rating))}</span>
            {item.rating % 1 !== 0 && <span className="stars-empty">★</span>}
            {item.review_count && <span className="rating-count">({item.review_count})</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main component ─── */
function ShopCategory({ category, banner }) {
  const { all_products } = useContext(ShopContext);

  /* UI state */
  const [sortBy, setSortBy]               = useState("featured");
  const [viewMode, setViewMode]           = useState("grid");
  const [checkedCats, setCheckedCats]     = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [maxPrice, setMaxPrice]           = useState(2000);
  const [currentPage, setCurrentPage]     = useState(1);
  const ITEMS_PER_PAGE = 9;

  /* Category label */
  const categoryLabel =
    category === "kid"
      ? "Kids"
      : category.charAt(0).toUpperCase() + category.slice(1);

  /* Parallax on hero bg */
  const heroBgRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (heroBgRef.current)
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Reveal refs */
  const toolbarRef    = useReveal();
  const filtersRef    = useReveal();
  const paginationRef = useReveal();
  const alsoRef       = useReveal();

  /* Filtering */
  const filtered = all_products.filter(item => item.category === category);

  /* Sorting */
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return a.new_price - b.new_price;
    if (sortBy === "price_desc") return b.new_price - a.new_price;
    if (sortBy === "newest")     return (b.id || 0) - (a.id || 0);
    if (sortBy === "rated")      return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  /* Pagination */
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* Active filter pills (UI only — wire to real filters when ready) */
  const activeFilters = [
    ...checkedCats.map(c => ({ label: c, key: `cat-${c}`, remove: () => setCheckedCats(p => p.filter(x => x !== c)) })),
    ...selectedSizes.map(s => ({ label: `Size: ${s}`, key: `sz-${s}`, remove: () => setSelectedSizes(p => p.filter(x => x !== s)) })),
    ...(selectedColor ? [{ label: `Color: ${selectedColor}`, key: "color", remove: () => setSelectedColor(null) }] : []),
  ];

  const clearAllFilters = () => {
    setCheckedCats([]);
    setSelectedSizes([]);
    setSelectedColor(null);
    setMaxPrice(2000);
  };

  /* Page buttons */
  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1)
      pageButtons.push(i);
    else if (pageButtons[pageButtons.length - 1] !== "...")
      pageButtons.push("...");
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* ── HERO BANNER ── */}
      <div className="cat-hero">
        <div
          ref={heroBgRef}
          className="cat-hero-bg"
          style={{ backgroundImage: `url('${banner}')` }}
        />
        <div className="cat-hero-overlay" />
        <div className="cat-hero-content">
          <div className="cat-breadcrumb">
            <a href="/">Home</a>
            <span>›</span>
            <span style={{ color: "rgba(245,240,232,.8)" }}>{categoryLabel}</span>
          </div>
          <h1 className="cat-hero-title">{categoryLabel.toUpperCase()}'S</h1>
          <p className="cat-hero-sub">
            {HERO_SUBS[category] || `Explore our ${categoryLabel}'s collection.`}
          </p>
          <div className="cat-hero-meta">
            <div className="hero-meta-item">
              <div className="hero-meta-dot" />
              <span>{filtered.length} Products</span>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-dot" />
              <span>New Arrivals Weekly</span>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-dot" />
              <span>Free Shipping ₹999+</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SHOP LAYOUT ── */}
      <div className="shop-layout">

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">

          <FilterSection title="Category">
            {CATEGORY_FILTERS.map(cat => (
              <label
                key={cat}
                className={`filter-check${checkedCats.includes(cat) ? " checked" : ""}`}
                onClick={() =>
                  setCheckedCats(prev =>
                    prev.includes(cat) ? prev.filter(x => x !== cat) : [...prev, cat]
                  )
                }
              >
                <input type="checkbox" readOnly checked={checkedCats.includes(cat)} />
                <div className="check-box" />
                {cat}
                <span className="check-count">{CATEGORY_COUNTS[cat]}</span>
              </label>
            ))}
          </FilterSection>

          <div className="filter-divider" />

          <FilterSection title="Price Range">
            <div className="price-range">
              <div className="range-track">
                <div className="range-fill" style={{ right: `${100 - (maxPrice / 2000) * 100}%` }} />
              </div>
              <div className="range-labels">
                <span>₹0</span>
                <span>₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="price-slider"
                min="0"
                max="2000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </FilterSection>

          <div className="filter-divider" style={{ marginTop: 24 }} />

          <FilterSection title="Size">
            <div className="size-pills">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`size-pill${selectedSizes.includes(s) ? " active" : ""}`}
                  onClick={() =>
                    setSelectedSizes(prev =>
                      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                    )
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterSection>

          <div className="filter-divider" style={{ marginTop: 24 }} />

          <FilterSection title="Color">
            <div className="color-swatches">
              {COLORS.map(c => (
                <div
                  key={c.name}
                  className={`color-swatch${selectedColor === c.name ? " active" : ""}`}
                  style={{
                    background: c.hex,
                    ...(c.border ? { border: "1.5px solid #d6c9b4" } : {}),
                  }}
                  title={c.name}
                  onClick={() => setSelectedColor(prev => prev === c.name ? null : c.name)}
                />
              ))}
            </div>
          </FilterSection>

          <div className="filter-divider" style={{ marginTop: 24 }} />

          <FilterSection title="Rating">
            {[5, 4, 3].map(r => (
              <label key={r} className="filter-check">
                <input type="checkbox" readOnly />
                <div className="check-box" />
                <span style={{ color: "#f0a500", letterSpacing: 1 }}>{"★".repeat(r)}</span>
                <span style={{ color: "#d6c9b4", letterSpacing: 1 }}>{"★".repeat(5 - r)}</span>
                {r < 5 && <span style={{ marginLeft: 4, fontSize: 13 }}>& up</span>}
              </label>
            ))}
          </FilterSection>

          <button className="clear-btn" style={{ marginTop: 32 }} onClick={clearAllFilters}>
            Clear All Filters
          </button>

        </aside>

        {/* ── MAIN ── */}
        <main className="shop-main">

          {/* Toolbar */}
          <div className="shop-toolbar reveal" ref={toolbarRef}>
            <p className="result-count">
              Showing <strong>{paged.length}</strong> of <strong>{sorted.length}</strong> products
            </p>
            <div className="toolbar-right">
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rated">Best Rated</option>
              </select>
              <div className="view-btns">
                <button
                  className={`view-btn${viewMode === "grid" ? " active" : ""}`}
                  title="Grid view"
                  onClick={() => setViewMode("grid")}
                >
                  <svg viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                    <rect x="9" y="1" width="6" height="6" rx="1" />
                    <rect x="1" y="9" width="6" height="6" rx="1" />
                    <rect x="9" y="9" width="6" height="6" rx="1" />
                  </svg>
                </button>
                <button
                  className={`view-btn${viewMode === "list" ? " active" : ""}`}
                  title="List view"
                  onClick={() => setViewMode("list")}
                >
                  <svg viewBox="0 0 16 16">
                    <rect x="1" y="2"  width="14" height="3" rx="1" />
                    <rect x="1" y="7"  width="14" height="3" rx="1" />
                    <rect x="1" y="12" width="14" height="3" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilters.length > 0 && (
            <div className="active-filters reveal" ref={filtersRef}>
              <span className="af-label">Filters:</span>
              {activeFilters.map(f => (
                <div key={f.key} className="af-pill" onClick={f.remove}>
                  {f.label} <span>×</span>
                </div>
              ))}
            </div>
          )}

          {/* Product grid — your Items component OR the styled card */}
          <div className={`products-grid${viewMode === "list" ? " list-view" : ""}`}>
            {paged.map((item, idx) => (
              /* Drop-in your <Items> component below, or keep the styled card */
              <Items
                key={item.id ?? idx}
                Pname={item.name}
                Pimg={item.image}
                Nprice={item.new_price}
                Oprice={item.old_price}
                id={item.id}
                desc={item.description}
                product={"all_product"}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination reveal" ref={paginationRef}>
              <button
                className="page-btn arrow"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ‹
              </button>
              {pageButtons.map((btn, i) =>
                btn === "..." ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={btn}
                    className={`page-btn${currentPage === btn ? " active" : ""}`}
                    onClick={() => setCurrentPage(btn)}
                  >
                    {btn}
                  </button>
                )
              )}
              <button
                className="page-btn arrow"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          )}

          {/* You May Also Like */}
          <div className="also-viewed reveal" ref={alsoRef}>
            <div className="av-header">
              <h3 className="av-title">You may also <em>like</em></h3>
              <a href="#" className="av-link">View all →</a>
            </div>
            <div className="av-scroll">
              {ALSO_LIKED.map(item => (
                <div className="av-card" key={item.name}>
                  <div className="av-card-img">
                    <img src={item.img} alt={item.name} loading="lazy" />
                  </div>
                  <p className="av-card-name">{item.name}</p>
                  <p className="av-card-price">{item.price}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* <FooterShop /> */}
    </div>
  );
}

export default ShopCategory;