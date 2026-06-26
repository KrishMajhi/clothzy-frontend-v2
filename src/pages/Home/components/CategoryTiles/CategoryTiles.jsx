import "./CategoryTiles.css";
import { Link } from "react-router-dom";
const CATEGORIES = [
  {
    name: "Women's",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    delay: "clzv3-d1",
    path: "women",
  },
  {
    name: "Men's",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=700&auto=format&fit=crop",
    delay: "clzv3-d2",
    path: "men",
  },
  {
    name: "Kids",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=700&auto=format&fit=crop",
    delay: "clzv3-d3",
    path: "kids",
  },
];

const ArrowIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={size === 14 ? "1.5" : "2"}
  >
    <path strokeLinecap="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

function CategoryTiles() {
  return (
    <section className="clzv3-categories">
      <div className="clzv3-sec-top clzv3-rv">
        <div>
          <p className="clzv3-eyebrow">Shop by</p>
          <h2 className="clzv3-sec-h">
            Browse <em>Categories</em>
          </h2>
        </div>
        <a href="#" className="clzv3-btn-all">
          All Products <ArrowIcon />
        </a>
      </div>

      <div className="clzv3-cat-grid">
        {CATEGORIES.map((cat) => (
          <div
            className={`clzv3-cat-card clzv3-rv ${cat.delay}`}
            key={cat.name}
          >
            <img src={cat.image} alt={cat.name} />
            <div className="clzv3-cat-overlay" />
            <div className="clzv3-cat-info">
              <div className="clzv3-cat-info-sub">Browse</div>
              <div className="clzv3-cat-info-name">{cat.name}</div>
              <Link to={`/${cat.path}`} className="clzv3-cat-cta">
                Shop now <ArrowIcon size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategoryTiles;
