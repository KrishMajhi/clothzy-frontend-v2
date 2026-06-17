import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

  import "./../css/PersonalInfoComp.css";

export default function PersonalInfoComp() {
  const { user, updateCurrentUser } = useAuth();

  const [isEdit, setIsEdit]   = useState(false);
  const [formData, setFormData] = useState({});

  const personalInfo = user?.personal_info || {};

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "?";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day:   "numeric",
      year:  "numeric",
    });
  };

  const handleEdit = () => {
    if (!isEdit) {
      setFormData({
        fullname:     personalInfo.fullname     || "",
        email:        personalInfo.email        || "",
        phone_number: personalInfo.phone_number || "",
        username:     personalInfo.username     || "",
      });
    }
    setIsEdit(!isEdit);
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateCurrentUser({ personal_info: formData });
      setIsEdit(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({});
    setIsEdit(false);
  };

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">ACCOUNT SETTINGS</div>
        <h1 className="page-title">My Profile</h1>
        <p className="page-sub">Manage your personal information and account settings</p>
      </div>

      {/* Profile Hero Card */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{getInitial(personalInfo.fullname)}</div>
        </div>
        <div className="profile-info">
          <h2>{personalInfo.fullname     || "—"}</h2>
          <p>{personalInfo.email         || "—"}</p>
          <p>{personalInfo.phone_number  || "—"}</p>
          <span className="profile-role">{personalInfo.role || "Member"}</span>
        </div>
      </div>

      {/* Profile Fields */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Personal Information</div>
          <div className="section-action" onClick={handleEdit}>
            {isEdit ? "✕ CANCEL" : "✏️ EDIT"}
          </div>
        </div>

        <div className="profile-fields">
          {[
            { label: "Full Name",     key: "fullname",     type: "text"  },
            { label: "Email Address", key: "email",        type: "email" },
            { label: "Phone Number",  key: "phone_number", type: "tel"   },
            { label: "Username",      key: "username",     type: "text"  },
          ].map(({ label, key, type }) => (
            <div className="profile-field" key={key}>
              <label className="profile-field-label">{label}</label>
              {isEdit ? (
                <input
                  type={type}
                  className="profile-field-input"
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              ) : (
                <div className="profile-field-value">{personalInfo[key] || "Not set"}</div>
              )}
            </div>
          ))}

          <div className="profile-field">
            <label className="profile-field-label">Member Since</label>
            <div className="profile-field-value">{formatDate(personalInfo.created_at)}</div>
          </div>

          <div className="profile-field">
            <label className="profile-field-label">Account Status</label>
            <div className="profile-field-value">
              <span className="badge confirmed">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Actions */}
      {isEdit && (
        <div className="profile-actions">
          <button className="btn primary" onClick={handleSave}>
            💾 SAVE CHANGES
          </button>
          <button className="btn" onClick={handleCancel}>
            CANCEL
          </button>
        </div>
      )}
    </div>
  );
}
