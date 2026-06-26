import './UspStrip.css';

const USP_ITEMS = [
  {
    title: 'Free Shipping',
    subtitle: 'Orders above ₹999',
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-rust)" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375A1.125 1.125 0 012.25 17.625V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.9 17.9 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    subtitle: '7-day hassle-free',
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-rust)" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
  },
  {
    title: 'Secure Checkout',
    subtitle: 'UPI, Cards, COD',
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-rust)" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: 'Sustainable',
    subtitle: 'Breathable fabrics',
    icon: (
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--clzv3-rust)" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
];

function UspStrip() {
  return (
    <div className="clzv3-usp clzv3-rv">
      {USP_ITEMS.map((item) => (
        <div className="clzv3-usp-item" key={item.title}>
          <div className="clzv3-usp-icon">{item.icon}</div>
          <div>
            <div className="clzv3-usp-title">{item.title}</div>
            <div className="clzv3-usp-subtitle">{item.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UspStrip;
