import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./css/PersonalInfoComp.css";

export default function PersonalInfoComp() {
  const { user, updateCurrentUser } = useAuth();

  const [edit, setEdit] = useState(false);
  const [updatedata, setUpdatedata] = useState({});

  const personalInfo = user?.personal_info;

  const initial =
    personalInfo?.username?.charAt(0).toUpperCase() ?? "?";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const fields = [
    {
      label: "Full Name",
      key: "fullname",
      icon: "◈",
      editable: true,
    },
    {
      label: "Username",
      key: "username",
      icon: "◉",
      editable: true,
    },
    {
      label: "Email",
      key: "email",
      icon: "◆",
      editable: true,
    },
    {
      label: "Phone",
      key: "phone_number",
      icon: "◷",
      editable: true,
    },
    {
      label: "Role",
      key: "role",
      icon: "◎",
      editable: false,
    },
    {
      label: "Member Since",
      key: "created_at",
      icon: "⌖",
      editable: false,
      format: (v) => (v ? formatDate(v) : "—"),
    },
  ];

  const handleEdit = async () => {
    if (!edit) {
      const seed = {};

      fields
        .filter((f) => f.editable)
        .forEach((f) => {
          seed[f.key] = personalInfo?.[f.key] || "";
        });

      setUpdatedata(seed);
      setEdit(true);
      return;
    }

    try {
      await updateCurrentUser({
        personal_info: updatedata,
      });

      setEdit(false);
      setUpdatedata({});
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setUpdatedata({});
  };

  return (
    <div className="pi-root">
      {/* Heading */}
      <div className="pi-heading">
        <span className="pi-heading-tag">Account</span>

        <h1 className="pi-title">Personal Info</h1>

        <p className="pi-desc">
          Your identity on Clothzy — keep it accurate.
        </p>
      </div>

      {/* Hero Card */}
      <div className="pi-hero">
        <div className="pi-avatar-wrap">
          <div className="pi-avatar">{initial}</div>
          <span className="pi-avatar-ring" />
        </div>

        <div className="pi-hero-body">
          <h2 className="pi-hero-name">
            {personalInfo?.fullname ||
              personalInfo?.username ||
              "—"}
          </h2>

          <p className="pi-hero-email">
            {personalInfo?.email ?? "—"}
          </p>

          {personalInfo?.phone_number && (
            <p className="pi-hero-phone">
              {personalInfo.phone_number}
            </p>
          )}

          <span className="pi-role-pill">
            {personalInfo?.role ?? "user"}
          </span>
        </div>

        <div
          className="pi-hero-deco"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Profile Details */}
      <div className="pi-section-block">
        <div className="pi-section-label">
          <span className="pi-section-label-dot" />
          Profile Details
        </div>

        <div className="pi-fields">
          {fields.map(
            ({
              label,
              key,
              icon,
              editable,
              format,
            }) => {
              const rawValue =
                personalInfo?.[key];

              const displayValue = format
                ? format(rawValue)
                : rawValue || null;

              return (
                <div
                  className="pi-field"
                  key={key}
                >
                  <span className="pi-field-icon">
                    {icon}
                  </span>

                  <div className="pi-field-body">
                    <span className="pi-field-label">
                      {label}
                    </span>

                    {edit && editable ? (
                      <input
                        className="pi-field-input"
                        type={
                          key === "email"
                            ? "email"
                            : key === "phone_number"
                              ? "tel"
                              : "text"
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                        value={
                          updatedata[key] ?? ""
                        }
                        onChange={(e) =>
                          setUpdatedata(
                            (prev) => ({
                              ...prev,
                              [key]:
                                e.target.value,
                            })
                          )
                        }
                      />
                    ) : (
                      <span
                        className={`pi-field-value${
                          !displayValue
                            ? " pi-field-empty"
                            : ""
                        }`}
                      >
                        {displayValue ??
                          (key ===
                          "created_at"
                            ? "—"
                            : "Not set")}
                      </span>
                    )}
                  </div>

                  {editable && !edit && (
                    <span className="pi-field-editable-hint">
                      editable
                    </span>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="pi-actions">
        <button
          className="pi-btn-primary"
          onClick={handleEdit}
        >
          <span>{edit ? "💾" : "✏"}</span>

          {edit
            ? "Save Changes"
            : "Edit Profile"}
        </button>

        <button
          className="pi-btn-ghost"
          disabled
          title="Available in V2"
        >
          Upload Photo
        </button>

        {edit && (
          <button
            className="pi-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}