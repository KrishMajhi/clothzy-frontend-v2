import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from "../../../context/AuthContext";

import "./../css/AddressComp.css";

const ADDRESS_FIELDS = [
  { label: "Address Line 1", key: "address_line_1", placeholder: "House / Flat / Building" },
  { label: "Address Line 2", key: "address_line_2", placeholder: "Street / Area / Locality" },
  { label: "City",           key: "city",           placeholder: "City" },
  { label: "State",          key: "state",          placeholder: "State / Province" },
  { label: "Postal Code",    key: "postal_code",    placeholder: "PIN / ZIP" },
  { label: "Country",        key: "country",        placeholder: "Country" },
];

export default function AddressComp() {
  const { user, updateCurrentUser } = useAuth();

  const [edit,       setEdit]       = useState(false);
  const [updatedata, setUpdatedata] = useState({});
  const [saving,     setSaving]     = useState(false);

  // Real backend: user.address is a single object
  const address = user?.address;

  const hasAddress = ADDRESS_FIELDS.some((f) => address?.[f.key]);

  const handleEdit = async () => {
    if (!edit) {
      const seed = {};
      ADDRESS_FIELDS.forEach((f) => { seed[f.key] = address?.[f.key] || ""; });
      setUpdatedata(seed);
      setEdit(true);
      return;
    }
    try {
      setSaving(true);
      await updateCurrentUser({ address: updatedata });
      setEdit(false);
      setUpdatedata({});
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setUpdatedata({});
  };

  return (
    <div className="view">
      <div className="page-header">
        <div className="page-eyebrow">ACCOUNT SETTINGS</div>
        <h1 className="page-title">Saved Address</h1>
        <p className="page-sub">Manage your delivery address</p>
      </div>

      {/* Empty State */}
      {!hasAddress && !edit && (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <div className="empty-title">No address saved yet</div>
          <div className="empty-sub">Add your delivery address to speed up checkout.</div>
          <button className="btn primary" style={{ marginTop: "16px" }} onClick={handleEdit}>
            + ADD ADDRESS
          </button>
        </div>
      )}

      {/* Address Fields */}
      {(hasAddress || edit) && (
        <div className="section-block">
          <div className="section-header">
            <div className="section-title">Delivery Address</div>
            {!edit && (
              <div className="section-action" onClick={handleEdit}>
                ✏️ EDIT
              </div>
            )}
          </div>

          <div className="profile-fields">
            {ADDRESS_FIELDS.map(({ label, key, placeholder }) => (
              <div className="profile-field" key={key}>
                <label className="profile-field-label">{label}</label>
                {edit ? (
                  <input
                    type="text"
                    className="profile-field-input"
                    placeholder={placeholder}
                    value={updatedata[key] ?? ""}
                    onChange={(e) =>
                      setUpdatedata((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                  />
                ) : (
                  <div className={`profile-field-value${!address?.[key] ? " addr-empty" : ""}`}>
                    {address?.[key] || "Not set"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {edit && (
            <div className="profile-actions">
              <button className="btn primary" onClick={handleEdit} disabled={saving}>
                {saving ? "Saving..." : "💾 SAVE ADDRESS"}
              </button>
              <button className="btn" onClick={handleCancel}>CANCEL</button>
            </div>
          )}
        </div>
      )}

      {/* Map Placeholder */}
      <div className="addr-map-placeholder">
        <span>🗺</span>
        <p>Map preview coming in V2</p>
      </div>
    </div>
  );
}
