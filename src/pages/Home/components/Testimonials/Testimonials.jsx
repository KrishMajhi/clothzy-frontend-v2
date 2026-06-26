import './Testimonials.css';

const TESTIMONIALS = [
  {
    stars: '★★★★★',
    quote:
      'The linen kurti arrived in two days and the quality is stunning. Feels premium, fits perfectly. Nothing like this at this price point.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
    name: 'Priya Sharma',
    location: 'Mumbai, MH',
    delay: 'clzv3-d1',
  },
  {
    stars: '★★★★★',
    quote:
      "Ordered the co-ord set and got so many compliments at my cousin's wedding. Breathable even in Gujarat's heat. Clothzy for life.",
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop',
    name: 'Kavya Patel',
    location: 'Ahmedabad, GJ',
    delay: 'clzv3-d2',
  },
  {
    stars: '★★★★☆',
    quote:
      "Finally a brand that understands Indian occasions and body types. The kids section is absolutely adorable. My daughter loves it!",
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
    name: 'Rohan Mehta',
    location: 'Bangalore, KA',
    delay: 'clzv3-d3',
  },
];

function Testimonials() {
  return (
    <section className="clzv3-testimonials">
      <div className="clzv3-rv">
        <p className="clzv3-eyebrow">Real Stories</p>
        <h2 className="clzv3-sec-h">What Our <em>Customers Say</em></h2>
      </div>

      <div className="clzv3-testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <div className={`clzv3-testimonial-card clzv3-rv ${t.delay}`} key={t.name}>
            <div className="clzv3-testimonial-stars">{t.stars}</div>
            <p className="clzv3-testimonial-quote">{t.quote}</p>
            <div className="clzv3-testimonial-meta">
              <img className="clzv3-testimonial-avatar" src={t.avatar} alt={t.name} />
              <div>
                <div className="clzv3-testimonial-name">{t.name}</div>
                <div className="clzv3-testimonial-location">{t.location}</div>
              </div>
              <div className="clzv3-testimonial-verified">✓ Verified</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
