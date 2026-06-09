import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

import CheckoutNav from "./CheckoutNav";
import CheckoutSteps from "./CheckoutSteps";
import ContactSection from "./ContactSection";
import ShippingSection from "./ShippingSection";
import PaymentSection from "./PaymentSection";
import SuccessOverlay from "./SuccessOverlay";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import { useCart, calculateOrderSummary } from "../../context/CartContext";

const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const getCartMeta = (items) => {
  let subtotal = 0,
    orig = 0;
  items.forEach((i) => {
    subtotal += i.price * i.quantity;
    orig += (i.original_price || i.price) * i.quantity;
  });
  return { subtotal, savings: orig - subtotal, itemCount: items.length };
};

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addr1: "",
  addr2: "",
  city: "",
  state: "",
  pin: "",
  country: "India",
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, orderSummaryConfig, getOrderSummaryConfig, clearCart } =
    useCart();

  const isBuyNow = location.state?.mode === "buy_now";
  const buyNowItem = location.state?.item;
  const checkoutItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;

  const [form, setFormState] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [emailOk, setEmailOk] = useState(false);
  const [payMethod, setPayMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [step, setStep] = useState("checkout");
  const [orderId, setOrderId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getOrderSummaryConfig();
  }, []);

  const setField = (k, v) => {
    setFormState((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: false }));
  };

  const { subtotal, savings, itemCount } = getCartMeta(checkoutItems);
  const calc = calculateOrderSummary({
    subtotal,
    shippingMethod,
    config: orderSummaryConfig,
  });
  const totals = {
    subtotal,
    savings,
    itemCount,
    tax: calc?.tax ?? subtotal * 0.08,
    deliveryCharge: calc?.deliveryCharge ?? 0,
    shippingMethodCharge: calc?.shippingMethodCharge ?? 0,
    total: calc?.total ?? subtotal * 1.08,
  };
  const codFee = payMethod === "cod" ? 49 : 0;
  const finalTotal = totals.total + codFee;

  const validate = () => {
    const req = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "addr1",
      "city",
      "pin",
    ];
    const errs = {};
    req.forEach((k) => {
      if (!form[k].trim()) errs[k] = true;
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = true;
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      document
        .querySelector(".co-field-input--err")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    const id = `#CLZ-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(id);
    setStep("confirmed");
    setShowSuccess(true);
    if (!isBuyNow) clearCart();
    setProcessing(false);
  };

  return (
    <div className="co-root">
      <div className="co-bg" />

      {showSuccess && (
        <SuccessOverlay
          orderId={orderId}
          onClose={() => setShowSuccess(false)}
        />
      )}

      <CheckoutNav
        isBuyNow={isBuyNow}
        onBack={() => (isBuyNow ? navigate(-1) : navigate("/cart"))}
      />
      <CheckoutSteps isBuyNow={isBuyNow} step={step} />

      <div className="co-container">
        <div className="co-left">
          <ContactSection
            form={form}
            setField={setField}
            errors={errors}
            emailOk={emailOk}
            setEmailOk={setEmailOk}
          />
          <ShippingSection
            form={form}
            setField={setField}
            errors={errors}
            shippingMethod={shippingMethod}
            onShippingChange={setShippingMethod}
            config={orderSummaryConfig}
          />
          <PaymentSection
            payMethod={payMethod}
            onPayMethodChange={setPayMethod}
          />

          <button
            className="co-place-btn"
            onClick={handlePlaceOrder}
            disabled={processing}
          >
            <span>🔒</span>
            <span>
              {processing ? "Processing…" : `Place Order · ${fmt(finalTotal)}`}
            </span>
            {processing && <span className="co-spinner" />}
          </button>
          <p className="co-order-note">
            By placing your order you agree to Clothzy's{" "}
            <Link
              to="/terms"
              style={{
                color: "var(--co-rust)",
                textDecoration: "underline dotted",
              }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{
                color: "var(--co-rust)",
                textDecoration: "underline dotted",
              }}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <CheckoutOrderSummary
          items={checkoutItems}
          totals={totals}
          shippingMethod={shippingMethod}
          config={orderSummaryConfig}
          payMethod={payMethod}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
