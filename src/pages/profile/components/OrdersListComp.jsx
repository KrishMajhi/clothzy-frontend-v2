import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../css/OrdersListComp.css";

const FILTERS = ["all", "delivered", "shipped", "processing", "pending", "refunded"];

export default function OrdersListComp({ onViewOrder }) {
  const { user } = useAuth();

  const [query,  setQuery]  = useState("");
  const [filter, setFilter] = useState("all");

  const orders = user?.orders || [];

  const filtered = orders.filter(o => {
    const mf = filter === "all" || o.status === filter;
    const ms = !query ||
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      (o.items || []).some(i => i.name.toLowerCase().includes(query.toLowerCase()));
    return mf && ms;
  });

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Order Management</div>
        <h1 className="profilepage-title">All Orders</h1>
        <p className="profilepage-sub">Complete purchase history with search and filtering</p>
      </div>

      <div className="orders-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by order ID or item name…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-pills">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`pill ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="orders-header">
        <div className="orders-title">Orders</div>
        <div className="orders-count">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="orders-table-head">
        <span>Order ID</span>
        <span>Items</span>
        <span>Status</span>
        <span>Date</span>
        <span>Amount</span>
        <span />
      </div>

      <div id="orders-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◫</div>
            <div className="empty-title">No orders found</div>
            <div className="empty-sub">Try adjusting your search or filter.</div>
          </div>
        ) : (
          filtered.map(o => (
            <div key={o.id} className="order-row" onClick={() => onViewOrder && onViewOrder(o.id)}>
              <div className="order-row-id">{o.id}</div>
              <div>
                <div className="order-row-name">{(o.items || []).map(i => i.name).join(", ")}</div>
                <div className="order-row-sub">{o.itemsCount} item{o.itemsCount > 1 ? "s" : ""} · {o.paymentMethod}</div>
              </div>
              <div>
                <span className={`badge ${o.status}`}>{o.status.replace(/_/g, " ")}</span>
              </div>
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
