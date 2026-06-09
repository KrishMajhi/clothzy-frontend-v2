const CheckoutSteps = ({ isBuyNow, step }) => (
  <div className="co-steps-bar">
    <div className="co-steps">
      <div className={`co-step ${isBuyNow ? "co-step--active" : "co-step--done"}`}>
        <div className="co-step-num">{isBuyNow ? "1" : "✓"}</div>
        <span className="co-step-label">{isBuyNow ? "Product" : "Cart"}</span>
      </div>
      <div className={`co-step ${step === "checkout" ? "co-step--active" : "co-step--done"}`}>
        <div className="co-step-num">{step === "checkout" ? "2" : "✓"}</div>
        <span className="co-step-label">Checkout</span>
      </div>
      <div className={`co-step ${step === "confirmed" ? "co-step--active" : ""}`}>
        <div className="co-step-num">3</div>
        <span className="co-step-label">Confirmation</span>
      </div>
    </div>
  </div>
);
export default CheckoutSteps;
