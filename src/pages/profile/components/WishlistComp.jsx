import { useState } from "react";
import "../css/WishlistComp.css";

const PLACEHOLDER_ITEMS = [
  { id:1, brand:"Clothzy Studio",  name:"Relaxed Linen Shirt – Sage Green",    price:"₹2,890", original:"₹3,490", discount:"17% OFF", sizes:["XS","S","M","L"],          img:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
  { id:2, brand:"Clothzy Premium", name:"High-Rise Flare Jeans – Indigo",       price:"₹3,290", original:"₹3,990", discount:"18% OFF", sizes:["26","28","30","32","34"],   img:"https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80" },
  { id:3, brand:"Clothzy Studio",  name:"Oversized Knit Cardigan – Camel",      price:"₹4,190", original:"₹5,490", discount:"24% OFF", sizes:["XS","S","M","L","XL"],     img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
  { id:4, brand:"Clothzy",         name:"Satin Slip Dress – Midnight",          price:"₹3,590", original:null,     discount:null,      sizes:["XS","S","M","L"],          img:"https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80" },
  { id:5, brand:"Clothzy Basics",  name:"French Terry Hoodie – Oatmeal",        price:"₹2,190", original:"₹2,690", discount:"19% OFF", sizes:["S","M","L","XL","XXL"],    img:"https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80" },
  { id:6, brand:"Clothzy Studio",  name:"Tailored Wool Trousers – Charcoal",    price:"₹4,890", original:"₹5,990", discount:"18% OFF", sizes:["28","30","32","34","36"],  img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80" },
];

export default function WishlistComp() {
  const [items,         setItems]         = useState(PLACEHOLDER_ITEMS);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [sortBy,        setSortBy]        = useState("Recently Added");

  const sorted = [...items].sort((a, b) => {
    if (sortBy === "Price: Low to High") return parseInt(a.price.replace(/[₹,]/g,"")) - parseInt(b.price.replace(/[₹,]/g,""));
    if (sortBy === "Price: High to Low") return parseInt(b.price.replace(/[₹,]/g,"")) - parseInt(a.price.replace(/[₹,]/g,""));
    return 0;
  });

  const selectSize = (id, size) => setSelectedSizes(p => ({ ...p, [id]: size }));

  const removeItem = (id) => setItems(p => p.filter(i => i.id !== id));

  const addToCart = (item) => {
    if (!selectedSizes[item.id]) { alert("Please select a size first"); return; }
    alert(`Added ${item.name} (${selectedSizes[item.id]}) to cart!`);
  };

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Collections</div>
        <h1 className="profilepage-title">My Wishlist</h1>
        <p className="profilepage-sub">Items you've saved — tap any size then add to cart</p>
      </div>

      <div className="wishlist-sort">
        <span className="wishlist-count">{items.length} item{items.length !== 1 ? "s" : ""} saved</span>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option>Recently Added</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">♡</div>
          <div className="empty-title">Nothing saved yet</div>
          <div className="empty-sub">Tap the heart on any item while browsing to save it here.</div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {sorted.map(item => (
            <div className="wl-card" key={item.id}>
              {item.discount && <div className="wl-discount-badge">{item.discount}</div>}
              <button className="wl-remove" onClick={() => removeItem(item.id)} title="Remove">✕</button>
              <img
                className="wl-img"
                src={item.img}
                alt={item.name}
                loading="lazy"
                onError={e => { e.target.style.display = "none"; }}
              />
              <div className="wl-body">
                <div className="wl-brand">{item.brand}</div>
                <div className="wl-name">{item.name}</div>
                <div className="wl-price-row">
                  <span className="wl-price">{item.price}</span>
                  {item.original && <span className="wl-original">{item.original}</span>}
                  {item.discount && <span className="wl-discount">{item.discount}</span>}
                </div>
                <div className="wl-sizes">
                  {item.sizes.map(s => (
                    <button
                      key={s}
                      className={`wl-size ${selectedSizes[item.id] === s ? "sel" : ""}`}
                      onClick={() => selectSize(item.id, s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="wl-actions">
                  <button className="wl-atc" onClick={() => addToCart(item)}>ADD TO CART</button>
                  <button className="wl-share" title="Share">↗</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
