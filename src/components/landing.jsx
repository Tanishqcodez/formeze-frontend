import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";


const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Instant Setup",
    desc: "Point your form's action attribute to your Formeze endpoint. No config files, no CLI tools. Live in under 60 seconds.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: "Zero Backend",
    desc: "No servers. No databases. No APIs to maintain. Formeze is the backend you never have to build.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: "Email Notifications",
    desc: "Every submission lands in your inbox in real time. Stay in the loop without ever opening a dashboard.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Spam Protection",
    desc: "Built-in honeypot fields and reCAPTCHA support filter noise so your inbox stays clean.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Submission Dashboard",
    desc: "Browse, search, and export every submission from a clean web interface. CSV exports included.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    title: "Works Everywhere",
    desc: "Vanilla HTML, React, Vue, Next.js, Jekyll, Hugo — if it renders a form, Formeze handles it.",
  },
];

const STEPS = [
  { num: "01", title: "Create an endpoint", body: "Sign up and generate a unique form endpoint URL from your Formeze dashboard." },
  { num: "02", title: "Wire your form", body: 'Set your form\'s action to your endpoint. Add method="POST" and you\'re done.' },
  { num: "03", title: "Receive submissions", body: "Hit publish. Every submission is captured instantly — no servers required." },
];



function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Landing() {
  const [copied, setCopied] = useState(false);

const NAV_LINKS = ["Docs", "Help", "Support"];
const [mobileOpen, setMobileOpen] = useState(false);

  const codeSnippet = `<form action="https://formeze-backend.onrender.com/f/YOUR_ID" method="POST">
  <input type="text" name="name" placeholder="Your name" />
  <input type="email" name="email" placeholder="Email" />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Send</button>
</form>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
   
    <div className="min-h-screen bg-[#0a0f0a] text-white font-sans overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; }

        .font-display { font-family: 'Syne', sans-serif; }

        .glow-green {
          box-shadow: 0 0 40px rgba(74, 222, 128, 0.15), 0 0 80px rgba(74, 222, 128, 0.05);
        }
        .glow-text {
          text-shadow: 0 0 40px rgba(74, 222, 128, 0.4);
        }
        .grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .noise::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(74, 222, 128, 0.35) !important;
          box-shadow: 0 8px 40px rgba(74, 222, 128, 0.1);
        }
        .btn-primary {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(74, 222, 128, 0.35);
        }
        .hero-gradient {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(74,222,128,0.12) 0%, transparent 70%);
        }
        .step-line::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(74,222,128,0.4), transparent);
        }
        .badge {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25);
        }
        code, pre { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .code-block {
          background: #0d1a0d;
          border: 1px solid rgba(74,222,128,0.15);
        }
        .highlight-plan {
          background: linear-gradient(145deg, #0f1f0f, #0d180d);
          border: 1px solid rgba(74,222,128,0.45) !important;
        }
        .tag-pill {
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.18);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-anim { animation: float 5s ease-in-out infinite; }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        .fade-in {
          animation: fadeIn 0.6s ease both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    

      {/* HERO */}
      <section className="relative pt-32 pb-24 grid-bg hero-gradient overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full" style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 badge rounded-full px-4 py-1.5 mb-8 fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 relative">
              <span className="absolute inset-0 rounded-full bg-green-400 pulse-ring" />
            </span>
            <span className="text-xs text-green-400 font-semibold tracking-wider uppercase">No backend required</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-800 leading-[0.95] tracking-tight mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
            Form handling
            <br />
            <span className="text-green-400 glow-text">without the server.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-10 fade-in" style={{ animationDelay: '0.2s' }}>
            Collect form submissions instantly on any static site — no backend, no database, no DevOps. Just drop in an endpoint and go live.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/login" className="btn-primary text-[#0a0f0a] font-semibold px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto">
              Start for free — no credit card
            </Link>
            <a href="#how-it-works" className="border border-white/10 hover:border-green-400/30 text-white/70 hover:text-white transition-all font-medium px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto">
              See how it works →
            </a>
          </div>

          {/* Code Preview */}
          <div className="max-w-2xl mx-auto text-left code-block rounded-2xl overflow-hidden float-anim fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-white/25 font-mono">contact.html</span>
              <button onClick={handleCopy} className="text-xs text-white/40 hover:text-green-400 transition-colors font-medium flex items-center gap-1.5">
                {copied ? (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
                ) : (
                  <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                )}
              </button>
            </div>
            <pre className="px-5 py-5 text-xs md:text-sm leading-relaxed overflow-x-auto">
              <code>
                <span className="text-white/30">{"<"}</span>
                <span className="text-green-400">form</span>
                <span className="text-yellow-300/80"> action</span>
                <span className="text-white/30">{"="}</span>
                <span className="text-orange-300/80">"https://formeze-backend.onrender.com/f/YOUR_ID"</span>
                <span className="text-yellow-300/80"> method</span>
                <span className="text-white/30">{"="}</span>
                <span className="text-orange-300/80">"POST"</span>
                <span className="text-white/30">{">"}</span>
                {"\n  "}
                <span className="text-white/30">{"<"}</span>
                <span className="text-green-400">input</span>
                <span className="text-yellow-300/80"> type</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"text"</span>
                <span className="text-yellow-300/80"> name</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"name"</span>
                <span className="text-white/30">{" />"}</span>
                {"\n  "}
                <span className="text-white/30">{"<"}</span>
                <span className="text-green-400">input</span>
                <span className="text-yellow-300/80"> type</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"email"</span>
                <span className="text-yellow-300/80"> name</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"email"</span>
                <span className="text-white/30">{" />"}</span>
                {"\n  "}
                <span className="text-white/30">{"<"}</span>
                <span className="text-green-400">textarea</span>
                <span className="text-yellow-300/80"> name</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"message"</span>
                <span className="text-white/30">{">"}</span>
                <span className="text-white/30">{"</"}
                </span>
                <span className="text-green-400">textarea</span>
                <span className="text-white/30">{">"}</span>
                {"\n  "}
                <span className="text-white/30">{"<"}</span>
                <span className="text-green-400">button</span>
                <span className="text-yellow-300/80"> type</span>
                <span className="text-white/30">=</span>
                <span className="text-orange-300/80">"submit"</span>
                <span className="text-white/30">{">"}</span>
                <span className="text-white/60">Send</span>
                <span className="text-white/30">{"</"}</span>
                <span className="text-green-400">button</span>
                <span className="text-white/30">{">"}</span>
                {"\n"}
                <span className="text-white/30">{"</"}</span>
                <span className="text-green-400">form</span>
                <span className="text-white/30">{">"}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 2, suffix: "+", label: "Developers" },
            { value: 100, suffix: "+", label: "Forms handled" },
            { value: 99.9, suffix: "%", label: "Uptime" },
            { value: 60, suffix: "s", label: "Setup time" },
          ].map(stat => (
            <div key={stat.label}>
              <div className="font-display text-3xl md:text-4xl font-800 text-green-400 mb-1">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-white/40 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="tag-pill text-xs font-semibold tracking-widest uppercase text-green-400 px-3 py-1 rounded-full">Features</span>
          <h2 className="font-display text-4xl md:text-5xl font-800 mt-4 mb-4 tracking-tight">
            Everything you need.<br /><span className="text-white/30">Nothing you don't.</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-base">Formeze strips away the complexity without compromising on what matters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="card-hover border border-white/8 bg-white/2 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-green-400/10 text-green-400 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2 text-base">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white/1.5 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="tag-pill text-xs font-semibold tracking-widest uppercase text-green-400 px-3 py-1 rounded-full">How it works</span>
            <h2 className="font-display text-4xl md:text-5xl font-800 mt-4 tracking-tight">
              Live in <span className="text-green-400">three steps.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-8 items-start relative pb-12">
                {i < STEPS.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-px bg-linear-to-b from-green-400/30 to-transparent" />
                )}
                <div className="shrink-0 w-14 h-14 rounded-2xl border border-green-400/30 bg-green-400/5 flex items-center justify-center z-10">
                  <span className="font-display text-sm font-800 text-green-400">{step.num}</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-white/40 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL
      <section className="py-20 border-y border-white/5 bg-white/1">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="tag-pill text-xs font-semibold tracking-widest uppercase text-green-400 px-3 py-1 rounded-full">Loved by builders</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { quote: "I had a working contact form on my portfolio in literally 2 minutes. No more spinning up Express just to handle email.", name: "Mia Chen", role: "Frontend Dev" },
              { quote: "We switched our landing page forms to Formeze and halved our infrastructure cost. Ridiculous that this didn't exist sooner.", name: "Tom Rader", role: "Indie Hacker" },
              { quote: "The spam filter alone is worth it. Our inbox used to be flooded. Now it's clean. Amazing product.", name: "Sara Okonkwo", role: "Designer & Maker" },
            ].map((t, i) => (
              <div key={i} className="card-hover border border-white/8 bg-white/2rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-white/55 leading-relaxed mb-5">"{t.quote}"</p>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/30">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 100%, rgba(74,222,128,0.07) 0%, transparent 60%)' }} />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <h2 className="font-display text-5xl md:text-6xl font-800 tracking-tight mb-6 leading-tight">
            Your form is<br /><span className="text-green-400 glow-text">already working.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 leading-relaxed">
            Stop procrastinating on backend setup. Formeze turns any HTML form into a live data collector in under a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-primary text-[#0a0f0a] font-semibold px-8 py-4 rounded-xl text-base">
              Create your free endpoint →
            </Link>
            <Link to="/docs" className="border border-white/10 hover:border-green-400/30 text-white/60 hover:text-white transition-all font-medium px-8 py-4 rounded-xl text-base">
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg viewBox="0 0 20 20" fill="white" className="w-3.5 h-3.5">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <span className="font-display font-800 text-white">Formeze</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/35">
            {["Docs", "Help", "Support", "Privacy", "Terms"].map(l => (
              <Link key={l} to={`/` + l.toLowerCase()} className="hover:text-green-400 transition-colors">{l}</Link>
            ))}
          </div>

          <p className="text-xs text-white/20">© 2026 Formeze. All rights reserved.</p>
        </div>
      </footer>
    </div>
    </>
  );
}


