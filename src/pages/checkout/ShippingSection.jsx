import { useEffect } from "react";
import Field from "./Field";
import { useAuth } from "../../context/AuthContext";

const STATES = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Uttar Pradesh",
  "West Bengal",
];

const DeliveryOptions = ({ method, onChange, config }) => {
  const opts = [
    {
      id: "standard",
      name: "Standard Shipping",
      days: "5–7 business days",
      charge: 0,
    },
    {
      id: "express",
      name: "Express Shipping",
      days: "2–3 business days",
      charge: config?.express_shipping_charge ?? 99,
    },
    {
      id: "same_day",
      name: "⚡ Same Day Delivery",
      days: "Order before 2 PM · Select cities",
      charge: config?.same_day_shipping_charge ?? 249,
    },
  ];

  return (
    <div className="co-ship-options">
      {opts.map((o) => (
        <div
          key={o.id}
          className={`co-ship-opt${method === o.id ? " co-ship-opt--sel" : ""}`}
          onClick={() => onChange(o.id)}
        >
          <div className="co-ship-radio">
            <div className="co-ship-radio-dot" />
          </div>
          <div className="co-ship-info">
            <div className="co-ship-name">{o.name}</div>
            <div className="co-ship-days">{o.days}</div>
          </div>
          <div
            className={`co-ship-price${o.charge === 0 ? " co-ship-price--free" : ""}`}
          >
            {o.charge === 0 ? "Free" : `₹${o.charge}`}
          </div>
        </div>
      ))}
    </div>
  );
};

const ShippingSection = ({
  form,
  setField,
  errors,
  shippingMethod,
  onShippingChange,
  config,
}) => {
  const { user } = useAuth();
  const addr = user?.address ?? {};

  // Pre-fill shipping fields from user's saved address on mount.
  // Fields stay editable; submit logic falls back to saved values for empties.
  useEffect(() => {
    if (!addr || Object.keys(addr).length === 0) return;
    if (addr.address_line_1) setField("addr1",   addr.address_line_1);
    if (addr.address_line_2) setField("addr2",   addr.address_line_2);
    if (addr.city)           setField("city",    addr.city);
    if (addr.state)          setField("state",   addr.state);
    if (addr.postal_code)    setField("pin",     addr.postal_code);
    if (addr.country)        setField("country", addr.country);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="co-card">
      <div className="co-section-head">
        <div className="co-section-num">2</div>
        <h2 className="co-section-title">Shipping Address</h2>
      </div>

      <div className="co-row">
        <Field
          label="Address Line 1"
          placeholder={addr.address_line_1 || "House / Flat / Street"}
          value={form.addr1}
          onChange={(v) => setField("addr1", v)}
          error={errors.addr1}
        />
      </div>

      <div className="co-row">
        <Field
          label="Address Line 2 (Optional)"
          placeholder={addr.address_line_2 || "Landmark, Colony, etc."}
          value={form.addr2}
          onChange={(v) => setField("addr2", v)}
        />
      </div>

      <div className="co-row co-row--2">
        <Field
          label="City"
          placeholder={addr.city || "Mumbai"}
          value={form.city}
          onChange={(v) => setField("city", v)}
          error={errors.city}
        />
        <div className="co-field-group">
          <label className="co-field-label">State</label>
          <select
            className="co-field-input"
            value={form.state}
            onChange={(e) => setField("state", e.target.value)}
          >
            <option value="" disabled>
              {addr.state || "Select state"}
            </option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="co-row co-row--2">
        <Field
          label="PIN Code"
          placeholder={addr.postal_code || "400001"}
          value={form.pin}
          onChange={(v) => setField("pin", v.replace(/\D/g, "").slice(0, 6))}
          error={errors.pin}
        />
        <div className="co-field-group">
          <label className="co-field-label">Country</label>
          <select
            className="co-field-input"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
          >
            {["India", "United States", "United Kingdom", "UAE"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="co-delivery-section">
        <p className="co-field-label" style={{ marginBottom: "12px" }}>
          Delivery Method
        </p>
        <DeliveryOptions
          method={shippingMethod}
          onChange={onShippingChange}
          config={config}
        />
      </div>
    </div>
  );
};

export default ShippingSection;
