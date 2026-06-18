import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../css/SecurityComp.css";

const TIPS = [
  "Use a password that's at least 12 characters.",
  "Mix letters, numbers, and symbols.",
  "Never reuse passwords across websites.",
  "Enable 2FA when it becomes available.",
];

const LOGIN_HISTORY = [
  { device: "💻 Chrome · Windows 11", location: "Surat, Gujarat",     ip: "103.47.xxx.xxx", time: "Today, 10:24 AM",  status: "success" },
  { device: "📱 Safari · iPhone 15",  location: "Surat, Gujarat",     ip: "103.47.xxx.xxx", time: "Jan 20, 9:11 PM",  status: "success" },
  { device: "💻 Firefox · macOS",     location: "Ahmedabad, Gujarat",  ip: "59.92.xxx.xxx",  time: "Jan 18, 3:45 PM",  status: "warning" },
  { device: "📱 Chrome · Android",    location: "Surat, Gujarat",     ip: "103.47.xxx.xxx", time: "Jan 16, 8:02 AM",  status: "success" },
  { device: "💻 Chrome · Windows 11", location: "Surat, Gujarat",     ip: "103.47.xxx.xxx", time: "Jan 14, 11:30 AM", status: "success" },
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
  const strengthColor = ["", "#e57373", "#ffb74d", "#ffd54f", "#81c784", "#4db6ac"][strength];

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError(""); setSuccess(false);
  };

  const handleSubmit = async () => {
    if (!form.old_password || !form.new_password || !form.confirm) { setError("All fields are required."); return; }
    if (form.new_password !== form.confirm) { setError("New passwords don't match."); return; }
    if (form.new_password.length < 8) { setError("Password must be at least 8 characters."); return; }
    try {
      setSaving(true);
      await changePassword({ old_password: form.old_password, new_password: form.new_password });
      setSuccess(true);
      setForm({ old_password: "", new_password: "", confirm: "" });
      setTimeout(() => { setPwOpen(false); setSuccess(false); }, 1800);
    } catch (err) {
      setError(err?.message || "Failed to change password.");
    } finally { setSaving(false); }
  };

  const handleClose = () => {
    setPwOpen(false);
    setForm({ old_password: "", new_password: "", confirm: "" });
    setError(""); setSuccess(false);
  };

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Security</div>
        <h1 className="profilepage-title">Password & Authentication</h1>
        <p className="profilepage-sub">Keep your account safe and monitor access activity</p>
      </div>

      {/* ── Change Password ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Change Password</div>
          <button className="section-action" onClick={() => pwOpen ? handleClose() : setPwOpen(true)}>
            {pwOpen ? "✕ CANCEL" : "CHANGE"}
          </button>
        </div>

        {!pwOpen && (
          <div className="detail-grid">
            <div className="detail-card">
              <div className="detail-card-label">Password</div>
              <div className="detail-card-value">••••••••••••</div>
              <div className="detail-card-sub">Last changed 3 months ago</div>
            </div>
          </div>
        )}

        {pwOpen && (
          <div className="sec-pw-panel">
            {success ? (
              <div className="sec-pw-success">
                <span className="sec-pw-success-icon">✓</span>
                <p>Password updated successfully!</p>
              </div>
            ) : (
              <>
                <div className="profile-field">
                  <label className="profile-field-label">Current Password</label>
                  <div className="sec-input-wrap">
                    <input className="profile-field-input" type={showOld ? "text" : "password"} name="old_password" placeholder="Enter current password" value={form.old_password} onChange={handleChange} autoComplete="current-password" />
                    <button className="sec-eye" onClick={() => setShowOld(p => !p)} tabIndex={-1}>{showOld ? "🙈" : "👁"}</button>
                  </div>
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">New Password</label>
                  <div className="sec-input-wrap">
                    <input className="profile-field-input" type={showNew ? "text" : "password"} name="new_password" placeholder="Min. 8 characters" value={form.new_password} onChange={handleChange} autoComplete="new-password" />
                    <button className="sec-eye" onClick={() => setShowNew(p => !p)} tabIndex={-1}>{showNew ? "🙈" : "👁"}</button>
                  </div>
                  {form.new_password && (
                    <div className="sec-strength">
                      <div className="sec-strength-bar">
                        {[1,2,3,4,5].map(n => (
                          <span key={n} className="sec-strength-seg" style={{ background: n <= strength ? strengthColor : "var(--border)" }} />
                        ))}
                      </div>
                      <span className="sec-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-field-label">Confirm New Password</label>
                  <div className="sec-input-wrap">
                    <input className="profile-field-input" type={showConf ? "text" : "password"} name="confirm" placeholder="Repeat new password" value={form.confirm} onChange={handleChange} autoComplete="new-password" />
                    <button className="sec-eye" onClick={() => setShowConf(p => !p)} tabIndex={-1}>{showConf ? "🙈" : "👁"}</button>
                    {form.confirm && (
                      <span className="sec-match-icon" style={{ color: form.new_password === form.confirm ? "#81c784" : "#e57373" }}>
                        {form.new_password === form.confirm ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                </div>

                {error && <p className="sec-error">⚠ {error}</p>}

                <div className="profile-actions">
                  <button className="btn primary" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Updating..." : "UPDATE PASSWORD"}
                  </button>
                  <button className="btn" onClick={handleClose}>CANCEL</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── 2FA ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Two-Factor Authentication</div>
        </div>
        <div className="detail-grid three">
          <div className="detail-card">
            <div className="detail-card-label">Status</div>
            <div className="detail-card-value"><span className="badge confirmed">Enabled</span></div>
            <div className="detail-card-sub">Authenticator app active</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Backup Codes</div>
            <div className="detail-card-value">8 remaining</div>
            <div className="detail-card-sub">Of 10 total generated</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">Recovery Email</div>
            <div className="detail-card-value" style={{ fontSize: "12px" }}>j***@gmail.com</div>
            <div className="detail-card-sub">Verified</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn">VIEW BACKUP CODES</button>
          <button className="btn">CHANGE 2FA METHOD</button>
        </div>
      </div>

      {/* ── Login History ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Recent Login Activity</div>
        </div>
        <div className="login-table-wrap">
          <table className="login-table">
            <thead>
              <tr>
                <th>Device / Browser</th>
                <th>Location</th>
                <th>IP Address</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {LOGIN_HISTORY.map((row, i) => (
                <tr key={i}>
                  <td>{row.device}</td>
                  <td>{row.location}</td>
                  <td>{row.ip}</td>
                  <td>{row.time}</td>
                  <td>
                    <span className={`login-status ${row.status}`}>
                      {row.status === "success" ? "✓ Success" : "⚠ New location"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Active Sessions ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Active Sessions</div>
        </div>
        <div className="detail-grid">
          <div className="detail-card">
            <div className="detail-card-label">💻 Current Session</div>
            <div className="detail-card-value">Chrome · Windows 11</div>
            <div className="detail-card-sub">Surat, Gujarat · Started 10:24 AM today</div>
          </div>
          <div className="detail-card">
            <div className="detail-card-label">📱 Mobile App</div>
            <div className="detail-card-value">iPhone 15 Pro</div>
            <div className="detail-card-sub">Surat, Gujarat · Last active 2 days ago</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn danger">SIGN OUT ALL OTHER DEVICES</button>
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
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data & Account ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Your Data</div>
        </div>
        <div className="info-bar">
          <span>Download a copy of all your Clothzy data — orders, addresses, preferences and account info.</span>
        </div>
        <div className="profile-actions">
          <button className="btn" onClick={() => alert("Preparing your data export…")}>
            ⬇ DOWNLOAD MY DATA
          </button>
        </div>
      </div>

      {/* ── Danger Zone ── */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Danger Zone</div>
        </div>
        <div className="danger-zone">
          <div className="danger-title">Delete Account</div>
          <div className="danger-sub">
            Permanently delete your Clothzy account, order history, saved addresses and all personal data.
            This action cannot be undone and you will lose all wishlist items and accumulated rewards.
          </div>
          <div className="danger-actions">
            <button className="btn danger" onClick={() => {
              if (window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) {
                alert("Account deletion request submitted.");
              }
            }}>
              DELETE MY ACCOUNT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
