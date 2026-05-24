import { useState, useEffect, useRef } from "react";

// ─── Brand tokens (identical across all Formeze pages) ────────────────────────
const BRAND        = "#29C964";
const BRAND_DIM    = "rgba(41,201,100,0.08)";
const BRAND_BORDER = "rgba(41,201,100,0.18)";
const BG           = "#081008";
const CARD_BG      = "#0d1a0e";
const LAST_UPDATED = "May 24, 2026";

// ─── Formeze logo ─────────────────────────────────────────────────────────────
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
      <line x1="17" y1="14.5" x2="23" y2="14.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="17" y1="16.5" x2="23" y2="16.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="20"   x2="23" y2="20"   stroke="white" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="11" y1="22.5" x2="17.5" y2="22.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function SectionIcon({ children }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
         style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}` }}>
      {children}
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full"
          style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`, color: BRAND }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: BRAND }} />
      {children}
    </span>
  );
}

function TocItem({ number, title, active, onClick }) {
  return (
    <button onClick={onClick}
            className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg transition-all duration-150"
            style={{
              background: active ? BRAND_DIM    : "transparent",
              border:     active ? `1px solid ${BRAND_BORDER}` : "1px solid transparent",
            }}>
      <span className="flex-shrink-0 text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded"
            style={{
              background: active ? BRAND : "rgba(255,255,255,0.05)",
              color:      active ? "#081008" : "#4d7a54",
            }}>
        {number}
      </span>
      <span className="text-[13px] leading-snug transition-colors"
            style={{ color: active ? BRAND : "#4d7a54", fontWeight: active ? 600 : 400 }}>
        {title}
      </span>
    </button>
  );
}

