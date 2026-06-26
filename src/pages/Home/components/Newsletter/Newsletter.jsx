import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your subscribe endpoint when ready.
    console.log('Subscribe:', email);
  };

  return (
    <div className="clzv3-newsletter">
      <div className="clzv3-newsletter-intro clzv3-rv">
        <p className="clzv3-eyebrow">Stay in Touch</p>
        <h2 className="clzv3-newsletter-heading">
          Stay Updated
          <br />
          <em>with Clothzy</em>
        </h2>
        <p className="clzv3-newsletter-subtext">
          Subscribe to our newsletter and be the first to know about new collections, exclusive deals, and more.
        </p>
      </div>

      <form className="clzv3-newsletter-form clzv3-rv clzv3-d2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
        <p className="clzv3-newsletter-note">No spam. Unsubscribe any time.</p>
      </form>
    </div>
  );
}

export default Newsletter;
