import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const BRAND = "#2ACA65";
const BRAND_DIM = "rgb(137 149 166);";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

/* ── tiny keyframe injector ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; background: #090e10; }

  @keyframes drift1  { to { transform: translate(44px, 60px); } }
  @keyframes drift2  { to { transform: translate(-40px,-52px); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulseR  { 0%,100%{ transform:scale(1);   opacity:1;   } 50%{ transform:scale(1.14); opacity:.5; } }
  @keyframes float   { 0%,100%{ transform:translateY(0);  } 50%{ transform:translateY(-5px); } }
  @keyframes sparkle { 0%,100%{ transform:scale(1);   opacity:.75; } 50%{ transform:scale(1.7); opacity:.2; } }
  @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(14px); }
                       to   { opacity:1; transform:translateX(-50%) translateY(0);    } }
  @keyframes toastOut{ from { opacity:1; transform:translateX(-50%) translateY(0);    }
                       to   { opacity:0; transform:translateX(-50%) translateY(14px); } }
  @keyframes spin    { to { transform: rotate(360deg); } }
`;

function injectCSS(css) {
  if (typeof document === "undefined") return;
  const id = "fz-verify-styles";
  if (!document.getElementById(id)) {
    const s = document.createElement("style");
    s.id = id;
    s.textContent = css;
    document.head.appendChild(s);
  }
}

/* ── sub-components ── */

function BgGrid() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundImage: `linear-gradient(${BRAND_BORDER.replace("0.28", "0.07")} 1px, transparent 1px),
                       linear-gradient(90deg, ${BRAND_BORDER.replace("0.28", "0.07")} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        maskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
        opacity: 0.55,
      }}
    />
  );
}

function Blobs() {
  const base = {
    position: "fixed",
    borderRadius: "50%",
    filter: "blur(100px)",
    zIndex: 0,
    pointerEvents: "none",
  };
  return (
    <>
      <div
        style={{
          ...base,
          width: 540,
          height: 540,
          background: `radial-gradient(circle, rgba(42,202,101,.20) 0%, transparent 70%)`,
          top: -160,
          left: -120,
          animation: "drift1 13s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          ...base,
          width: 440,
          height: 440,
          background: `radial-gradient(circle, rgba(42,202,101,.11) 0%, transparent 70%)`,
          bottom: -130,
          right: -90,
          animation: "drift2 15s ease-in-out infinite alternate",
        }}
      />
    </>
  );
}

function Logo() {
  return (
    <a
      href="#"
      style={{
        fontFamily: "'Sora',sans-serif",
        fontSize: "1.35rem",
        fontWeight: 700,
        letterSpacing: "-.02em",
        color: "#e8edf5",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `linear-gradient(135deg, ${BRAND}, #22c55e)`,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0a1a0e"
          strokeWidth="2.6"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 10h10M4 14h6" />
        </svg>
      </span>
      Formeze
    </a>
  );
}

function EnvelopeIcon() {
  return (
    <div
      style={{
        width: 88,
        height: 88,
        margin: "0 auto 28px",
        position: "relative",
      }}
    >
      {/* rings */}
      {[
        { inset: -10, bg: BRAND_DIM },
        { inset: -23, bg: "rgba(42,202,101,.05)" },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: r.inset,
            left: r.inset,
            right: r.inset,
            bottom: r.inset,
            borderRadius: "50%",
            background: r.bg,
            animation: `pulseR 2.7s ease-in-out infinite`,
            animationDelay: i === 1 ? ".45s" : "0s",
          }}
        />
      ))}
      {/* circle */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #0d1f10, #0a1409)",
          border: `1.5px solid ${BRAND_BORDER}`,
          display: "grid",
          placeItems: "center",
          boxShadow: `0 8px 36px rgba(42,202,101,.22)`,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={BRAND}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: "float 3.2s ease-in-out infinite" }}
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      </div>
      {/* sparks */}
      {[
        { w: 6, h: 6, top: 4, right: 10, delay: "0s", dur: "2.2s" },
        { w: 4, h: 4, bottom: 8, left: 6, delay: ".5s", dur: "2.8s" },
        { w: 5, h: 5, top: "44%", right: -4, delay: "1s", dur: "2.4s" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: BRAND,
            width: s.w,
            height: s.h,
            top: s.top,
            bottom: s.bottom,
            left: s.left,
            right: s.right,
            opacity: 0.7,
            animation: `sparkle ${s.dur} ease-in-out infinite ${s.delay}`,
          }}
        />
      ))}
    </div>
  );
}

