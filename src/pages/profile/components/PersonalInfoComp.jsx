import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../css/PersonalInfoComp.css";

const ACTIVITY = [
  { color: "green", text: <>Order <strong>ORD-2025-006</strong> was delivered successfully</>, time: "2 hours ago" },
  { color: "blue",  text: <>Added <strong>Linen Blazer – Ivory</strong> to wishlist</>,         time: "Yesterday" },
  { color: "gold",  text: <>Password changed successfully</>,                                     time: "3 days ago" },
  { color: "green", text: <>Order <strong>ORD-2025-005</strong> placed · ₹4,250</>,              time: "Jan 20, 2025" },
  { color: "muted", text: <>Signed in from <strong>Surat, Gujarat</strong> · Chrome on Windows</>, time: "Jan 18, 2025" },
];

export default function PersonalInfoComp() {
  const { user, updateCurrentUser } = useAuth();

  const [isEdit,   setIsEdit]   = useState(false);
  const [formData, setFormData] = useState({});

  const personalInfo = user?.personal_info || {};

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleEdit = () => {
    if (!isEdit) {
      setFormData({
        fullname:     personalInfo.fullname     || "",
        email:        personalInfo.email        || "",
        phone_number: personalInfo.phone_number || "",
        username:     personalInfo.username     || "",
        dob:          personalInfo.dob          || "",
        gender:       personalInfo.gender       || "",
        language:     personalInfo.language     || "",
      });
    }
    setIsEdit(!isEdit);
  };

  const handleSave = async () => {
    try {
      await updateCurrentUser({ personal_info: formData });
      setIsEdit(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => { setFormData({}); setIsEdit(false); };

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const ordersCount  = (user?.orders || []).length;
  const totalSpent   = (user?.orders || []).reduce((s, o) => {
    const n = parseInt((o.total || "0").replace(/[₹,]/g, ""));
    return s + (isNaN(n) ? 0 : n);
  }, 0);
  const wishlistCount = (user?.wishlist || []).length;

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Account Settings</div>
        <h1 className="profilepage-title">My Profile</h1>
        <p className="profilepage-sub">Manage your personal information and account settings</p>
      </div>

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{getInitial(personalInfo.fullname)}</div>
        </div>
        <div className="profile-info">
          <h2>{personalInfo.fullname || "—"}</h2>
          <p>{personalInfo.email        || "—"}</p>
          <p>{personalInfo.phone_number || "—"}</p>
          <span className="profile-verified">✓ Verified User</span>
        </div>
        <div className="profile-hero-stats">
          <div>
            <div className="profile-hero-stat-val">{ordersCount}</div>
            <div className="profile-hero-stat-label">Orders</div>
          </div>
          <div>
            <div className="profile-hero-stat-val">₹{Math.round(totalSpent / 1000)}K</div>
            <div className="profile-hero-stat-label">Spent</div>
          </div>
          <div>
            <div className="profile-hero-stat-val">{wishlistCount}</div>
            <div className="profile-hero-stat-label">Wishlist</div>
          </div>
        </div>
      </div>

      {/* ── Personal Info Fields ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Personal Information</div>
          <button className="section-action" onClick={handleEdit}>
            {isEdit ? "✕ CANCEL" : "✏️ EDIT"}
          </button>
        </div>

        <div className="profile-fields">
          {[
            { label: "Full Name",     key: "fullname",     type: "text"  },
            { label: "Email Address", key: "email",        type: "email" },
            { label: "Phone Number",  key: "phone_number", type: "tel"   },
            { label: "Username",      key: "username",     type: "text"  },
            { label: "Date of Birth", key: "dob",          type: "date"  },
          ].map(({ label, key, type }) => (
            <div className="profile-field" key={key}>
              <label className="profile-field-label">{label}</label>
              {isEdit ? (
                <input className="profile-field-input" type={type} value={formData[key] || ""} onChange={set(key)} />
              ) : (
                <div className="profile-field-value">{
                  key === "dob" ? (personalInfo.dob ? formatDate(personalInfo.dob) : "Not set")
                                : (personalInfo[key] || "Not set")
                }</div>
              )}
            </div>
          ))}

          {/* Gender */}
          <div className="profile-field">
            <label className="profile-field-label">Gender</label>
            {isEdit ? (
              <select className="profile-field-input" value={formData.gender || ""} onChange={set("gender")}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            ) : (
              <div className="profile-field-value">{personalInfo.gender || "Not set"}</div>
            )}
          </div>

          {/* Language */}
          <div className="profile-field">
            <label className="profile-field-label">Preferred Language</label>
            {isEdit ? (
              <select className="profile-field-input" value={formData.language || ""} onChange={set("language")}>
                <option>English (India)</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>Marathi</option>
              </select>
            ) : (
              <div className="profile-field-value">{personalInfo.language || "English (India)"}</div>
            )}
          </div>

          {/* Member Since */}
          <div className="profile-field">
            <label className="profile-field-label">Member Since</label>
            <div className="profile-field-value">{formatDate(personalInfo.created_at)}</div>
          </div>

          {/* Account Status */}
          <div className="profile-field">
            <label className="profile-field-label">Account Status</label>
            <div className="profile-field-value"><span className="badge confirmed">Active</span></div>
          </div>
        </div>
      </div>

      {isEdit && (
        <div className="profile-actions">
          <button className="btn primary" onClick={handleSave}>💾 SAVE CHANGES</button>
          <button className="btn" onClick={handleCancel}>CANCEL</button>
        </div>
      )}

      {/* ── Recent Activity ── */}
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
