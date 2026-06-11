import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  // =====================
  // CART
  // Lazy initializer reads localStorage once on mount, not on every render
  // =====================
  // const [cartItems, setCartItems] = useState(() =>
  //   JSON.parse(localStorage.getItem("cartItems") ?? "[]"),
  // );

  // =====================
  // PRODUCTS & PAGINATION
  // currentPage is NOT here — it lives in ShopCategory (page-level UI state)
  // =====================
  const [gridproducts, setGridProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [productsLoading, setProductsLoading] = useState(false);

  // =====================
  // FILTER METADATA
  // Sourced from /products/filter_metadata, NOT derived from paginated data
  // =====================
  const [dataCategoryFilters, setDataCategoryFilters] = useState([]); // [{ name, count }]
  const [dataGenderFilters, setDataGenderFilters] = useState([]);
  const [dataSizes, setDataSizes] = useState([]);
  const [dataColors, setDataColors] = useState([]);
  const [dataBrands, setDataBrands] = useState([]);
  const [dataTags, setDataTags] = useState([]);
  const [datamaxPrice, setDataMaxPrice] = useState(2000);
  const [metadataLoading, setMetadataLoading] = useState(false);

  // =====================
  // FETCH FILTER METADATA
  // Called independently of pagination — accepts partial filters for faceted counts.
  // Example: fetchFilterMetadata("men") → categories only for men
  //
  // Expected response shape from GET /products/filter_metadata:
  // {
  //   "categories": [{ "name": "Hoodie", "count": 12 }, ...],
  //   "genders":    ["men", "women", "kids"],
  //   "sizes":      ["S", "M", "L", "XL"],
  //   "colors":     ["black", "white", "red"],
  //   "brands":     ["Nike", "Adidas"],
  //   "tags":       ["new", "sale"],
  //   "max_price":  4999
  // }
  // =====================
  const fetchFilterMetadata = async (gender_category) => {
    setMetadataLoading(true);
    
    try {
      if (!gender_category) {
        console.warn("fetchFilterMetadata: gender_category is required");
        return;
      }

      const url = new URL(
        `${API_BASE_URL}/api/v0.0.24/products/filter_metadata`,
      );
      url.searchParams.append("gender", gender_category);

      const raw = await fetch(url.toString(), { method: "GET" });

      if (!raw.ok) {
        throw new Error(`Failed to fetch filter metadata: ${raw.status}`);
      }

      const data = await raw.json();

      setDataCategoryFilters(data.categories ?? []);
      setDataGenderFilters(data.genders ?? []);
      setDataSizes(data.sizes ?? []);
      setDataColors(data.colors ?? []);
      setDataBrands(data.brands ?? []);
      setDataTags(data.tags ?? []);
      setDataMaxPrice(data.max_price ?? 2000);
    } catch (error) {
      console.error("fetchFilterMetadata error:", error);
    } finally {
      setMetadataLoading(false);
    }
  };

  // =====================
  // FETCH PRODUCTS
  // Owns only products + pagination. No filter derivation happens here.
  // ShopCategory calls this with a full query object:
  //   fetchProducts({ gender: "men", page: 2, limit: 20, category: "hoodie" })
  // =====================
  const fetchProducts = async (query = {}) => {
    const queryParams = new URLSearchParams(query);
    setProductsLoading(true);

    try {
      const raw = await fetch(
        `${API_BASE_URL}/api/v0.0.24/products/all_products?${queryParams}`,
        { method: "GET" },
      );

      if (!raw.ok) {
        throw new Error(`Failed to fetch products: ${raw.status}`);
      }

      // Expected shape (ProductListResponseModel):
      // { items: [...], total, page, limit, total_pages }
      const data = await raw.json();

      setGridProducts(data.items ?? []);
      setTotalProducts(data.total ?? 0);
      setTotalPages(data.total_pages ?? 1);
      setPageLimit(data.limit ?? 20);
    } catch (error) {
      console.error("fetchProducts error:", error);
      setGridProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setProductsLoading(false);
    }
  };

  // =====================
  // FETCH SINGLE PRODUCT
  // =====================
  const fetchProductByID = async (product_id) => {
    try {
      const raw = await fetch(
        `${API_BASE_URL}/api/v0.0.24/products/get_product/${product_id}`,
      );

      if (!raw.ok) {
        throw new Error(`Failed to fetch product: ${raw.status}`);
      }

      // Returns a single ProductResponseModel
      return await raw.json();
    } catch (error) {
      console.error("fetchProductByID error:", error);
      return null;
    }
  };

  // =====================
  // >PERSIST CART
  // =====================

  const contextValue = {
    // Products & pagination
    gridproducts,
    totalProducts,
    totalPages,
    pageLimit,
    productsLoading,

    // Filter metadata (from dedicated endpoint, not derived from page data)
    datamaxPrice,
    dataCategoryFilters, // [{ name: string, count: number }]
    dataGenderFilters,
    dataColors,
    dataSizes,
    dataBrands,
    dataTags,
    metadataLoading,

    // Fetchers
    fetchProducts,
    fetchProductByID,
    fetchFilterMetadata,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

export const useShop = () => useContext(ShopContext);
