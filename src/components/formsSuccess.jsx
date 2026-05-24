import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const BRAND        = "#29C964";
const BRAND_DIM    = "rgba(41,201,100,0.08)";
const BRAND_BORDER = "rgba(41,201,100,0.18)";
const BG           = "#081008";
const CARD_BG      = "#0d1a0e";

function FormezeLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" rx="9" fill={BRAND} />
      <rect x="9"  y="7"    width="16" height="20" rx="2.2"
            stroke="white" strokeWidth="1.6" fill="none" />
      <path d="M21 7 L25 11 L21 11 Z" fill="white" opacity="0.9" />
      <rect x="11" y="13.5" width="4" height="4" rx="0.8"
            stroke="white" strokeWidth="1.3" fill="none" />
      <path d="M11.9 15.6 L13 16.7 L14.7 14.8"
            stroke="white" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17" y1="14.5" x2="23" y2="14.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="16.5" x2="23" y2="16.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="20"   x2="23" y2="20"   stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="22.5" x2="17.5" y2="22.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function AnimatedCheck({ visible }) {
  return (
    <svg
      width="52" height="52" viewBox="0 0 52 52"
      fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="26" cy="26" r="24"
        stroke={BRAND} strokeWidth="2"
        opacity="0.25"
      />
      <circle
        cx="26" cy="26" r="24"
        stroke={BRAND} strokeWidth="2" fill="none"
        strokeDasharray="150.8"
        strokeDashoffset={visible ? "0" : "150.8"}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.8s cubic-bezier(0.65,0,0.35,1)",
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      <path
        d="M14 26.5L22 34L38 18"
        stroke={BRAND} strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="36"
        strokeDashoffset={visible ? "0" : "36"}
        style={{
          transition: "stroke-dashoffset 0.5s cubic-bezier(0.65,0,0.35,1) 0.6s",
        }}
      />
    </svg>
  );
}

function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 4, height: 4,
        background: BRAND,
        opacity: 0.4,
        ...style,
      }}
    />
  );
}

function DetailRow({ label, value, last = false }) {
  return (
    <div
      className="flex items-center justify-between py-3 px-5"
      style={{ borderBottom: last ? "none" : `1px solid ${BRAND_BORDER}` }}
    >
      <span
        className="text-[11.5px] font-semibold uppercase tracking-wider"
        style={{ color: "#3d6642" }}
      >
        {label}
      </span>
      <span className="text-[13px] font-medium" style={{ color: "#c4d9c6" }}>
        {value}
      </span>
    </div>
  );
}

const CONFETTI_STYLES = `
  @keyframes floatUp {
    0%   { transform: translateY(0px) rotate(0deg);   opacity: 0.7; }
    100% { transform: translateY(-120px) rotate(360deg); opacity: 0;   }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes scalePop {
    0%   { opacity: 0; transform: scale(0.7); }
    60%  { transform: scale(1.05);            }
    100% { opacity: 1; transform: scale(1);   }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .anim-fade-up   { animation: fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-scale-pop { animation: scalePop    0.5s cubic-bezier(0.4,0,0.2,1) both; }
  .shimmer-text {
    background: linear-gradient(90deg, #29C964 0%, #a8f5c4 40%, #29C964 60%, #29C964 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }
`;

function ConfettiDot({ x, delay, size, color }) {
  return (
    <div
      className="absolute bottom-0 rounded-full pointer-events-none"
      style={{
        left:             x,
        width:            size,
        height:           size,
        background:       color,
        opacity:          0,
        animation:        `floatUp 1.4s ease-out ${delay}s forwards`,
      }}
    />
  );
}


