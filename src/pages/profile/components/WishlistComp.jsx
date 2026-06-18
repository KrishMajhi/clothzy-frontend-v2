import { useState } from "react";
import "../css/WishlistComp.css";
import { useWishlist } from "../../../context/WishListContext";
import { useCart } from "../../../context/CartContext";
const PLACEHOLDER_ITEMS = [
  {
    id: 1,
    brand: "Clothzy Studio",
    name: "Relaxed Linen Shirt – Sage Green",
    price: "₹2,890",
    original: "₹3,490",
    discount: "17% OFF",
    sizes: ["XS", "S", "M", "L"],
    img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  },
  {
    id: 2,
    brand: "Clothzy Premium",
    name: "High-Rise Flare Jeans – Indigo",
    price: "₹3,290",
    original: "₹3,990",
    discount: "18% OFF",
    sizes: ["26", "28", "30", "32", "34"],
    img: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80",
  },
  {
    id: 3,
    brand: "Clothzy Studio",
    name: "Oversized Knit Cardigan – Camel",
    price: "₹4,190",
    original: "₹5,490",
    discount: "24% OFF",
    sizes: ["XS", "S", "M", "L", "XL"],
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  },
  {
    id: 4,
    brand: "Clothzy",
    name: "Satin Slip Dress – Midnight",
    price: "₹3,590",
    original: null,
    discount: null,
    sizes: ["XS", "S", "M", "L"],
    img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
  },
  {
    id: 5,
    brand: "Clothzy Basics",
    name: "French Terry Hoodie – Oatmeal",
    price: "₹2,190",
    original: "₹2,690",
    discount: "19% OFF",
    sizes: ["S", "M", "L", "XL", "XXL"],
    img: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80",
  },
  {
    id: 6,
    brand: "Clothzy Studio",
    name: "Tailored Wool Trousers – Charcoal",
    price: "₹4,890",
    original: "₹5,990",
    discount: "18% OFF",
    sizes: ["28", "30", "32", "34", "36"],
    img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
  },
];

export default function WishlistComp() {
  // const [wishlistItems, setItems] = useState(PLACEHOLDER_ITEMS);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sortBy, setSortBy] = useState("Recently Added");
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const sorted = [...wishlistItems].sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return Number(a.price) - Number(b.price);
    }

    if (sortBy === "Price: High to Low") {
      return Number(b.price) - Number(a.price);
    }

    return 0;
  });

  const selectSize = (id, size) =>
    setSelectedSizes((p) => ({ ...p, [id]: size }));

  const removeItem = async (productId) => {
    await removeFromWishlist(productId);
  };
  const handleAddToCart = async (item) => {
    const selectedSize = selectedSizes[item.product_id];

    if (!selectedSize) {
      alert("Select a size first");
      return;
    }

    addToCart({
      product_id: item.product_id,
      quantity: 1,
      selected_size: selectedSize,
      selected_color: item.colors?.[0] || "Default",
    });
  };

  // console.log(data);
  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Collections</div>
        <h1 className="profilepage-title">My Wishlist</h1>
        <p className="profilepage-sub">
          Items you've saved — tap any size then add to cart
        </p>
      </div>

      <div className="wishlist-sort">
        <span className="wishlist-count">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}{" "}
          saved
        </span>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option>Recently Added</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <div className="empty-title">Nothing saved yet</div>
          <div className="empty-sub">
            Tap the heart on any item while browsing to save it here.
          </div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {sorted.map((item) => {
            const isInCart = cartItems.some(
              (cartItem) => cartItem.product_id === item.product_id,
            );

            return (
              <div className="wl-card" key={item.wishlist_id}>
                {item.discount_percentage && (
                  <div className="wl-discount-badge">
                    {item.discount_percentage}% OFF
                  </div>
                )}
                <button
                  className="wl-remove"
                  onClick={() => removeItem(item.product_id)}
                  title="Remove"
                >
                  ✕
                </button>
                <img
                  className="wl-img"
                  src={item.image_url}
                  alt={item.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <div className="wl-body">
                  <div className="wl-brand">{"Clothzy Specials"}</div>
                  <div className="wl-name">{item.name}</div>
                  <div className="wl-price-row">
                    <span className="wl-price">${item.price}</span>
                    {item.original_price && (
                      <span className="wl-original">{item.original_price}</span>
                    )}
                    {item.discount_percentage && (
                      <span className="wl-discount">
                        {item.discount_percentage}%OFF
                      </span>
                    )}
                  </div>
                  <div className="wl-sizes">
                    {item?.sizes?.map((s) => (
                      <button
                        key={s}
                        className={`wl-size ${selectedSizes[item.product_id] === s ? "sel" : ""}`}
                        onClick={() => selectSize(item.product_id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="wl-actions">
                    <button
                      className="wl-atc"
                      disabled={isInCart}
                      onClick={() => handleAddToCart(item)}
                    >
                      {isInCart ? "IN CART ✓" : "ADD TO CART"}
                    </button>
                    <button className="wl-share" title="Share">
                      ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
