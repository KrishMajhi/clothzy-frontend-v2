import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "../css/AddressComp.css";

const EMPTY_ADDR = {
  type: "Home", icon: "🏠", name: "", phone: "",
  address_line_1: "", address_line_2: "", city: "", state: "", postal_code: "", country: "India",
};

const TYPE_OPTIONS = [
  { label: "Home",           icon: "🏠" },
  { label: "Office",         icon: "🏢" },
  { label: "Parent's Home",  icon: "👨‍👩‍👧" },
  { label: "Other",          icon: "📍" },
];

export default function AddressComp() {
  const { user, updateCurrentUser } = useAuth();

  // delivery_addresses: array  |  billing_address: object  |  billing_same: bool
  const deliveryAddresses  = user?.delivery_addresses  || [];
  const billingAddress     = user?.billing_address     || null;
  const billingSame        = user?.billing_same        ?? true;

  const [editingIdx,   setEditingIdx]   = useState(null); // null = closed, -1 = new
  const [editForm,     setEditForm]     = useState({});
  const [saving,       setSaving]       = useState(false);

  const [editBilling,  setEditBilling]  = useState(false);
  const [billForm,     setBillForm]     = useState({});
  const [billSameState,setBillSameState]= useState(billingSame);

  // ── Delivery CRUD ──
  const openNew = () => { setEditForm({ ...EMPTY_ADDR }); setEditingIdx(-1); };
  const openEdit = (i) => { setEditForm({ ...deliveryAddresses[i] }); setEditingIdx(i); };
  const closeEdit = () => { setEditingIdx(null); setEditForm({}); };

  const handleSaveDelivery = async () => {
    try {
      setSaving(true);
      const updated = [...deliveryAddresses];
      if (editingIdx === -1) {
        updated.push({ ...editForm, id: Date.now().toString(), is_default: updated.length === 0 });
      } else {
        updated[editingIdx] = { ...editForm };
      }
      await updateCurrentUser({ delivery_addresses: updated });
      closeEdit();
    } catch (e) { console.error(e); alert("Failed to save address"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (i) => {
    if (!window.confirm("Delete this address?")) return;
    const updated = deliveryAddresses.filter((_, idx) => idx !== i);
    await updateCurrentUser({ delivery_addresses: updated });
  };

  const handleSetDefault = async (i) => {
    const updated = deliveryAddresses.map((a, idx) => ({ ...a, is_default: idx === i }));
    await updateCurrentUser({ delivery_addresses: updated });
  };

  // ── Billing ──
  const openBilling = () => {
    setBillForm(billingAddress || {});
    setBillSameState(billingSame);
    setEditBilling(true);
  };

  const handleSaveBilling = async () => {
    try {
      setSaving(true);
      await updateCurrentUser({ billing_same: billSameState, billing_address: billSameState ? null : billForm });
      setEditBilling(false);
    } catch (e) { alert("Failed to save billing address"); }
    finally { setSaving(false); }
  };

  const setF = (key) => (e) => setEditForm(p => ({ ...p, [key]: e.target.value }));
  const setBF = (key) => (e) => setBillForm(p => ({ ...p, [key]: e.target.value }));

  const defaultAddr = deliveryAddresses.find(a => a.is_default) || deliveryAddresses[0];

  return (
    <div className="view">
      <div className="profilepage-header">
        <div className="profilepage-eyebrow">Account Settings</div>
        <h1 className="profilepage-title">Saved Addresses</h1>
        <p className="profilepage-sub">Manage your delivery and billing addresses</p>
      </div>

      {/* ═══ DELIVERY ADDRESSES ═══ */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Delivery Addresses</div>
          <button className="section-action" onClick={openNew}>+ ADD NEW</button>
        </div>

        {deliveryAddresses.length === 0 && editingIdx !== -1 && (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div className="empty-title">No delivery addresses saved</div>
            <div className="empty-sub">Add an address to speed up checkout.</div>
          </div>
        )}

        <div className="address-grid">
          {deliveryAddresses.map((addr, i) => (
            <div key={addr.id || i} className={`addr-card ${addr.is_default ? "is-default" : ""}`}>
              {addr.is_default && (
                <div className="addr-default-badge">
                  <span className="badge default-badge">Default</span>
                </div>
              )}
              <div className="addr-type">
                <span className="addr-type-icon">{addr.icon || "📍"}</span>
                <span className="addr-type-label">{addr.type || "Address"}</span>
              </div>
              <div className="addr-name">{addr.name}</div>
              <div className="addr-line">{addr.address_line_1}</div>
              {addr.address_line_2 && <div className="addr-line">{addr.address_line_2}</div>}
              <div className="addr-line">{[addr.city, addr.state].filter(Boolean).join(", ")} — {addr.postal_code}</div>
              <div className="addr-line">{addr.country}</div>
              {addr.phone && <div className="addr-phone">{addr.phone}</div>}
              <div className="addr-actions">
                <button className="btn sm" onClick={() => openEdit(i)}>✏️ EDIT</button>
                {!addr.is_default && (
                  <button className="btn sm" onClick={() => handleSetDefault(i)}>SET DEFAULT</button>
                )}
                {!addr.is_default && (
                  <button className="btn sm danger" onClick={() => handleDelete(i)}>DELETE</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Add / Edit Form ── */}
        {editingIdx !== null && (
          <div className="addr-form-wrap">
            <div className="section-header" style={{ marginTop: "24px" }}>
              <div className="section-title" style={{ fontSize: "14px" }}>
                {editingIdx === -1 ? "New Address" : "Edit Address"}
              </div>
            </div>

            {/* Type picker */}
            <div className="addr-type-picker">
              {TYPE_OPTIONS.map(({ label, icon }) => (
                <button
                  key={label}
                  className={`addr-type-btn ${editForm.type === label ? "active" : ""}`}
                  onClick={() => setEditForm(p => ({ ...p, type: label, icon }))}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>

            <div className="profile-fields" style={{ marginTop: "16px" }}>
              {[
                { label: "Recipient Name", key: "name",           placeholder: "Full name" },
                { label: "Phone",          key: "phone",          placeholder: "+91 XXXXX XXXXX" },
                { label: "Address Line 1", key: "address_line_1", placeholder: "House / Flat / Building" },
                { label: "Address Line 2", key: "address_line_2", placeholder: "Street / Area (optional)" },
                { label: "City",           key: "city",           placeholder: "City" },
                { label: "State",          key: "state",          placeholder: "State" },
                { label: "Postal Code",    key: "postal_code",    placeholder: "PIN Code" },
                { label: "Country",        key: "country",        placeholder: "Country" },
              ].map(({ label, key, placeholder }) => (
                <div className="profile-field" key={key}>
                  <label className="profile-field-label">{label}</label>
                  <input className="profile-field-input" placeholder={placeholder} value={editForm[key] || ""} onChange={setF(key)} />
                </div>
              ))}
            </div>

            <div className="profile-actions">
              <button className="btn primary" onClick={handleSaveDelivery} disabled={saving}>
                {saving ? "Saving..." : "💾 SAVE ADDRESS"}
              </button>
              <button className="btn" onClick={closeEdit}>CANCEL</button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ BILLING ADDRESS ═══ */}
      <div className="section-block">
        <div className="section-header">
          <div className="section-title">Billing Address</div>
          <button className="section-action" onClick={openBilling}>✏️ EDIT</button>
        </div>

        {!editBilling && (
          <>
            {billingSame ? (
              <div className="detail-card" style={{ maxWidth: "420px" }}>
                <div className="detail-card-label">Same as default delivery address</div>
                {defaultAddr ? (
                  <div className="detail-card-value" style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.7 }}>
                    {defaultAddr.address_line_1}<br />
                    {defaultAddr.address_line_2 && <>{defaultAddr.address_line_2}<br /></>}
                    {defaultAddr.city}, {defaultAddr.state} — {defaultAddr.postal_code}<br />
                    {defaultAddr.country}
                  </div>
                ) : (
                  <div className="detail-card-sub">No delivery address set yet</div>
                )}
              </div>
            ) : billingAddress ? (
              <div className="detail-card" style={{ maxWidth: "420px" }}>
                <div className="detail-card-label">Billing Address</div>
                <div className="detail-card-value" style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.7 }}>
                  {billingAddress.address_line_1}<br />
                  {billingAddress.address_line_2 && <>{billingAddress.address_line_2}<br /></>}
                  {billingAddress.city}, {billingAddress.state} — {billingAddress.postal_code}<br />
                  {billingAddress.country}
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: "32px" }}>
                <div className="empty-sub">No billing address saved. Click Edit to add one.</div>
              </div>
            )}
          </>
        )}

        {editBilling && (
          <div style={{ marginTop: "8px" }}>
            <div className="toggle-list" style={{ marginBottom: "20px" }}>
              <div className="toggle-item">
                <div>
                  <div className="toggle-label">Same as default delivery address</div>
                  <div className="toggle-sub">Use my default delivery address for billing</div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={billSameState} onChange={e => setBillSameState(e.target.checked)} />
                  <span className="switch-slider" />
                </label>
              </div>
            </div>

            {!billSameState && (
              <div className="profile-fields">
                {[
                  { label: "Address Line 1", key: "address_line_1", placeholder: "House / Flat / Building" },
                  { label: "Address Line 2", key: "address_line_2", placeholder: "Street / Area (optional)" },
                  { label: "City",           key: "city",           placeholder: "City" },
                  { label: "State",          key: "state",          placeholder: "State" },
                  { label: "Postal Code",    key: "postal_code",    placeholder: "PIN Code" },
                  { label: "Country",        key: "country",        placeholder: "Country" },
                ].map(({ label, key, placeholder }) => (
                  <div className="profile-field" key={key}>
                    <label className="profile-field-label">{label}</label>
                    <input className="profile-field-input" placeholder={placeholder} value={billForm[key] || ""} onChange={setBF(key)} />
                  </div>
                ))}
              </div>
            )}

            <div className="profile-actions">
              <button className="btn primary" onClick={handleSaveBilling} disabled={saving}>
                {saving ? "Saving..." : "💾 SAVE BILLING"}
              </button>
              <button className="btn" onClick={() => setEditBilling(false)}>CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
