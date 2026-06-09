import { useAuth } from "../../Context/AuthContext.jsx";
import Field from "./Field";
import { useEffect } from "react";
const ContactSection = ({ form, setField, errors, emailOk, setEmailOk }) => {
  const { user } = useAuth();

  // Pre-fill once on mount
  useEffect(() => {
    if (user?.personal_info) {
      const { fullname, email, phone } = user.personal_info;
      const [firstName = "", lastName = ""] = (fullname || "").split(" ");
      if (firstName) setField("firstName", firstName);
      if (lastName) setField("lastName", lastName);
      if (email) setField("email", email);
      if (phone) setField("phone", phone);
    }
  }, []);

  return (
    <div className="co-card">
      <div className="co-section-head">
        <div className="co-section-num">1</div>
        <h2 className="co-section-title">Contact Information</h2>
      </div>
      <div className="co-row co-row--2">
        <Field
          label="First Name"
          placeholder="Arjun"
          value={form.firstName}
          onChange={(v) => setField("firstName", v)}
          error={errors.firstName}
        />
        <Field
          label="Last Name"
          placeholder="Sharma"
          value={form.lastName}
          onChange={(v) => setField("lastName", v)}
          error={errors.lastName}
        />
      </div>
      <div className="co-row">
        <Field
          label="Email Address"
          type="email"
          placeholder="arjun@example.com"
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
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(v) => setField("phone", v)}
          error={errors.phone}
        />
      </div>
    </div>
  );
};
export default ContactSection;
