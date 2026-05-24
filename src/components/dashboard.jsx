import { useState, useLayoutEffect, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Toaster, toast } from "sonner";
import { ScaleLoader } from "react-spinners";


const BRAND = "#2ACA65";
const BRAND_DIM = "rgba(42,202,101,0.10)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";
const NAVBAR_H = 64; 
const ROOT_ID = "fz-dashboard-root";
const STYLE_ID = "fz-dashboard-styles";




function useScopedStyles() {
  useLayoutEffect(() => {
    const FONT_ID = "fz-google-fonts";
    if (!document.getElementById(FONT_ID)) {
      const link = document.createElement("link");
      link.id = FONT_ID;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap";
      document.head.appendChild(link);
    }

    if (document.getElementById(STYLE_ID)) return;

    const R = `#${ROOT_ID}`; 

    const css = `
      /* ── Keyframes (names are namespaced with fz- prefix) ── */
      @keyframes fz-fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fz-fadeIn    { from { opacity:0; }                            to { opacity:1; } }
      @keyframes fz-slideLeft { from { transform:translateX(-100%); }          to { transform:translateX(0); } }
      @keyframes fz-drift1    { to { transform:translate(44px,60px); } }
      @keyframes fz-drift2    { to { transform:translate(-40px,-52px); } }

      /* ── Root wrapper: isolated box model & font ── */
      ${R} {
        box-sizing: border-box;
        font-family: 'DM Sans', sans-serif;
        color: #e8edf5;
        min-height: 100vh;
        background: #090e10;
      }
      ${R} *, ${R} *::before, ${R} *::after {
        box-sizing: inherit;
      }

      /* ── Animation helpers ── */
      ${R} .fz-fadeup  { animation: fz-fadeUp   .48s cubic-bezier(.22,1,.36,1) both; }
      ${R} .fz-fadein  { animation: fz-fadeIn   .28s ease both; }
      ${R} .fz-slidein { animation: fz-slideLeft .28s cubic-bezier(.22,1,.36,1) both; }

      /* ── Card hover ── */
      ${R} .fz-card-hover { transition: border-color .2s, box-shadow .2s; }
      ${R} .fz-card-hover:hover {
        border-color: ${BRAND_BORDER} !important;
        box-shadow: 0 0 28px rgba(42,202,101,.09);
      }

      /* ── Message row ── */
      ${R} .fz-msg-row { transition: background .15s; cursor: pointer; }
      ${R} .fz-msg-row:hover { background: rgba(42,202,101,.045) !important; }

      /* ── Stat grid: 4 col → 2 col on narrow screens ── */
      ${R} .fz-stat-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 14px;
      }
      @media (max-width: 900px) {
        ${R} .fz-stat-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 420px) {
        ${R} .fz-stat-grid { gap: 10px; }
      }

      /* ── Chart grid: side-by-side → stacked ── */
      ${R} .fz-chart-grid {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 14px;
      }
      @media (max-width: 860px) {
        ${R} .fz-chart-grid { grid-template-columns: 1fr; }
      }

      /* ── Desktop sidebar (hidden ≤768px) ── */
      ${R} .fz-sidebar {
        position: fixed;
        top: ${NAVBAR_H}px; left: 0; bottom: 0; width: 220px;
        background: #0a150c;
        border-right: 1px solid ${BRAND_BORDER};
        display: flex; flex-direction: column;
        z-index: 50; padding: 28px 0; overflow-y: auto;
      }
      @media (max-width: 768px) { ${R} .fz-sidebar { display: none; } }

      /* ── Main content ── */
      ${R} .fz-main {
        margin-left: 220px;
        min-height: 100vh;
        position: relative;
        z-index: 1;
      }
      @media (max-width: 768px) {
        ${R} .fz-main { margin-left: 0 !important; padding-bottom: 80px !important; }
      }

      /* ── Mobile topbar (hidden on desktop) ── */
      ${R} .fz-topbar {
        display: none;
        position: sticky;
        top: ${NAVBAR_H}px; z-index: 90;
        background: rgba(9,14,16,.94);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(42,202,101,.12);
        padding: 10px 16px;
        align-items: center; justify-content: space-between;
      }
      @media (max-width: 768px) { ${R} .fz-topbar { display: flex; } }

      /* ── Desktop-only header row ── */
      ${R} .fz-desk-header { display: flex; }
      @media (max-width: 768px) { ${R} .fz-desk-header { display: none; } }

      /* ── Mobile-only page title ── */
      ${R} .fz-mob-title { display: none; }
      @media (max-width: 768px) {
        ${R} .fz-mob-title { display: block; padding-top: 16px; margin-bottom: 18px; }
      }

      /* ── Mobile drawer ── */
      ${R} .fz-drawer {
        position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
        background: #0a150c;
        border-right: 1px solid ${BRAND_BORDER};
        z-index: 210; display: flex; flex-direction: column;
        overflow-y: auto; padding: 24px 0;
      }
      ${R} .fz-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,.62);
        backdrop-filter: blur(4px);
        z-index: 209;
      }

      /* ── Bottom nav (mobile only) ── */
      ${R} .fz-bottom-nav {
        display: none;
        position: fixed; bottom: 0; left: 0; right: 0;
        background: rgba(9,14,16,.97);
        backdrop-filter: blur(14px);
        border-top: 1px solid rgba(42,202,101,.14);
        z-index: 90;
        padding: 6px 0 max(6px, env(safe-area-inset-bottom));
      }
      @media (max-width: 768px) { ${R} .fz-bottom-nav { display: flex; } }

      /* ── Scoped scrollbar (webkit only, non-global) ── */
      ${R} ::-webkit-scrollbar        { width: 4px; }
      ${R} ::-webkit-scrollbar-track  { background: transparent; }
      ${R} ::-webkit-scrollbar-thumb  { background: rgba(42,202,101,.2); border-radius: 4px; }
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

const Ico = {
  Submit: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
  ),
  Form: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 8h10M7 12h6M7 16h4" />
    </svg>
  ),
  Inbox: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
    </svg>
  ),
  Bar: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={BRAND}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  Grid: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Msg: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  Gear: () => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Menu: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e8edf5"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  X: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94a3b8"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bell: ({ active }) => (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? BRAND : "#64748b"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  SignOut: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f87171"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const navItems = [
  { id: "overview", label: "Overview", Icon: Ico.Grid },
  { id: "messages", label: "Messages", Icon: Ico.Msg, badge: true },
  { id: "settings", label: "Settings", Icon: Ico.Gear },
];

function Avatar({ name, size = 36 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bgs = ["#1a3a24", "#1e2e3d", "#2a1e3a", "#2e1a1a"];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: bgs[name.charCodeAt(0) % bgs.length],
        border: `1.5px solid ${BRAND_BORDER}`,
        display: "grid",
        placeItems: "center",
        fontFamily: "'Sora',sans-serif",
        fontWeight: 600,
        fontSize: size > 34 ? ".8rem" : ".68rem",
        color: BRAND,
      }}
    >
      {initials}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: checked ? BRAND : "rgba(255,255,255,.08)",
        position: "relative",
        transition: "background .25s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left .22s cubic-bezier(.22,1,.36,1)",
          boxShadow: "0 1px 4px rgba(0,0,0,.3)",
        }}
      />
    </button>
  );
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0f1f12",
        border: `1px solid ${BRAND_BORDER}`,
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: ".8rem",
        color: "#e8edf5",
      }}
    >
      <div style={{ color: "#64748b", marginBottom: 2 }}>{label}</div>
      <div style={{ color: BRAND, fontWeight: 600 }}>
        {payload[0].value}
        {payload[0].name === "rate" ? "%" : ""}
      </div>
    </div>
  );
}

const cardStyle = (extra = {}) => ({
  background: "#0c1a0e",
  border: `1px solid rgba(42,202,101,0.15)`,
  borderRadius: 14,
  ...extra,
});


function SidebarContent({
  activeTab,
  setActiveTab,
  unread,
  onLogout,
  onClose,
  user,
}) {
  return (
    <>
      <nav
        style={{
          flex: 1,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                onClose?.();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 12px",
                borderRadius: 9,
                border: "none",
                cursor: "pointer",
                background: active ? BRAND_DIM : "transparent",
                color: active ? BRAND : "#64748b",
                fontFamily: "'Sora',sans-serif",
                fontWeight: active ? 600 : 400,
                fontSize: ".875rem",
                textAlign: "left",
                borderLeft: active
                  ? `2px solid ${BRAND}`
                  : "2px solid transparent",
                transition: "all .18s",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <item.Icon />
                {item.label}
              </span>
              {item.badge && unread > 0 && (
                <span
                  style={{
                    background: BRAND,
                    color: "#0a1a0e",
                    borderRadius: 20,
                    fontSize: ".68rem",
                    fontWeight: 700,
                    padding: "1px 7px",
                  }}
                >
                  {unread}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "16px 12px",
          borderTop: "1px solid rgba(42,202,101,.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <Avatar name={user.name} size={34} />
          <div>
            <div
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 600,
                fontSize: ".82rem",
                color: "#e8edf5",
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: ".72rem", color: "#475569" }}>
              Free Plan
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fz-fadein"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        className="fz-fadeup"
        style={{
          ...cardStyle({
            padding: "36px 32px",
            maxWidth: 360,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 32px 80px rgba(0,0,0,.7)",
          }),
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(239,68,68,.1)",
            border: "1px solid rgba(239,68,68,.25)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 18px",
          }}
        >
          <Ico.SignOut />
        </div>
        <h2
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#e8edf5",
            marginBottom: 8,
          }}
        >
          Sign out?
        </h2>
        <p
          style={{
            fontSize: ".875rem",
            color: "#64748b",
            marginBottom: 26,
            lineHeight: 1.6,
          }}
        >
          You'll need to sign back in to access your dashboard.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#94a3b8",
              fontSize: ".875rem",
              fontFamily: "'Sora',sans-serif",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 9,
              background: "rgba(239,68,68,.15)",
              border: "1px solid rgba(239,68,68,.3)",
              color: "#ef4444",
              fontSize: ".875rem",
              fontFamily: "'Sora',sans-serif",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function timeAgo(date) {
if (!date) return "No submissions yet";
const seconds = Math.floor((new Date() - new Date(date)) / 1000);
const intervals = [
  { label: "year",   seconds: 31536000 },
  { label: "month",  seconds: 2592000  },
  { label: "day",    seconds: 86400    },
  { label: "hour",   seconds: 3600     },
  { label: "minute", seconds: 60       },
];
for (const interval of intervals) {
  const count = Math.floor(seconds / interval.seconds);
  if (count >= 1) return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
}
return "Just now";
}
function MessagePanel({ msg, onClose }) {
  return (
    <div
      className="fz-fadein"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        background: "rgba(0,0,0,.55)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="fz-fadeup"
        style={{ ...cardStyle({ padding: 24, maxWidth: 440, width: "100%" }) }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Avatar name={msg.name || msg.username || "User"} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 600,
                color: "#e8edf5",
                fontSize: ".92rem",
              }}
            >
              {msg.name || msg.username || "User"}
            </div>
            <div
              style={{
                fontSize: ".76rem",
                color: "#64748b",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {msg.email || msg.mail || "No email provided"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              fontSize: "1.4rem",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            background: BRAND_DIM,
            border: `1px solid ${BRAND_BORDER}`,
            borderRadius: 7,
            padding: "5px 11px",
            marginBottom: 14,
            fontSize: ".76rem",
            color: BRAND,
            display: "inline-block",
          }}
        >
          Time: {timeAgo(msg.createdAt)}
        </div>
        <p
          style={{
            fontSize: ".88rem",
            color: "#94a3b8",
            lineHeight: 1.7,
            marginBottom: 18,
          }}
        >
          {msg.message || msg.msg || "No message content"}
        </p>
        {(() => {
          const excludedFields = [
            "_id",
            "userId",
            "createdAt",
            "updatedAt",
            "__v",
            "name",
            "username",
            "email",
            "mail",
            "message",
            "msg",
          ];

          const extraFields = Object.entries(msg).filter(
            ([key]) => !excludedFields.includes(key),
          );

          if (extraFields.length === 0) return null;

          return (
            <div
              style={{
                marginBottom: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {extraFields.map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(255,255,255,.06)",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".72rem",
                      color: BRAND,
                      marginBottom: 4,
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </div>

                  <div
                    style={{
                      fontSize: ".84rem",
                      color: "#cbd5e1",
                      wordBreak: "break-word",
                    }}
                  >
                    {String(value)}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 8,
              background: `linear-gradient(135deg,${BRAND},#22c55e)`,
              color: "#0a1a0e",
              fontFamily: "'Sora',sans-serif",
              fontWeight: 700,
              fontSize: ".85rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

//  MAIN DASHBOARD

export default function Dashboard() {
  useScopedStyles();

  const [activeTab, setActiveTab] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [user, setUser] = useState({
    name: "User",
    email: "user@example.com",
    unreadForms: 0,
    emailNotification: true,
    verified: true,
  });
  const [notifEmail, setNotifEmail] = useState(user.emailNotification);
  // Bug fix: was [{}] which injected a phantom submission into stats
  const [form, setForm] = useState([]);
  const [unreadForms, setUnreadForms] = useState({
    // Bug fix: parse as Number — localStorage returns a string, breaking arithmetic
    previous: Number(localStorage.getItem("nof")) || 0,
    current: 0,
    unread: 0,
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const navigate = useNavigate();

  // ── API helpers ──────────────────────────────────────────────────────────────
  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://formeze-backend.onrender.com/api/auth/fetch",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      const json = await response.json();

      if (!json.user?.verified) {
        navigate("/notverified", {
          state: {fromDashboard: true, user: user}
        });
        return;
      }

      setUser(json.user);
      setNotifEmail(json.user.emailNotification);
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
    }
  };

  const fetchForms = async () => {
    try {
      const response = await fetch(
        "https://formeze-backend.onrender.com/form/fetch",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        },
      );

      const json = await response.json();

      if (response.status === 200) {
        const docs = json.document ?? [];
        setForm(docs);
        setUnreadForms((prev) => ({
          ...prev,
          current: docs.length,
          unread: docs.length > prev.previous ? docs.length - prev.previous : 0,
        }));
        localStorage.setItem("nof", docs.length);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch forms");
    }
  };

  const toggleEmailNotification = async () => {
    setEmailLoading(true);
    try {
      const response = await fetch(
        "https://formeze-backend.onrender.com/toggle/email",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        },
      );
      if (response.ok) {
        setNotifEmail((prev) => !prev);
      } else {
        toast.error("Failed to update notification preference.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update notification preference.");
    } finally {
      setEmailLoading(false);
    }
  };


  useEffect(() => {
    fetchUser();
    fetchForms();
  }, []);

  if (loggedOut)
    return (
      <div
        id={ROOT_ID}
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          fontFamily: "'Sora',sans-serif",
          color: "#64748b",
          fontSize: ".95rem",
        }}
      >
        You've been signed out.{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setLoggedOut(false);
          }}
          style={{ color: BRAND }}
        >
          Sign back in
        </a>
      </div>
    );

  const tabLabel = {
    overview: "Dashboard",
    messages: "Messages",
    settings: "Settings",
  };

  const tabSub = {
    overview: `Welcome back, ${user.name} 👋`,
    messages: `${unreadForms.unread} unread message${unreadForms.unread !== 1 ? "s" : ""}`,
    settings: "Manage your preferences",
  };

  



  const statItems = [
    {
      label: "Total Submissions",
      value: form.length,
      Icon: Ico.Submit,
    },
    { label: "Plan", value: "Free Tier", Icon: Ico.Form },
    {
      label: "Unread Messages",
      value: unreadForms.unread,
      delta:
        unreadForms.unread == 0
          ? "0%"
          : parseInt(((form.length - unreadForms.unread) / form.length) * 100) +
            "%",
      Icon: Ico.Inbox,
    },
    {
      label: "Last Submission",
      value: timeAgo(form[form.length - 1]?.createdAt),
      Icon: Ico.Bar,
    },
  ];

  // Bug fix: these were rebuilt on every render; useMemo recomputes only when `form` changes
  const submissionsData = useMemo(() => {
    const days = [
      { day: "Mon", submissions: 0 },
      { day: "Tue", submissions: 0 },
      { day: "Wed", submissions: 0 },
      { day: "Thu", submissions: 0 },
      { day: "Fri", submissions: 0 },
      { day: "Sat", submissions: 0 },
      { day: "Sun", submissions: 0 },
    ];
    form.forEach((item) => {
      const day = new Date(item.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      const found = days.find((d) => d.day === day);
      if (found) found.submissions += 1;
    });
    return days;
  }, [form]);

  const monthlyData = useMemo(() => {
    const months = [
      { month: "Jan", submissions: 0 }, { month: "Feb", submissions: 0 },
      { month: "Mar", submissions: 0 }, { month: "Apr", submissions: 0 },
      { month: "May", submissions: 0 }, { month: "Jun", submissions: 0 },
      { month: "Jul", submissions: 0 }, { month: "Aug", submissions: 0 },
      { month: "Sep", submissions: 0 }, { month: "Oct", submissions: 0 },
      { month: "Nov", submissions: 0 }, { month: "Dec", submissions: 0 },
    ];
    form.forEach((item) => {
      const month = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short" });
      const found = months.find((m) => m.month === month);
      if (found) found.submissions += 1;
    });
    return months;
  }, [form]);

  const signOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Toaster />
      <div id={ROOT_ID}>
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              top: -200,
              left: -160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(42,202,101,.12) 0%, transparent 70%)",
              filter: "blur(90px)",
              animation: "fz-drift1 13s ease-in-out infinite alternate",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 460,
              height: 460,
              bottom: -150,
              right: -100,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(42,202,101,.07) 0%, transparent 70%)",
              filter: "blur(90px)",
              animation: "fz-drift2 15s ease-in-out infinite alternate",
            }}
          />
        </div>

        <aside className="fz-sidebar">
          <SidebarContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unread={unreadForms.unread}
            onLogout={() => setShowLogout(true)}
            user={user}
          />
        </aside>

        {/* ── Mobile drawer + overlay ── */}
        {drawerOpen && (
          <>
            <div
              className="fz-overlay fz-fadein"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fz-drawer fz-slidein">
              <SidebarContent
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                // Bug fix: `unread` was undefined — should be unreadForms.unread
                unread={unreadForms.unread}
                onLogout={() => {
                  setDrawerOpen(false);
                  setShowLogout(true);
                }}
                onClose={() => setDrawerOpen(false)}
                // Bug fix: user prop was missing, causing crash inside SidebarContent
                user={user}
              />
            </div>
          </>
        )}

        {/* ── Mobile topbar ── */}
        <div className="fz-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
              }}
            >
              <Ico.Menu />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `linear-gradient(135deg,${BRAND},#22c55e)`,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0a1a0e"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                >
                  <path d="M4 6h16M4 10h10M4 14h6" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 700,
                  fontSize: ".95rem",
                }}
              >
                Formeze
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                background: BRAND_DIM,
                border: `1px solid ${BRAND_BORDER}`,
                borderRadius: 8,
                padding: "7px 8px",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Ico.Bell active={unreadForms.unread > 0} />
            </button>
            <Avatar name={user.name} size={32} />
          </div>
        </div>

        {/* ── Main content ── */}
        <main
          className="fz-main"
          style={{ padding: `${NAVBAR_H + 32}px 28px 48px` }}
        >
          {/* Desktop page header */}
          <div
            className="fz-desk-header fz-fadeup"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Sora',sans-serif",
                  fontWeight: 700,
                  fontSize: "1.55rem",
                  letterSpacing: "-.025em",
                  marginBottom: 4,
                  color: "#e8edf5",
                }}
              >
                {tabLabel[activeTab]}
              </h1>
              <p style={{ fontSize: ".875rem", color: "#64748b" }}>
                {tabSub[activeTab]}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={user.name} size={38} />
            </div>
          </div>

          {/* Mobile page title */}
          <div className="fz-mob-title fz-fadeup">
            <h1
              style={{
                fontFamily: "'Sora',sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                letterSpacing: "-.02em",
                color: "#e8edf5",
              }}
            >
              {tabLabel[activeTab]}
            </h1>
            <p style={{ fontSize: ".8rem", color: "#64748b", marginTop: 3 }}>
              {tabSub[activeTab]}
            </p>
          </div>

          {/* ══ OVERVIEW ══ */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="fz-stat-grid fz-fadeup">
                {statItems.map((s, i) => (
                  <div
                    key={i}
                    className="fz-card-hover"
                    style={{
                      ...cardStyle({ padding: "18px" }),
                      animationDelay: `${i * 0.07}s`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          background: BRAND_DIM,
                          border: `1px solid ${BRAND_BORDER}`,
                          borderRadius: 8,
                          padding: "6px 7px",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <s.Icon />
                      </div>
                      {s.delta && (
                        <span
                          style={{
                            fontSize: ".7rem",
                            color: BRAND,
                            fontWeight: 600,
                            background: BRAND_DIM,
                            borderRadius: 20,
                            padding: "2px 8px",
                          }}
                        >
                          {s.delta}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontWeight: 700,
                        fontSize: "1.55rem",
                        letterSpacing: "-.03em",
                        color: "#e8edf5",
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "#64748b",
                        marginTop: 3,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Endpoint URL Card ── */}
              <div
                className="fz-card-hover fz-fadeup"
                style={{
                  ...cardStyle({ padding: "20px 22px" }),
                  animationDelay: ".1s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          background: BRAND_DIM,
                          border: `1px solid ${BRAND_BORDER}`,
                          borderRadius: 7,
                          padding: "5px 6px",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={BRAND}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontWeight: 600,
                          fontSize: ".9rem",
                          color: "#e8edf5",
                        }}
                      >
                        Your Form Endpoint
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: ".78rem",
                        color: "#64748b",
                        marginBottom: 12,
                        lineHeight: 1.55,
                      }}
                    >
                      Point your HTML form's{" "}
                      <code
                        style={{
                          color: BRAND,
                          background: BRAND_DIM,
                          padding: "1px 5px",
                          borderRadius: 4,
                          fontSize: ".75rem",
                        }}
                      >
                        action
                      </code>{" "}
                      attribute to this URL to receive submissions in your
                      dashboard.
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "#060d08",
                        border: `1px solid ${BRAND_BORDER}`,
                        borderRadius: 9,
                        padding: "10px 14px",
                        overflow: "hidden",
                      }}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0 }}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontSize: ".8rem",
                          color: BRAND,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                          letterSpacing: ".01em",
                        }}
                      >
                        {`https://formeze-backend.onrender.com/f/${user._id}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://formeze-backend.onrender.com/f/${user._id}`,
                      );
                      toast.success("Endpoint URL copied!");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "10px 16px",
                      borderRadius: 9,
                      background: BRAND_DIM,
                      border: `1px solid ${BRAND_BORDER}`,
                      color: BRAND,
                      fontSize: ".8rem",
                      fontFamily: "'Sora',sans-serif",
                      fontWeight: 600,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "background .18s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={BRAND}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy URL
                  </button>
                </div>
              </div>

              <div className="fz-chart-grid">
                <div
                  className="fz-card-hover fz-fadeup"
                  style={{
                    ...cardStyle({ padding: "20px" }),
                    animationDelay: ".15s",
                  }}
                >
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontWeight: 600,
                        fontSize: ".9rem",
                        color: "#e8edf5",
                      }}
                    >
                      Weekly Submissions
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "#64748b",
                        marginTop: 2,
                      }}
                    >
                      Total form responses this week
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart
                      data={submissionsData}
                      margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                    >
                      <defs>
                        <linearGradient id="fz-ag1" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor={BRAND}
                            stopOpacity={0.28}
                          />
                          <stop
                            offset="100%"
                            stopColor={BRAND}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(42,202,101,.07)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "#475569", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#475569", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTip />} />
                      <Area
                        type="monotone"
                        dataKey="submissions"
                        stroke={BRAND}
                        strokeWidth={2.2}
                        fill="url(#fz-ag1)"
                        dot={{ fill: BRAND, r: 3, strokeWidth: 0 }}
                        activeDot={{
                          r: 5,
                          fill: BRAND,
                          stroke: "#0c1a0e",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className="fz-card-hover fz-fadeup"
                  style={{
                    ...cardStyle({ padding: "20px" }),
                    animationDelay: ".22s",
                  }}
                >
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontWeight: 600,
                        fontSize: ".9rem",
                        color: "#e8edf5",
                      }}
                    >
                      Monthly Submissions
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "#64748b",
                        marginTop: 2,
                      }}
                    >
                      Total form response Monthly
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 4, right: 4, bottom: 0, left: -22 }}
                      barSize={13}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(42,202,101,.07)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#475569", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#475569", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                      />
                      <Tooltip content={<ChartTip />} />
                      <Bar
                        dataKey="submissions"
                        fill={BRAND}
                        radius={[5, 5, 0, 0]}
                        fillOpacity={0.85}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ══ MESSAGES ══ */}
          {activeTab === "messages" && (
            <div
              className="fz-fadeup"
              style={{ ...cardStyle({ overflow: "hidden" }) }}
            >
              {[...form].reverse().map((msg, i) => (
                <div
                  key={msg._id}
                  className="fz-msg-row"
                  onClick={() => setSelectedMsg(msg)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    borderBottom:
                      i < form.length - 1
                        ? "1px solid rgba(42,202,101,.07)"
                        : "none",
                  }}
                >
                  <Avatar name={msg.name || msg.username || "User"} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Sora',sans-serif",
                          fontWeight: 700,
                          fontSize: ".86rem",
                          color: "#e8edf5",
                        }}
                      >
                        {msg.name}
                      </span>
                      <span
                        style={{
                          fontSize: ".7rem",
                          color: "#475569",
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      >
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "#64748b",
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ color: BRAND, fontWeight: 500 }}>
                        {msg.message || msg.msg || ""}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "#475569",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {msg.msg}
                    </div>
                  </div>
                  {msg.unread && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: BRAND,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeTab === "settings" && (
            <div
              className="fz-fadeup"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                maxWidth: 540,
              }}
            >
              <div
                className="fz-card-hover"
                style={{ ...cardStyle({ padding: "22px" }) }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Sora',sans-serif",
                        fontWeight: 600,
                        fontSize: ".9rem",
                        color: "#e8edf5",
                        marginBottom: 5,
                      }}
                    >
                      Email Notifications
                    </div>
                    <div
                      style={{
                        fontSize: ".82rem",
                        color: "#64748b",
                        lineHeight: 1.65,
                      }}
                    >
                      Receive an email whenever someone submits one of your
                      forms. Includes a preview of the submission.
                    </div>
                  </div>
                  {emailLoading ? (
                    <ScaleLoader color="#29C763" />
                  ) : (
                    <Toggle
                      checked={notifEmail}
                      onChange={toggleEmailNotification}
                    />
                  )}
                </div>
                {notifEmail && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "9px 14px",
                      borderRadius: 8,
                      background: BRAND_DIM,
                      border: `1px solid ${BRAND_BORDER}`,
                      fontSize: ".78rem",
                      color: BRAND,
                    }}
                  >
                    ✓ Notifications sent to <strong>{user.email}</strong>
                  </div>
                )}
              </div>

              <div
                style={{
                  ...cardStyle({
                    padding: "22px",
                    borderColor: "rgba(239,68,68,.2)",
                  }),
                }}
              >
                <div
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontWeight: 600,
                    fontSize: ".88rem",
                    color: "#f87171",
                    marginBottom: 6,
                  }}
                >
                  Danger Zone
                </div>
                <div
                  style={{
                    fontSize: ".82rem",
                    color: "#64748b",
                    marginBottom: 16,
                  }}
                >
                  Signing out will end your current session on this device.
                </div>
                <button
                  onClick={() => setShowLogout(true)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    background: "rgba(239,68,68,.1)",
                    border: "1px solid rgba(239,68,68,.25)",
                    color: "#f87171",
                    fontSize: ".85rem",
                    fontFamily: "'Sora',sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ── Mobile bottom nav ── */}
        <nav className="fz-bottom-nav">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 0",
                  color: active ? BRAND : "#475569",
                  transition: "color .18s",
                  position: "relative",
                }}
              >
                <item.Icon />
                <span
                  style={{
                    fontFamily: "'Sora',sans-serif",
                    fontWeight: active ? 600 : 400,
                    fontSize: ".62rem",
                    letterSpacing: ".02em",
                  }}
                >
                  {item.label}
                </span>
                {item.badge && unreadForms.unread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 2,
                      right: "calc(50% - 18px)",
                      minWidth: 15,
                      height: 15,
                      borderRadius: 20,
                      background: BRAND,
                      color: "#0a1a0e",
                      fontSize: ".58rem",
                      fontWeight: 800,
                      padding: "0 4px",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {unreadForms.unread > 9 ? "9+" : unreadForms.unread}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Modals */}
        {showLogout && (
          <LogoutModal
            onConfirm={() => {
              setShowLogout(false);
              setLoggedOut(true);
              signOut();
            }}
            onCancel={() => setShowLogout(false)}
          />
        )}
        {selectedMsg && (
          <MessagePanel
            msg={selectedMsg}
            onClose={() => setSelectedMsg(null)}
          />
        )}
      </div>
    </>
  );
}