function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl p-7"
             style={{ background: CARD_BG, border: `1px solid ${BRAND_BORDER}` }}>
      <div className="flex items-center gap-3 mb-5">
        <SectionIcon>{icon}</SectionIcon>
        <h2 className="text-[17px] font-bold"
            style={{ color: "#e8edf5", fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.3px" }}>
          {title}
        </h2>
      </div>
      <div className="text-[14px] leading-relaxed space-y-4"
           style={{ color: "#8aab8e", fontFamily: "'DM Sans', sans-serif" }}>
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
          <span className="flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
          <span style={{ color: "#8aab8e", lineHeight: 1.75 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBox({ children, variant = "green" }) {
  const styles = {
    green: {
      background:   BRAND_DIM,
      border:       `1px solid ${BRAND_BORDER}`,
      borderLeft:   `3px solid ${BRAND}`,
      color:        "#8aab8e",
    },
    amber: {
      background:   "rgba(245,158,11,0.06)",
      border:       "1px solid rgba(245,158,11,0.18)",
      borderLeft:   "3px solid #f59e0b",
      color:        "#b89a6a",
    },
    red: {
      background:   "rgba(239,68,68,0.06)",
      border:       "1px solid rgba(239,68,68,0.18)",
      borderLeft:   "3px solid #ef4444",
      color:        "#b87070",
    },
  };
  return (
    <div className="rounded-xl px-5 py-4 text-[13.5px] leading-relaxed"
         style={styles[variant]}>
      {children}
    </div>
  );
}

// ─── Numbered step (used in Account & Usage sections) ─────────────────────────
function Step({ number, title, children }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold mt-0.5"
           style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`, color: BRAND }}>
        {number}
      </div>
      <div>
        <p className="font-semibold text-[13.5px] mb-1" style={{ color: "#c4d9c6" }}>{title}</p>
        <p className="text-[13.5px]" style={{ color: "#8aab8e", lineHeight: 1.75 }}>{children}</p>
      </div>
    </div>
  );
}

// ─── Section definitions (id · title · icon SVG) ──────────────────────────────
const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="15" x2="15" y2="15"/>
        <line x1="9" y1="11" x2="11" y2="11"/>
      </svg>
    ),
  },
  {
    id: "accounts",
    title: "Accounts & Registration",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: "use-of-service",
    title: "Use of the Service",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M7 8h10M7 12h6M7 16h4"/>
      </svg>
    ),
  },
  {
    id: "prohibited",
    title: "Prohibited Conduct",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
  },
  {
    id: "ownership",
    title: "Intellectual Property",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>
      </svg>
    ),
  },
  {
    id: "payment",
    title: "Payment & Plans",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Liability",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
      </svg>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11"/>
      </svg>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={BRAND} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("acceptance");
  const observerRef = useRef(null);

  // Highlight the correct TOC item as the user scrolls
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
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

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="flex items-center justify-between px-8 py-4"
           style={{ borderBottom: `1px solid ${BRAND_BORDER}` }}>
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <FormezeLogo size={32} />
          <span className="text-white font-bold text-lg" style={{ letterSpacing: "-0.4px" }}>
            Formeze
          </span>
        </a>
        <div className="flex items-center gap-3">
          <a href="/login"
             className="text-[13px] font-medium px-4 py-1.5 rounded-full no-underline transition-colors"
             style={{ color: "#8aab8e", border: `1px solid ${BRAND_BORDER}` }}>
            Sign in
          </a>
          <a href="/signup"
             className="text-[13px] font-bold px-4 py-1.5 rounded-full no-underline"
             style={{ background: BRAND, color: "#081008" }}>
            Get started
          </a>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <div className="px-8 pt-14 pb-12 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1.5 rounded-full tracking-widest uppercase"
                style={{ background: BRAND_DIM, border: `1px solid ${BRAND_BORDER}`, color: BRAND }}>
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute w-full h-full rounded-full opacity-50"
                    style={{ background: BRAND }} />
              <span className="relative w-2 h-2 rounded-full" style={{ background: BRAND }} />
            </span>
            Legal
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-white font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(28px, 5vw, 42px)", letterSpacing: "-0.8px" }}>
          Terms of <span style={{ color: BRAND }}>Service</span>
        </h1>

        {/* Subtext */}
        <p className="max-w-xl text-[15px] leading-relaxed mb-7" style={{ color: "#8aab8e" }}>
          These terms govern your use of Formeze. By creating an account or using
          the service you agree to be bound by them. We've kept the language as
          clear and jargon-free as possible.
        </p>

        {/* Quick pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Pill>Free plan available</Pill>
          <Pill>Cancel anytime</Pill>
          <Pill>You own your data</Pill>
          <Pill>Fair use policy</Pill>
        </div>

        {/* Last updated */}
        <div className="inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-lg"
             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#4d7a54" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Last updated: <strong style={{ color: "#6b9970" }}>{LAST_UPDATED}</strong>
        </div>
      </div>

      {/* ══════════ TWO-COLUMN LAYOUT ══════════ */}
      <div className="max-w-5xl mx-auto px-8 pb-24 flex gap-8 items-start">

        {/* ── Sticky TOC sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-8 self-start">
          <div className="rounded-2xl p-4"
               style={{ background: CARD_BG, border: `1px solid ${BRAND_BORDER}` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3"
               style={{ color: "#3d6642" }}>
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

        {/* ── Content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* 1 ── Acceptance */}
          <Section id="acceptance" title={SECTIONS[0].title} icon={SECTIONS[0].icon}>
            <P>
              These Terms of Service (<Hl>"Terms"</Hl>) are a legal agreement between you
              and <Hl>Formeze, Inc.</Hl> governing your access to and use of the Formeze
              platform, website, and API (collectively, the <Hl>"Service"</Hl>).
            </P>
            <P>
              By creating an account, clicking "Get started", or otherwise accessing the
              Service, you confirm that you have read, understood, and agree to be bound
              by these Terms and our{" "}
              <a href="/privacy" style={{ color: BRAND }}>Privacy Policy</a>.
            </P>
            <InfoBox>
              If you are using Formeze on behalf of a company or other legal entity,
              you represent that you have the authority to bind that entity to these
              Terms. If you do not have that authority, do not use the Service.
            </InfoBox>
            <P>
              We may update these Terms from time to time. We will notify you of
              material changes by email at least <Hl>14 days in advance</Hl>. Continued
              use of the Service after that date constitutes acceptance.
            </P>
          </Section>

          {/* 2 ── Accounts */}
          <Section id="accounts" title={SECTIONS[1].title} icon={SECTIONS[1].icon}>
            <P>
              To access most features of Formeze you must register for an account.
              When you do, you agree to the following:
            </P>
            <div className="flex flex-col gap-4 mt-1">
              <Step number="1" title="Accurate information">
                You must provide a valid email address and truthful registration
                details. You may not impersonate another person or use a false identity.
              </Step>
              <Step number="2" title="Email verification">
                You must verify your email address before you can publish forms or
                receive submissions. Accounts that remain unverified for more than
                30 days may be removed.
              </Step>
              <Step number="3" title="Account security">
                You are responsible for maintaining the confidentiality of your
                password and for all activity that occurs under your account. Notify us
                immediately at{" "}
                <a href="mailto:formeze.service@gmail.com" style={{ color: BRAND }}>
                  formeze.service@gmail.com
                </a>{" "}
                if you suspect unauthorised access.
              </Step>
              <Step number="4" title="One account per person">
                Each individual or organisation may maintain one free account.
                Creating multiple free accounts to circumvent plan limits is prohibited.
              </Step>
            </div>
          </Section>

          {/* 3 ── Use of Service */}
          <Section id="use-of-service" title={SECTIONS[2].title} icon={SECTIONS[2].icon}>
            <P>
              Subject to these Terms, Formeze grants you a limited, non-exclusive,
              non-transferable licence to access and use the Service for your own
              personal or internal business purposes.
            </P>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>What you can do</p>
              <BulletList items={[
                <>Create and publish HTML forms that submit data to your Formeze endpoint.</>,
                <>Embed your form endpoint on any website or web application you own or operate.</>,
                <>Access, export, and delete your form submissions at any time via the dashboard or API.</>,
                <>Integrate Formeze with your own backend systems using the provided endpoint URL.</>,
              ]} />
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Free plan limits</p>
              <BulletList items={[
                <><Hl>100 submissions / month</Hl> — additional submissions are queued and delivered at the start of the next billing cycle.</>,
                <><Hl>1 form endpoint</Hl> — free accounts are limited to a single active endpoint.</>,
                <><Hl>Email notifications</Hl> — email notification per submission is available on all plans.</>,
              ]} />
            </div>

            <InfoBox>
              Plan limits are subject to change. We will always give at least{" "}
              <strong style={{ color: BRAND }}>30 days notice</strong> before reducing
              the limits of an existing free plan.
            </InfoBox>
          </Section>

          {/* 4 ── Prohibited */}
          <Section id="prohibited" title={SECTIONS[3].title} icon={SECTIONS[3].icon}>
            <P>
              The following uses of the Service are strictly prohibited. Violation
              may result in immediate account termination.
            </P>
            <BulletList items={[
              <><Hl>Illegal activity</Hl> — collecting data in violation of applicable privacy laws (e.g. GDPR, CCPA) or without appropriate user consent on your forms.</>,
              <><Hl>Spam & phishing</Hl> — using Formeze to send unsolicited communications, conduct phishing attacks, or harvest credentials.</>,
              <><Hl>Harmful content</Hl> — collecting or transmitting content that is abusive, threatening, hateful, obscene, or that infringes third-party rights.</>,
              <><Hl>Automated abuse</Hl> — scraping, crawling, or using bots to submit fake form data, probe for vulnerabilities, or stress-test infrastructure.</>,
              <><Hl>Reselling</Hl> — reselling, sublicensing, or white-labelling the Service to third parties without a written reseller agreement with Formeze.</>,
              <><Hl>Reverse engineering</Hl> — decompiling, reverse engineering, or attempting to extract the source code of the Service.</>,
              <><Hl>Circumventing limits</Hl> — creating multiple accounts or using proxies to bypass plan limits or rate limits.</>,
            ]} />
            <InfoBox variant="amber">
              <strong style={{ color: "#f5c842" }}>Reports of misuse</strong> — if you
              believe someone is using Formeze in violation of these terms, please
              report it to{" "}
              <a href="mailto:formeze.service@gmail.com" style={{ color: "#f5c842" }}>
                formeze.service@gmail.com
              </a>
              .
            </InfoBox>
          </Section>

          {/* 5 ── Intellectual Property */}
          <Section id="ownership" title={SECTIONS[4].title} icon={SECTIONS[4].icon}>
            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Your content</p>
              <P>
                You retain full ownership of all form submissions, data, and other
                content that you or your end-users submit through Formeze
                (<Hl>"Your Content"</Hl>). We claim no intellectual property rights
                over it. You grant Formeze a limited licence to store, process, and
                transmit Your Content solely to provide the Service to you.
              </P>
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Formeze's IP</p>
              <P>
                The Formeze platform, including its source code, design, trademarks,
                and documentation, is owned by Formeze, Inc. and protected by
                copyright and other intellectual property laws. Nothing in these Terms
                transfers any Formeze IP to you.
              </P>
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Feedback</p>
              <P>
                If you submit suggestions, ideas, or feedback about the Service
                (<Hl>"Feedback"</Hl>), you grant Formeze a royalty-free, perpetual
                licence to use that Feedback without any obligation to compensate you
                or keep it confidential.
              </P>
            </div>
          </Section>

          {/* 6 ── Payment */}
          <Section id="payment" title={SECTIONS[5].title} icon={SECTIONS[5].icon}>
            <P>
              Formeze offers a free plan and paid subscription plans. All billing
              is handled securely by <Hl>Stripe</Hl>; your payment details are never
              stored on Formeze servers.
            </P>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Subscriptions</p>
              <BulletList items={[
                <>Paid plans are billed monthly or annually in advance.</>,
                <>Prices are displayed inclusive of any applicable taxes where required by law.</>,
                <>We will notify you at least <Hl>30 days</Hl> before any price increase takes effect for existing subscribers.</>,
              ]} />
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Cancellation & refunds</p>
              <BulletList items={[
                <>You may cancel your subscription at any time from the Settings tab. Access continues until the end of the current billing period.</>,
                <>We do not offer pro-rated refunds for partial months, except where required by applicable consumer protection law.</>,
                <>Annual plan subscribers may request a full refund within <Hl>14 days</Hl> of initial purchase if they have not exceeded 50 submissions.</>,
              ]} />
            </div>

            <InfoBox>
              To cancel your subscription or request a refund, go to{" "}
              <strong style={{ color: BRAND }}>Settings → Billing</strong> in your
              dashboard, or email{" "}
              <a href="mailto:formeze.service@gmail.com" style={{ color: BRAND }}>
                formeze.service@gmail.com
              </a>
              .
            </InfoBox>
          </Section>

          {/* 7 ── Disclaimers */}
          <Section id="disclaimers" title={SECTIONS[6].title} icon={SECTIONS[6].icon}>
            <InfoBox variant="amber">
              <strong style={{ color: "#f5c842" }}>Please read this section carefully.</strong>{" "}
              It limits Formeze's liability to you.
            </InfoBox>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>
                Service provided "as is"
              </p>
              <P>
                The Service is provided <Hl>"as is"</Hl> and <Hl>"as available"</Hl> without
                warranties of any kind, express or implied. We do not warrant that the
                Service will be uninterrupted, error-free, or free of viruses or other
                harmful components.
              </P>
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>
                Limitation of liability
              </p>
              <P>
                To the fullest extent permitted by law, Formeze's total liability to you
                for any claim arising out of these Terms or your use of the Service is
                limited to the greater of <Hl>$100 USD</Hl> or the amount you paid to
                Formeze in the 12 months preceding the claim.
              </P>
              <P>
                In no event will Formeze be liable for indirect, incidental, special,
                consequential, or punitive damages, including loss of profits, data, or
                business opportunities, even if we have been advised of the possibility
                of such damages.
              </P>
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>Indemnification</p>
              <P>
                You agree to indemnify and hold harmless Formeze, its officers,
                directors, and employees from any claims, damages, or expenses
                (including reasonable legal fees) arising from your use of the Service
                in violation of these Terms or applicable law.
              </P>
            </div>
          </Section>

          {/* 8 ── Termination */}
          <Section id="termination" title={SECTIONS[7].title} icon={SECTIONS[7].icon}>
            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>By you</p>
              <P>
                You may delete your account at any time from the Settings tab. Upon
                deletion, your data will be purged within <Hl>30 days</Hl> in
                accordance with our Privacy Policy. Active paid subscriptions must
                be cancelled separately before account deletion.
              </P>
            </div>

            <div>
              <p className="font-semibold mb-2" style={{ color: "#c4d9c6" }}>By Formeze</p>
              <P>
                We may suspend or terminate your account with or without notice if:
              </P>
              <BulletList items={[
                <>You violate any provision of these Terms or our Acceptable Use Policy.</>,
                <>Your account is used for illegal activity, spam, or abuse.</>,
                <>You fail to pay subscription fees after reasonable notice.</>,
                <>We discontinue the Service (with at least 60 days notice to all users).</>,
              ]} />
            </div>

            <InfoBox variant="red">
              <strong style={{ color: "#fca5a5" }}>Data after termination</strong> — if
              your account is terminated for cause, Formeze is not obligated to retain
              or return your data. We strongly recommend exporting your submissions
              regularly from the dashboard.
            </InfoBox>
          </Section>

          {/* 9 ── Governing Law */}
          <Section id="governing-law" title={SECTIONS[8].title} icon={SECTIONS[8].icon}>
            <P>
              These Terms are governed by and construed in accordance with the laws
              of the <Hl>State of Delaware, United States</Hl>, without regard to its
              conflict-of-law provisions.
            </P>
            <P>
              Any dispute arising out of or relating to these Terms or the Service
              that cannot be resolved informally shall be subject to binding
              arbitration under the rules of the American Arbitration Association,
              conducted in English in <Hl>San Francisco, California</Hl>.
            </P>
            <P>
              Notwithstanding the foregoing, either party may seek injunctive or
              other equitable relief in any court of competent jurisdiction to
              prevent irreparable harm pending arbitration.
            </P>
            <InfoBox>
              If you are a consumer located in the <Hl>EU / EEA</Hl>, nothing in
              these Terms affects your rights under the mandatory consumer protection
              laws of your country of residence.
            </InfoBox>
          </Section>

          {/* 10 ── Contact */}
          <Section id="contact" title={SECTIONS[9].title} icon={SECTIONS[9].icon}>
            <P>
              If you have any questions about these Terms or need to report a
              violation, please contact us: <Hl>formeze.service@gmail.com</Hl>
            </P>
            <P>
              Formeze, Inc. · 100 Form St, San Francisco, CA 94105, United States
            </P>
          </Section>

          {/* Changes notice */}
          <div className="rounded-2xl px-7 py-5 text-[13.5px] leading-relaxed"
               style={{
                 background:  "rgba(245,158,11,0.06)",
                 border:      "1px solid rgba(245,158,11,0.18)",
                 borderLeft:  "3px solid #f59e0b",
                 color:       "#b89a6a",
               }}>
            <strong style={{ color: "#f5c842", fontWeight: 600 }}>Changes to these Terms</strong>{" "}
            — We reserve the right to modify these Terms at any time. When we make
            material changes, we will update the "Last updated" date above and notify
            registered users by email at least <strong style={{ color: "#f5c842" }}>14 days</strong>{" "}
            before the changes take effect. Your continued use of the Service after
            that date constitutes your acceptance of the revised Terms.
          </div>

        </div>
      </div>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="mt-4 px-8 py-7"
              style={{ borderTop: `1px solid ${BRAND_BORDER}`, background: "#060e07" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FormezeLogo size={26} />
            <span className="text-white font-bold text-[15px]" style={{ letterSpacing: "-0.3px" }}>
              Formeze
            </span>
          </div>
          <div className="flex items-center gap-5">
            {[
              { label: "Terms of Service", href: "/terms"   },
              { label: "Privacy Policy",   href: "/privacy" },
              { label: "Help Center",      href: "/help"    },
            ].map((l) => (
              <a key={l.label} href={l.href}
                 className="text-[12px] no-underline transition-colors"
                 style={{ color: "#3d6642" }}
                 onMouseEnter={(e) => (e.target.style.color = BRAND)}
                 onMouseLeave={(e) => (e.target.style.color = "#3d6642")}>
                {l.label}
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
