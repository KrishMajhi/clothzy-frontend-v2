import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/OrdersListComp.css";

const BadgeHtml = ({ status }) => (
  <span className={`badge ${status}`}>{status.replace(/_/g, " ")}</span>
);

const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">◫</div>
    <div className="empty-title">No orders found</div>
    <div className="empty-sub">Try adjusting your search or filter.</div>
  </div>
);

const FILTERS = ["all", "delivered", "shipped", "processing", "pending", "refunded"];

export default function OrdersListComp({ onViewOrder }) {
  const { user } = useAuth();

  const [searchQuery,    setSearchQuery]    = useState("");
  const [currentFilter,  setCurrentFilter]  = useState("all");

  const orders = user?.orders || [];

  const filtered = orders.filter((o) => {
    const matchFilter = currentFilter === "all" || o.status === currentFilter;
    const matchSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.items || []).some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">ORDER MANAGEMENT</div>
        <h1 className="page-title">All Orders</h1>
        <p className="page-sub">Complete order history and status tracking</p>
      </div>

      {/* Search */}
      <div className="orders-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search by order ID or item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Pills */}
      <div className="filter-pills">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`pill ${currentFilter === f ? "active" : ""}`}
            onClick={() => setCurrentFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders Count */}
      <div className="orders-header">
        <div className="orders-title">Orders</div>
        <div className="orders-count">
          <span>{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* List */}
      <div id="orders-list">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((o) => (
            <div key={o.id} className="order-row" onClick={() => onViewOrder(o.id)}>
              <div className="order-row-id">{o.id}</div>
              <div className="order-row-meta">
                <div className="order-row-name">
                  {(o.items || []).map((i) => i.name).join(", ")}
                </div>
                <div className="order-row-sub">
                  {o.itemsCount} item{o.itemsCount > 1 ? "s" : ""} · {o.paymentMethod}
                </div>
              </div>
              <div><BadgeHtml status={o.status} /></div>
              <div className="order-row-date">{o.date}</div>
              <div className="order-row-amount">{o.total}</div>
              <div className="order-row-arrow">→</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
