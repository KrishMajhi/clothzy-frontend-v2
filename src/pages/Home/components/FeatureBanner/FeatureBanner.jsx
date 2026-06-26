import './FeatureBanner.css';

function FeatureBanner() {
  return (
    <div className="clzv3-feature-banner clzv3-rv">
      <div className="clzv3-fb-bg">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop"
          alt="Exclusive Offers"
        />
      </div>
      <div className="clzv3-fb-overlay" />
      <div className="clzv3-fb-content">
        <p className="clzv3-fb-eyebrow">Only on Best Sellers</p>
        <h2 className="clzv3-fb-heading">
          Exclusive Offers
          <br />
          <em>For You</em>
        </h2>
        <p className="clzv3-fb-text">
          Up to 40% off on our most-loved pieces — hand-picked styles in limited quantities. Don't miss out.
        </p>
        <a href="#" className="clzv3-btn-outline">Check Now</a>
      </div>
      <div className="clzv3-fb-ghost-text">SALE</div>
    </div>
  );
}

export default FeatureBanner;
