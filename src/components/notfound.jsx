import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

const BRAND = "#2ACA65";
const BRAND_DIM = "rgba(42,202,101,0.10)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

const ROOT_ID = "fz-404-root";
const STYLE_ID = "fz-404-styles";

function use404Styles() {
  useLayoutEffect(() => {
    const FONT_ID = "fz-google-fonts";
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement("link");
      link.id = FONT_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }

    if (document.getElementById(STYLE_ID)) return;

    const css = `
      @keyframes fz404-drift1    { to { transform: translate(40px, 55px); } }
      @keyframes fz404-drift2    { to { transform: translate(-35px, -50px); } }
      @keyframes fz404-fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fz404-pulse     { 0%,100% { opacity:.6; } 50% { opacity:1; } }
      @keyframes fz404-scanline  { from { transform:translateY(-100%); } to { transform:translateY(100vh); } }
      @keyframes fz404-glitch1 {
        0%,90%,100% { clip-path:none; transform:none; }
        91% { clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%); transform:translateX(-4px); }
        93% { clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%); transform:translateX(4px); }
        95% { clip-path:none; transform:none; }
      }
      @keyframes fz404-glitch2 {
        0%,88%,100% { clip-path:none; transform:none; opacity:0; }
        89% { clip-path:polygon(0 30%,100% 30%,100% 50%,0 50%); transform:translateX(6px); opacity:.5; }
        91% { clip-path:polygon(0 70%,100% 70%,100% 85%,0 85%); transform:translateX(-6px); opacity:.5; }
        93% { opacity:0; }
      }

      #${ROOT_ID} {
        font-family: 'DM Sans', sans-serif;
        background: #090e10;
        color: #e8edf5;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 48px 24px;
        box-sizing: border-box;
      }
      #${ROOT_ID} *, #${ROOT_ID} *::before, #${ROOT_ID} *::after {
        box-sizing: inherit;
      }

      #${ROOT_ID} .fz404-orb {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(80px);
      }
      #${ROOT_ID} .fz404-orb-1 {
        width: 520px; height: 520px;
        top: -200px; left: -180px;
        background: radial-gradient(circle, rgba(42,202,101,.1) 0%, transparent 70%);
        animation: fz404-drift1 13s ease-in-out infinite alternate;
      }
      #${ROOT_ID} .fz404-orb-2 {
        width: 400px; height: 400px;
        bottom: -160px; right: -120px;
        background: radial-gradient(circle, rgba(42,202,101,.06) 0%, transparent 70%);
        animation: fz404-drift2 15s ease-in-out infinite alternate;
      }

      #${ROOT_ID} .fz404-grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(42,202,101,.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(42,202,101,.04) 1px, transparent 1px);
        background-size: 48px 48px;
        pointer-events: none;
      }

      #${ROOT_ID} .fz404-scanline {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(to bottom, transparent, rgba(42,202,101,.08), transparent);
        animation: fz404-scanline 6s linear infinite;
        pointer-events: none;
      }

      #${ROOT_ID} .fz404-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        animation: fz404-fadeUp .6s cubic-bezier(.22,1,.36,1) both;
      }

      #${ROOT_ID} .fz404-num-wrap {
        position: relative;
        margin-bottom: 8px;
      }

      #${ROOT_ID} .fz404-num {
        font-family: 'Sora', sans-serif;
        font-weight: 700;
        font-size: clamp(96px, 18vw, 148px);
        letter-spacing: -.04em;
        color: transparent;
        -webkit-text-stroke: 1.5px rgba(42,202,101,.35);
        line-height: 1;
        animation: fz404-glitch1 7s ease infinite;
        user-select: none;
      }

      #${ROOT_ID} .fz404-num-ghost {
        position: absolute;
        inset: 0;
        font-family: 'Sora', sans-serif;
        font-weight: 700;
        font-size: clamp(96px, 18vw, 148px);
        letter-spacing: -.04em;
        color: rgba(42,202,101,.15);
        line-height: 1;
        animation: fz404-glitch2 7s ease infinite;
        user-select: none;
      }

      #${ROOT_ID} .fz404-icon {
        width: 56px; height: 56px;
        border-radius: 14px;
        background: ${BRAND_DIM};
        border: 1px solid ${BRAND_BORDER};
        display: grid;
        place-items: center;
        margin-bottom: 22px;
        animation: fz404-pulse 3s ease-in-out infinite;
      }

      #${ROOT_ID} .fz404-title {
        font-family: 'Sora', sans-serif;
        font-weight: 700;
        font-size: clamp(1.15rem, 3vw, 1.5rem);
        color: #e8edf5;
        letter-spacing: -.02em;
        margin: 0 0 10px;
      }

      #${ROOT_ID} .fz404-sub {
        font-size: .88rem;
        color: #64748b;
        line-height: 1.7;
        max-width: 360px;
        margin: 0 0 36px;
      }

      #${ROOT_ID} .fz404-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
      }

      #${ROOT_ID} .fz404-btn-primary {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 11px 22px;
        border-radius: 9px;
        background: ${BRAND};
        border: none;
        color: #060e09;
        font-family: 'Sora', sans-serif;
        font-weight: 600;
        font-size: .875rem;
        cursor: pointer;
        text-decoration: none;
        transition: opacity .18s;
      }
      #${ROOT_ID} .fz404-btn-primary:hover { opacity: .85; }

      #${ROOT_ID} .fz404-btn-ghost {
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 11px 22px;
        border-radius: 9px;
        background: ${BRAND_DIM};
        border: 1px solid ${BRAND_BORDER};
        color: ${BRAND};
        font-family: 'Sora', sans-serif;
        font-weight: 600;
        font-size: .875rem;
        cursor: pointer;
        transition: background .18s;
      }
      #${ROOT_ID} .fz404-btn-ghost:hover { background: rgba(42,202,101,.16); }

      #${ROOT_ID} .fz404-breadcrumb {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: .74rem;
        color: #334155;
        margin-top: 40px;
        font-family: 'Sora', sans-serif;
      }
      #${ROOT_ID} .fz404-breadcrumb span { color: ${BRAND}; }
    `;

    const tag = document.createElement("style");
    tag.id = STYLE_ID;
    tag.textContent = css;
    document.head.appendChild(tag);

    return () => {
      document.getElementById(STYLE_ID)?.remove();
    };
  }, []);
}

export default function NotFound() {
  use404Styles();
  const navigate = useNavigate();

  return (
    <div id={ROOT_ID}>
      {/* Background orbs */}
      <div className="fz404-orb fz404-orb-1" />
      <div className="fz404-orb fz404-orb-2" />

      {/* Grid + scanline */}
      <div className="fz404-grid" />
      <div className="fz404-scanline" />

      <div className="fz404-content">
        {/* Glitching 404 number */}
        <div className="fz404-num-wrap">
          <div className="fz404-num-ghost">404</div>
          <div className="fz404-num">404</div>
        </div>

        {/* Icon */}
        <div className="fz404-icon">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BRAND}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v4M11 16h.01" />
          </svg>
        </div>

        <h1 className="fz404-title">Page not found</h1>
        <p className="fz404-sub">
          The page you're looking for has gone missing or never existed.
          Double-check the URL or head back to your dashboard.
        </p>

        <div className="fz404-actions">
          <button
            className="fz404-btn-primary"
            onClick={() => navigate("/")}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to Home Page
          </button>
          <button
            className="fz404-btn-ghost"
            onClick={() => navigate(-1)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>
        </div>

        <div className="fz404-breadcrumb">
          formeze <span>/</span> <span>404</span>
        </div>
      </div>
    </div>
  );
}
