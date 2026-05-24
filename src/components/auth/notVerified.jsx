import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const FormezeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="38" height="38" rx="9" fill="#29C964" />
    <rect x="9" y="7" width="16" height="20" rx="2.2" stroke="white" strokeWidth="1.6" fill="none" />
    <path d="M21 7 L25 11 L21 11 Z" fill="white" opacity="0.9" />
    <rect x="11" y="13.5" width="4" height="4" rx="0.8" stroke="white" strokeWidth="1.3" fill="none" />
    <path d="M11.9 15.6 L13 16.7 L14.7 14.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="17" y1="14.5" x2="23" y2="14.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="17" y1="16.5" x2="23" y2="16.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="11" y1="20" x2="23" y2="20" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    <line x1="11" y1="22.5" x2="17.5" y2="22.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function EmailNotVerified() {
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [cooldown, setCooldown] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  useEffect(() => {
    console.log(location.state?.fromDashboard)
    if(!location.state?.fromDashboard){
     navigate("/")
    }
  }, [])
  

  const sendVerificationLink = async () => {
    if (status === "loading" || cooldown > 0) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("https://formeze-backend.onrender.com/api/auth/createverificationtoken", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token")

        },
      });
      const json = await res.json()

      if (!json.success) {
        const data = await res.json().catch(() => ({}));
        throw new Error(json.msg || `Server error`);
      }

      setStatus("sent");
      setCooldown(60);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };


  const isDisabled = status === "loading" || cooldown > 0;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#081008",
        backgroundImage:
          "radial-gradient(ellipse 75% 50% at 50% 0%, rgba(41,201,100,0.13) 0%, transparent 65%)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >
      {/* NAV */}
      <nav
        className="flex items-center px-8 py-4"
        style={{ borderBottom: "1px solid rgba(41,201,100,0.08)" }}
      >
        <div className="flex items-center gap-2.5">
          <FormezeLogo />
          <span className="text-white font-bold text-lg" style={{ letterSpacing: "-0.4px" }}>
            Formeze
          </span>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "#0d1a0e",
            border: "1px solid rgba(41,201,100,0.18)",
            boxShadow: "0 0 0 1px rgba(41,201,100,0.06), 0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* top accent bar */}
          <div
            className="h-[3px]"
            style={{ background: "linear-gradient(90deg, #29C964 0%, rgba(41,201,100,0.15) 100%)" }}
          />

          <div
            className="px-10 pt-10 pb-10"
            style={{ background: "linear-gradient(170deg, #0f2012 0%, #0d1a0e 60%)" }}
          >
            {/* Envelope illustration */}
            <div className="flex justify-center mb-8">
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: 88, height: 88, borderRadius: 22,
                  background: "rgba(41,201,100,0.08)",
                  border: "1.5px solid rgba(41,201,100,0.22)",
                }}
              >
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "#f59e0b", color: "#081008" }}
                >
                  !
                </div>
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                  <rect x="4" y="10" width="36" height="24" rx="4" stroke="#29C964" strokeWidth="1.8" fill="none" />
                  <path d="M4 14.5L22 26L40 14.5" stroke="#29C964" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="text-center text-white font-extrabold leading-tight mb-3"
              style={{ fontSize: 26, letterSpacing: "-0.5px" }}
            >
              Your email is{" "}
              <span style={{ color: "#f59e0b" }}>not verified</span>
            </h1>

            {/* Description */}
            <p className="text-center text-[14.5px] leading-relaxed mb-8" style={{ color: "#8aab8e" }}>
              Your account needs email verification before you can continue.
              Click below and we'll send a verification link to{" "}
              <strong style={{ color: "#c4d9c6", fontWeight: 600 }}>alex@example.com</strong>.
            </p>

            {/* Success banner */}
            {status === "sent" && (
              <div
                className="flex items-start gap-3 rounded-xl p-4 mb-6"
                style={{ background: "rgba(41,201,100,0.08)", border: "1px solid rgba(41,201,100,0.22)" }}
              >
                <div
                  className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "#29C964" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#081008" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-[13.5px] leading-relaxed" style={{ color: "#8aab8e" }}>
                  <strong style={{ color: "#c4d9c6", fontWeight: 600 }}>Verification link sent!</strong>{" "}
                  Check your inbox — and your spam folder just in case.
                </p>
              </div>
            )}

            {/* Error banner */}
            {status === "error" && (
              <div
                className="flex items-start gap-3 rounded-xl p-4 mb-6"
                style={{
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.20)",
                  borderLeft: "3px solid #ef4444",
                }}
              >
                <span className="flex-shrink-0 text-[14px] mt-0.5" style={{ color: "#ef4444" }}>✕</span>
                <p className="text-[13.5px] leading-relaxed" style={{ color: "#b87070" }}>
                  <strong style={{ color: "#fca5a5", fontWeight: 600 }}>Failed to send.</strong>{" "}
                  {errorMsg}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={sendVerificationLink}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-2.5 font-bold text-[14px] rounded-[10px] transition-all duration-200"
              style={{
                padding: "15px 0",
                background: isDisabled ? "rgba(41,201,100,0.15)" : "#29C964",
                color: isDisabled ? "#3d6642" : "#081008",
                cursor: isDisabled ? "not-allowed" : "pointer",
                boxShadow: isDisabled ? "none" : "0 8px 28px rgba(41,201,100,0.22), 0 0 0 1px rgba(41,201,100,0.35)",
                letterSpacing: "0.1px",
              }}
              onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="rgba(8,16,8,0.25)" strokeWidth="2" />
                    <path d="M8.5 2A6.5 6.5 0 0 1 15 8.5" stroke="#3d6642" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Sending…</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="#3d6642" strokeWidth="1.5" fill="none" />
                    <path d="M8.5 5.5V8.5L10.5 10.5" stroke="#3d6642" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Resend in {cooldown}s</span>
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <rect x="1.5" y="4" width="14" height="10" rx="2" stroke="#081008" strokeWidth="1.5" fill="none" />
                    <path d="M1.5 6.5L8.5 11L15.5 6.5" stroke="#081008" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Send Verification Link</span>
                </>
              )}
            </button>
          </div>

          {/* Footer strip */}
          <div
            className="px-10 py-4 flex items-center justify-center"
            style={{ background: "#091209", borderTop: "1px solid rgba(41,201,100,0.08)" }}
          >
            <p className="text-[12.5px]" style={{ color: "#3d6642" }}>
              Having trouble?{" "}
              <Link
                to="/support"
                className="underline"
                style={{ color: "#4d8a54" }}
                onMouseEnter={(e) => (e.target.style.color = "#29C964")}
                onMouseLeave={(e) => (e.target.style.color = "#4d8a54")}
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
