import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import "./css/AddressComp.css";

export default function AddressComp() {
  const { user, updateCurrentUser } = useAuth();

  const [edit, setEdit] = useState(false);
  const [updatedata, setUpdatedata] = useState({});
  const [saving, setSaving] = useState(false);

  // ==========================
  // CHANGED
  // address now lives inside:
  // user.address
  // ==========================
  const address = user?.address;

  const fields = [
    {
      label: "Address Line 1",
      key: "address_line_1",
      icon: "⌖",
      placeholder: "House / Flat / Building",
    },
    {
      label: "Address Line 2",
      key: "address_line_2",
      icon: "⌖",
      placeholder: "Street / Area / Locality",
    },
    {
      label: "City",
      key: "city",
      icon: "◎",
      placeholder: "City",
    },
    {
      label: "State",
      key: "state",
      icon: "◈",
      placeholder: "State / Province",
    },
    {
      label: "Postal Code",
      key: "postal_code",
      icon: "◉",
      placeholder: "PIN / ZIP",
    },
    {
      label: "Country",
      key: "country",
      icon: "◆",
      placeholder: "Country",
    },
  ];

  // ==========================
  // CHANGED
  // was:
  // user?.[f.key]
  //
  // now:
  // address?.[f.key]
  // ==========================
  const hasAddress = fields.some(
    (f) => address?.[f.key]
  );

  const handleEdit = async () => {
    if (!edit) {
      const seed = {};

      // ==========================
      // CHANGED
      // seed from address object
      // ==========================
      fields.forEach((f) => {
        seed[f.key] = address?.[f.key] || "";
      });

      setUpdatedata(seed);
      setEdit(true);

      return;
    }

    try {
      setSaving(true);

      // ==========================
      // CHANGED
      // OLD:
      // await updateCurrentUser(updatedata)
      //
      // NEW:
      // backend expects:
      // {
      //   address: {...}
      // }
      // ==========================
      await updateCurrentUser({
        address: updatedata,
      });

      setEdit(false);
      setUpdatedata({});
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setUpdatedata({});
  };

  return (
    <div className="addr-root">
      {/* ── Heading ── */}
      <div className="addr-heading">
        <span className="addr-heading-tag">
          Delivery
        </span>

        <h1 className="addr-title">
          Address
        </h1>

        <p className="addr-desc">
          Where should Clothzy deliver your
          orders?
        </p>
      </div>

      {/* ── Empty State ── */}
      {!hasAddress && !edit && (
        <div className="addr-empty-banner">
          <span className="addr-empty-icon">
            📍
          </span>

          <div className="addr-empty-body">
            <p className="addr-empty-title">
              No address saved yet
            </p>

            <p className="addr-empty-sub">
              Add your delivery address to
              speed up checkout.
            </p>
          </div>

          <button
            className="addr-add-btn"
            onClick={handleEdit}
          >
            + Add Address
          </button>
        </div>
      )}

      {/* ── Address Fields ── */}
      <div className="addr-section-block">
        {(hasAddress || edit) && (
          <div className="addr-section-label">
            <span className="addr-section-dot" />
            Delivery Address
          </div>
        )}

        <div className="addr-fields">
          {fields.map(
            ({
              label,
              key,
              icon,
              placeholder,
            }) => {
              // ==========================
              // CHANGED
              // was:
              // user?.[key]
              //
              // now:
              // address?.[key]
              // ==========================
              const value =
                address?.[key];

              return (
                <div
                  className="addr-field"
                  key={key}
                >
                  <span className="addr-field-icon">
                    {icon}
                  </span>

                  <div className="addr-field-body">
                    <span className="addr-field-label">
                      {label}
                    </span>

                    {edit ? (
                      <input
                        className="addr-field-input"
                        type="text"
                        placeholder={
                          placeholder
                        }
                        value={
                          updatedata[key] ??
                          ""
                        }
                        onChange={(e) =>
                          setUpdatedata(
                            (prev) => ({
                              ...prev,
                              [key]:
                                e.target
                                  .value,
                            })
                          )
                        }
                      />
                    ) : (
                      <span
                        className={`addr-field-value${
                          !value
                            ? " addr-field-empty"
                            : ""
                        }`}
                      >
                        {value ||
                          "Not set"}
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* ── Actions ── */}
      {(edit || hasAddress) && (
        <div className="addr-actions">
          <button
            className="addr-btn-primary"
            onClick={handleEdit}
            disabled={saving}
          >
            <span>
              {edit ? "💾" : "✏"}
            </span>

            {saving
              ? "Saving..."
              : edit
                ? "Save Address"
                : "Edit Address"}
          </button>

          {edit && (
            <button
              className="addr-btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* ── Map Placeholder ── */}
      <div className="addr-map-placeholder">
        <span className="addr-map-icon">
          🗺
        </span>

        <p>Map preview coming in V2</p>
      </div>
    </div>
  );
}