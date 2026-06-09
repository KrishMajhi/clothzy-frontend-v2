import { useNavigate } from "react-router-dom";

const SuccessOverlay = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="co-success-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="co-success-card">
        <div className="co-success-check">✓</div>
        <h2 className="co-success-title">Order Confirmed!</h2>
        <p className="co-success-desc">
          Thank you for shopping with Clothzy. Your items will be dispatched within 24 hours and delivered to your doorstep.
        </p>
        <p className="co-success-id">Order ID: <strong>{orderId}</strong></p>
        <button className="co-success-btn" onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    </div>
  );
};
export default SuccessOverlay;