export default function SubmissionPage() {
  const [checkVisible,    setCheckVisible]    = useState(false);
  const [contentVisible,  setContentVisible]  = useState(false);
  const [confettiBurst,   setConfettiBurst]   = useState(false);
  const [referenceId]                         = useState(() => generateRefId());

  useEffect(() => {
    const t1 = setTimeout(() => setCheckVisible(true),   150);
    const t2 = setTimeout(() => setContentVisible(true), 600);
    const t3 = setTimeout(() => setConfettiBurst(true),  900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  function generateRefId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return "FZ-" + Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    month:   "short",
    day:     "numeric",
    year:    "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
    hour12:  true,
  });

  const confettiDots = [
    { x: "15%",  delay: 0.0,  size: 6,  color: BRAND           },
    { x: "30%",  delay: 0.1,  size: 4,  color: "#a8f5c4"       },
    { x: "50%",  delay: 0.05, size: 8,  color: BRAND           },
    { x: "65%",  delay: 0.15, size: 5,  color: "rgba(41,201,100,0.6)" },
    { x: "80%",  delay: 0.08, size: 6,  color: "#a8f5c4"       },
    { x: "22%",  delay: 0.2,  size: 4,  color: BRAND           },
    { x: "72%",  delay: 0.12, size: 7,  color: BRAND           },
  ];

  return (
    <>
      <style>{CONFETTI_STYLES}</style>

      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: BG,
          backgroundImage: [
            "radial-gradient(ellipse 70% 50% at 50% 0%,   rgba(41,201,100,0.13) 0%, transparent 60%)",
            "radial-gradient(ellipse 40% 30% at 10% 100%, rgba(41,201,100,0.05) 0%, transparent 55%)",
            "radial-gradient(ellipse 35% 25% at 90% 80%,  rgba(41,201,100,0.05) 0%, transparent 55%)",
          ].join(", "),
          fontFamily: "'DM Sans', 'Inter', sans-serif",
        }}
      >

        <div className="flex-1 flex items-center justify-center px-4 py-0">
          <div className="w-full max-w-md">

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background:  CARD_BG,
                border:      `1px solid ${BRAND_BORDER}`,
                boxShadow: [
                  "0 0 0 1px rgba(41,201,100,0.06)",
                  "0 32px 64px rgba(0,0,0,0.55)",
                  `0 0 80px rgba(41,201,100,0.06)`,
                ].join(", "),
              }}
            >
              <div
                className="h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${BRAND} 0%, rgba(41,201,100,0.2) 100%)`,
                }}
              />

              <div
                className="relative flex flex-col items-center text-center px-10 pt-12 pb-10 overflow-hidden"
                style={{
                  background: "linear-gradient(170deg, #0f2012 0%, #0d1a0e 65%)",
                }}
              >
                <Particle style={{ top: "18%", left: "12%",  width: 3, height: 3 }} />
                <Particle style={{ top: "30%", right: "10%", width: 2, height: 2 }} />
                <Particle style={{ top: "60%", left: "8%",   width: 4, height: 4, opacity: 0.2 }} />
                <Particle style={{ top: "70%", right: "14%", width: 3, height: 3, opacity: 0.2 }} />

                <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                  {confettiBurst && confettiDots.map((d, i) => (
                    <ConfettiDot key={i} {...d} />
                  ))}
                </div>

                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width:      200,
                    height:     200,
                    background: `radial-gradient(circle, rgba(41,201,100,0.10) 0%, transparent 70%)`,
                    top:        "50%",
                    left:       "50%",
                    transform:  "translate(-50%, -80%)",
                  }}
                />

                <div className="mb-6 relative z-10 anim-scale-pop">
                  <AnimatedCheck visible={checkVisible} />
                </div>

                <div
                  className="relative z-10"
                  style={{
                    opacity:   contentVisible ? 1 : 0,
                    transform: contentVisible ? "translateY(0)" : "translateY(14px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                  }}
                >
                  <h1
                    className="font-extrabold leading-tight mb-3"
                    style={{
                      fontSize:      28,
                      letterSpacing: "-0.6px",
                    }}
                  >
                    <span className="text-white">Submission </span>
                    <span className="shimmer-text">received!</span>
                  </h1>

                  <p
                    className="text-[14.5px] leading-relaxed max-w-xs mx-auto"
                    style={{ color: "#8aab8e" }}
                  >
                    Your response has been securely recorded. The form owner
                    has been notified.
                  </p>
                </div>
              </div>

              <div
                style={{
                  opacity:    contentVisible ? 1 : 0,
                  transform:  contentVisible ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                }}
              >
                <div
                  className="mx-8 mt-2 mb-6 rounded-xl overflow-hidden"
                  style={{
                    background: BRAND_DIM,
                    border:     `1px solid ${BRAND_BORDER}`,
                  }}
                >
                  <DetailRow label="Submitted"    value={submittedAt} />
                  <DetailRow label="Status"       last
                    value={
                      <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                        style={{ color: BRAND }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: BRAND }}
                        />
                        Delivered
                      </span>
                    }
                  />
                </div>

                <div className="px-8 mb-8">
                  <p
                    className="text-[11px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "#3d6642" }}
                  >
                    What happens next
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke={BRAND} strokeWidth="2" strokeLinecap="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.91 10.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 18z"/>
                          </svg>
                        ),
                        text: "The form owner will review your submission and may get in touch if needed.",
                      },
                      {
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke={BRAND} strokeWidth="2" strokeLinecap="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        ),
                        text: "A confirmation email has been sent if the form owner enabled that option.",
                      },
                      {
                        icon: (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                               stroke={BRAND} strokeWidth="2" strokeLinecap="round">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                        ),
                        text: "Your data is stored securely and handled per Formeze's privacy policy.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                          style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}` }}
                        >
                          {item.icon}
                        </div>
                        <p className="text-[13px] leading-relaxed" style={{ color: "#8aab8e" }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <button
                    onClick={() => window.history.back()}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 font-bold text-[14px] rounded-[10px] transition-all duration-200"
                    style={{
                      padding:    "14px 0",
                      background: BRAND,
                      color:      "#081008",
                      boxShadow:  "0 8px 28px rgba(41,201,100,0.22), 0 0 0 1px rgba(41,201,100,0.35)",
                      letterSpacing: "0.1px",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                         stroke="#081008" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M19 12H5M5 12l7 7M5 12l7-7" />
                    </svg>
                    Go back to website
                  </button>
                </div>
              </div>

            </div>

            <div
              className="mt-5 flex items-center justify-center gap-2"
              style={{
                opacity:    contentVisible ? 1 : 0,
                transition: "opacity 0.5s ease 0.3s",
              }}
            >
              <span className="text-[12px]" style={{ color: "#2e522f" }}>
                Form powered by
              </span>
              <Link
                to="https://formeze.netlify.app/"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 no-underline"
              >
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: "#3d6642" }}
                  onMouseEnter={(e) => (e.target.style.color = BRAND)}
                  onMouseLeave={(e) => (e.target.style.color = "#3d6642")}
                >
                  Formeze
                </span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
