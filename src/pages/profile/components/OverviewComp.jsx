import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";
import "../css/OverviewComp.css";
import { useOrders } from "../../../context/OrderContext";
const ACTIVITY = [
  {
    color: "green",
    text: (
      <>
        Order <strong>ORD-2025-006</strong> was delivered successfully
      </>
    ),
    time: "2 hours ago",
  },
  {
    color: "blue",
    text: (
      <>
        Added <strong>Linen Blazer – Ivory</strong> to wishlist
      </>
    ),
    time: "Yesterday",
  },
  {
    color: "gold",
    text: <>Password changed successfully</>,
    time: "3 days ago",
  },
  {
    color: "green",
    text: (
      <>
        Order <strong>ORD-2025-005</strong> placed · ₹4,250
      </>
    ),
    time: "Jan 20, 2025",
  },
  {
    color: "muted",
    text: (
      <>
        Signed in from <strong>Surat, Gujarat</strong> · Chrome on Windows
      </>
    ),
    time: "Jan 18, 2025",
  },
];

const computeStats = (orders = []) => {
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const inTransit = orders.filter(
    (o) => o.status === "shipped" || o.status === "processing",
  ).length;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0,
  );

  return {
    total: orders.length,
    delivered,
    inTransit,
    totalSpent,
  };
};

export default function OverviewComp() {
  const { user } = useAuth();
  const { recentOrders, fetchRecentOrders } = useOrders();

  useEffect(() => {
    fetchRecentOrders();
  }, []);
  const orders = recentOrders || [];
  const personalInfo = user?.personal_info || {};
  const stats = computeStats(orders);
  // const recent      = orders.slice(0, 4);
  const recent = orders;

  const totalSpentFmt =
    stats.totalSpent >= 1000
      ? `₹${Math.round(stats.totalSpent / 1000)}K`
      : `₹${stats.totalSpent}`;

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Welcome Back</div>
        <h1 className="profilepage-title">Dashboard</h1>
        <p className="profilepage-sub">
          Overview of your account activity and recent orders
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

      {/* ── Quick Profile ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Quick Profile</div>
        </div>
        <div className="profile-quick-view">
          {[
            { label: "Name", value: personalInfo.fullname },
            { label: "Email", value: personalInfo.email },
            { label: "Phone", value: personalInfo.phone_number },
            {
              label: "Member Since",
              value: personalInfo.created_at
                ? new Date(personalInfo.created_at).toLocaleDateString(
                    "en-IN",
                    { month: "short", year: "numeric" },
                  )
                : null,
            },
          ].map(({ label, value }) => (
            <div className="quick-field" key={label}>
              <span className="quick-label">{label}</span>
              <span className="quick-value">{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Recent Orders</div>
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
              <div key={o.id} className="order-preview">
                <div className="order-preview-id">{o.id}</div>
                <div className="order-preview-date">
                  {new Date(o.created_at).toLocaleDateString()}
                </div>
                <div className="order-preview-items">
                  {o.item_count} item{o.item_count > 1 ? "s" : ""} ·{" "}
                  {o.payment_method}
                </div>
                <div>
                  <span className={`badge ${o.status}`}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="order-preview-total">{o.total_amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Activity Feed ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Recent Activity</div>
        </div>
        <div className="activity-feed">
          {ACTIVITY.map((a, i) => (
            <div className="activity-item" key={i}>
              <div className={`activity-dot ${a.color}`} />
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
