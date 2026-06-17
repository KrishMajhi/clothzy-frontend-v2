import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/SecurityComp.css";

const FEATURES = [
  { icon: "📱", title: "Two-Factor Auth",  desc: "Extra layer of security via OTP.",            badge: "V3" },
  { icon: "📋", title: "Active Sessions",  desc: "See where your account is logged in.",        badge: "V3" },
];

const TIPS = [
  "Use a password that's at least 12 characters.",
  "Mix letters, numbers, and symbols.",
  "Never reuse passwords across websites.",
  "Enable 2FA when it becomes available.",
];

export default function SecurityComp() {
  const { changePassword } = useAuth();

  const [pwOpen,   setPwOpen]   = useState(false);
  const [form,     setForm]     = useState({ old_password: "", new_password: "", confirm: "" });
  const [saving,   setSaving]   = useState(false);
  const [showOld,  setShowOld]  = useState(false);
  const [showNew,  setShowNew]  = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  // ── password strength ──
  const strength = (() => {
    const p = form.new_password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)  s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p))   s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "#e57373", "#ffb74d", "#fff176", "#81c784", "#4db6ac"][strength];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      await changePassword({ old_password: form.old_password, new_password: form.new_password });
      setSuccess(true);
      setForm({ old_password: "", new_password: "", confirm: "" });
      setTimeout(() => { setPwOpen(false); setSuccess(false); }, 1800);
    } catch (err) {
      setError(err?.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setPwOpen(false);
    setForm({ old_password: "", new_password: "", confirm: "" });
    setError("");
    setSuccess(false);
  };

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">SECURITY</div>
        <h1 className="page-title">Password & Authentication</h1>
        <p className="page-sub">Keep your account secure</p>
      </div>

      {/* ── Change Password ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Password</div>
          <div
            className="section-action"
            onClick={() => (pwOpen ? handleClose() : setPwOpen(true))}
          >
            {pwOpen ? "✕ CANCEL" : "CHANGE PASSWORD"}
          </div>
        </div>

        {pwOpen && (
          <div className="sec-pw-panel">
            {success ? (
              <div className="sec-pw-success">
                <span className="sec-pw-success-icon">✓</span>
                <p>Password updated successfully!</p>
              </div>
            ) : (
              <>
                {/* Current Password */}
                <div className="profile-field">
                  <label className="profile-field-label">Current Password</label>
                  <div className="sec-input-wrap">
                    <input
                      className="profile-field-input"
                      type={showOld ? "text" : "password"}
                      name="old_password"
                      placeholder="Enter current password"
                      value={form.old_password}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                    <button className="sec-eye" onClick={() => setShowOld((p) => !p)} tabIndex={-1}>
                      {showOld ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="profile-field">
                  <label className="profile-field-label">New Password</label>
                  <div className="sec-input-wrap">
                    <input
                      className="profile-field-input"
                      type={showNew ? "text" : "password"}
                      name="new_password"
                      placeholder="Min. 8 characters"
                      value={form.new_password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button className="sec-eye" onClick={() => setShowNew((p) => !p)} tabIndex={-1}>
                      {showNew ? "🙈" : "👁"}
                    </button>
                  </div>
                  {form.new_password && (
                    <div className="sec-strength">
                      <div className="sec-strength-bar">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span
                            key={n}
                            className="sec-strength-seg"
                            style={{ background: n <= strength ? strengthColor : "rgba(255,255,255,.1)" }}
                          />
                        ))}
                      </div>
                      <span className="sec-strength-label" style={{ color: strengthColor }}>
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="profile-field">
                  <label className="profile-field-label">Confirm New Password</label>
                  <div className="sec-input-wrap">
                    <input
                      className="profile-field-input"
                      type={showConf ? "text" : "password"}
                      name="confirm"
                      placeholder="Repeat new password"
                      value={form.confirm}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    <button className="sec-eye" onClick={() => setShowConf((p) => !p)} tabIndex={-1}>
                      {showConf ? "🙈" : "👁"}
                    </button>
                    {form.confirm && (
                      <span
                        className="sec-match-icon"
                        style={{ color: form.new_password === form.confirm ? "#81c784" : "#e57373" }}
                      >
                        {form.new_password === form.confirm ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                </div>

                {error && <p className="sec-error">⚠ {error}</p>}

                <div className="profile-actions">
                  <button className="btn primary" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Updating..." : "💾 UPDATE PASSWORD"}
                  </button>
                  <button className="btn" onClick={handleClose}>CANCEL</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Two-Factor Auth ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Two-Factor Authentication</div>
        </div>
        <div className="detail-grid">
          {FEATURES.map((f) => (
            <div className="detail-card" key={f.title}>
              <div className="detail-card-label">{f.icon} {f.title}</div>
              <div className="detail-card-value">
                <span className="badge pending">Coming {f.badge}</span>
              </div>
              <div className="detail-card-sub">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Security Tips ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Security Tips</div>
        </div>
        <div className="sec-tips-list">
          {TIPS.map((tip, i) => (
            <div className="sec-tip" key={i}>
              <span className="sec-tip-bullet">◆</span>
              <span className="sec-tip-text">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
