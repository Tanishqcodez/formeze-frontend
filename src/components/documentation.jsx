import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";

const NAV_SECTIONS = [
  {
    group: "Getting Started",
    icon: "🚀",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quickstart", label: "Quick Start" },
      { id: "how-it-works", label: "How It Works" },
    ],
  },
  {
    group: "Core Concepts",
    icon: "📐",
    items: [
      { id: "fields", label: "Accepted Fields" },
      { id: "redirects", label: "Custom Redirects" },
      { id: "email-notifications", label: "Email Notifications" },
    ],
  },
  {
    group: "Security",
    icon: "🔒",
    items: [
      { id: "spam-protection", label: "Spam Protection" },
      // { id: "allowed-origins", label: "Allowed Origins" },
    ],
  },
  {
    group: "Integrations",
    icon: "🔗",
    items: [
      { id: "html", label: "Plain HTML" },
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
      { id: "webhooks", label: "Webhooks" },
    ],
  },
  {
    group: "API Reference",
    icon: "⚡",
    items: [{ id: "api-errors", label: "Error Codes" }],
  },
];

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────

function Tag({ children, color = "green" }) {
  const colors = {
    green: "bg-green-400/10 text-green-400 border-green-400/20",
    yellow: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
    red: "bg-red-400/10 text-red-400 border-red-400/20",
    blue: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    gray: "bg-white/5 text-white/40 border-white/10",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border font-mono ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function CodeBlock({ code, lang = "html", filename }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighter
  const highlight = (src, language) => {
    // Escape HTML entities in a plain string (no spans yet)
    const esc = (s) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const span = (color, text, extra = "") =>
      `<span style="color:${color}${extra}">${text}</span>`;

    if (language === "html") {
      // Tokenise in one pass so injected spans are never re-processed
      const tagRe = /(<\/?)(\w[\w-]*)([^>]*?)(\/?>)/g;
      const attrRe = /([\w-]+)(=)("([^"]*)")/g;
      let result = "";
      let lastIndex = 0;
      let m;
      while ((m = tagRe.exec(src)) !== null) {
        // Plain text before this tag
        result += esc(src.slice(lastIndex, m.index));
        const [, open, tagName, attrs, close] = m;
        // Highlight attributes inside the tag
        let highlightedAttrs = esc(attrs).replace(
          attrRe,
          (_, name, eq, val) =>
            span("#fde68a", name) + eq + span("#fb923c", val),
        );
        result +=
          span("#4ade80", esc(open) + tagName) +
          highlightedAttrs +
          span("#4ade80", esc(close));
        lastIndex = tagRe.lastIndex;
      }
      result += esc(src.slice(lastIndex));
      // Highlight HTML comments
      result = result.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (c) =>
        span("#6b7280", c, "; font-style:italic"),
      );
      return result;
    }

    if (language === "js" || language === "jsx") {
      const keywords = new Set([
        "const",
        "let",
        "var",
        "function",
        "return",
        "import",
        "from",
        "export",
        "default",
        "async",
        "await",
        "if",
        "else",
        "true",
        "false",
        "null",
        "typeof",
        "new",
        "class",
        "extends",
        "this",
        "of",
        "in",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "break",
        "continue",
        "throw",
        "try",
        "catch",
        "finally",
        "yield",
      ]);
      // Tokenise: strings, template literals, comments, words, other chars
      const tokenRe =
        /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|(`[^`]*`)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|([A-Za-z_$][\w$]*)|([^])/g;
      let result = "";
      let tm;
      while ((tm = tokenRe.exec(src)) !== null) {
        const [, lineComment, blockComment, tmpl, dqStr, sqStr, word, ch] = tm;
        if (lineComment || blockComment) {
          result += span("#6b7280", esc(tm[0]), "; font-style:italic");
        } else if (tmpl || dqStr || sqStr) {
          result += span("#fb923c", esc(tm[0]));
        } else if (word) {
          if (keywords.has(word)) result += span("#c084fc", word);
          else if (/^[A-Z]/.test(word)) result += span("#4ade80", word);
          else result += esc(word);
        } else {
          result += esc(ch);
        }
      }
      return result;
    }

    if (language === "bash") {
      const tokenRe = /(#[^\n]*)|(^\$\s)/gm;
      return src.replace(tokenRe, (m, comment, prompt) => {
        if (comment) return span("#6b7280", esc(m), "; font-style:italic");
        if (prompt) return span("#4ade80", m);
        return esc(m);
      });
    }

    if (language === "json") {
      // Tokenise JSON in one pass
      const tokenRe =
        /("(?:[^"\\]|\\.)*")\s*(:)|("(?:[^"\\]|\\.)*")|(true|false|null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
      let result = "";
      let lastIndex = 0;
      let jm;
      while ((jm = tokenRe.exec(src)) !== null) {
        result += esc(src.slice(lastIndex, jm.index));
        const [full, key, colon, strVal, keyword, num] = jm;
        if (key && colon) {
          result += span("#4ade80", esc(key)) + esc(colon);
        } else if (strVal) {
          result += span("#fb923c", esc(strVal));
        } else if (keyword || num) {
          result += span("#c084fc", esc(full));
        } else {
          result += esc(full);
        }
        lastIndex = tokenRe.lastIndex;
      }
      result += esc(src.slice(lastIndex));
      return result;
    }

    return esc(src);
  };

  return (
    <div className="not-prose rounded-xl overflow-hidden border border-white/8 my-5 code-block-wrap">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          {filename && (
            <span className="text-xs text-white/25 font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Tag color="gray">{lang}</Tag>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/35 hover:text-green-400 transition-colors"
          >
            {copied ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      <pre
        className="px-5 py-4 text-sm leading-relaxed overflow-x-auto bg-[#080e08]"
        style={{ margin: 0, borderRadius: 0, background: "#080e08" }}
      >
        <code
          className="font-mono"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.875rem",
            background: "none",
            padding: 0,
            color: "inherit",
            whiteSpace: "pre",
          }}
          dangerouslySetInnerHTML={{ __html: highlight(code, lang) }}
        />
      </pre>
    </div>
  );
}

function Callout({ type = "info", children }) {
  const styles = {
    info: {
      border: "border-green-400/25",
      bg: "bg-green-400/5",
      icon: "💡",
      text: "text-green-300",
    },
    warning: {
      border: "border-yellow-400/25",
      bg: "bg-yellow-400/5",
      icon: "⚠️",
      text: "text-yellow-300",
    },
    danger: {
      border: "border-red-400/25",
      bg: "bg-red-400/5",
      icon: "🚫",
      text: "text-red-300",
    },
    tip: {
      border: "border-blue-400/25",
      bg: "bg-blue-400/5",
      icon: "✨",
      text: "text-blue-300",
    },
  };
  const s = styles[type];
  return (
    <div
      className={`flex gap-3 rounded-xl border ${s.border} ${s.bg} px-4 py-4 my-5`}
    >
      <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
      <p className={`text-sm leading-relaxed ${s.text}`}>{children}</p>
    </div>
  );
}

function SectionHeading({ id, level = 1, children }) {
  const Tag = `h${level}`;
  const sizes = {
    1: "text-3xl font-extrabold mb-3 mt-0",
    2: "text-xl font-bold mb-3 mt-10",
    3: "text-base font-semibold mb-2 mt-7 text-white/80",
  };
  return (
    <Tag
      id={id}
      className={`font-display tracking-tight text-white ${sizes[level]} scroll-mt-24`}
    >
      {children}
    </Tag>
  );
}

function PropRow({ name, type, required, defaultVal, children }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.015] transition-colors">
      <td className="py-3 pr-4 font-mono text-sm text-green-400 whitespace-nowrap">
        {name}
      </td>
      <td className="py-3 pr-4">
        <Tag color="blue">{type}</Tag>
      </td>
      <td className="py-3 pr-4">
        {required ? (
          <Tag color="red">required</Tag>
        ) : (
          <Tag color="gray">optional</Tag>
        )}
      </td>
      <td className="py-3 pr-4 font-mono text-xs text-white/30">
        {defaultVal || "—"}
      </td>
      <td className="py-3 text-sm text-white/45 leading-relaxed">{children}</td>
    </tr>
  );
}

// ─── CONTENT SECTIONS

function Introduction() {
  return (
    <section>
      <div className="inline-flex items-center gap-2 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-green-400 font-semibold tracking-wider uppercase">
          v1.1 — Latest
        </span>
      </div>
      <SectionHeading id="introduction" level={1}>
        Introduction
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4 text-base">
        Formeze is a backend-free form handling service. It lets any HTML form
        send submissions to a secure endpoint — no server, no database, no API
        to maintain.
      </p>
      <p className="text-white/55 leading-relaxed mb-6 text-base">
        You own your form's markup completely. Formeze only handles the
        invisible part: receiving, storing, filtering, and forwarding your
        submissions.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: "⚡", title: "Instant", body: "Live in under 60 seconds" },
          {
            icon: "🔒",
            title: "Secure",
            body: "Spam filtering + origin control",
          },
          { icon: "📦", title: "Portable", body: "Any stack, any static host" },
        ].map((c) => (
          <div
            key={c.title}
            className="border border-white/8 bg-white/[0.02] rounded-xl p-4 hover:border-green-400/25 transition-colors"
          >
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="font-semibold text-white text-sm mb-1">
              {c.title}
            </div>
            <div className="text-xs text-white/40">{c.body}</div>
          </div>
        ))}
      </div>
      <Callout type="tip">
        New to Formeze? Jump straight to the <strong>Quick Start</strong> —
        you'll have a working form in under 5 minutes.
      </Callout>
    </section>
  );
}

function QuickStart() {
  return (
    <section>
      <SectionHeading id="quickstart" level={1}>
        Quick Start
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-6">
        Get your first form collecting submissions in three steps.
      </p>

      <SectionHeading level={2}>Step 1 — Create an endpoint</SectionHeading>
      <p className="text-white/50 leading-relaxed mb-3 text-sm">
        Sign up at{" "}
        <Link to="/login" className="text-green-400 font-mono">
          formeze
        </Link>{" "}
        and copy your unique endpoint URL from the dashboard.
      </p>
      <div className="flex items-center gap-3 bg-[#080e08] border border-white/8 rounded-xl px-4 py-3 mb-6 font-mono text-sm">
        <span className="text-white/25">Endpoint</span>
        <span className="text-green-400 flex-1 truncate">
          https://formeze.onrender.com/f/abc123xyz
        </span>
        <button className="text-white/30 hover:text-green-400 transition-colors text-xs">
          Copy
        </button>
      </div>

      <SectionHeading level={2}>Step 2 — Wire your HTML form</SectionHeading>
      <p className="text-white/50 leading-relaxed mb-3 text-sm">
        Set your form's <Tag color="yellow">action</Tag> attribute to your
        endpoint and <Tag color="yellow">method</Tag> to{" "}
        <Tag color="green">POST</Tag>.
      </p>
      <CodeBlock
        lang="html"
        filename="contact.html"
        code={`<form action="https://formeze.up.railway.app/f/abcdefgh" method="POST">
  <input type="text"  name="name"    placeholder="Your name"   required />
  <input type="email" name="email"   placeholder="Your email"  required />
  <textarea name="message" placeholder="Message..."></textarea>
  <button type="submit">Send message</button>
</form>`}
      />

      <SectionHeading level={2}>Step 3 — Go live</SectionHeading>
      <p className="text-white/50 leading-relaxed mb-3 text-sm">
        Deploy your site anywhere — Netlify, Vercel, GitHub Pages, Cloudflare
        Pages, or even plain S3. Formeze works regardless of your hosting.
      </p>
      <Callout type="info">
        Every submission is immediately visible in your Formeze dashboard and
        forwarded to the notification email set on your account.
      </Callout>
    </section>
  );
}

function HowItWorks() {
  return (
    <section>
      <SectionHeading id="how-it-works" level={1}>
        How It Works
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-6">
        Under the hood, Formeze acts as a transparent proxy between your
        visitor's browser and your inbox.
      </p>
      <div className="relative border border-white/8 rounded-xl overflow-hidden bg-[#080e08] p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          {[
            { label: "Browser", sub: "Visitor fills form", icon: "🖥️" },
            {
              label: "Formeze API",
              sub: "Validates & stores",
              icon: "⚡",
              accent: true,
            },
            { label: "Your Inbox", sub: "Notification email", icon: "📬" },
            { label: "Dashboard", sub: "Browse & export", icon: "📊" },
          ].map((node, i) => (
            <div
              key={i}
              className="flex sm:flex-col items-center gap-3 sm:gap-2 w-full sm:w-auto"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${node.accent ? "bg-green-400/15 border border-green-400/30" : "bg-white/5 border border-white/8"}`}
              >
                {node.icon}
              </div>
              <div>
                <div
                  className={`text-sm font-semibold ${node.accent ? "text-green-400" : "text-white"}`}
                >
                  {node.label}
                </div>
                <div className="text-xs text-white/30">{node.sub}</div>
              </div>
              {i < 3 && (
                <svg
                  className="hidden sm:block w-5 h-5 text-white/15 mx-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-white/50 text-sm leading-relaxed">
        Formeze receives the raw <Tag color="blue">multipart/form-data</Tag> or{" "}
        <Tag color="blue">application/x-www-form-urlencoded</Tag> POST body,
        runs spam checks, persists the payload, sends notifications, and finally
        redirects the user (or returns JSON for JavaScript submissions).
      </p>
    </section>
  );
}

function AcceptedFields() {
  return (
    <section>
      <SectionHeading id="fields" level={1}>
        Accepted Fields
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        Formeze accepts any field your form sends. Certain underscore-prefixed
        names are reserved as{" "}
        <strong className="text-white">magic fields</strong> that control
        behaviour.
      </p>

      <SectionHeading level={2}>Magic fields</SectionHeading>
      <div className="overflow-x-auto">
        <table className="w-full text-sm mb-8">
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Field name
              </th>
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Type
              </th>
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Required
              </th>
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Default
              </th>
              <th className="pb-3 text-white/40 font-medium text-xs uppercase tracking-wide">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <PropRow
              name="_redirect"
              type="string"
              defaultVal="dashboard thank-you"
            >
              URL to redirect after successful submission
            </PropRow>
            <PropRow name="_subject" type="string" defaultVal="Form Submission">
              Override the notification email subject line
            </PropRow>
            <PropRow name="_cc" type="string" defaultVal="—">
              Extra email address to CC on notifications
            </PropRow>
          </tbody>
        </table>
      </div>
      <Callout type="info">
        All magic fields are stripped from the stored submission — they never
        appear in your dashboard exports.
      </Callout>
    </section>
  );
}

function CustomRedirects() {
  return (
    <section>
      <SectionHeading id="redirects" level={1}>
        Custom Redirects
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        After a successful submission, Formeze redirects to a default thank-you
        page. Use <Tag color="green">_redirect</Tag> to send users to your own
        URL instead.
      </p>
      <CodeBlock
        lang="html"
        filename="form.html"
        code={`<input type="hidden" name="_redirect" value="https://yoursite.com/thank-you" />`}
      />
      <SectionHeading level={2}>JSON mode (no redirect)</SectionHeading>
      <p className="text-white/50 text-sm leading-relaxed mb-3">
        For JavaScript-controlled forms, set <Tag color="yellow">_format</Tag>{" "}
        to <Tag color="green">json</Tag>. Formeze returns a JSON object instead
        of redirecting.
      </p>
      <CodeBlock
        lang="js"
        filename="form.js"
        code={`const res = await fetch("https://formeze.up.railway.app/f/abcdefgh", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Ada Lovelace",
    email: "ada@example.com",
    _format: "json",
  }),
});

const data = await res.json();
// { ok: true, id: "sub_abc123", createdAt: "2025-01-14T..." }`}
      />
    </section>
  );
}

function EmailNotifications() {
  return (
    <section>
      <SectionHeading id="email-notifications" level={1}>
        Email Notifications
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        Every new submission triggers a notification to the email on your
        Formeze account. Customise the subject line or add a CC address
        per-form.
      </p>
      <CodeBlock
        lang="html"
        code={`<!-- Custom subject -->
<input type="hidden" name="_subject" value="New contact from portfolio" />

<!-- CC a teammate -->
<input type="hidden" name="_cc" value="team@yourcompany.com" />`}
      />
    </section>
  );
}

function SpamProtection() {
  return (
    <section>
      <SectionHeading id="spam-protection" level={1}>
        Spam Protection
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-6">
        Formeze provides two built-in layers of spam defence before you even
        need reCAPTCHA.
      </p>
      <SectionHeading level={2}>Honeypot field</SectionHeading>
      <p className="text-white/50 text-sm leading-relaxed mb-3">
        Add a hidden field named <Tag color="green">_honeypot</Tag>. Real users
        never see or fill it. Bots that blindly fill all fields will be blocked
        automatically.
      </p>
      <CodeBlock
        lang="html"
        code={`<!-- Hide this with CSS — never with display:none -->
<input
  type="text"
  name="_honeypot"
  style="position:absolute;left:-9999px;opacity:0;"
  tabindex="-1"
  autocomplete="off"
/>`}
      />
      <Callout type="warning">
        Do not hide the honeypot with{" "}
        <code className="font-mono text-xs">display:none</code> or{" "}
        <code className="font-mono text-xs">visibility:hidden</code> — some bots
        detect this and skip those fields.
      </Callout>
      <SectionHeading level={2}>Rate limiting</SectionHeading>
      <p className="text-white/50 text-sm leading-relaxed">
        Formeze automatically rate-limits submissions per IP. On the Pro plan
        you can configure custom rate limits under{" "}
        <strong className="text-white">Form Settings → Security</strong>.
      </p>
    </section>
  );
}

// function AllowedOrigins() {
//   return (
//     <section>
//       <SectionHeading id="allowed-origins" level={1}>
//         Allowed Origins
//       </SectionHeading>
//       <p className="text-white/55 leading-relaxed mb-4">
//         Lock your form endpoint to specific domains so only your site can submit
//         to it.
//       </p>
//       <div className="border border-white/8 rounded-xl overflow-hidden mb-5">
//         <div className="px-4 py-3 bg-white/[0.02] border-b border-white/6 text-xs text-white/30 font-mono">
//           Dashboard → Form Settings → Allowed Origins
//         </div>
//         <div className="p-4 flex flex-col gap-2">
//           {[
//             "https://yoursite.com",
//             "https://www.yoursite.com",
//             "https://staging.yoursite.com",
//           ].map((o, i) => (
//             <div
//               key={i}
//               className="flex items-center gap-2 bg-[#080e08] border border-white/6 rounded-lg px-3 py-2"
//             >
//               <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
//               <span className="font-mono text-xs text-green-400">{o}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <Callout type="warning">
//         Leave the allowed origins list empty during development. Add production
//         domains before going live.
//       </Callout>
//     </section>
//   );
// }

function HtmlIntegration() {
  return (
    <section>
      <SectionHeading id="html" level={1}>
        Plain HTML
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        No framework needed. Drop this into any{" "}
        <code className="font-mono text-xs text-green-400">.html</code> file.
      </p>
      <CodeBlock
        lang="html"
        filename="contact.html"
        code={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact</title>
</head>
<body>
  <form action="https://formeze.netlify.app/f/YOUR_ID" method="POST">
    <input type="text"  name="name" placeholder="Name" required />
    <input type="email" name="email" placeholder="Email" required />
    <textarea name="message" placeholder="Message" required></textarea>

    <input type="hidden" name="_subject" value="New contact message" />
    <input type="hidden" name="_redirect" value="/thank-you.html" />
    <input type="text" name="_honeypot" style="display:none" />

    <button type="submit">Send</button>
  </form>
</body>
</html>`}
      />
    </section>
  );
}

function ReactIntegration() {
  return (
    <section>
      <SectionHeading id="react" level={1}>
        React
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        Use the native{" "}
        <code className="text-green-400 font-mono text-xs">fetch</code> API with
        JSON mode for full control over the UI flow.
      </p>
      <CodeBlock
        lang="jsx"
        filename="ContactForm.jsx"
        code={`import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const data = Object.fromEntries(new FormData(e.target));

    try {
      const res = await fetch("https://formeze.up.railway.app/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _format: "json" }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return <p>Thanks! We'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text"  placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}`}
      />
    </section>
  );
}

function NextjsIntegration() {
  return (
    <section>
      <SectionHeading id="nextjs" level={1}>
        Next.js
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        Works identically to the React integration. Use a Server Action or a
        client-side fetch — both work.
      </p>
      <SectionHeading level={2}>App Router — Server Action</SectionHeading>
      <CodeBlock
        lang="jsx"
        filename="app/contact/page.jsx"
        code={`"use server";

async function submitForm(formData) {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    _format: "json",
  };

  const res = await fetch("https://formeze.netlify.app/f/YOUR_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Submission failed");
}

export default function ContactPage() {
  return (
    <form action={submitForm}>
      <input name="name" type="text" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send</button>
    </form>
  );
}`}
      />
      <Callout type="tip">
        Server Actions keep your form endpoint secret from the client. The
        browser never sees your Formeze form ID.
      </Callout>
    </section>
  );
}

function Webhooks() {
  return (
    <section>
      <SectionHeading id="webhooks" level={1}>
        Webhooks
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-4">
        Get a real-time HTTP POST to your own server for every new submission.
        Perfect for Zapier, Make, Slack bots, or custom integrations.
      </p>
      <SectionHeading level={2}>Payload shape</SectionHeading>
      <CodeBlock
        lang="json"
        code={`{
  "id":        "sub_01HXY4Z9KBD7GR",
  "formId":    "abc123xyz",
  "createdAt": "2025-05-13T10:32:00Z",
  "data": {
    "name":    "Ada Lovelace",
    "email":   "ada@example.com",
    "message": "Hello from Formeze!"
  },
  "meta": {
    "ip":        "203.0.113.42",
    "userAgent": "Mozilla/5.0 ..."
  }
}`}
      />
      <SectionHeading level={2}>Verifying webhook signatures</SectionHeading>
      <p className="text-white/50 text-sm leading-relaxed mb-3">
        Each request includes an <Tag color="blue">X-Formeze-Signature</Tag>{" "}
        header — an HMAC-SHA256 of the raw body signed with your webhook secret.
      </p>
      <CodeBlock
        lang="js"
        filename="webhook-handler.js"
        code={`import crypto from "crypto";

export async function POST(req) {
  const body      = await req.text();
  const signature = req.headers.get("x-formeze-signature");
  const expected  = crypto
    .createHmac("sha256", process.env.FORMEZE_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== \`sha256=\${expected}\`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const submission = JSON.parse(body);
  // handle submission...
  return new Response("OK");
}`}
      />
    </section>
  );
}

function ApiErrors() {
  const errors = [
    {
      code: "400",
      label: "Bad Request",
      desc: "Missing required fields or malformed body",
    },
    { code: "401", label: "Unauthorized", desc: "Invalid or missing API key" },
    { code: "403", label: "Forbidden", desc: "Origin not in allowed list" },
    { code: "404", label: "Not Found", desc: "Form ID does not exist" },
    {
      code: "429",
      label: "Rate Limited",
      desc: "Too many submissions in a short period",
    },
    {
      code: "500",
      label: "Server Error",
      desc: "Formeze internal error — we're paged automatically",
    },
  ];
  return (
    <section>
      <SectionHeading id="api-errors" level={1}>
        Error Codes
      </SectionHeading>
      <p className="text-white/55 leading-relaxed mb-5">
        All error responses follow a consistent JSON envelope.
      </p>
      <CodeBlock
        lang="json"
        code={`{
  "success": false,
  "error": "ORIGIN_NOT_ALLOWED",
  "message": "The request origin is not in the allowed list for this form.",
  "status": 403
}`}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3 pr-4 text-white/40 font-medium text-xs uppercase tracking-wide">
                Label
              </th>
              <th className="pb-3 text-white/40 font-medium text-xs uppercase tracking-wide">
                When
              </th>
            </tr>
          </thead>
          <tbody>
            {errors.map((e) => (
              <tr
                key={e.code}
                className="border-b border-white/5 hover:bg-white/[0.015] transition-colors"
              >
                <td className="py-3 pr-4">
                  <Tag
                    color={
                      e.code.startsWith("4")
                        ? e.code === "429"
                          ? "yellow"
                          : "red"
                        : "red"
                    }
                  >
                    {e.code}
                  </Tag>
                </td>
                <td className="py-3 pr-4 font-mono text-xs text-white/55">
                  {e.label}
                </td>
                <td className="py-3 text-xs text-white/40">{e.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const SECTION_MAP = {
  introduction: <Introduction />,
  quickstart: <QuickStart />,
  "how-it-works": <HowItWorks />,
  fields: <AcceptedFields />,
  redirects: <CustomRedirects />,
  "email-notifications": <EmailNotifications />,
  "spam-protection": <SpamProtection />,
  // "allowed-origins": <AllowedOrigins />,
  html: <HtmlIntegration />,
  react: <ReactIntegration />,
  nextjs: <NextjsIntegration />,
  webhooks: <Webhooks />,
  "api-errors": <ApiErrors />,
};

// ─── MAIN PAGE

export default function Documentation() {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const validIds = new Set(allItems.map((i) => i.id));

  // Derive active section from URL, falling back to "introduction"
  const getSectionFromURL = () => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    return section && validIds.has(section) ? section : "introduction";
  };

  const [activeSection, setActiveSection] = useState(getSectionFromURL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const contentRef = useRef(null);

  // Keep active section in sync when the URL changes (e.g. browser back/forward)
  useEffect(() => {
    const section = getSectionFromURL();
    setActiveSection(section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const filtered = search.trim()
    ? allItems.filter((i) =>
        i.label.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const navigate = (id) => {
    routerNavigate({ search: `?section=${id}` });
    setSidebarOpen(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const currentIndex = allItems.findIndex((i) => i.id === activeSection);
  const prev = allItems[currentIndex - 1];
  const next = allItems[currentIndex + 1];

  return (
    <div
      className="min-h-screen bg-[#0a0f0a] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }
        .font-display { font-family: 'Syne', sans-serif; }
        code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,0.2); border-radius: 99px; }

        .sidebar-link {
          transition: all 0.15s ease;
          border-left: 2px solid transparent;
        }
        .sidebar-link:hover { color: white; border-color: rgba(74,222,128,0.3); }
        .sidebar-link.active { color: #4ade80; border-color: #4ade80; background: rgba(74,222,128,0.05); }

        .logo-glow { box-shadow: 0 0 16px rgba(74,222,128,0.3); }

        .btn-primary { background: linear-gradient(135deg,#4ade80,#22c55e); transition: all 0.2s; }
        .btn-primary:hover { box-shadow: 0 4px 16px rgba(74,222,128,0.3); }

        .grid-bg {
          background-image:
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .prose p + p { margin-top: 1rem; }
        .mobile-overlay { backdrop-filter: blur(4px); }

        .nav-search:focus { border-color: rgba(74,222,128,0.4); outline: none; box-shadow: 0 0 0 3px rgba(74,222,128,0.08); }

        .content-fade { animation: contentFade 0.25s ease; }
        @keyframes contentFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .tag-pill { background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.18); }
        .code-block-wrap { transition: border-color 0.2s; }
        .code-block-wrap:hover { border-color: rgba(74,222,128,0.2); }

        /* Kill ALL Tailwind Typography / prose overrides inside code blocks */
        .prose .code-block-wrap,
        .prose .code-block-wrap *,
        .prose :where(.code-block-wrap):not(:where([class~="not-prose"] *)),
        .prose :where(pre):not(:where([class~="not-prose"] *)) {
          color: unset;
          background: unset;
          font-size: unset;
          border-radius: unset;
          padding: unset;
          margin: unset;
          max-width: unset;
        }
        .code-block-wrap pre {
          margin: 0 !important;
          border-radius: 0 !important;
          background: #080e08 !important;
          padding: 1rem 1.25rem !important;
          font-size: 0.875rem !important;
          color: #e2e8e2 !important;
        }
        .code-block-wrap pre code {
          background: none !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-size: inherit !important;
          color: inherit !important;
          font-weight: normal !important;
        }

        h1, h2, h3 { scroll-margin-top: 80px; }
      `}</style>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/6 backdrop-blur-xl bg-[#0a0f0a]/85 flex items-center">
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
            Docs
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {["Docs", "Help", "Support"].map((l) => (
              <Link
                key={l}
                to={"/" + l}
                className={`transition-colors font-medium ${l === "Docs" ? "text-green-400" : "text-white/45 hover:text-white"}`}
              >
                {l}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-0 ml-4">
            {localStorage.getItem("token") ? (
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
          </div>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-white/50 hover:text-white transition-colors ml-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* ── LAYOUT ───────────────────────────────────────────────── */}
      <div className="pt-14 flex min-h-screen">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="mobile-overlay fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ──────────────────────────────────────────── */}
        <aside
          className={`
          fixed top-14 left-0 bottom-0 w-64 z-40 flex flex-col
          border-r border-white/6 bg-[#0a0f0a]
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          {/* Search */}
          <div className="px-4 py-3 border-b border-white/6">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search docs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="nav-search w-full bg-white/[0.04] border border-white/8 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-white/25 transition-all"
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
            {(filtered
              ? [
                  {
                    group: `Results (${filtered.length})`,
                    icon: "🔍",
                    items: filtered,
                  },
                ]
              : NAV_SECTIONS
            ).map((section) => (
              <div key={section.group}>
                <div className="flex items-center gap-1.5 px-3 mb-1.5 ">
                  <span className="text-xs">{section.icon}</span>
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-white/25">
                    {section.group}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`cursor-pointer sidebar-link text-left w-full px-3 py-2 rounded-r-lg text-sm font-medium transition-all
                        ${activeSection === item.id ? "active" : "text-white/40"}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Version badge */}
          <div className="px-4 py-3 border-t border-white/6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/25">Version</span>
              <Tag color="green">v1.1.0</Tag>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────── */}
        <main ref={contentRef} className="flex-1 min-w-0 grid-bg">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-white/25 mb-8 font-medium">
              <span>Docs</span>
              {NAV_SECTIONS.map((s) =>
                s.items.find((i) => i.id === activeSection) ? (
                  <>
                    <svg
                      key="sep"
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span key="group" className="text-white/40">
                      {s.group}
                    </span>
                    <svg
                      key="sep2"
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span key="label" className="text-green-400">
                      {s.items.find((i) => i.id === activeSection)?.label}
                    </span>
                  </>
                ) : null,
              )}
            </div>

            {/* Content */}
            <div key={activeSection} className="content-fade prose">
              {SECTION_MAP[activeSection]}
            </div>

            {/* Divider */}
            <div className="mt-14 mb-8 border-t border-white/6" />

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <button
                  onClick={() => navigate(prev.id)}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-green-400 transition-colors group cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-white/20 mb-0.5">Previous</div>
                    <div>{prev.label}</div>
                  </div>
                </button>
              ) : (
                <div />
              )}
              {next ? (
                <button
                  onClick={() => navigate(next.id)}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-green-400 transition-colors group text-right cursor-pointer"
                >
                  <div>
                    <div className="text-xs text-white/20 mb-0.5">Next</div>
                    <div>{next.label}</div>
                  </div>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* FOOTBAR FEEDBACK HERE */}
          </div>
        </main>

        {/* ── ON-PAGE TOC (right rail, desktop) ────────────────── */}
        <aside className="hidden xl:flex flex-col w-52 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pt-10 pr-6 pl-2">
          <div className="text-[11px] font-semibold tracking-widest uppercase text-white/20 mb-3">
            On this page
          </div>
          <div className="flex flex-col gap-1.5">
            {NAV_SECTIONS.flatMap((s) => s.items).filter(
              (i) => i.id === activeSection,
            ).length === 0
              ? null
              : ["introduction", "quickstart", "how-it-works"].includes(
                    activeSection,
                  )
                ? [
                    { label: "Overview" },
                    { label: "Steps" },
                    { label: "Next" },
                  ].map((t, i) => (
                    <span key={i} className="text-xs text-white/25 pl-2 py-1">
                      {t.label}
                    </span>
                  ))
                : null}
            {NAV_SECTIONS.find((s) =>
              s.items.some((i) => i.id === activeSection),
            )?.items.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-left text-xs py-1 pl-2 rounded border-l-2 transition-all
                  ${
                    item.id === activeSection
                      ? "text-green-400 border-green-400"
                      : "text-white/25 border-transparent hover:text-white/50 hover:border-white/20"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
