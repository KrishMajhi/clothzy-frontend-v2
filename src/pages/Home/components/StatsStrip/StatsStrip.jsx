import './StatsStrip.css';

const STATS = [
  { value: '50K+', label: 'Happy Customers', rust: true, delay: '' },
  { value: '2,400+', label: 'Styles & Counting', rust: false, delay: 'clzv3-d1' },
  { value: '50+', label: 'Cities Delivered', rust: true, delay: 'clzv3-d2' },
  { value: '4.8★', label: 'Average Rating', rust: false, delay: 'clzv3-d3' },
];

function StatsStrip() {
  return (
    <div className="clzv3-stats">
      {STATS.map((stat) => (
        <div className={`clzv3-stat clzv3-rv ${stat.delay}`} key={stat.label}>
          <div className={`clzv3-stat-num ${stat.rust ? 'clzv3-stat-num-rust' : ''}`}>
            {stat.value}
          </div>
          <div className="clzv3-stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default StatsStrip;