function Steps() {
  const steps = [
    {
      label: (
        <>
          Open your{" "}
          <strong style={{ color: "#e8edf5", fontWeight: 500 }}>
            email app
          </strong>{" "}
          or inbox
        </>
      ),
    },
    {
      label: (
        <>
          Find the email from{" "}
          <strong style={{ color: "#e8edf5", fontWeight: 500 }}>Formeze</strong>{" "}
          — check spam if you don't see it
        </>
      ),
    },
    {
      label: (
        <>
          Click{" "}
          <strong style={{ color: "#e8edf5", fontWeight: 500 }}>
            Verify my email
          </strong>{" "}
          and you're all set
        </>
      ),
    },
  ];
  return (
    <div
      style={{
        background: "rgba(255,255,255,.025)",
        border: `1px solid ${BRAND_BORDER}`,
        borderRadius: 12,
        padding: "20px 24px",
        textAlign: "left",
        marginBottom: 30,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {steps.map((s, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
        >
          <div
            style={{
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
              background: BRAND_DIM,
              border: `1px solid ${BRAND_BORDER}`,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              marginTop: 1,
              fontFamily: "'Sora',sans-serif",
              fontSize: ".72rem",
              fontWeight: 600,
              color: BRAND,
            }}
          >
            {i + 1}
          </div>
          <div
            style={{ fontSize: ".86rem", lineHeight: 1.55, color: "#64748b" }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── main page ── */
export default function Verification() {
  injectCSS(CSS);

  const navigate = useNavigate();

  // Read ?email= from URL if available
  const emailParam =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email") || ""
      : "";

  const [countdown, setCountdown] = useState(0);
  //   const [toast, setToast]         = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const timerRef = useRef(null);

  const handleResend = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    const response = await fetch(
      "https://formeze-backend.onrender.com/api/auth/createverificationtoken",
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      },
    );
    const data = await response.json();
    if (data.success == true) {
      toast("Verification email resent!");
      setCountdown(60);
    } else {
      toast(data.msg || "Some error occured, please try again later!");
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [countdown]);

  useEffect(() => {
    localStorage.getItem("token") == null && navigate("/login");
    localStorage.getItem("verified") == "true" && navigate("/dashboard");
  }, []);

  useEffect(() => {
    injectCSS(CSS);

    return () => {
      const style = document.getElementById("fz-verify-styles");
      if (style) style.remove();
    };
  }, []);

  /* styles */
  const page = {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'DM Sans',sans-serif",
    color: "#e8edf5",
    background: "#090e10",
  };

  return (
    <>
      <Toaster />
      <div style={page}>
        <BgGrid />
        <Blobs />

        {/* nav */}
        <nav
          style={{
            width: "100%",
            maxWidth: 1100,
            padding: "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Logo />
          <a
            href="#"
            style={{
              fontSize: ".85rem",
              color: "#64748b",
              textDecoration: "none",
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#e8edf5")}
            onMouseLeave={(e) => (e.target.style.color = "#64748b")}
          >
            Back to sign in
          </a>
        </nav>

        {/* main */}
        <main
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px 80px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: "#0c1a0e",
              border: `1px solid ${BRAND_BORDER}`,
              borderRadius: 20,
              padding: "52px 48px 44px",
              width: "100%",
              maxWidth: 480,
              textAlign: "center",
              boxShadow: `0 0 0 1px rgba(255,255,255,.03) inset,
                     0 32px 80px rgba(0,0,0,.6),
                     0 0 70px rgba(42,202,101,.07)`,
              animation: "fadeUp .55s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <EnvelopeIcon />

            <h1
              style={{
                fontFamily: "'Sora',sans-serif",
                fontSize: "1.65rem",
                fontWeight: 700,
                letterSpacing: "-.025em",
                lineHeight: 1.25,
                marginBottom: 12,
              }}
            >
              Check your <span style={{ color: BRAND }}>inbox</span>
            </h1>

            <p
              style={{
                fontSize: ".925rem",
                lineHeight: 1.65,
                color: "#64748b",
                marginBottom: 32,
              }}
            >
              We've sent a verification link to
              <br />
              <strong style={{ color: "#e8edf5", fontWeight: 500 }}>
                {emailParam || "your email address"}
              </strong>
            </p>

            <Steps />

            {/* CTA button */}
            <a
              href={emailParam ? `mailto:${emailParam}` : "mailto:"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                width: "100%",
                padding: "14px 24px",
                borderRadius: 10,
                background: `linear-gradient(135deg, ${BRAND}, #22c55e)`,
                color: "#0a1a0e",
                fontSize: ".92rem",
                fontWeight: 700,
                fontFamily: "'Sora',sans-serif",
                letterSpacing: "-.01em",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                boxShadow: hoverBtn
                  ? `0 8px 32px rgba(42,202,101,.45)`
                  : `0 4px 24px rgba(42,202,101,.28)`,
                transform: hoverBtn ? "translateY(-2px)" : "translateY(0)",
                filter: hoverBtn ? "brightness(1.08)" : "none",
                transition: "transform .18s, box-shadow .18s, filter .18s",
                marginBottom: 20,
              }}
              onMouseEnter={() => setHoverBtn(true)}
              onMouseLeave={() => setHoverBtn(false)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0a1a0e"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              Open Email App
            </a>

            {/* resend */}
            <div style={{ fontSize: ".83rem", color: "#64748b" }}>
              Didn't receive it?{" "}
              <button
                onClick={handleResend}
                disabled={countdown > 0}
                style={{
                  background: "none",
                  border: "none",
                  cursor: countdown > 0 ? "default" : "pointer",
                  color: countdown > 0 ? "#64748b" : BRAND,
                  fontSize: ".83rem",
                  fontFamily: "inherit",
                  padding: 0,
                  opacity: countdown > 0 ? 0.55 : 1,
                  transition: "opacity .2s",
                }}
              >
                Resend email
              </button>
              {countdown > 0 && (
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {" "}
                  ({countdown}s)
                </span>
              )}
            </div>

            {/* footer */}
            <p
              style={{
                fontSize: ".78rem",
                color: "#475569",
                marginTop: 28,
                lineHeight: 1.65,
              }}
            >
              Need help?{" "}
              <Link
                to="/help"
                style={{ color: "rgb(147 151 158)", textUnderlineOffset: 3 }}
              >
                Contact support
              </Link>
            </p>
          </div>
        </main>

        {/* <Toast visible={toast}/> */}
      </div>
    </>
  );
}
