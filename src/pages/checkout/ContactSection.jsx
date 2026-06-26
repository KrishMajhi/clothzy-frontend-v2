import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import Field from "./Field";

const ContactSection = ({ form, setField, errors, emailOk, setEmailOk }) => {
  const { user } = useAuth();

  // Pre-fill form from user profile on mount.
  // We write into the form so the user can edit the values freely.
  // If they clear a field the submit logic will fall back to the saved value.
  useEffect(() => {
    if (!user?.personal_info) return;
    const { fullname, email, phone } = user.personal_info;
    const [firstName = "", ...rest] = (fullname || "").split(" ");
    const lastName = rest.join(" ");

    if (firstName) setField("firstName", firstName);
    if (lastName)  setField("lastName",  lastName);
    if (email)     setField("email",      email);
    if (phone)     setField("phone",      phone);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const savedInfo = user?.personal_info ?? {};
  const [savedFirst = "", ...savedRest] = (savedInfo.fullname || "").split(" ");
  const savedLast = savedRest.join(" ");

  return (
    <div className="co-card">
      <div className="co-section-head">
        <div className="co-section-num">1</div>
        <h2 className="co-section-title">Contact Information</h2>
      </div>

      <div className="co-row co-row--2">
        <Field
          label="First Name"
          placeholder={savedFirst || "Arjun"}
          value={form.firstName}
          onChange={(v) => setField("firstName", v)}
          error={errors.firstName}
        />
        <Field
          label="Last Name"
          placeholder={savedLast || "Sharma"}
          value={form.lastName}
          onChange={(v) => setField("lastName", v)}
          error={errors.lastName}
        />
      </div>

      <div className="co-row">
        <Field
          label="Email Address"
          type="email"
          placeholder={savedInfo.email || "arjun@example.com"}
          value={form.email}
          onChange={(v) => {
            setField("email", v);
            setEmailOk(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
          }}
          error={errors.email}
          showCheck={emailOk}
        />
      </div>

      <div className="co-row">
        <Field
          label="Phone Number"
          type="tel"
          placeholder={savedInfo.phone || "+91 98765 43210"}
          value={form.phone}
          onChange={(v) => setField("phone", v)}
          error={errors.phone}
        />
      </div>
    </div>
  );
};

export default ContactSection;
