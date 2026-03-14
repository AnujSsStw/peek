import Link from "next/link";

const WIDGET_IMAGES = [
  { src: "https://vkzt6x8f94.ufs.sh/f/GA7pZstuPi18GdTbGYuPi18WegzBykIjNlvumRnHTDYawMJU", width: 240 },
  { src: "https://vkzt6x8f94.ufs.sh/f/GA7pZstuPi18pB5RVFQC1el0Q7qfKavkLRt85Y6cGVHIWxhi", width: 140 },
  { src: "https://vkzt6x8f94.ufs.sh/f/GA7pZstuPi18Wf2QDHeSGdgq8Xf3Prsp1WNQZEhAcC0ety9m", width: 180 },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Background gradient orbs */}
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
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,242,74,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "-15%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,242,74,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        className="animate-fade-in"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link
            href="/help"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "color 0.2s",
            }}
          >
            Help
          </Link>
          <Link
            href="/get-started"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              padding: "8px 20px",
              borderRadius: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 40px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* Left — copy */}
        <div>
          <div
            className="animate-fade-up delay-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-glow)",
              borderRadius: "100px",
              padding: "6px 16px 6px 10px",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "12px" }}>✨</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--accent)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Now on Android
            </span>
          </div>

          <h1
            className="animate-fade-up delay-2"
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: "20px",
            }}
          >
            Your day,
            <br />
            <span style={{ color: "var(--accent)" }}>at a glance.</span>
          </h1>

          <p
            className="animate-fade-up delay-3"
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              maxWidth: "420px",
              marginBottom: "36px",
            }}
          >
            Peek turns your home screen into an intelligent daily dashboard.
            Calendar events, tasks, weather — all in one beautiful widget
            powered by AI.
          </p>

          <div
            className="animate-fade-up delay-4"
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            <Link
              href="/get-started"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--accent)",
                color: "var(--bg)",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: "12px",
                letterSpacing: "-0.01em",
                boxShadow: "0 0 30px rgba(196,242,74,0.2), 0 4px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Get Peek
              <span style={{ fontSize: "18px" }}>→</span>
            </Link>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginLeft: "4px",
              }}
            >
              Free to use
            </span>
          </div>
        </div>

        {/* Right — widget previews */}
        <div
          style={{
            position: "relative",
            height: "480px",
          }}
        >
          {/* Large widget — back left */}
          <img
            src={WIDGET_IMAGES[0].src}
            alt="Widget preview"
            className="animate-slide-right delay-3"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "280px",
              borderRadius: "20px",
              border: "1px solid var(--border-up)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          />

          {/* Small widget — top right */}
          <img
            src={WIDGET_IMAGES[1].src}
            alt="Widget preview"
            className="animate-slide-right delay-4"
            style={{
              position: "absolute",
              top: "20px",
              right: "0",
              width: "160px",
              borderRadius: "16px",
              border: "1px solid var(--border-up)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          />

          {/* Medium widget — bottom right, overlapping */}
          <img
            src={WIDGET_IMAGES[2].src}
            alt="Widget preview"
            className="animate-slide-right delay-5"
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "220px",
              borderRadius: "18px",
              border: "1px solid var(--border-up)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </section>

      {/* Features strip */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "60px 40px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              icon: "📅",
              title: "Google Calendar",
              desc: "Events sync automatically. See your day without opening an app.",
            },
            {
              icon: "✅",
              title: "Todoist",
              desc: "Tasks, priorities, and progress — all surfaced on your widget.",
            },
            {
              icon: "🤖",
              title: "AI-Powered",
              desc: "Picks the perfect layout and data for the moment. Always fresh.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-up delay-${i + 5}`}
              style={{
                background: "var(--bg-up)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "28px",
                transition: "border-color 0.3s, background 0.3s",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>{f.icon}</div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 700,
                  fontSize: "16px",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
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
        <div style={{ display: "flex", gap: "24px" }}>
          <Link
            href="/help"
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Help & Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
