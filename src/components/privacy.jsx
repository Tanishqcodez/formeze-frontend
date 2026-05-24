import { useState, useEffect, useRef } from "react";

const BRAND       = "#29C964";
const BRAND_DIM   = "rgba(41,201,100,0.08)";
const BRAND_BORDER= "rgba(41,201,100,0.18)";
const BG          = "#081008";
const CARD_BG     = "#0d1a0e";

const LAST_UPDATED = "May 24, 2026";

function FormezeLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" rx="9" fill={BRAND} />
      <rect x="9"  y="7"    width="16" height="20" rx="2.2"
            stroke="white" strokeWidth="1.6" fill="none" />
      <path d="M21 7 L25 11 L21 11 Z" fill="white" opacity="0.9" />
      <rect x="11" y="13.5" width="4"  height="4"  rx="0.8"
            stroke="white" strokeWidth="1.3" fill="none" />
      <path d="M11.9 15.6 L13 16.7 L14.7 14.8"
            stroke="white" strokeWidth="1.2"
            strokeLinecap="round" strokeLinejoin="round" />
      <line x1="17" y1="14.5" x2="23" y2="14.5"
            stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="16.5" x2="23" y2="16.5"
            stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="20"   x2="23" y2="20"
            stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="22.5" x2="17.5" y2="22.5"
            stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function SectionIcon({ children }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
      style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}` }}
    >
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
      style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`, color: BRAND }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BRAND }} />
      {children}
    </span>
  );
}

function TocItem({ number, title, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer"
      style={{
        background: active ? BRAND_DIM : "transparent",
        border:     active ? `1px solid ${BRAND_BORDER}` : "1px solid transparent",
      }}
    >
      <span
        className="flex-shrink-0 text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded"
        style={{
          background: active ? BRAND : "rgba(255,255,255,0.05)",
          color:      active ? "#081008" : "#4d7a54",
        }}
      >
        {number}
      </span>
      <span
        className="text-[13px] leading-snug transition-colors"
        style={{ color: active ? BRAND : "#4d7a54",
                 fontWeight: active ? 600 : 400 }}
      >
        {title}
      </span>
    </button>
  );
}

