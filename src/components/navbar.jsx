import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png";

export default function Navbar() {
  const location = useLocation();
  const NAV_LINKS = ["Docs", "Help", "Support"];
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .formeze-nav { font-family: 'DM Sans', sans-serif; }
        .formeze-logo { font-family: 'Syne', sans-serif; }

        .btn-primary-nav {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          transition: all 0.2s ease;
        }
        .btn-primary-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(74, 222, 128, 0.35);
        }
        .logo-glow {
          box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
        }
      `}</style>
      {location.pathname === "/docs" ? null : (
        <header className="formeze-nav  fixed top-0 left-0 right-0   z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0f0a]/80">
          <div
            style={{ padding: "20px" }}
            className="max-w-6xlf  mx-auto px-6 h-16 flex items-center justify-between"
          >
            <div className="flex items-center w-full px-4 gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                <div className="p-0.5 w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center logo-glow">
                  <img src={logo} alt="Formeze Logo" />
                </div>
                <span className="font-display font-extrabold text-white text-lg tracking-tight">
                  Formeze
                </span>
              </Link>

              <div className="h-5 w-px bg-white/10 flex-shrink-0" />
              <span className="text-sm text-white/35 font-medium hidden sm:block">
                {location.pathname.charAt(1).toUpperCase() +
                  location.pathname.slice(2) || "Home"}
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Nav links */}
              <nav className="hidden md:flex  gap-6 text-sm">
                {["Docs", "Help", "Support"].map((l) => (
                  <Link
                    key={l}
                    to={"/" + l}
                    className={`transition-colors font-medium ${l.toLowerCase() === location.pathname.slice(1).toLowerCase() ? "text-green-400" : "text-white/45 hover:text-white"}`}
                  >
                    {l}
                  </Link>
                ))}
                {localStorage.getItem("token") &&
                localStorage.getItem("token") ? (
                  <>
                    <Link
                      to="/dashboard"
                      style={{ padding: "5px" }}
                      className="btn-primary-nav  text-xs font-semibold px-3 py-1.5 rounded-lg text-[#0a0f0a]"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm text-white/50 hover:text-white transition-colors font-medium px-3"
                    >
                      Login
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white/60 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div
              style={{ padding: "20px" }}
              className="p-20 md:hidden border-t border-white/5 bg-[#0a0f0a]  flex flex-row justify-center gap-4"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white/60 hover:text-green-400 transition-colors font-medium"
                >
                  {link}
                </a>
              ))}
              {/* <hr className="border-white/5" /> */}
              <Link
                to="/login"
                style={{ padding: "2px" }}
                className="btn-primary-nav text-sm font-semibold px-4 py-2.5 rounded-lg text-center text-[#0a0f0a]"
              >
                Get started for free
              </Link>
            </div>
          )}
        </header>
      )}
    </>
  );
}
