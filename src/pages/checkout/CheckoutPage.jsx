import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./CheckoutPage.css";

import CheckoutNav from "./CheckoutNav";
import CheckoutSteps from "./CheckoutSteps";
import ContactSection from "./ContactSection";
import ShippingSection from "./ShippingSection";
import PaymentSection from "./PaymentSection";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import { useCart, calculateOrderSummary } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useAuth } from "../../context/AuthContext";

const fmt = (n) => `₹${Number(n).toFixed(0)}`;

const getCartMeta = (items) => {
  let subtotal = 0, orig = 0;
  items.forEach((i) => {
    subtotal += i.price * i.quantity;
    orig += (i.original_price || i.price) * i.quantity;
  });
  return { subtotal, savings: orig - subtotal, itemCount: items.length };
};

const INITIAL_FORM = {
  firstName: "",
  lastName:  "",
  email:     "",
  phone:     "",
  addr1:     "",
  addr2:     "",
  city:      "",
  state:     "",
  pin:       "",
  country:   "India",
};

const CheckoutPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const { cartItems, orderSummaryConfig, getOrderSummaryConfig, clearCart } = useCart();
  const { createOrder } = useOrders();

  const isBuyNow     = location.state?.mode === "buy_now";
  const buyNowItem   = location.state?.item;
  const checkoutItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;

  const [form,        setFormState] = useState(INITIAL_FORM);
  const [errors,      setErrors]    = useState({});
  const [emailOk,     setEmailOk]   = useState(false);
  const [payMethod,   setPayMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [step,        setStep]      = useState("checkout");
  const [processing,  setProcessing] = useState(false);

  useEffect(() => { getOrderSummaryConfig(); }, []);

  const setField = (k, v) => {
    setFormState((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: false }));
  };

  // ─── Saved user values used as fallbacks ───────────────────────────────────
  const savedInfo = user?.personal_info ?? {};
  const savedAddr = user?.address        ?? {};

  const [savedFirst = "", ...savedRestParts] = (savedInfo.fullname || "").split(" ");
  const savedLast = savedRestParts.join(" ");

  /**
   * Returns the "effective" value for a field:
   *   • the typed form value if non-empty
   *   • otherwise the user's saved value (so we never send empty strings when
   *     the user was happy with their saved data)
   */
  const eff = (formKey, savedValue) =>
    form[formKey].trim() !== "" ? form[formKey].trim() : (savedValue ?? "").toString().trim();

  // Effective values for all required fields
  const effectiveValues = {
    firstName: eff("firstName", savedFirst),
    lastName:  eff("lastName",  savedLast),
    email:     eff("email",     savedInfo.email),
    phone:     eff("phone",     savedInfo.phone),
    addr1:     eff("addr1",     savedAddr.address_line_1),
    addr2:     eff("addr2",     savedAddr.address_line_2),
    city:      eff("city",      savedAddr.city),
    state:     eff("state",     savedAddr.state),
    pin:       eff("pin",       savedAddr.postal_code),
    country:   eff("country",   savedAddr.country) || "India",
  };

  // ─── Totals ────────────────────────────────────────────────────────────────
  const { subtotal, savings, itemCount } = getCartMeta(checkoutItems);
  const calc   = calculateOrderSummary({ subtotal, shippingMethod, config: orderSummaryConfig });
  const totals = {
    subtotal,
    savings,
    itemCount,
    tax:                 calc?.tax               ?? subtotal * 0.08,
    deliveryCharge:      calc?.deliveryCharge     ?? 0,
    shippingMethodCharge: calc?.shippingMethodCharge ?? 0,
    total:               calc?.total             ?? subtotal * 1.08,
  };
  const codFee     = payMethod === "cod" ? 49 : 0;
  const finalTotal = totals.total + codFee;

  // ─── Validation ────────────────────────────────────────────────────────────
  /**
   * Validates using effective values (form OR saved fallback).
   * A field is only invalid when BOTH the form input AND the saved fallback are empty.
   */
  const validate = () => {
    const required = ["firstName", "lastName", "email", "phone", "addr1", "city", "pin"];
    const errs = {};

    required.forEach((k) => {
      if (!effectiveValues[k]) errs[k] = true;
    });

    // Email format check against effective email
    const emailVal = effectiveValues.email;
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      errs.email = true;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Place Order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!validate()) {
      document.querySelector(".co-field-input--err")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setProcessing(true);

    try {
      // Build orderData entirely from effective values so the backend always
      // receives complete, non-empty strings even when the user didn't re-type
      // their saved address.
      const orderData = {
        shipping_method:  shippingMethod,
        payment_method:   payMethod,

        delivery_name:    `${effectiveValues.firstName} ${effectiveValues.lastName}`.trim(),
        delivery_phone:   effectiveValues.phone,

        address_line_1:   effectiveValues.addr1,
        address_line_2:   effectiveValues.addr2 || null,

        city:             effectiveValues.city,
        state:            effectiveValues.state  || savedAddr.state  || "",
        country:          effectiveValues.country,
        postal_code:      effectiveValues.pin,

        promo_code:       null,
      };

      const order = await createOrder(orderData);

      if (!isBuyNow) {
        await clearCart();
      }

      // Navigate to the dedicated confirmation page, passing everything
      // the page needs so it can display instantly before the fetch resolves.
      navigate("/order-confirmation", {
        replace: true,
        state: {
          orderId:        order.id,
          isBuyNow,
          items:          checkoutItems,
          totals: {
            ...totals,
            codFee,
            finalTotal,
          },
        },
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="co-root">
      <div className="co-bg" />

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
              style={{ color: "var(--co-rust)", textDecoration: "underline dotted" }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{ color: "var(--co-rust)", textDecoration: "underline dotted" }}
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
