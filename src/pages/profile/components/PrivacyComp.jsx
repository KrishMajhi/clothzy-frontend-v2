import { useState } from "react";
// import { useAuth } from "../../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/PrivacyComp.css";

export default function PrivacyComp() {
  const { user, updateCurrentUser } = useAuth();

  const prefs = user?.preferences || {};

  const [marketingEmails,   setMarketingEmails]   = useState(prefs.marketing_emails   ?? true);
  const [smsNotifications,  setSmsNotifications]  = useState(prefs.sms_notifications  ?? true);

  const handleSave = async () => {
    try {
      await updateCurrentUser({
        preferences: {
          marketing_emails:  marketingEmails,
          sms_notifications: smsNotifications,
        },
      });
      alert("Preferences updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update preferences");
    }
  };

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">ACCOUNT SETTINGS</div>
        <h1 className="profilepage-title">Privacy & Data</h1>
        <p className="profilepage-sub">Control how your data is used</p>
      </div>

      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Data Preferences</div>
        </div>
        <div className="detail-card" style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="checkbox"
              id="marketing-emails"
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
            />
            <label htmlFor="marketing-emails" style={{ marginLeft: "8px", fontSize: "12px" }}>
              Receive marketing emails
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="sms-notifications"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
            <label htmlFor="sms-notifications" style={{ marginLeft: "8px", fontSize: "12px" }}>
              Receive SMS notifications
            </label>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn primary" onClick={handleSave}>
            💾 SAVE PREFERENCES
          </button>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn danger">DELETE ACCOUNT</button>
      </div>
    </div>
  );
}
