import { useState } from "react";
import Field from "./Field";

const formatCardNum = (v) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
const formatExp = (v) => {
  const c = v.replace(/\D/g, "").slice(0, 4);
  return c.length >= 3 ? c.slice(0, 2) + " / " + c.slice(2) : c;
};
const cardDisplay = (v) => {
  const c = v.replace(/\s/g, "");
  let d = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) d += " ";
    d += i < c.length ? c[i] : "•";
  }
  return d;
};

const CardPreview = ({ card }) => (
  <div className="co-card-preview-wrap">
    <div className="co-card-preview">
      <div className="co-card-shimmer" />
      <div className="co-card-logo">CLOTHZY</div>
      <div className="co-card-chip" />
      <div className="co-card-number">{cardDisplay(card.number)}</div>
      <div className="co-card-bottom">
        <div>
          <div className="co-card-label-sm">Card Holder</div>
          <div className="co-card-val-sm">
            {card.name.toUpperCase() || "FULL NAME"}
          </div>
        </div>
        <div>
          <div className="co-card-label-sm">Expires</div>
          <div className="co-card-val-sm">{card.expiry || "MM / YY"}</div>
        </div>
        <div className="co-card-brand">
          <div className="co-card-circle co-card-circle--1" />
          <div className="co-card-circle co-card-circle--2" />
        </div>
      </div>
    </div>
  </div>
);

const PAY_METHODS = [
  { id: "card", icon: "💳", label: "Credit / Debit" },
  { id: "upi", icon: "📱", label: "UPI" },
  { id: "cod", icon: "💵", label: "Cash on Delivery" },
];

const UPI_APPS = [
  { icon: "🟢", name: "PhonePe" },
  { icon: "🔵", name: "GPay" },
  { icon: "🟣", name: "Paytm" },
  { icon: "🟠", name: "BHIM" },
];

const PaymentSection = ({ payMethod, onPayMethodChange }) => {
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState(null);

  return (
    <div className="co-card">
      <div className="co-section-head">
        <div className="co-section-num">3</div>
        <h2 className="co-section-title">Payment</h2>
      </div>

      <div className="co-pay-tabs">
        {PAY_METHODS.map((m) => (
          <button
            key={m.id}
            className={`co-pay-tab${payMethod === m.id ? " co-pay-tab--active" : ""}`}
            onClick={() => onPayMethodChange(m.id)}
          >
            <span className="co-pay-tab-icon">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {payMethod === "card" && (
        <div className="co-pay-panel">
          <CardPreview card={card} />
          <div className="co-row">
            <Field
              label="Name on Card"
              placeholder="Arjun Sharma"
              value={card.name}
              onChange={(v) => setCard((p) => ({ ...p, name: v }))}
            />
          </div>
          <div className="co-row">
            <Field
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={(v) =>
                setCard((p) => ({ ...p, number: formatCardNum(v) }))
              }
              maxLength={19}
            />
          </div>
          <div className="co-row co-row--2">
            <Field
              label="Expiry Date"
              placeholder="MM / YY"
              value={card.expiry}
              onChange={(v) => setCard((p) => ({ ...p, expiry: formatExp(v) }))}
              maxLength={7}
            />
            <Field
              label="CVV"
              type="password"
              placeholder="•••"
              value={card.cvv}
              onChange={(v) =>
                setCard((p) => ({
                  ...p,
                  cvv: v.replace(/\D/g, "").slice(0, 4),
                }))
              }
              maxLength={4}
            />
          </div>
          <div className="co-accepted-cards">
            <span className="co-accepted-label">Accepted:</span>
            {["Visa", "Mastercard", "RuPay", "Amex"].map((c) => (
              <span key={c} className="co-card-pill">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {payMethod === "upi" && (
        <div className="co-pay-panel">
          <div className="co-row">
            <div className="co-field-group">
              <label className="co-field-label">UPI ID</label>
              <input
                className="co-field-input"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          </div>
          <p className="co-field-label" style={{ margin: "16px 0 10px" }}>
            Or pay with
          </p>
          <div className="co-upi-apps">
            {UPI_APPS.map((a) => (
              <button
                key={a.name}
                className={`co-upi-btn${upiApp === a.name ? " co-upi-btn--active" : ""}`}
                onClick={() => setUpiApp(a.name)}
              >
                <span>{a.icon}</span>
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {payMethod === "cod" && (
        <div className="co-cod-notice">
          <span className="co-cod-icon">💵</span>
          <div>
            <div className="co-cod-title">Cash on Delivery Available</div>
            <div className="co-cod-desc">
              Pay in cash when your order arrives. A ₹49 handling fee applies.
              Our delivery partner will collect the exact amount upon delivery.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