function Section({ id, icon, title, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-2xl p-7"
      style={{ background: CARD_BG, border: `1px solid ${BRAND_BORDER}` }}
    >
      <div className="flex items-center gap-3 mb-5">
        <SectionIcon>{icon}</SectionIcon>
        <h2
          className="text-[17px] font-bold"
          style={{
            color: "#e8edf5",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h2>
      </div>

      <div
        className="text-[14px] leading-relaxed space-y-4"
        style={{ color: "#8aab8e", fontFamily: "'DM Sans', sans-serif" }}
      >
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p style={{ color: "#8aab8e", lineHeight: 1.8 }}>{children}</p>;
}
function Hl({ children }) {
  return <strong style={{ color: "#c4d9c6", fontWeight: 600 }}>{children}</strong>;
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span
            className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
            style={{ background: BRAND }}
          />
          <span style={{ color: "#8aab8e", lineHeight: 1.75 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children }) {
  return (
    <div
      className="rounded-xl px-5 py-4 text-[13.5px] leading-relaxed"
      style={{
        background: BRAND_DIM,
        border: `1px solid ${BRAND_BORDER}`,
        borderLeft: `3px solid ${BRAND}`,
        color: "#8aab8e",
      }}
    >
      {children}
    </div>
  );
}

const SECTIONS = [
  {
    id:    "information-we-collect",
    title: "Information We Collect",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
  },
  {
    id:    "how-we-use",
    title: "How We Use Your Information",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
  },
  {
    id:    "data-storage",
    title: "Data Storage & Security",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
  },
  {
    id:    "cookies",
    title: "Cookies & Tracking",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
  {
    id:    "your-rights",
    title: "Your Rights",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id:    "data-retention",
    title: "Data Retention",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id:    "contact",
    title: "Contact Us",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("information-we-collect");
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: BG,
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(41,201,100,0.12) 0%, transparent 60%)",
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
    >

     
      <nav
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `1px solid ${BRAND_BORDER}` }}
      >
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <FormezeLogo size={32} />
          <span
            className="text-white font-bold text-lg"
            style={{ letterSpacing: "-0.4px" }}
          >
            Formeze
          </span>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-[13px] font-medium px-4 py-1.5 rounded-full no-underline transition-colors"
            style={{ color: "#8aab8e", border: `1px solid ${BRAND_BORDER}` }}
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="text-[13px] font-bold px-4 py-1.5 rounded-full no-underline"
            style={{ background: BRAND, color: "#081008" }}
          >
            Get started
          </a>
        </div>
      </nav>

      
      <div className="px-8 pt-14 pb-12 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase"
            style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`, color: BRAND }}
          >
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute w-full h-full rounded-full opacity-50"
                    style={{ background: BRAND }} />
              <span className="relative w-2 h-2 rounded-full" style={{ background: BRAND }} />
            </span>
            Legal
          </span>
        </div>

        <h1
          className="text-white font-extrabold leading-tight mb-4"
          style={{ fontSize: "clamp(28px, 5vw, 42px)", letterSpacing: "-0.8px" }}
        >
          Privacy <span style={{ color: BRAND }}>Policy</span>
        </h1>

        <p
          className="max-w-xl text-[15px] leading-relaxed mb-7"
          style={{ color: "#8aab8e" }}
        >
          We believe privacy is a right, not a feature. Here's exactly how Formeze
          collects, uses, and protects your data — written in plain English.
        </p>

        {/* Quick-fact pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Pill>No ads, ever</Pill>
          <Pill>Data never sold</Pill>
          <Pill>You own your submissions</Pill>
          <Pill>GDPR-aligned</Pill>
        </div>

        {/* Last updated chip */}
        <div
          className="inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#4d7a54" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Last updated: <strong style={{ color: "#6b9970" }}>{LAST_UPDATED}</strong>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-24 flex gap-8 items-start">


        <aside
          className="hidden lg:block w-56 flex-shrink-0 sticky top-8 self-start"
        >
          <div
            className="rounded-2xl p-4"
            style={{ background: CARD_BG, border: `1px solid ${BRAND_BORDER}` }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3"
              style={{ color: "#3d6642" }}
            >
              On this page
            </p>
            <nav className="flex flex-col gap-0.5">
              {SECTIONS.map((s, i) => (
                <TocItem
                  key={s.id}
                  number={i + 1}
                  title={s.title}
                  active={activeSection === s.id}
                  onClick={() => scrollTo(s.id)}
                />
              ))}
            </nav>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* ── 1. Information We Collect ── */}
          <Section
            id="information-we-collect"
            title={SECTIONS[0].title}
            icon={SECTIONS[0].icon}
          >
            <P>
              When you use Formeze, we collect two categories of information:
              information you give us directly, and information collected
              automatically as you use the service.
            </P>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>
                Information you provide
              </p>
              <BulletList items={[
                <><Hl>Account data</Hl> — name, email address, and password when you register.</>,
                <><Hl>Form submissions</Hl> — all data submitted through forms you create and publish via Formeze. You own this data entirely.</>,
                <><Hl>Billing information</Hl> — if you upgrade to a paid plan, payment details are processed by Stripe and never stored on our servers.</>,
                <><Hl>Support communications</Hl> — messages you send to our support team.</>,
              ]} />
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>
                Information collected automatically
              </p>
              <BulletList items={[
                <><Hl>Log data</Hl> — IP address, browser type, pages visited, and timestamps when you access Formeze.</>,
                <><Hl>Usage analytics</Hl> — aggregated, anonymised metrics about how features are used (e.g. how many forms are created per week). No personal profiling.</>,
                <><Hl>Device information</Hl> — screen resolution and operating system, used solely for layout and compatibility improvements.</>,
              ]} />
            </div>

            <InfoBox>
              <strong style={{ color: BRAND }}>Important:</strong> We do
              not collect data from your end-users beyond what they voluntarily
              submit through your forms. We are a processor, not a controller,
              of that data.
            </InfoBox>
          </Section>

          {/* ── 2. How We Use Your Information ── */}
          <Section
            id="how-we-use"
            title={SECTIONS[1].title}
            icon={SECTIONS[1].icon}
          >
            <P>
              Every piece of data we collect serves a specific, limited purpose.
              We do not use your information for advertising, profiling, or any
              purpose you haven't been told about.
            </P>
            <BulletList items={[
              <><Hl>Provide the service</Hl> — authenticate your account, deliver form submissions to your dashboard, and send notification emails you've opted into.</>,
              <><Hl>Improve Formeze</Hl> — analyse anonymised usage patterns to identify bugs, prioritise features, and measure performance.</>,
              <><Hl>Security</Hl> — detect and prevent abuse, fraud, and unauthorised access to accounts.</>,
              <><Hl>Legal compliance</Hl> — respond to lawful requests from authorities where required under applicable law.</>,
              <><Hl>Transactional communication</Hl> — send receipts, password-reset emails, and service-status notices. You cannot opt out of these as they are essential to the service.</>,
            ]} />
            <InfoBox>
              We will <strong style={{ color: BRAND }}>never</strong> sell,
              rent, or share your personal data with advertisers. Formeze is
              funded by subscriptions, not by monetising your data.
            </InfoBox>
          </Section>

       

          {/* ── 4. Data Storage & Security ── */}
          <Section
            id="data-storage"
            title={SECTIONS[3].title}
            icon={SECTIONS[3].icon}
          >
            <P>
              Your data is stored on MongoDB Atlas infrastructure with
              encryption at rest and in transit (TLS 1.2+). Access to production
              databases is restricted to a minimal set of authorised personnel.
            </P>
            <BulletList items={[
              <><Hl>Encryption in transit</Hl> — all data between your browser and our servers is encrypted via HTTPS / TLS.</>,
              <><Hl>Encryption at rest</Hl> — data stored in MongoDB Atlas is encrypted at the storage layer.</>,
              <><Hl>Password hashing</Hl> — passwords are hashed using bcrypt before storage. We never store plaintext passwords.</>,
              <><Hl>Auth tokens</Hl> — JWTs are signed and expire after a set period. Logging out invalidates your session.</>,
              <><Hl>Least-privilege access</Hl> — team members only have access to the data they need to do their specific job.</>,
            ]} />
            <InfoBox>
              No security system is 100% infallible. If you suspect your account
              has been compromised, please{" "}
              <a href="mailto:formeze.service@gmail.com" style={{ color: BRAND }}>
                contact formeze.service@gmail.com
              </a>{" "}
              immediately.
            </InfoBox>
          </Section>

          {/* ── 5. Cookies & Tracking ── */}
          <Section
            id="cookies"
            title={SECTIONS[4].title}
            icon={SECTIONS[4].icon}
          >
            <P>
              Formeze uses a minimal set of cookies — only what is strictly
              necessary to operate the service. We do not use tracking cookies,
              advertising cookies, or third-party analytics pixels.
            </P>
            <BulletList items={[
              <><Hl>Session cookies</Hl> — keep you logged in during a browser session. Cleared when you close your browser or sign out.</>,
              <><Hl>Preference cookies</Hl> — store lightweight UI settings (e.g. your active dashboard tab) to improve your experience.</>,
              <><Hl>No advertising cookies</Hl> — we do not install cookies from Google Ads, Meta, or any other advertising network.</>,
              <><Hl>localStorage</Hl> — used to store your authentication token and notification preferences locally in your browser. No data is shared with third parties from localStorage.</>,
            ]} />
          </Section>

          {/* ── 6. Your Rights ── */}
          <Section
            id="your-rights"
            title={SECTIONS[5].title}
            icon={SECTIONS[5].icon}
          >
            <P>
              You have meaningful control over your data. You can exercise any
              of the following rights at any time by emailing{" "}
              <a href="mailto:formeze.service@gmail.com" style={{ color: BRAND }}>
                formeze.service@gmail.com
              </a>
              .
            </P>
            <BulletList items={[
              <><Hl>Access</Hl> — request a copy of all personal data we hold about you.</>,
              <><Hl>Correction</Hl> — ask us to correct inaccurate or incomplete data.</>,
              <><Hl>Deletion</Hl> — request deletion of your account and all associated data. We will action this within 30 days.</>,
              <><Hl>Portability</Hl> — receive your form submission data in a machine-readable format (CSV / JSON).</>,
              <><Hl>Objection</Hl> — object to processing of your data for any purpose other than service delivery.</>,
              <><Hl>Withdraw consent</Hl> — turn off email notifications at any time from the Settings tab in your dashboard.</>,
            ]} />
            <InfoBox>
              If you are located in the EU / EEA, you also have the right to
              lodge a complaint with your local data protection authority under
              the <strong style={{ color: BRAND }}>GDPR</strong>.
            </InfoBox>
          </Section>

          {/* ── 7. Data Retention ── */}
          <Section
            id="data-retention"
            title={SECTIONS[6].title}
            icon={SECTIONS[6].icon}
          >
            <P>
              We retain your data only for as long as it is necessary to provide
              the service or comply with legal obligations.
            </P>
            <BulletList items={[
              <><Hl>Account data</Hl> — retained for as long as your account is active. Deleted within 30 days of an account-deletion request.</>,
              <><Hl>Form submissions</Hl> — stored until you delete them from your dashboard or close your account.</>,
              <><Hl>Log data</Hl> — retained for a maximum of 90 days for security and debugging purposes, then automatically purged.</>,
              <><Hl>Billing records</Hl> — retained for 7 years to comply with tax and accounting regulations.</>,
            ]} />
          </Section>

          {/* ── 8. Contact Us ── */}
          <Section
            id="contact"
            title={SECTIONS[6].title}
            icon={SECTIONS[6].icon}
          >
            <P>
              If you have any questions about this policy, want to exercise your
              rights, or need to report a security issue, please reach out:
            </P>

          <Hl>formeze.service@gmail.com</Hl>

            <P>
              We aim to respond to all privacy-related enquiries within{" "}
              <Hl>5 business days</Hl>. For urgent security matters we aim to
              respond within <Hl>24 hours</Hl>.
            </P>
          </Section>

          {/* ── Changes notice ── */}
          <div
            className="rounded-2xl px-7 py-5 text-[13.5px] leading-relaxed"
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.18)",
              borderLeft: "3px solid #f59e0b",
              color: "#b89a6a",
            }}
          >
            <strong style={{ color: "#f5c842", fontWeight: 600 }}>
              Policy changes
            </strong>{" "}
            — We may update this Privacy Policy from time to time. When we do,
            we'll update the "Last updated" date at the top of the page and
            notify registered users by email at least 14 days before any
            material changes take effect. Continued use of Formeze after that
            date constitutes acceptance of the revised policy.
          </div>

        </div>
      </div>

      <footer
        className="mt-4 px-8 py-7"
        style={{ borderTop: `1px solid ${BRAND_BORDER}`, background: "#060e07" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FormezeLogo size={26} />
            <span className="text-white font-bold text-[15px]" style={{ letterSpacing: "-0.3px" }}>
              Formeze
            </span>
          </div>
          <div className="flex items-center gap-5">
            {["Terms of Service", "Privacy Policy", "Help Center"].map((l) => (
              <a key={l} href="#"
                 className="text-[12px] no-underline transition-colors"
                 style={{ color: "#3d6642" }}
                 onMouseEnter={(e) => (e.target.style.color = BRAND)}
                 onMouseLeave={(e) => (e.target.style.color = "#3d6642")}
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-[12px]" style={{ color: "#1e3320" }}>
            © 2026 Formeze, Inc. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}