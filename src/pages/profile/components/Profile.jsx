import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";
import OverviewComp from "./OverviewComp";
import PersonalInfoComp from "./PersonalInfoComp";
import OrdersComp from "./OrdersComp";
import OrdersListComp from "./OrdersListComp";
import OrderDetailComp from "./OrderDetailComp";
import AddressComp from "./AddressComp";
import WishlistComp from "./WishlistComp";
import SecurityComp from "./SecurityComp";
import "../css/Profile.css";
import {Link} from "react-router-dom"
const sections = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "addresses", icon: "📍", label: "Addresses" },
  { id: "wishlist", icon: "❤️", label: "Wishlist" },
];

const secSections = [{ id: "security", icon: "🔐", label: "Password & Auth" }];

export default function Profile() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [order_number, setorder_number] = useState(0);
  const handleViewOrder = (orderId, order_numberr) => {
    setSelectedOrderId(orderId);
    setorder_number(order_numberr);
    setActiveSection("order-detail");
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setActiveSection("orders-list");
  };

  const isActive = (id) =>
    activeSection === id ||
    (id === "orders" &&
      ["orders", "orders-list", "order-detail"].includes(activeSection));

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewComp />;
      case "profile":
        return <PersonalInfoComp />;
      case "orders":
        return (
          <OrdersComp
            onViewOrder={handleViewOrder}
            onViewAll={() => setActiveSection("orders-list")}
          />
        );
      case "orders-list":
        return <OrdersListComp onViewOrder={handleViewOrder} />;
      case "order-detail":
        return (
          <OrderDetailComp
            orderId={selectedOrderId}
            onBack={handleBackToOrders}
            order_number={order_number}
          />
        );
      case "addresses":
        return <AddressComp />;
      case "wishlist":
        return <WishlistComp />;
      case "security":
        return <SecurityComp />;
      default:
        return <OverviewComp />;
    }
  };

  const personalInfo = user?.personal_info || {};

  return (
    <div className="profile-page">
      <div className="layout">
        <aside className="sidebar">
          <Link to={"/"}>
          <div className="sidebar-logo">
            <span>C</span>LOTHZY
          </div>
          </Link>

          <nav className="sidebar-nav">
            <div className="nav-section">Account</div>
            {sections.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`nav-item ${isActive(id) ? "active" : ""}`}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <div className="nav-section" style={{ marginTop: "28px" }}>
              Security
            </div>
            {secSections.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`nav-item ${activeSection === id ? "active" : ""}`}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="sidebar-user-name">
              {personalInfo.fullname || "User"}
            </div>
            <div className="sidebar-user-email">{personalInfo.email}</div>
          </div>
        </aside>

        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
}
