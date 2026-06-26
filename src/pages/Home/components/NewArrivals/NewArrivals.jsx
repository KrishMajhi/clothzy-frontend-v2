import { useRef } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { NEW_ARRIVALS } from '../products';
import './NewArrivals.css';

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

function NewArrivals() {
  const trackRef = useRef(null);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const handleMouseDown = (e) => {
    const track = trackRef.current;
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - track.offsetLeft;
    dragState.current.scrollLeft = track.scrollLeft;
  };

  const handleMouseUp = () => {
    dragState.current.isDown = false;
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const track = trackRef.current;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.4;
    track.scrollLeft = dragState.current.scrollLeft - walk;
  };

  return (
    <section className="clzv3-new-arrivals">
      <div className="clzv3-new-arrivals-head">
        <div className="clzv3-rv">
          <p className="clzv3-eyebrow">Fresh Picks</p>
          <h2 className="clzv3-sec-h">New <em>Arrivals</em></h2>
        </div>
        <a href="#" className="clzv3-btn-all clzv3-rv clzv3-d2">
          View All <ArrowIcon />
        </a>
      </div>

      <div className="clzv3-carousel-outer">
        <div
          className="clzv3-carousel-track"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {NEW_ARRIVALS.map((product) => (
            <ProductCard key={product.id} product={product} variant="carousel" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
