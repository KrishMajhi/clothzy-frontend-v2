import ProductCard from '../ProductCard/ProductCard';
import { POPULAR_COLLECTIONS } from '../products';
import './PopularCollections.css';

const ArrowIcon = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const DELAYS = ['clzv3-d1', 'clzv3-d2', 'clzv3-d3'];

function PopularCollections() {
  return (
    <section className="clzv3-popular">
      <div className="clzv3-popular-head">
        <div className="clzv3-rv">
          <p className="clzv3-eyebrow">Best Sellers</p>
          <h2 className="clzv3-sec-h">Popular <em>Collections</em></h2>
        </div>
        <a href="#" className="clzv3-btn-all clzv3-rv clzv3-d2">
          View All <ArrowIcon />
        </a>
      </div>

      <div className="clzv3-popular-grid">
        {POPULAR_COLLECTIONS.map((product, idx) => (
          <div className={`clzv3-rv ${DELAYS[idx] ?? ''}`} key={product.id}>
            <ProductCard product={product} variant="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default PopularCollections;
