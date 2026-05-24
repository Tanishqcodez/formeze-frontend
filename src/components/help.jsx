import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const BRAND = "#2ACA65";
const BRAND_DARK = "#1ea854";
const BRAND_DIM = "rgba(42,202,101,0.12)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

const categories = ["All", "Getting Started", "Forms & Fields", "Integrations", "Billing", "Security"];

const faqs = [
  {
    category: "Getting Started",
    question: "What is Formeze?",
    answer:
      "Formeze is a form-as-a-service platform that lets you collect messages, leads, and submissions from any website without writing backend code. Simply embed our snippet, and all responses land straight in your dashboard.",
  },
  {
    category: "Getting Started",
    question: "How do I create my first form?",
    answer:
      "Sign up for a free account, click 'New Form' in your dashboard, and copy the generated endpoint or embed snippet into your HTML. You'll start receiving submissions instantly—no server setup required.",
  },
  {
    category: "Getting Started",
    question: "Do I need coding knowledge to use Formeze?",
    answer:
      "Not at all. Our no-code builder lets you configure fields, labels, and redirects visually. If you prefer a custom implementation, you can also POST directly to our REST endpoint from any frontend.",
  },
  {
    category: "Forms & Fields",
    question: "What field types does Formeze support?",
    answer:
      "We support text, email, phone, number, textarea, checkbox, radio, select, file upload, date picker, and hidden fields. Custom field validation rules (regex, min/max, required) are available on all plans.",
  },
  {
    category: "Forms & Fields",
    question: "Can I set up a custom thank-you redirect after submission?",
    answer:
      "Yes. In each form's settings you can specify a redirect URL. After a successful submission the visitor is sent there automatically. You can also show an inline success message instead if you prefer.",
  },
  {
    category: "Forms & Fields",
    question: "Is there a submission limit per form?",
    answer:
      "The free plan allows up to 100 submissions per month per form. Pro and Business plans offer unlimited submissions. You'll receive an email notification before you hit any limit.",
  },
  {
    category: "Integrations",
    question: "Which tools can I connect Formeze to?",
    answer:
      "Formeze integrates natively with Slack, Notion, Airtable, Google Sheets, Mailchimp, and Zapier. Through Zapier you can connect to 5,000+ other apps. Webhooks are available on all paid plans.",
  },
  {
    category: "Integrations",
    question: "How do I set up email notifications for new submissions?",
    answer:
      "Go to your form's Notifications tab and add one or more email addresses. You can customise the subject line and include any field values using {{field_name}} placeholders in the template.",
  },
  {
    category: "Integrations",
    question: "Does Formeze support webhooks?",
    answer:
      "Yes. Paid plans can configure a webhook URL per form. Every submission triggers a POST request with the full payload as JSON, making it easy to pipe data into your own backend or automation.",
  },
  {
    category: "Billing",
    question: "What plans does Formeze offer?",
    answer:
      "We offer a free tier (1 form, 100 submissions/month), Pro ($12/month — unlimited forms, 10,000 submissions, integrations), and Business ($39/month — everything in Pro plus team seats, priority support, and custom domains).",
  },
  {
    category: "Billing",
    question: "Can I cancel my subscription at any time?",
    answer:
      "Absolutely. Cancel anytime from your account settings. You keep full access until the end of your billing period, and your data is exportable any time before or after cancellation.",
  },
  {
    category: "Security",
    question: "How does Formeze protect my data?",
    answer:
      "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are GDPR-compliant, never sell your data, and store submissions in SOC 2 Type II certified infrastructure.",
  },
  {
    category: "Security",
    question: "Does Formeze have spam protection?",
    answer:
      "Yes. Every form includes built-in honeypot fields, reCAPTCHA v3 (invisible), and rate-limiting by IP. You can also enable manual CAPTCHA challenges for high-risk forms in your form settings.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        flexShrink: 0,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={open ? BRAND : "#6b7c87"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div
      style={{
        background: open ? "rgba(42,202,101,0.04)" : "#161b22",
        border: `1px solid ${open ? BRAND_BORDER : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s",
        animationDelay: `${index * 0.045}s`,
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "20px 24px",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            color: open ? "#ffffff" : "#d4dde3",
            lineHeight: 1.4,
            transition: "color 0.2s",
          }}
        >
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>

      <div
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div ref={bodyRef} style={{ padding: "0 24px 22px" }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: "#7a909e",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Help() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    const matchCat = activeCategory === "All" || f.category === activeCategory;
    const matchSearch =
      !search ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1117",
        fontFamily: "'DM Sans', sans-serif",
        padding: "60px 20px 80px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a3a42; border-radius: 10px; }
        input::placeholder { color: #3d5060; }
        input:focus { outline: none; border-color: ${BRAND_BORDER} !important; box-shadow: 0 0 0 3px rgba(42,202,101,0.10); }
        .cat-btn { cursor: pointer; border: none; }
        .cat-btn:hover { background: rgba(42,202,101,0.10) !important; color: #2ACA65 !important; border-color: ${BRAND_BORDER} !important; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.5s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`,
            borderRadius: 30, padding: "5px 14px 5px 10px", marginBottom: 20,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: BRAND,
              display: "inline-block",
            }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: BRAND, letterSpacing: "0.05em" }}>
              Help Center
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 42, fontWeight: 800, color: "#fff",
            letterSpacing: -1, lineHeight: 1.1, marginBottom: 14,
          }}>
            Frequently asked<br />
            <span style={{ color: BRAND }}>questions</span>
          </h1>
          <p style={{ fontSize: 15, color: "#5a7180", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
            Everything you need to know about Formeze. Can't find an answer? Our team is happy to help.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 420, margin: "0 auto" }}>
            <svg
              width="17" height="17" viewBox="0 0 17 17" fill="none"
              style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            >
              <circle cx="7.5" cy="7.5" r="5" stroke="#3d5060" strokeWidth="1.6" />
              <path d="M11 11L14 14" stroke="#3d5060" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "#161b22",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "13px 16px 13px 44px",
                fontSize: 14,
                color: "#d4dde3",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          justifyContent: "center", marginBottom: 40,
          animation: "fadeUp 0.5s ease 0.1s both",
        }}>
          {categories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                className="cat-btn"
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: active ? BRAND : "transparent",
                  color: active ? "#04140a" : "#5a7180",
                  border: `1px solid ${active ? BRAND : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 20,
                  padding: "7px 16px",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#3d5060" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 16px", display: "block" }}>
              <circle cx="20" cy="20" r="18" stroke="#2a3a42" strokeWidth="1.5" />
              <path d="M14 20h12M20 14v12" stroke="#2a3a42" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: 15 }}>No results for "{search}". Try a different keyword.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((item, i) => (
              <FAQItem key={item.question} item={item} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{
          marginTop: 64,
          background: "#161b22",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20,
          padding: "40px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, #1aa850, ${BRAND}, #6eefaa, ${BRAND}, #1aa850)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }} />
          <div style={{
            width: 48, height: 48, background: BRAND_DIM,
            border: `1px solid ${BRAND_BORDER}`,
            borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 11C2 6.03 6.03 2 11 2s9 4.03 9 9-4.03 9-9 9-9-4.03-9-9z" stroke={BRAND} strokeWidth="1.5" />
              <path d="M11 7v4.5l3 3" stroke={BRAND} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -0.3,
          }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: 14, color: "#5a7180", lineHeight: 1.7, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
            Our support team typically responds within a few hours. We'd love to help.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:support@formeze.com"
              style={{
                background: BRAND, color: "#04140a",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600,
                padding: "12px 28px", borderRadius: 10,
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#04140a" strokeWidth="1.4" />
                <path d="M1.5 5.5l6.5 4 6.5-4" stroke="#04140a" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Email Support
            </a>
            <a
              href="#docs"
              style={{
                background: "transparent",
                color: "#7a909e",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 500,
                padding: "12px 28px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              View Docs
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="#7a909e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, color: "#2a3a42", fontSize: 12 }}>
          © 2026 Formeze · <Link to="/privacy" style={{ color: "#3a5a48", textDecoration: "underline" }}>Privacy</Link> · <a href="#" style={{ color: "#3a5a48", textDecoration: "underline" }}>Terms</a>
        </div>

      </div>
    </div>
  );
}
