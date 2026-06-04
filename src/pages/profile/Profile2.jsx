import { useState } from "react";
import PersonalInfoComp from "./PersonalInfoComp";
import WishlistComp from "./WishlistComp";
import OrdersComp from "./OrdersComp";
import SecurityComp from "./SecurityComp";
import "./Profile.css";

const sections = [
  { id: "Personal Information", icon: "👤", label: "Personal Information" },
  { id: "Wishlist",             icon: "❤️", label: "Wishlist" },
  { id: "Orders",               icon: "📦", label: "Orders" },
  { id: "Security",             icon: "🔐", label: "Security" },
];

export default function Profile() {
  const [activeSection, setActiveSection] = useState("Personal Information");

  const renderContent = () => {
    switch (activeSection) {
      case "Personal Information": return <PersonalInfoComp />;
      case "Wishlist":             return <WishlistComp />;
      case "Orders":               return <OrdersComp />;
      case "Security":             return <SecurityComp />;
      default:                     return <PersonalInfoComp />;
    }
  };

  return (
    <div className="profile-page">
      {/* Ambient background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="profile-container">
        {/* ── Sidebar ── */}
        <aside className="profile-sidebar">
          <div className="sidebar-brand">
            <span className="brand-letter">C</span>
            <span className="brand-name">Clothzy</span>
          </div>

          <p className="sidebar-label">Account</p>

          <nav className="sidebar-nav">
            {sections.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`sidebar-btn ${activeSection === id ? "active" : ""}`}
              >
                <span className="sidebar-icon">{icon}</span>
                <span>{label}</span>
                {activeSection === id && <span className="active-indicator" />}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p>Profile V1</p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="profile-main">
          <div className="profile-content-wrapper">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
