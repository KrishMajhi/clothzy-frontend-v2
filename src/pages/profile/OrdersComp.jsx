
import "./css/OrdersComp.css";

const stats = [
  { label: "Total Orders", value: "24", icon: "📦" },
  { label: "In Transit", value: "3", icon: "🚚" },
  { label: "Delivered", value: "19", icon: "✅" },
  { label: "Spent", value: "₹18.4K", icon: "💳" },
];

const orders = [
  {
    id: "#CLZ-1024",
    status: "Shipped",
    date: "15 Sep 2025",
    total: "₹2,499",
    items: 3,
    payment: "Paid",
    shipping: "Express",
  },
];

export default function OrdersComp() {
  return (
    <div className="ord-root">
      <div className="ord-heading">
        <span className="ord-heading-tag">History</span>
        <h1 className="ord-title">Orders</h1>
        <p className="ord-desc">
          Track, search and manage all your Clothzy purchases.
        </p>
      </div>

      <div className="ord-stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="ord-stat-card">
            <div>{s.icon}</div>
            <div>
              <div>{s.label}</div>
              <strong>{s.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="ord-toolbar">
        <input placeholder="Search by Order ID..." />
        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
        </select>
      </div>

      {orders.map((order) => (
        <div key={order.id} className="ord-card">
          <div className="ord-card-top">
            <div>
              <h3>{order.id}</h3>
              <p>{order.date}</p>
            </div>
            <span>{order.status}</span>
          </div>

          <div className="ord-grid">
            <div><small>Items</small><div>{order.items}</div></div>
            <div><small>Total</small><div>{order.total}</div></div>
            <div><small>Payment</small><div>{order.payment}</div></div>
            <div><small>Shipping</small><div>{order.shipping}</div></div>
          </div>

          <div className="ord-actions">
            <button>Track Order</button>
            <button>View Details</button>
            <button>Download Invoice</button>
          </div>
        </div>
      ))}

      <div className="ord-lifecycle">
        <p className="ord-lifecycle-label">Order Journey</p>
        <div className="ord-steps">
          <div className="ord-step">📋 Placed</div>
          <div className="ord-step">🏭 Packed</div>
          <div className="ord-step">🚚 Shipped</div>
          <div className="ord-step">✅ Delivered</div>
        </div>
      </div>
    </div>
  );
}
