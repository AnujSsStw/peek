import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "How do I add a widget to my home screen?",
    a: "Long-press your Android home screen, tap \"Widgets\", find Peek in the list, then drag your preferred size (small, medium, or large) onto your home screen.",
  },
  {
    q: "How does Peek get my calendar events?",
    a: "Connect your Google Calendar in Settings → Integrations. Peek reads your events (read-only) and surfaces them on your widget. Your data stays between you and our servers — we never share it.",
  },
  {
    q: "How do I connect Todoist?",
    a: "Go to Settings → Integrations → Todoist → Connect. Peek will import your projects and tasks automatically. Only read access is requested.",
  },
  {
    q: "Why is my widget blank or showing a loading spinner?",
    a: "This usually means the widget hasn't fetched its first image yet. Pull down to refresh on the Widgets tab, or check your internet connection. If the issue persists, try removing and re-adding the widget.",
  },
  {
    q: "How often does the widget update?",
    a: "Peek refreshes your widget periodically in the background. You can also force a refresh by pulling down on the Widgets tab inside the app.",
  },
  {
    q: "Can I choose which layout my widget uses?",
    a: "When you add a widget, Peek's AI picks the best layout for the time of day and your data. Layout selection is automatic to keep things fresh and contextual.",
  },
  {
    q: "What data does Peek access?",
    a: "Only what you explicitly connect: Google Calendar events (read-only) and Todoist tasks (read-only). We also use your approximate location for weather if you allow it. No data is sold or shared with third parties.",
  },
  {
    q: "How do I disconnect an integration?",
    a: "Go to Settings → tap the connected integration → Disconnect. This removes all synced data for that provider from Peek.",
  },
  {
    q: "Is Peek free?",
    a: "Yes. Peek is free to use during the current beta period.",
  },
];

const CONTACT_CHANNELS = [
  {
    icon: "✉️",
    label: "Email",
    value: "support@peek.app",
    href: "mailto:support@peek.app",
  },
  {
    icon: "🐛",
    label: "Bug Reports",
    value: "GitHub Issues",
    href: "https://github.com",
  },
];

export default function HelpPage() {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background accents */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "-8%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,242,74,0.05) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        className="animate-fade-in help-container"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "24px",
          paddingBottom: "24px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text)",
          }}
        >
          <div className="glow-dot" />
          <span
            style={{
              fontFamily: "var(--display)",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.02em",
            }}
          >
            Peek
          </span>
        </Link>

        <Link
          href="/"
          style={{
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "16px" }}>←</span>
          Home
        </Link>
      </nav>

      {/* Header */}
      <header
        className="help-container"
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "60px",
          paddingBottom: "0",
        }}
      >
        <div
          className="animate-fade-up delay-1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-glow)",
            borderRadius: "100px",
            padding: "5px 14px 5px 8px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "11px" }}>❓</span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Help Center
          </span>
        </div>

        <h1
          className="animate-fade-up delay-2"
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "12px",
          }}
        >
          Help & Support
        </h1>
        <p
          className="animate-fade-up delay-3"
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "var(--text-muted)",
            maxWidth: "500px",
          }}
        >
          Everything you need to get the most out of Peek. Can't find what
          you're looking for? Reach out below.
        </p>
      </header>

      {/* FAQ Section */}
      <section
        className="help-container"
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "48px",
          paddingBottom: "48px",
        }}
      >
        <div
          className="animate-fade-up delay-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "1px",
              background: "var(--accent)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Frequently Asked
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQ_ITEMS.map((item, i) => (
            <details
              key={i}
              className={`animate-fade-up delay-${Math.min(i + 3, 8)}`}
              style={{
                background: "var(--bg-up)",
                borderRadius: i === 0 ? "14px 14px 2px 2px" : i === FAQ_ITEMS.length - 1 ? "2px 2px 14px 14px" : "2px",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <summary
                style={{
                  padding: "16px 18px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: 600,
                  lineHeight: 1.4,
                  listStyle: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  userSelect: "none",
                  transition: "color 0.2s",
                }}
              >
                <span>{item.q}</span>
                <span
                  style={{
                    fontSize: "18px",
                    color: "var(--text-muted)",
                    fontWeight: 300,
                    flexShrink: 0,
                    transition: "transform 0.2s",
                  }}
                >
                  +
                </span>
              </summary>
              <div
                style={{
                  padding: "0 18px 16px",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "var(--text-muted)",
                }}
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section
        className="help-container"
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "20px",
          paddingBottom: "48px",
        }}
      >
        <div
          className="animate-fade-up delay-4"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "1px",
              background: "var(--accent)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Quick Start
          </span>
        </div>

        <div className="help-grid">
          {[
            {
              step: "01",
              title: "Sign in",
              desc: "Use Google to create your account. Takes 5 seconds.",
              accent: false,
            },
            {
              step: "02",
              title: "Connect",
              desc: "Link Google Calendar and Todoist in Settings → Integrations.",
              accent: false,
            },
            {
              step: "03",
              title: "Add widget",
              desc: "Long-press home screen → Widgets → Peek. Done.",
              accent: true,
            },
          ].map((s, i) => (
            <div
              key={s.step}
              className={`animate-fade-up delay-${i + 5}`}
              style={{
                background: s.accent ? "var(--accent-dim)" : "var(--bg-up)",
                border: `1px solid ${s.accent ? "var(--accent-glow)" : "var(--border)"}`,
                borderRadius: "14px",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: s.accent ? "var(--accent)" : "var(--text-muted)",
                  letterSpacing: "0.08em",
                  marginBottom: "12px",
                }}
              >
                {s.step}
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 700,
                  fontSize: "16px",
                  marginBottom: "6px",
                  letterSpacing: "-0.01em",
                  color: s.accent ? "var(--accent)" : "var(--text)",
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                }}
              >
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        className="help-container"
        style={{
          position: "relative",
          zIndex: 10,
          paddingTop: "20px",
          paddingBottom: "48px",
        }}
      >
        <div
          className="animate-fade-up delay-5"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "1px",
              background: "var(--accent)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "11px",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Contact Us
          </span>
        </div>

        <div className="help-contact-row">
          {CONTACT_CHANNELS.map((ch, i) => (
            <a
              key={ch.label}
              href={ch.href}
              className={`animate-fade-up delay-${i + 6}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "var(--bg-up)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "20px 24px",
                textDecoration: "none",
                color: "var(--text)",
                transition: "border-color 0.3s, background 0.3s",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {ch.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "2px",
                  }}
                >
                  {ch.label}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  {ch.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="help-container"
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid var(--border)",
          paddingTop: "24px",
          paddingBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            fontFamily: "var(--mono)",
          }}
        >
          peek v0.1
        </span>
        <Link
          href="/"
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
