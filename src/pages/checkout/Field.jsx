const Field = ({ label, type = "text", placeholder, value, onChange, error, maxLength, showCheck }) => (
  <div className="co-field-group">
    <label className="co-field-label">{label}</label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        className={`co-field-input${error ? " co-field-input--err" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        maxLength={maxLength}
      />
      {showCheck && <span className="co-field-check">✓</span>}
    </div>
  </div>
);
export default Field;
