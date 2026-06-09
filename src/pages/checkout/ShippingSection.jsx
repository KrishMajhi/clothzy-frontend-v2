import Field from "./Field";

const STATES = ["Andhra Pradesh","Delhi","Gujarat","Karnataka","Maharashtra","Rajasthan","Tamil Nadu","Uttar Pradesh","West Bengal"];

const DeliveryOptions = ({ method, onChange, config }) => {
  const opts = [
    { id: "standard", name: "Standard Shipping",   days: "5–7 business days",                 charge: 0 },
    { id: "express",  name: "Express Shipping",     days: "2–3 business days",                 charge: config?.express_shipping_charge  ?? 99  },
    { id: "same_day", name: "⚡ Same Day Delivery", days: "Order before 2 PM · Select cities", charge: config?.same_day_shipping_charge ?? 249 },
  ];
  return (
    <div className="co-ship-options">
      {opts.map(o => (
        <div key={o.id} className={`co-ship-opt${method === o.id ? " co-ship-opt--sel" : ""}`} onClick={() => onChange(o.id)}>
          <div className="co-ship-radio"><div className="co-ship-radio-dot" /></div>
          <div className="co-ship-info">
            <div className="co-ship-name">{o.name}</div>
            <div className="co-ship-days">{o.days}</div>
          </div>
          <div className={`co-ship-price${o.charge === 0 ? " co-ship-price--free" : ""}`}>
            {o.charge === 0 ? "Free" : `₹${o.charge}`}
          </div>
        </div>
      ))}
    </div>
  );
};

const ShippingSection = ({ form, setField, errors, shippingMethod, onShippingChange, config }) => (
  <div className="co-card">
    <div className="co-section-head">
      <div className="co-section-num">2</div>
      <h2 className="co-section-title">Shipping Address</h2>
    </div>
    <div className="co-row">
      <Field label="Address Line 1" placeholder="Flat 4B, Sunrise Apartments"
        value={form.addr1} onChange={v => setField("addr1", v)} error={errors.addr1} />
    </div>
    <div className="co-row">
      <Field label="Address Line 2 (Optional)" placeholder="Near City Mall"
        value={form.addr2} onChange={v => setField("addr2", v)} />
    </div>
    <div className="co-row co-row--2">
      <Field label="City" placeholder="Surat" value={form.city} onChange={v => setField("city", v)} error={errors.city} />
      <div className="co-field-group">
        <label className="co-field-label">State</label>
        <select className="co-field-input" value={form.state} onChange={e => setField("state", e.target.value)}>
          <option value="" disabled>Select state</option>
          {STATES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
    <div className="co-row co-row--2">
      <Field label="PIN Code" placeholder="395007"
        value={form.pin} onChange={v => setField("pin", v.replace(/\D/g, "").slice(0, 6))} error={errors.pin} />
      <div className="co-field-group">
        <label className="co-field-label">Country</label>
        <select className="co-field-input" value={form.country} onChange={e => setField("country", e.target.value)}>
          {["India","United States","United Kingdom","UAE"].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
    <div className="co-delivery-section">
      <p className="co-field-label" style={{ marginBottom: "12px" }}>Delivery Method</p>
      <DeliveryOptions method={shippingMethod} onChange={onShippingChange} config={config} />
    </div>
  </div>
);

export default ShippingSection;
