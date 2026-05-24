import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";

const BRAND = "#2ACA65";
const BRAND_DARK = "#1ea854";
const BRAND_DIM = "rgba(42,202,101,0.10)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

const TOPICS = [
  "General Inquiry",
  "Technical Support",
  "Billing & Plans",
  "Feature Request",
  "Partnership",
  "Other",
];

const contactInfo = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect
          x="1.5"
          y="4"
          width="15"
          height="10.5"
          rx="2"
          stroke={BRAND}
          strokeWidth="1.5"
        />
        <path
          d="M1.5 6.5l7.5 5 7.5-5"
          stroke={BRAND}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Email us",
    value: "formeze.service@gmail.com",
    sub: "We reply within a few hours",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={BRAND} strokeWidth="1.5" />
        <path
          d="M9 5v4.5l3 2"
          stroke={BRAND}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Support hours",
    value: "Mon – Fri, 9am – 6pm",
    sub: "UTC timezone",
  },
];

function FloatingLabel({ label, children, error }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      {children}
      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#e05c5c",
            marginTop: 4,
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <label
        style={{
          position: "absolute",
          left: 16,
          top: active ? 8 : "50%",
          transform: active ? "none" : "translateY(-50%)",
          fontSize: active ? 10 : 14,
          fontWeight: active ? 600 : 400,
          color: focused ? BRAND : active ? "#7ecf9a" : "#8aaab8",
          letterSpacing: active ? "0.07em" : 0,
          textTransform: active ? "uppercase" : "none",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "#0f1117",
          border: `1px solid ${error ? "#8a3232" : focused ? BRAND_BORDER : "rgba(255,255,255,0.08)"}`,
          borderRadius: 12,
          padding: "26px 16px 10px",
          fontSize: 14,
          color: "#d4dde3",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          boxShadow: focused ? `0 0 0 3px ${BRAND_DIM}` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        {...rest}
      />
      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#e05c5c",
            marginTop: 4,
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function TextareaField({ label, value, onChange, error }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <label
        style={{
          position: "absolute",
          left: 16,
          top: active ? 10 : 18,
          fontSize: active ? 10 : 14,
          fontWeight: active ? 600 : 400,
          color: focused ? BRAND : active ? "#7ecf9a" : "#8aaab8",
          letterSpacing: active ? "0.07em" : 0,
          textTransform: active ? "uppercase" : "none",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        style={{
          width: "100%",
          background: "#0f1117",
          border: `1px solid ${error ? "#8a3232" : focused ? BRAND_BORDER : "rgba(255,255,255,0.08)"}`,
          borderRadius: 12,
          padding: "28px 16px 12px",
          fontSize: 14,
          color: "#d4dde3",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          resize: "vertical",
          boxShadow: focused ? `0 0 0 3px ${BRAND_DIM}` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />
      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#e05c5c",
            marginTop: 4,
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: 18 }}>
      <label
        style={{
          position: "absolute",
          left: 16,
          top: value ? 8 : "50%",
          transform: value ? "none" : "translateY(-50%)",
          fontSize: value ? 10 : 14,
          fontWeight: value ? 600 : 400,
          color: focused ? BRAND : value ? "#7ecf9a" : "#8aaab8",
          letterSpacing: value ? "0.07em" : 0,
          textTransform: value ? "uppercase" : "none",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          pointerEvents: "none",
          fontFamily: "'DM Sans', sans-serif",
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: "#0f1117",
          border: `1px solid ${error ? "#8a3232" : focused ? BRAND_BORDER : "rgba(255,255,255,0.08)"}`,
          borderRadius: 12,
          padding: value ? "26px 16px 10px" : "18px 16px",
          fontSize: 14,
          color: value ? "#d4dde3" : "transparent",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          appearance: "none",
          boxShadow: focused ? `0 0 0 3px ${BRAND_DIM}` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          cursor: "pointer",
        }}
      >
        <option value="" disabled />
        {options.map((o) => (
          <option
            key={o}
            value={o}
            style={{ background: "#161b22", color: "#d4dde3" }}
          >
            {o}
          </option>
        ))}
      </select>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        style={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="#3d5060"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {error && (
        <span
          style={{
            fontSize: 11,
            color: "#e05c5c",
            marginTop: 4,
            display: "block",
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function SuccessScreen({ onReset }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        animation: "fadeUp 0.5s ease both",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          background: BRAND_DIM,
          border: `1.5px solid ${BRAND_BORDER}`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M8 16l6 6 10-12"
            stroke={BRAND}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 12,
          letterSpacing: -0.3,
        }}
      >
        Message sent!
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#5a7180",
          lineHeight: 1.7,
          maxWidth: 320,
          margin: "0 auto 28px",
        }}
      >
        Thanks for reaching out. Our team will get back to you within a few
        hours.
      </p>
      <button
        onClick={onReset}
        style={{
          background: "transparent",
          border: `1px solid ${BRAND_BORDER}`,
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: 13,
          color: BRAND,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Send another message
      </button>
    </div>
  );
}

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);

  // Subtle animated grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const size = 48;
      ctx.strokeStyle = "rgba(42,202,101,0.055)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width + size; x += size) {
        for (let y = 0; y < canvas.height + size; y += size) {
          const dist = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2),
          );
          const wave = Math.sin(dist / 60 - t) * 0.5 + 0.5;
          ctx.globalAlpha = wave * 0.4;
          ctx.strokeRect(x - size / 2, y - size / 2, size, size);
        }
      }
      t += 0.012;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.topic) e.topic = "Please select a topic";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    else if (form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    try {
      const response = await fetch("https://formeze-backend.onrender.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         name: form.name,
         email: form.email,
         topic: form.topic,
         company: form.company,
         message:form.message
        }),
      });
      const data = await response.json();
      if (data.success == true) {
        setLoading(false);
        setSubmitted(true);
      } else {
        setLoading(false);
        toast("Some error occured, please try again later!");
      }
    } catch (error) {
        toast("Some error occured, please try again later!");

    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", company: "", topic: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <>
      <Toaster />
      <div
        style={{
          background: "#0f1117",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::placeholder { color: transparent; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #2a3a42; border-radius: 10px; }
      `}</style>

        {/* Animated canvas bg */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1080,
            margin: "0 auto",
            padding: "80px 24px 80px",
          }}
        >
          {/* Two-column layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 60,
              alignItems: "start",
            }}
          >
            {/* Left: info panel */}
            <div style={{ animation: "fadeUp 0.5s ease both" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: BRAND_DIM,
                  border: `1px solid ${BRAND_BORDER}`,
                  borderRadius: 30,
                  padding: "5px 14px 5px 10px",
                  marginBottom: 24,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: BRAND,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: BRAND,
                    letterSpacing: "0.05em",
                  }}
                >
                  Get in touch
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 46,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: -1.2,
                  lineHeight: 1.08,
                  marginBottom: 18,
                }}
              >
                We'd love
                <br />
                to <span style={{ color: BRAND }}>hear</span>
                <br />
                from you.
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#8aaab8",
                  lineHeight: 1.75,
                  maxWidth: 340,
                  marginBottom: 48,
                }}
              >
                Have a question, found a bug, or want to explore a partnership?
                Fill in the form and someone from our team will be in touch.
              </p>

              {/* Contact info tiles */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginBottom: 48,
                }}
              >
                {contactInfo.map((c) => (
                  <div
                    key={c.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      background: "#161b22",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 14,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: BRAND_DIM,
                        border: `1px solid ${BRAND_BORDER}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#7ecf9a",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          marginBottom: 2,
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#d4dde3",
                        }}
                      >
                        {c.value}
                      </div>
                      <div style={{ fontSize: 12, color: "#8aaab8" }}>
                        {c.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div
              style={{
                background: "#161b22",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 22,
                overflow: "hidden",
                animation: "fadeUp 0.5s ease 0.1s both",
              }}
            >
              {/* Shimmer top bar */}
              <div
                style={{
                  height: 4,
                  background: `linear-gradient(90deg,#1aa850,${BRAND},#6eefaa,${BRAND},#1aa850)`,
                  backgroundSize: "200% 100%",
                  animation: "shimmer 3s linear infinite",
                }}
              />

              <div style={{ padding: "36px 36px 40px" }}>
                {submitted ? (
                  <SuccessScreen onReset={handleReset} />
                ) : (
                  <>
                    <div style={{ marginBottom: 28 }}>
                      <h2
                        style={{
                          fontFamily: "'Syne',sans-serif",
                          fontSize: 22,
                          fontWeight: 800,
                          color: "#fff",
                          marginBottom: 6,
                          letterSpacing: -0.3,
                        }}
                      >
                        Send us a message
                      </h2>
                      <p style={{ fontSize: 13, color: "#8aaab8" }}>
                        All fields marked are required
                      </p>
                    </div>

                    {/* Name + Email row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <InputField
                        label="Full name *"
                        value={form.name}
                        onChange={set("name")}
                        error={errors.name}
                      />
                      <InputField
                        label="Email address *"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        error={errors.email}
                      />
                    </div>

                    {/* Company + Topic row */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <InputField
                        label="Company (optional)"
                        value={form.company}
                        onChange={set("company")}
                      />
                      <SelectField
                        label="Topic *"
                        value={form.topic}
                        onChange={set("topic")}
                        options={TOPICS}
                        error={errors.topic}
                      />
                    </div>

                    {/* Message */}
                    <TextareaField
                      label="Your message *"
                      value={form.message}
                      onChange={set("message")}
                      error={errors.message}
                    />

                    {/* Privacy note */}
                    <p
                      style={{
                        fontSize: 12,
                        color: "#8aaab8",
                        lineHeight: 1.6,
                        marginBottom: 22,
                      }}
                    >
                      By submitting this form you agree to our{" "}
                      <Link to="/privacy"
                        style={{ color: BRAND, textDecoration: "underline" }}
                      >
                        Privacy Policy
                      </Link>
                      . We never share your data.
                    </p>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        width: "100%",
                        background: loading ? BRAND_DIM : BRAND,
                        color: loading ? BRAND : "#04140a",
                        border: `1px solid ${loading ? BRAND_BORDER : "transparent"}`,
                        borderRadius: 12,
                        padding: "15px 24px",
                        fontSize: 15,
                        fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "opacity 0.2s, background 0.2s",
                      }}
                      onMouseOver={(e) => {
                        if (!loading) e.currentTarget.style.opacity = "0.88";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      {loading ? (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ animation: "spin 0.8s linear infinite" }}
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke={BRAND}
                              strokeWidth="2"
                              strokeDasharray="40 20"
                            />
                          </svg>
                          <span style={{ color: BRAND }}>Sending…</span>
                        </>
                      ) : (
                        <>
                          Send message
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M2 8h12M10 4l4 4-4 4"
                              stroke="#04140a"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
