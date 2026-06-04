import React, { useState } from "react";

const PromoCode = ({ onApply }) => {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    const code = input.trim().toUpperCase();
    if (code === "CLOTHZY20") {
      setApplied(true);
      onApply(true);
    } else if (code) {
      onApply(false);
    }
  };

  return (
    <div className="promo-section">
      <label className="promo-label">Promo Code</label>
      <div className="promo-input">
        <input
          type="text"
          placeholder="e.g. CLOTHZY20"
          id="promo-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          disabled={applied}
        />
        <button
          onClick={handleApply}
          disabled={applied}
          style={{ opacity: applied ? "0.4" : "1", pointerEvents: applied ? "none" : "auto" }}
        >
          Apply
        </button>
      </div>
      {applied && (
        <div className="promo-success" id="promo-success">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" fill="#2a7a5a" />
            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          CLOTHZY20 applied — 20% off!
        </div>
      )}
    </div>
  );
};

export default PromoCode;
