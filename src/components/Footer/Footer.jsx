import './Footer.css';

const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: ["Men's Clothing", "Women's Clothing", 'Kids', 'New Arrivals', 'Sale'],
  },
  {
    title: 'Customer Care',
    links: ['Shipping & Returns', 'Contact Us', 'Privacy Policy', 'Size Guide', 'FAQs'],
  },
  {
    title: 'Company',
    links: ['About Clothzy', 'Sustainability', 'Careers', 'Press', 'Blog'],
  },
];

const SOCIAL_ICONS = [
  // Instagram
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-sand)" strokeWidth="1.4" key="ig">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>,
  // Twitter/X
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-sand)" strokeWidth="1.4" key="tw">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>,
  // YouTube
  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-sand)" strokeWidth="1.4" key="yt">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98" />
  </svg>,
];

function Footer() {
  return (
    <footer className="clzv3-footer">
      <div className="clzv3-footer-top">
        <div className="clzv3-footer-big-text">Clothzy</div>
      </div>

      <div className="clzv3-footer-grid">
        <div>
          <a href="#" className="clzv3-footer-logo">CLOTHZY</a>
          <p className="clzv3-footer-tagline">Style your life with our exclusive clothing collections.</p>
          <div className="clzv3-footer-social">
            {SOCIAL_ICONS.map((icon, idx) => (
              <a href="#" key={idx}>{icon}</a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div className="clzv3-footer-col" key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="clzv3-footer-bottom">
        <p className="clzv3-footer-copyright">© 2025 Clothzy. All Rights Reserved.</p>
        <div className="clzv3-footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
