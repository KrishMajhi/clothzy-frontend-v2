import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./css/SecurityComp.css";

const FEATURES = [
  {
    icon: "📱",
    title: "Two-Factor Auth",
    desc: "Extra layer of security via OTP.",
    badge: "V3",
  },
  {
    icon: "📋",
    title: "Active Sessions",
    desc: "See where your account is logged in.",
    badge: "V3",
  },
];

const TIPS = [
  "Use a password that's at least 12 characters.",
  "Mix letters, numbers, and symbols.",
  "Never reuse passwords across websites.",
  "Enable 2FA when it becomes available.",
];

export default function SecurityComp() {
  // NEW
  const { changePassword } = useAuth();

  const [pwOpen, setPwOpen] = useState(false);

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm: "",
  });

  const [saving, setSaving] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = (() => {
    const p = form.new_password;

    if (!p) return 0;

    let s = 0;

    if (p.length >= 8) s++;
    if (p.length >= 12) s++;

    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;

    if (/\d/.test(p)) s++;

    if (/[^A-Za-z0-9]/.test(p)) s++;

    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][
    strength
  ];

  const strengthColor = [
    "",
    "#e57373",
    "#ffb74d",
    "#fff176",
    "#81c784",
    "#4db6ac",
  ][strength];

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!form.old_password || !form.new_password || !form.confirm) {
      setError("All fields are required.");
      return;
    }

    if (form.new_password !== form.confirm) {
      setError("New passwords don't match.");
      return;
    }

    if (form.new_password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setSaving(true);

      // REAL API CALL
      await changePassword({
        old_password: form.old_password,
        new_password: form.new_password,
      });

      setSuccess(true);

      setForm({
        old_password: "",
        new_password: "",
        confirm: "",
      });

      setTimeout(() => {
        setPwOpen(false);
        setSuccess(false);
      }, 1800);
    } catch (err) {
      setError(err?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPwOpen(false);

    setForm({
      old_password: "",
      new_password: "",
      confirm: "",
    });

    setError("");
    setSuccess(false);
  };

  return (
    <div className="sec-root">
      <div className="sec-heading">
        <span className="sec-heading-tag">Safety</span>

        <h1 className="sec-title">Security</h1>

        <p className="sec-desc">
          Keep your Clothzy account safe and protected.
        </p>
      </div>

      <div className="sec-status-banner">
        <span className="sec-status-dot" />

        <p className="sec-status-text">
          Your account is protected by a secure password. Advanced options are
          rolling out soon.
        </p>
      </div>

      {/* Change Password */}
      <div className={`sec-pw-card ${pwOpen ? "sec-pw-card--open" : ""}`}>
        <div className="sec-pw-header">
          <span className="sec-pw-header-icon">🔑</span>

          <div className="sec-pw-header-body">
            <h4 className="sec-pw-header-title">Change Password</h4>

            <p className="sec-pw-header-desc">
              Update your account password anytime.
            </p>
          </div>

          <button
            className={`sec-pw-toggle ${pwOpen ? "sec-pw-toggle--open" : ""}`}
            onClick={() => (pwOpen ? handleClose() : setPwOpen(true))}
          >
            {pwOpen ? "✕" : "Change"}
          </button>
        </div>

        <div className="sec-pw-body">
          <div className="sec-pw-inner">
            {success ? (
              <div className="sec-pw-success">
                <span className="sec-pw-success-icon">✓</span>

                <p>Password updated successfully!</p>
              </div>
            ) : (
              <>
                <div className="sec-pw-fields">
                  <div className="sec-pw-field">
                    <label className="sec-pw-label">Current Password</label>

                    <div className="sec-pw-input-wrap">
                      <input
                        className="sec-pw-input"
                        type={showOld ? "text" : "password"}
                        name="old_password"
                        placeholder="Enter current password"
                        value={form.old_password}
                        onChange={handleChange}
                        autoComplete="current-password"
                      />

                      <button
                        className="sec-pw-eye"
                        onClick={() => setShowOld((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showOld ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>

                  <div className="sec-pw-field">
                    <label className="sec-pw-label">New Password</label>

                    <div className="sec-pw-input-wrap">
                      <input
                        className="sec-pw-input"
                        type={showNew ? "text" : "password"}
                        name="new_password"
                        placeholder="Min. 8 characters"
                        value={form.new_password}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />

                      <button
                        className="sec-pw-eye"
                        onClick={() => setShowNew((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showNew ? "🙈" : "👁"}
                      </button>
                    </div>

                    {form.new_password && (
                      <div className="sec-pw-strength">
                        <div className="sec-pw-strength-bar">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span
                              key={n}
                              className="sec-pw-strength-seg"
                              style={{
                                background:
                                  n <= strength
                                    ? strengthColor
                                    : "rgba(255,255,255,.1)",
                              }}
                            />
                          ))}
                        </div>

                        <span
                          className="sec-pw-strength-label"
                          style={{
                            color: strengthColor,
                          }}
                        >
                          {strengthLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="sec-pw-field">
                    <label className="sec-pw-label">Confirm New Password</label>

                    <div className="sec-pw-input-wrap">
                      <input
                        className="sec-pw-input"
                        type={showConfirm ? "text" : "password"}
                        name="confirm"
                        placeholder="Repeat new password"
                        value={form.confirm}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />

                      <button
                        className="sec-pw-eye"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showConfirm ? "🙈" : "👁"}
                      </button>

                      {form.confirm && (
                        <span
                          className="sec-pw-match-icon"
                          style={{
                            color:
                              form.new_password === form.confirm
                                ? "#81c784"
                                : "#e57373",
                          }}
                        >
                          {form.new_password === form.confirm ? "✓" : "✗"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {error && <p className="sec-pw-error">⚠ {error}</p>}

                <div className="sec-pw-actions">
                  <button
                    className="sec-pw-submit"
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Password"}
                  </button>

                  <button className="sec-pw-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Future Features */}
      <div className="sec-features">
        {FEATURES.map((f, i) => (
          <div
            className="sec-feature-card"
            key={f.title}
            style={{
              animationDelay: `${i * 80}ms`,
            }}
          >
            <span className="sec-feature-icon">{f.icon}</span>

            <div className="sec-feature-body">
              <h4 className="sec-feature-title">{f.title}</h4>

              <p className="sec-feature-desc">{f.desc}</p>
            </div>

            <span className="sec-feature-badge">Coming in {f.badge}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="sec-tips">
        <p className="sec-tips-label">Security tips</p>

        <div className="sec-tips-list">
          {TIPS.map((tip, i) => (
            <div
              className="sec-tip"
              key={i}
              style={{
                animationDelay: `${i * 60}ms`,
              }}
            >
              <span className="sec-tip-bullet">◆</span>

              <span className="sec-tip-text">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
