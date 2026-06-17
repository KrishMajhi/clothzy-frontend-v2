// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/OrdersComp.css";

const computeStats = (orders = []) => {
  const delivered  = orders.filter((o) => o.status === "delivered").length;
  const inTransit  = orders.filter((o) => o.status === "shipped" || o.status === "processing").length;
  const totalSpent = orders.reduce((sum, o) => {
    const amount = parseInt((o.total || "0").replace(/[₹,]/g, ""));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  return { total: orders.length, delivered, inTransit, totalSpent: `₹${totalSpent.toLocaleString()}` };
};

const BadgeHtml = ({ status }) => (
  <span className={`badge ${status}`}>{status.replace(/_/g, " ")}</span>
);

export default function OrdersComp({ onViewOrder }) {
  const { user } = useAuth();

  const orders       = user?.orders || [];
  const stats        = computeStats(orders);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">ORDER MANAGEMENT</div>
        <h1 className="page-title">My Orders</h1>
        <p className="page-sub">Track and manage all your purchases</p>
      </div>

      {/* Stats */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-label">TOTAL ORDERS</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">DELIVERED</div>
          <div className="stat-value">{stats.delivered}</div>
          <div className="stat-sub">Successfully</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">IN TRANSIT</div>
          <div className="stat-value">{stats.inTransit}</div>
          <div className="stat-sub">Current</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOTAL SPENT</div>
          <div className="stat-value">{stats.totalSpent}</div>
          <div className="stat-sub">Overall</div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Recent Orders</div>
        </div>
        <div className="order-preview-list">
          {recentOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-title">No orders yet</div>
              <div className="empty-sub">Start shopping to see your orders here.</div>
            </div>
          ) : (
            recentOrders.map((o) => (
              <div
                key={o.id}
                className="order-preview"
                onClick={() => onViewOrder(o.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="order-preview-id">{o.id}</div>
                <div className="order-preview-date">{o.date}</div>
                <div className="order-preview-items">
                  {o.itemsCount} item{o.itemsCount > 1 ? "s" : ""} · {o.paymentMethod}
                </div>
                <div><BadgeHtml status={o.status} /></div>
                <div className="order-preview-total">{o.total}</div>
                <div className="order-preview-arrow">→</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
