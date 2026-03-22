import React, { useState } from "react";
import "./css/Product.css";
import { useParams } from "react-router-dom";
import { useShop } from "../Context/ShopContext";

function Product() {
  const { productid } = useParams();
  const { all_products, popular_data, collection_products, addToCart, cartItems } = useShop();

  // Find product across all data sources
  const allItems = [...(all_products || []), ...(popular_data || []), ...(collection_products || [])];
  const product = allItems.find((p) => p.id === Number(productid));

  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImg, setMainImg] = useState(null);

  const isInCart = cartItems.some((item) => item.id === Number(productid));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      image: product.image,
      name: product.name,
      description: product.description || "",
      product: "all_product",
      qty: 1,
      pTotal: Number(product.new_price),
      Price: product.new_price,
    });
  };

  if (!product) {
    return (
      <div style={{ paddingTop: "120px", textAlign: "center", fontSize: "1.4rem", color: "#888" }}>
        Product not found.
      </div>
    );
  }

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="product-page">
      {/* Thumbnail gallery */}
      <div className="product-gallery">
        {[product.image, product.image, product.image].map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`thumb-${i}`}
            className="thumb-img"
            onClick={() => setMainImg(img)}
          />
        ))}
      </div>

      {/* Main image */}
      <div className="product-main-image">
        <img src={mainImg || product.image} alt={product.name} />
      </div>

      {/* Product info */}
      <div className="product-info">
        <h1 className="pr-h">{product.name}</h1>

        <div className="rating">
          ★★★★☆ <span style={{ color: "#999", fontSize: "14px" }}>(122 reviews)</span>
        </div>

        <div className="price-section">
          <span className="old-price">${product.old_price}</span>
          <span className="new-price">${product.new_price}</span>
        </div>

        <p className="product-description">
          {product.description ||
            "A premium quality item crafted for style and comfort. Perfect for everyday wear."}
        </p>

        <div className="size-select">
          <span>Select Size:</span>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              style={{
                background: selectedSize === size ? "#7f2323" : "#000",
              }}
            >
              {size}
            </button>
          ))}
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          {isInCart ? "✓ Added to Cart" : "Add to Cart"}
        </button>

        <div className="meta">
          <p>Category: {product.category || "Clothing"}</p>
          <p>Tags: Modern, Latest</p>
        </div>
      </div>
    </div>
  );
}

export default Product;
