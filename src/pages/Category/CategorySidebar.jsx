
import React, { useEffect, useState } from "react";
import { COLOR_PALETTE } from "./shopCategoryConstants";
import { useShop } from "../../Context/ShopContext";

/* ─── Collapsible wrapper ─── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <div
        className={`filter-title${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <svg viewBox="0 0 24 24" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      <div className={`filter-body${open ? "" : " collapsed"}`}>{children}</div>
    </div>
  );
}

function CategorySidebar({
  checkedCats,
  setCheckedCats,
  selectedSizes,
  setSelectedSizes,
  selectedColor,
  setSelectedColor,
  maxPrice,
  setMaxPrice,
  onApplyFilters,
  onClearAll,
}) {
  const { dataCategoryFilters, dataColors, dataSizes, datamaxPrice } =
    useShop();

  // ══════════════════════════════════════════════════════════
  // PENDING STATE — what user is currently selecting (local)
  // ══════════════════════════════════════════════════════════
  const [pending, setPending] = useState({
    categories: checkedCats,
    sizes: selectedSizes,
    color: selectedColor,
    maxPrice: maxPrice,
  });

  // ══════════════════════════════════════════════════════════
  // APPLIED STATE — what was last sent to the API
  // ══════════════════════════════════════════════════════════
  const [applied, setApplied] = useState({
    categories: checkedCats,
    sizes: selectedSizes,
    color: selectedColor,
    maxPrice: maxPrice,
  });

  // Update pending state when parent props change
  useEffect(() => {
    setPending({
      categories: checkedCats,
      sizes: selectedSizes,
      color: selectedColor,
      maxPrice: maxPrice,
    });
  }, [checkedCats, selectedSizes, selectedColor, maxPrice]);

  // ══════════════════════════════════════════════════════════
  // BUTTON STATE LOGIC
  // ══════════════════════════════════════════════════════════
  // isDirty: true when pending filters differ from applied filters
  const isDirty = JSON.stringify(pending) !== JSON.stringify(applied);

  // hasAny: true when user has selected at least one filter
  const hasAny =
    (pending.categories && pending.categories.length > 0) ||
    (pending.sizes && pending.sizes.length > 0) ||
    pending.color ||
    pending.maxPrice !== 2000;

  // ══════════════════════════════════════════════════════════
  // HANDLE APPLY
  // ══════════════════════════════════════════════════════════
  const handleApplyFilters = () => {
    // Update applied state to match pending
    setApplied(pending);

    // Call parent callback to fetch with new filters
    if (onApplyFilters) {
      onApplyFilters({
        categories: pending.categories,
        sizes: pending.sizes,
        color: pending.color,
        maxPrice: pending.maxPrice,
      });
    }
  };

  // ══════════════════════════════════════════════════════════
  // HANDLE CLEAR ALL
  // ══════════════════════════════════════════════════════════
  const handleClearAll = () => {
    // Reset all filter states
    setCheckedCats([]);
    setSelectedSizes([]);
    setSelectedColor(null);
    setMaxPrice(2000);

    setPending({
      categories: [],
      sizes: [],
      color: null,
      maxPrice: 2000,
    });

    setApplied({
      categories: [],
      sizes: [],
      color: null,
      maxPrice: 2000,
    });

    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <aside className="sidebar">
      {/* Category */}
      <FilterSection title="Category">
        {dataCategoryFilters && dataCategoryFilters.length > 0 ? (
          dataCategoryFilters.map((catObj) => {
            const catName = catObj.name || catObj;
            const catCount = catObj.count || 0;
            return (
              <label
                key={catName}
                className={`filter-check${
                  checkedCats.includes(catName) ? " checked" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedCats.includes(catName)}
                  onChange={() =>
                    setCheckedCats((prev) =>
                      prev.includes(catName)
                        ? prev.filter((x) => x !== catName)
                        : [...prev, catName],
                    )
                  }
                />
                <div className="check-box" />
                {catName}
                <span className="check-count">{catCount}</span>
              </label>
            );
          })
        ) : (
          <p style={{ color: "#999", fontSize: "14px" }}>
            Loading categories...
          </p>
        )}
      </FilterSection>

      <div className="filter-divider" />

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="price-range">
          <div className="range-track">
            <div
              className="range-fill"
              style={{ right: `${100 - (maxPrice / datamaxPrice) * 100}%` }}
            />
          </div>
          <div className="range-labels">
            <span>₹0</span>
            <span>₹{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            className="price-slider"
            min="0"
            max={datamaxPrice}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </FilterSection>

      <div className="filter-divider" style={{ marginTop: 24 }} />

      {/* Size */}
      <FilterSection title="Size">
        <div className="size-pills">
          {dataSizes && dataSizes.length > 0 ? (
            dataSizes.map((s) => (
              <button
                key={s}
                className={`size-pill${
                  selectedSizes.includes(s) ? " active" : ""
                }`}
                onClick={() =>
                  setSelectedSizes((prev) =>
                    prev.includes(s)
                      ? prev.filter((x) => x !== s)
                      : [...prev, s],
                  )
                }
              >
                {s}
              </button>
            ))
          ) : (
            <p style={{ color: "#999", fontSize: "14px" }}>Loading sizes...</p>
          )}
        </div>
      </FilterSection>

      <div className="filter-divider" style={{ marginTop: 24 }} />

      {/* Color */}
      <FilterSection title="Color">
        <div className="color-swatches">
          {dataColors && dataColors.length > 0 ? (
            dataColors.map((colorName) => {
              const found = COLOR_PALETTE.find(
                (c) => c.name.toLowerCase() === colorName.toLowerCase(),
              );
              if (!found) return null;
              return (
                <div
                  key={found.name}
                  className={`color-swatch${
                    selectedColor === found.name ? " active" : ""
                  }`}
                  style={{
                    background: found.hex,
                    ...(found.border ? { border: "1.5px solid #d6c9b4" } : {}),
                  }}
                  title={found.name}
                  onClick={() =>
                    setSelectedColor((prev) =>
                      prev === found.name ? null : found.name,
                    )
                  }
                />
              );
            })
          ) : (
            <p style={{ color: "#999", fontSize: "14px" }}>Loading colors...</p>
          )}
        </div>
      </FilterSection>

      <div className="filter-divider" style={{ marginTop: 24 }} />

      {/* Rating */}
      <FilterSection title="Rating">
        {[5, 4, 3].map((r) => (
          <label key={r} className="filter-check">
            <input type="checkbox" readOnly />
            <div className="check-box" />
            <span style={{ color: "#f0a500", letterSpacing: 1 }}>
              {"★".repeat(r)}
            </span>
            <span style={{ color: "#d6c9b4", letterSpacing: 1 }}>
              {"★".repeat(5 - r)}
            </span>
            {r < 5 && <span style={{ marginLeft: 4, fontSize: 13 }}>& up</span>}
          </label>
        ))}
      </FilterSection>

      {/* Filter Buttons */}
      <div
        className="filter-buttons"
        style={{
          marginTop: 32,
          display: "flex",
          gap: 12,
          flexDirection: "column",
        }}
      >
        {/* Clear All Button */}
        <button
          className="clear-btn"
          onClick={handleClearAll}
          disabled={!hasAny}
          style={{
            opacity: !hasAny ? 0.5 : 1,
            cursor: !hasAny ? "not-allowed" : "pointer",
            padding: "10px 16px",
            borderRadius: "4px",
            border: "1px solid var(--dark, #000)",
            background: "transparent",
            color: "var(--dark, #000)",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
        >
          Clear All Filters
        </button>

        {/* Apply Filters Button */}
        <button
          className="apply-btn"
          onClick={handleApplyFilters}
          disabled={!isDirty}
          style={{
            opacity: !isDirty ? 0.5 : 1,
            cursor: !isDirty ? "not-allowed" : "pointer",
            backgroundColor: isDirty
              ? "var(--primary, #000)"
              : "var(--gray, #ccc)",
            color: "white",
            padding: "10px 16px",
            borderRadius: "4px",
            border: "none",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );
}

export default CategorySidebar;
