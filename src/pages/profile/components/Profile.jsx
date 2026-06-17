import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import OverviewComp from "./OverviewComp";
import PersonalInfoComp from "./PersonalInfoComp";
import OrdersComp from "./OrdersComp";
import OrdersListComp from "./OrdersListComp";
import OrderDetailComp from "./OrderDetailComp";
import AddressComp from "./AddressComp";
import WishlistComp from "./WishlistComp";
import SecurityComp from "./SecurityComp";
import PrivacyComp from "./PrivacyComp";
import "./../css/profile.css";
import { useSearchParams } from "react-router-dom";

const sections = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "orders", icon: "📦", label: "Orders" },
  { id: "addresses", icon: "📍", label: "Addresses" },
  { id: "wishlist", icon: "❤️", label: "Wishlist" },
  { id: "security", icon: "🔐", label: "Password & Auth" },
  { id: "privacy", icon: "👁", label: "Privacy" },
];

export default function Profile() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [activeSection, setActiveSection] = useState(
    searchParams.get("section") || "overview",
  );
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setActiveSection("order-detail");
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setActiveSection("orders-list");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewComp />;
      case "profile":
        return <PersonalInfoComp />;
      case "orders":
        return <OrdersComp onViewOrder={handleViewOrder} />;
      case "orders-list":
        return <OrdersListComp onViewOrder={handleViewOrder} />;
      case "order-detail":
        return (
          <OrderDetailComp
            orderId={selectedOrderId}
            onBack={handleBackToOrders}
          />
        );
      case "addresses":
        return <AddressComp />;
      case "wishlist":
        return <WishlistComp />;
      case "security":
        return <SecurityComp />;
      case "privacy":
        return <PrivacyComp />;
      default:
        return <OverviewComp />;
    }
  };

  const personalInfo = user?.personal_info || {};

  return (
    <div className="profile-page">
      <div className="layout">
        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span>C</span>LOTHZY
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section">MENU</div>
            {sections.slice(0, 5).map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`nav-item ${activeSection === id ? "active" : ""}`}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}

            <div className="nav-section" style={{ marginTop: "28px" }}>
              SECURITY
            </div>
            {sections.slice(5).map(({ id, icon, label }) => (
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

        {/* ── MAIN CONTENT ── */}
        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
}
