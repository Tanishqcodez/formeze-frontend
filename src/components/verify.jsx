import { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { toast, Toaster } from "sonner";


const BRAND = "#2ACA65";
const BRAND_DIM = "rgb(137, 149, 166)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

const GridBg = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.045 }}
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2ACA65" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const PulseDot = ({ delay = 0, size = 6 }) => (
  <span
    className="rounded-full inline-block"
    style={{
      width: size,
      height: size,
      backgroundColor: BRAND,
      animation: `pulse-dot 1.4s ease-in-out ${delay}s infinite`,
    }}
  />
);

export default function Verify() {
  const [tick, setTick] = useState(0);

    const params = useParams();
    const navigate = useNavigate();
  
   useEffect(() => {
     if(!params.id || !localStorage.getItem("token")) {
      navigate("/login");
    }

   }, [params.id, localStorage.getItem("token")]);
   
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
  const verifyUser = async () => {
    const response = await fetch(
      `https://formeze-backend.onrender.com/api/auth/verify/${params.id}`,
      {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    const data = await response.json();

    if (data.success === true) {
      toast("Account Verified Successfully!");
      localStorage.setItem("verified", true)
      navigate("/dashboard");
    } else {
      toast(data.msg || "Some error occured, please try again later!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  verifyUser();
}, [params.id]);
  

  return (
   <>
   <Toaster></Toaster>
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0b0f0d", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
          40%            { opacity: 1;   transform: scale(1);    }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-rev {
          to { transform: rotate(-360deg); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10%       { opacity: 1;       }
          90%       { opacity: 1;       }
          100%      { top: 100%;        }
        }

        .fade-up { animation: fade-up 0.7s ease both; }
        .fade-up-1 { animation: fade-up 0.7s 0.15s ease both; }
        .fade-up-2 { animation: fade-up 0.7s 0.3s  ease both; }
        .fade-up-3 { animation: fade-up 0.7s 0.45s ease both; }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #2ACA65 0%,
            #ffffff 40%,
            #2ACA65 60%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.2s linear infinite;
        }

        .ring-outer {
          animation: spin-slow 9s linear infinite;
        }
        .ring-inner {
          animation: spin-rev 6s linear infinite;
        }

        .scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #2ACA65, transparent);
          animation: scan 2.4s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <GridBg />

      {/* ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 520,
          height: 520,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(42,202,101,0.07) 0%, transparent 70%)",
        }}
      />

      {/* wordmark */}
      <div className="absolute top-8 left-0 right-0 flex justify-center fade-up">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded"
            style={{
              backgroundColor: BRAND,
              boxShadow: `0 0 10px ${BRAND}55`,
            }}
          />
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: BRAND_DIM, letterSpacing: "0.18em", fontFamily: "'DM Mono', monospace" }}
          >
            Formeze
          </span>
        </div>
      </div>

      {/* main card */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-8 py-12 rounded-2xl fade-up"
        style={{
          border: `1px solid ${BRAND_BORDER}`,
          background: "rgba(255,255,255,0.025)",
          backdropFilter: "blur(12px)",
          maxWidth: 440,
          width: "90%",
        }}
      >
        {/* icon ring stack */}
        <div className="relative flex items-center justify-center mb-10" style={{ width: 112, height: 112 }}>
          {/* outer ring */}
          <svg
            className="ring-outer absolute inset-0"
            width="112" height="112" viewBox="0 0 112 112"
            fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="56" cy="56" r="54" stroke={BRAND_BORDER} strokeWidth="1" />
            <circle cx="56" cy="4" r="3" fill={BRAND} opacity="0.9" />
            <circle cx="56" cy="108" r="2" fill={BRAND} opacity="0.4" />
            <circle cx="4" cy="56" r="2" fill={BRAND} opacity="0.5" />
          </svg>

          {/* inner ring */}
          <svg
            className="ring-inner absolute"
            style={{ width: 78, height: 78 }}
            viewBox="0 0 78 78"
            fill="none" xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="39" cy="39" r="37" stroke={BRAND_BORDER} strokeWidth="0.8" strokeDasharray="4 6" />
          </svg>

          {/* icon bg */}
          <div
            className="relative z-10 rounded-xl flex items-center justify-center"
            style={{
              width: 52,
              height: 52,
              background: "rgba(42,202,101,0.10)",
              border: `1px solid ${BRAND_BORDER}`,
            }}
          >
            {/* scan line inside icon */}
            <div className="scan-line" />
            {/* envelope icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2.5" stroke={BRAND} strokeWidth="1.5" />
              <path d="M2 7.5L10.77 13.2a2 2 0 0 0 2.46 0L22 7.5" stroke={BRAND} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* heading */}
        <h1
          className="shimmer-text fade-up-1 mb-3"
          style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2 }}
        >
          Verifying your email
        </h1>

        {/* sub */}
        <p
          className="fade-up-2 mb-8"
          style={{ color: BRAND_DIM, fontSize: 14, lineHeight: 1.7, maxWidth: 300 }}
        >
          We're confirming your address. This only takes a moment.
        </p>

        {/* dots */}
        <div className="fade-up-3 flex items-center gap-3">
          <PulseDot delay={0}   size={7} />
          <PulseDot delay={0.2} size={7} />
          <PulseDot delay={0.4} size={7} />
        </div>

        {/* bottom status chip */}
        <div
          className="mt-10 fade-up-3 flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(42,202,101,0.07)",
            border: `1px solid ${BRAND_BORDER}`,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: BRAND, display: "inline-block" }} />
          <span style={{ color: BRAND, fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
            SECURE · FORMEZE
          </span>
        </div>
      </div>

      {/* footer */}
      <p
        className="absolute bottom-6 text-xs fade-up-3"
        style={{ color: "rgba(137,149,166,0.5)", letterSpacing: "0.05em" }}
      >
        © {new Date().getFullYear()} Formeze — Form submissions without backend
      </p>
    </div>
   </>
  );
}
