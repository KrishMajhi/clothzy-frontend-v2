import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import CategoryHero from "./CategoryHero";
import CategorySidebar from "./CategorySidebar";
import CategoryToolbar from "./CategoryToolbar";
import CategoryGrid from "./CategoryGrid";
import AlsoLiked from "./AlsoLiked";

import { ITEMS_PER_PAGE } from "./shopCategoryConstants";
import "./ShopCategory.css";
import { useShop } from "../../Context/ShopContext.jsx";

const DEFAULT_MAX_PRICE = 2000;

const VALID_SORT_VALUES = new Set([
  "newest",
  "oldest",
  "price_low_to_high",
  "price_high_to_low",
  "rating",
]);

function ShopCategory({ gender_category, banner }) {
  const {
    gridproducts,
    totalProducts,
    totalPages: contextTotalPages,
    fetchProducts,
    fetchFilterMetadata,
    datamaxPrice,
    productsLoading,
  } = useShop();

  /* ── Applied filter state (what's actually been sent to API) ── */
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [checkedCats, setCheckedCats] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // ← NEW: Search state

  /* ── Derived label ── */
  const categoryLabel =
    gender_category === "kid"
      ? "Kids"
      : gender_category.charAt(0).toUpperCase() + gender_category.slice(1);

  // ══════════════════════════════════════════════════════════
  // BUILD QUERY — accepts explicit values so we don't depend
  // on stale state when calling right after setState
  // ══════════════════════════════════════════════════════════
  const buildQuery = ({
    page = 1,
    cats = checkedCats,
    sizes = selectedSizes,
    color = selectedColor,
    price = maxPrice,
    sort_by = sortBy,
    search = searchQuery, // ← NEW: Include search in query
  } = {}) => {
    const query = {
      gender: gender_category,
      page,
      limit: ITEMS_PER_PAGE,
    };

    if (sort_by && VALID_SORT_VALUES.has(sort_by)) {
      query.sort_by = sort_by;
    }

    if (cats.length > 0) {
      query.category = cats.join(",");
    }

    if (sizes.length > 0) {
      query.sizes = sizes.join(",");
    }

    if (color) {
      query.colors = color;
    }

    if (price !== DEFAULT_MAX_PRICE) {
      query.max_range = price;
    }

    // ← NEW: Add search parameter if present
    if (search && search.trim()) {
      query.search = search.trim();
    }

    return query;
  };

  // ══════════════════════════════════════════════════════════
  // INITIAL LOAD — only runs when gender_category changes
  // ══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!gender_category) return;

    setCheckedCats([]);
    setSelectedSizes([]);
    setSelectedColor(null);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("newest");
    setSearchQuery(""); // ← NEW: Reset search on category change
    setCurrentPage(1);

    fetchFilterMetadata(gender_category);

    fetchProducts({
      gender: gender_category,
      page: 1,
      limit: ITEMS_PER_PAGE,
      sort_by: "newest",
    });
  }, [gender_category]);

  // ══════════════════════════════════════════════════════════
  // SORT — immediate (no apply button needed for sorting)
  // ══════════════════════════════════════════════════════════
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
    fetchProducts(buildQuery({ page: 1, sort_by: value }));
    console.log("handlesort is called");
    console.log(gridproducts);
    console.log(value, sortBy);
  };

  // ══════════════════════════════════════════════════════════
  // SEARCH — NEW: Handle search submissions and clearing
  // ══════════════════════════════════════════════════════════
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // If query is empty, show all products; otherwise search with the query
    fetchProducts(buildQuery({ page: 1, search: query }));
  };

  // ══════════════════════════════════════════════════════════
  // PAGINATION
  // ══════════════════════════════════════════════════════════
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchProducts(buildQuery({ page: newPage }));
  };

  // ══════════════════════════════════════════════════════════
  // APPLY FILTERS — called from sidebar "Apply Filters" button
  // Receives the pending values directly from the sidebar,
  // so we don't need to wait for setState to flush.
  // ══════════════════════════════════════════════════════════
  const handleApplyFilters = ({ categories, sizes, color, maxPrice: mp }) => {
    const cats = categories ?? [];
    const szs = sizes ?? [];
    const col = color ?? null;
    const price = mp ?? DEFAULT_MAX_PRICE;

    // Update applied state
    setCheckedCats(cats);
    setSelectedSizes(szs);
    setSelectedColor(col);
    setMaxPrice(price);
    setCurrentPage(1);

    // Fetch immediately with the new values — don't wait for state
    fetchProducts(buildQuery({ page: 1, cats, sizes: szs, color: col, price }));
  };

  // ══════════════════════════════════════════════════════════
  // CLEAR ALL FILTERS
  // ══════════════════════════════════════════════════════════
  const handleClearAllFilters = () => {
    setCheckedCats([]);
    setSelectedSizes([]);
    setSelectedColor(null);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSearchQuery(""); // ← NEW: Clear search too
    setCurrentPage(1);

    // Fetch with empty filters
    fetchProducts(
      buildQuery({
        page: 1,
        cats: [],
        sizes: [],
        color: null,
        price: DEFAULT_MAX_PRICE,
        search: "", // ← NEW: Include empty search
      }),
    );
  };

  /* ── Active filter pills ── */
  const activeFilters = [
    ...checkedCats.map((c) => ({
      label: c,
      key: `cat-${c}`,
      remove: () => {
        const updated = checkedCats.filter((x) => x !== c);
        setCheckedCats(updated);
        fetchProducts(buildQuery({ page: 1, cats: updated }));
      },
    })),
    ...selectedSizes.map((s) => ({
      label: `Size: ${s}`,
      key: `sz-${s}`,
      remove: () => {
        const updated = selectedSizes.filter((x) => x !== s);
        setSelectedSizes(updated);
        fetchProducts(buildQuery({ page: 1, sizes: updated }));
      },
    })),
    ...(selectedColor
      ? [
          {
            label: `Color: ${selectedColor}`,
            key: "color",
            remove: () => {
              setSelectedColor(null);
              fetchProducts(buildQuery({ page: 1, color: null }));
            },
          },
        ]
      : []),
    ...(maxPrice !== DEFAULT_MAX_PRICE
      ? [
          {
            label: `Max: ₹${maxPrice}`,
            key: "price",
            remove: () => {
              setMaxPrice(DEFAULT_MAX_PRICE);
              fetchProducts(buildQuery({ page: 1, price: DEFAULT_MAX_PRICE }));
            },
          },
        ]
      : []),
  ];

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <CategoryHero
        category={gender_category}
        categoryLabel={categoryLabel}
        productCount={totalProducts}
        banner={banner}
      />

      <div className="shop-layout">
        <CategorySidebar
          selectedSection={gender_category}
          checkedCats={checkedCats}
          setCheckedCats={setCheckedCats}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onApplyFilters={handleApplyFilters}
          onClearAll={handleClearAllFilters}
        />

        <main className="shop-main">
          <CategoryToolbar
            totalShowing={gridproducts.length}
            totalProducts={totalProducts}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewChange={setViewMode}
            activeFilters={activeFilters}
            onSearch={handleSearch} // ← NEW: Pass search handler
          />

          <CategoryGrid
            items={gridproducts}
            viewMode={viewMode}
            currentPage={currentPage}
            totalPages={contextTotalPages}
            onPageChange={handlePageChange}
            loading={productsLoading}
          />

          <AlsoLiked />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ShopCategory;