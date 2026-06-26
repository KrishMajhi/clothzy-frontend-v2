import './Marquee.css';

const MARQUEE_ITEMS = [
  'New Arrivals',
  'Free Shipping ₹999+',
  'Men · Women · Kids',
  'Easy Returns 7 Days',
  'Festive Collection Live',
  'Sustainable Fabrics',
];

function MarqueeRun() {
  return (
    <>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item}>
          {item}
          <span className="clzv3-marquee-accent"> ✦ </span>
        </span>
      ))}
    </>
  );
}

function Marquee() {
  return (
    <div className="clzv3-marquee">
      <div className="clzv3-marquee-track">
        <MarqueeRun />
        <MarqueeRun />
      </div>
    </div>
  );
}

export default Marquee;
