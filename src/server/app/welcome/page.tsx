import Link from "next/link";

const HERO_WIDGETS = [
  { src: "/timeline-tasks_floating-light.png", alt: "Timeline tasks widget", rotate: -12, x: -20, y: 60, z: 1, w: 220 },
  { src: "/contextual-hero_morning.png", alt: "Contextual hero widget", rotate: -5, x: 60, y: 20, z: 2, w: 200 },
  { src: "/bento-box_ocean.png", alt: "Bento box widget", rotate: 2, x: 150, y: 40, z: 4, w: 240 },
  { src: "/minimalist-stack_editorial.png", alt: "Minimalist stack widget", rotate: 8, x: 260, y: 10, z: 3, w: 190 },
  { src: "/progress-ring_light.png", alt: "Progress ring widget", rotate: 14, x: 340, y: 70, z: 2, w: 170 },
  { src: "/companion-quote_warm.png", alt: "Companion quote widget", rotate: -2, x: 100, y: 280, z: 3, w: 210 },
  { src: "/contextual-hero_night.png", alt: "Night widget", rotate: 6, x: 280, y: 260, z: 2, w: 180 },
] as const;

const GALLERY_ROWS = [
  [
    "/contextual-hero_calm.png",
    "/bento-box_cream.png",
    "/timeline-tasks_floating-light.png",
    "/minimalist-stack_editorial.png",
    "/progress-ring_light.png",
    "/companion-quote_warm.png",
    "/contextual-hero_night.png",
    "/bento-box_neon.png",
  ],
  [
    "/timeline_emerald.png",
    "/contextual-hero_weather.png",
    "/minimalist-stack_neon.png",
    "/bento-box_frost.png",
    "/timeline-tasks_nested-dark.png",
    "/contextual-hero_energy.png",
    "/progress-ring_dark.png",
    "/bento-box_charcoal.png",
  ],
];

export default function WelcomePage() {
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
            background:
              "radial-gradient(circle, rgba(196,242,74,0.06) 0%, transparent 70%)",
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
            background:
              "radial-gradient(circle, rgba(196,242,74,0.04) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,242,74,0.03) 0%, transparent 60%)",
            filter: "blur(100px)",
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
            className="nav-cta"
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
            <span style={{ fontSize: "12px" }}>&#x2728;</span>
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
              className="hero-cta"
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
                boxShadow:
                  "0 0 30px rgba(196,242,74,0.2), 0 4px 12px rgba(0,0,0,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              Get Peek
              <span style={{ fontSize: "18px" }}>&rarr;</span>
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

        {/* Right — fanned widget cards */}
        <div
          className="hero-mosaic"
          style={{
            position: "relative",
            height: "520px",
            perspective: "1200px",
          }}
        >
          {/* Glow backdrop behind cards */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(196,242,74,0.1) 0%, rgba(196,242,74,0.03) 40%, transparent 70%)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />

          {HERO_WIDGETS.map((widget, i) => (
            <img
              key={widget.src}
              src={widget.src}
              alt={widget.alt}
              className={`animate-hero-card hero-widget delay-${i + 2}`}
              style={{
                position: "absolute",
                left: `${widget.x}px`,
                top: `${widget.y}px`,
                width: `${widget.w}px`,
                zIndex: widget.z,
                borderRadius: "16px",
                border: "1px solid var(--border-up)",
                transform: `rotate(${widget.rotate}deg)`,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            />
          ))}
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
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
        >
          {[
            {
              icon: "\uD83D\uDCC5",
              title: "Google Calendar",
              desc: "Events sync automatically. See your day without opening an app.",
            },
            {
              icon: "\u2705",
              title: "Todoist",
              desc: "Tasks, priorities, and progress — all surfaced on your widget.",
            },
            {
              icon: "\uD83E\uDD16",
              title: "AI-Powered",
              desc: "Picks the perfect layout and data for the moment. Always fresh.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className={`animate-fade-up delay-${i + 5} feature-card`}
              style={{
                background: "var(--bg-up)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "28px",
                transition: "border-color 0.3s, background 0.3s, transform 0.3s",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>
                {f.icon}
              </div>
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

      {/* Widget gallery — infinite scroll marquee */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          padding: "40px 0 80px",
          overflow: "hidden",
        }}
      >
        <div
          className="animate-fade-up delay-6"
          style={{
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            9 layouts. Endless styles.
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-muted)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            From minimal timelines to bold bento grids — Peek adapts to
            your aesthetic and your schedule.
          </p>
        </div>

        {/* Row 1 — scrolls left */}
        <div className="marquee-track" style={{ marginBottom: "16px" }}>
          <div className="marquee-scroll marquee-left">
            {[...GALLERY_ROWS[0], ...GALLERY_ROWS[0]].map((src, i) => (
              <img
                key={`row1-${i}`}
                src={src}
                alt="Widget style preview"
                className="gallery-img"
              />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="marquee-track">
          <div className="marquee-scroll marquee-right">
            {[...GALLERY_ROWS[1], ...GALLERY_ROWS[1]].map((src, i) => (
              <img
                key={`row2-${i}`}
                src={src}
                alt="Widget style preview"
                className="gallery-img"
              />
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "120px",
            background:
              "linear-gradient(to right, var(--bg) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "120px",
            background:
              "linear-gradient(to left, var(--bg) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      </section>

      {/* How it works */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "60px 40px 100px",
        }}
      >
        <h2
          className="animate-fade-up"
          style={{
            fontFamily: "var(--display)",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            textAlign: "center",
            marginBottom: "56px",
          }}
        >
          How it works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
          className="how-it-works-grid"
        >
          {[
            {
              step: "01",
              title: "Connect",
              desc: "Sign in with Google. Link Todoist if you want.",
            },
            {
              step: "02",
              title: "Choose",
              desc: "Pick a widget layout and style that fits you.",
            },
            {
              step: "03",
              title: "Generate",
              desc: "AI reads your calendar, tasks, and weather.",
            },
            {
              step: "04",
              title: "Glance",
              desc: "Your widget refreshes every 30 min. Always current.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`animate-fade-up delay-${i + 2}`}
              style={{
                textAlign: "center",
                padding: "24px 16px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "11px",
                  color: "var(--accent)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  marginBottom: "14px",
                }}
              >
                {item.step}
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 700,
                  fontSize: "18px",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "var(--text-muted)",
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 40px 100px",
        }}
      >
        <div
          className="animate-fade-up cta-banner"
          style={{
            background: "var(--bg-up)",
            border: "1px solid var(--border-up)",
            borderRadius: "24px",
            padding: "56px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Glow behind CTA */}
          <div
            style={{
              position: "absolute",
              top: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "400px",
              height: "300px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(196,242,74,0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "14px",
              position: "relative",
            }}
          >
            Ready to peek at your day?
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              marginBottom: "28px",
              position: "relative",
            }}
          >
            Set up your first widget in under a minute.
          </p>
          <Link
            href="/get-started"
            className="hero-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent)",
              color: "var(--bg)",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "12px",
              letterSpacing: "-0.01em",
              boxShadow:
                "0 0 30px rgba(196,242,74,0.2), 0 4px 12px rgba(0,0,0,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative",
            }}
          >
            Get Started
            <span style={{ fontSize: "18px" }}>&rarr;</span>
          </Link>
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
