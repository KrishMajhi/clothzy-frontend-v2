import React, { useState } from "react";
import { useReveal } from "./shopCategoryConstants";

function CategoryToolbar({
  totalShowing,
  totalProducts,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
  activeFilters,
  onSearch, // Add search callback prop
}) {
  const toolbarRef = useReveal();
  const filtersRef = useReveal();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If search bar is empty, immediately clear search and show all products
    if (!value.trim() && onSearch) {
      onSearch("");
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <>
      {/* Sort / view toolbar */}
      <div className="shop-toolbar reveal" ref={toolbarRef}>
        <p className="result-count">
          Showing <strong>{totalShowing}</strong> of{" "}
          <strong>{totalProducts}</strong> products
        </p>

        <div className="search-box-container">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              aria-label="Search products"
            />
            <button
              className="search-button"
              onClick={handleSearchSubmit}
              title="Search"
              aria-label="Search button"
            >
              <i className="ti ti-search"></i>
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_low_to_high">Price: Low to High</option>
            <option value="price_high_to_low">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Best Rated</option>
          </select>

          <div className="view-btns">
            <button
              className={`view-btn${viewMode === "grid" ? " active" : ""}`}
              title="Grid view"
              onClick={() => onViewChange("grid")}
              aria-label="Grid view"
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
              onClick={() => onViewChange("list")}
              aria-label="List view"
            >
              <svg viewBox="0 0 16 16">
                <rect x="1" y="2" width="14" height="3" rx="1" />
                <rect x="1" y="7" width="14" height="3" rx="1" />
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
          {activeFilters.map((f) => (
            <div key={f.key} className="af-pill" onClick={f.remove}>
              {f.label} <span>×</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default CategoryToolbar;