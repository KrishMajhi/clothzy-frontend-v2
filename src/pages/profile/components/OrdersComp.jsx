import { useAuth } from "../../../context/AuthContext";
import { useOrders } from "../../../context/OrderContext";
import "../css/OrdersComp.css";
const SPENDING_DATA = [
  { month: "AUG", val: 4200 },
  { month: "SEP", val: 7800 },
  { month: "OCT", val: 3400 },
  { month: "NOV", val: 11200 },
  { month: "DEC", val: 14800 },
  { month: "JAN", val: 8240 },
];

const computeStats = (orders = []) => {
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const pending = orders.filter((o) => o.status === "pending").length;

  const inTransit = orders.filter(
    (o) =>
      o.status === "processing" ||
      o.status === "shipped" ||
      o.status === "out_for_delivery",
  ).length;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );

  return {
    total: orders.length,
    delivered,
    pending,
    inTransit,
    totalSpent,
  };
};

export default function OrdersComp({ onViewOrder, onViewAll }) {
  const { recentOrders } = useOrders();

  const orders = recentOrders || [];
  const stats = computeStats(orders);
  const recent = orders.slice(0, 4);

  const totalSpentFmt =
    stats.totalSpent >= 1000
      ? `₹${Math.round(stats.totalSpent / 1000)}K`
      : `₹${stats.totalSpent}`;

  const max = Math.max(...SPENDING_DATA.map((d) => d.val));

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Order Management</div>
        <h1 className="profilepage-title">My Orders</h1>
        <p className="profilepage-sub">
          Track, manage, and review all your purchases
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-sub">All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{stats.delivered}</div>
          <div className="stat-sub">Successfully</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-sub">Awaiting processing</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">In Transit</div>
          <div className="stat-value">{stats.inTransit}</div>
          <div className="stat-sub">Active now</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value">{totalSpentFmt}</div>
          <div className="stat-sub">This year</div>
        </div>
      </div>

      {/* ── Spending Chart ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Monthly Spending</div>
        </div>
        <div className="spending-chart">
          <div className="spending-chart-header">
            <span className="spending-chart-period">Aug – Jan 2025</span>
            <span>
              <span className="spending-chart-total">₹58,240</span>
              <span className="spending-chart-delta"> ↑ 18%</span>
            </span>
          </div>
          <div className="spending-bars">
            {SPENDING_DATA.map((d, i) => (
              <div className="bar-wrap" key={d.month}>
                <div
                  className={`bar ${i === SPENDING_DATA.length - 1 ? "active" : ""}`}
                  style={{ height: `${Math.round((d.val / max) * 80)}px` }}
                  title={`₹${d.val.toLocaleString("en-IN")}`}
                />
                <span className="bar-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Recent Orders</div>
          <button
            className="section-action"
            onClick={() => onViewAll && onViewAll()}
          >
            VIEW ALL →
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-sub">
              Start shopping to see your orders here.
            </div>
          </div>
        ) : (
          <div className="order-preview-list">
            {recent.map((o) => (
              <div
                key={o.id}
                className="order-preview"
                onClick={() => onViewOrder && onViewOrder(o.id,o.order_number)}
              >
                {o.thumbnail && (
                  <img
                    className="order-preview-img"
                    src={o.thumbnail}
                    alt={o.id}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="order-preview-id">{o.id}</div>
                <div className="order-preview-date">
                  {new Date(o.created_at).toLocaleDateString()}
                </div>
                <div className="order-preview-items">
                  {o.item_count} item {o.item_count > 1 ? "s" : ""} ·{" "}
                  {o.payment_method}
                </div>
                <div>
                  <span className={`orderrecentbadge ${o.status}`}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="order-preview-total">{o.total_amount}</div>
                <div className="order-preview-arrow">→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
