const CheckoutNav = ({ isBuyNow, onBack }) => (
  <nav className="co-nav">
    <div className="co-nav-logo">
      <div className="co-nav-mark">C</div>
      <div className="co-nav-wordmark">CLOTHZY</div>
    </div>
    <div className="co-nav-secure"><span>🔒</span> Secure Checkout</div>
    <button className="co-nav-back" onClick={onBack}>
      {isBuyNow ? "← Back to Product" : "← Back to Cart"}
    </button>
  </nav>
);
export default CheckoutNav;
