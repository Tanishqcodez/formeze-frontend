import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { Link, useParams, useNavigate} from "react-router-dom";

const BRAND = "#2ACA65";
const BRAND_DIM = "rgba(42,202,101,0.10)";
const BRAND_BORDER = "rgba(42,202,101,0.28)";

function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  rightSlot,
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
          border: `1px solid ${
            error
              ? "#8a3232"
              : focused
              ? BRAND_BORDER
              : "rgba(255,255,255,0.08)"
          }`,
          borderRadius: 12,
          padding: "26px 44px 10px 16px",
          fontSize: 14,
          color: "#d4dde3",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          boxShadow: focused ? `0 0 0 3px ${BRAND_DIM}` : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      />

      {rightSlot && (
        <div
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          {rightSlot}
        </div>
      )}

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

export default function ResetPassword() {
  const canvasRef = useRef(null);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [errors, setErrors] = useState({});

  const params = useParams()
  const navigate = useNavigate()
  const id = params.id


  useEffect(() => {
    if(!id) navigate("/")
  }, [])
  

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let raf,
      t = 0;

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
              Math.pow(y - canvas.height / 2, 2)
          );

          const wave = Math.sin(dist / 60 - t) * 0.5 + 0.5;

          ctx.globalAlpha = wave * 0.4;

          ctx.strokeRect(
            x - size / 2,
            y - size / 2,
            size,
            size
          );
        }
      }

      t += 0.012;

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  const validate = () => {
    const e = {};

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 8) {
      e.password = "Minimum 8 characters";
    }

    if (!confirm) {
      e.confirm = "Please confirm your password";
    } else if (confirm !== password) {
      e.confirm = "Passwords do not match";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    setErrors(e);

    if (Object.keys(e).length > 0) return;

    try {
      setLoading(true);

      const response = await fetch(
        `https://formeze-backend.onrender.com/api/auth/reset/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setDone(true);
        navigate("/dashboard")
      } else {
        toast.error(
          "Some error occured, please try again later!"
        );
      }
    } catch (err) {
      toast.error(
        "Some error occured, please try again later!"
      );
    }

    setLoading(false);
  };

  const EyeIcon = ({ show }) => (
    <button
      type="button"
      onClick={() =>
        show === "pass"
          ? setShowPass((v) => !v)
          : setShowConfirm((v) => !v)
      }
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8aaab8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {(show === "pass"
          ? showPass
          : showConfirm) ? (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        ) : (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        )}
      </svg>
    </button>
  );

  return (
    <>
      <Toaster />

      <div
        style={{
          background: "#0f1117",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "60px 20px",
          minHeight: "100vh",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

          @keyframes fadeUp {
            from {
              opacity:0;
              transform:translateY(18px);
            }

            to {
              opacity:1;
              transform:translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position:200% 0
            }

            100% {
              background-position:-200% 0
            }
          }

          @keyframes spin {
            to {
              transform:rotate(360deg);
            }
          }

          @keyframes checkPop {
            0% {
              transform:scale(0.5);
              opacity:0
            }

            70% {
              transform:scale(1.15)
            }

            100% {
              transform:scale(1);
              opacity:1
            }
          }

          * {
            box-sizing:border-box;
            margin:0;
            padding:0;
          }

          html, body {
            background:#0f1117 !important;
          }

          ::placeholder {
            color: transparent;
          }
        `}</style>

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
            width: "100%",
            maxWidth: 440,
            animation: "fadeUp 0.5s ease both",
          }}
        >
          <div
            style={{
              background: "#161b22",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                height: 4,
                background: `linear-gradient(90deg,#1aa850,${BRAND},#6eefaa,${BRAND},#1aa850)`,
                backgroundSize: "200% 100%",
                animation: "shimmer 3s linear infinite",
              }}
            />

            <div style={{ padding: "36px 32px" }}>
              {done ? (
                <div
                  style={{
                    textAlign: "center",
                    animation: "fadeUp 0.4s ease both",
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      background: BRAND_DIM,
                      border: `1.5px solid ${BRAND_BORDER}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      animation: "checkPop 0.4s ease both",
                    }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                    >
                      <path
                        d="M7 15l6 6 10-12"
                        stroke={BRAND}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#fff",
                      marginBottom: 10,
                    }}
                  >
                    Password updated
                  </h2>

                  <p
                    style={{
                      fontSize: 14,
                      color: "#8aaab8",
                      lineHeight: 1.7,
                      maxWidth: 300,
                      margin: "0 auto 24px",
                    }}
                  >
                    Your password has been changed
                    successfully. You can now sign in with
                    your new password.
                  </p>

                  <Link
                    to="/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "12px 22px",
                      borderRadius: 12,
                      background: BRAND,
                      color: "#04140a",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    Back to sign in
                  </Link>
                </div>
              ) : (
                <>
                  {/* Heading */}
                  <div
                    style={{
                      marginBottom: 28,
                      textAlign: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#fff",
                        marginBottom: 8,
                        letterSpacing: -0.4,
                      }}
                    >
                      Create new password
                    </h2>

                    <p
                      style={{
                        fontSize: 13,
                        color: "#8aaab8",
                        lineHeight: 1.7,
                      }}
                    >
                      Your new password must be different
                      from previously used passwords.
                    </p>
                  </div>

                  {/* Password */}
                  <InputField
                    label="New password *"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    error={errors.password}
                    rightSlot={<EyeIcon show="pass" />}
                  />

                  {/* Confirm */}
                  <InputField
                    label="Confirm password *"
                    type={
                      showConfirm ? "text" : "password"
                    }
                    value={confirm}
                    onChange={(e) =>
                      setConfirm(e.target.value)
                    }
                    error={errors.confirm}
                    rightSlot={
                      <EyeIcon show="confirm" />
                    }
                  />

                  {/* Back */}
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: -8,
                      marginBottom: 22,
                    }}
                  >
                    <Link
                      to="/login"
                      style={{
                        fontSize: 12,
                        color: BRAND,
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Back to sign in
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: loading
                        ? BRAND_DIM
                        : BRAND,
                      color: loading
                        ? BRAND
                        : "#04140a",
                      border: `1px solid ${
                        loading
                          ? BRAND_BORDER
                          : "transparent"
                      }`,
                      borderRadius: 12,
                      padding: "15px 24px",
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily:
                        "'DM Sans',sans-serif",
                      cursor: loading
                        ? "not-allowed"
                        : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          style={{
                            animation:
                              "spin 0.8s linear infinite",
                          }}
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

                        Updating password...
                      </>
                    ) : (
                      <>
                        Update password

                        <svg
                          width="15"
                          height="15"
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

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#8aaab8",
              marginTop: 24,
            }}
          >
            © 2026 Formeze ·{" "}
            <Link
              to="privacy"
              style={{
                color: BRAND,
                textDecoration: "none",
              }}
            >
              Privacy
            </Link>{" "}
            ·{" "}
            <a
              href="#"
              style={{
                color: BRAND,
                textDecoration: "none",
              }}
            >
              Terms
            </a>
          </p>
        </div>
      </div>
    </>
  );
}