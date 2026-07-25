"use client";

import React, { useState } from "react";

/* ---------------------------------------------------------
   FRAMELY — paste a link, get screenshots in every size
   Design tokens
   bg        #F7F8FA   cool porcelain white
   ink       #14151A   near-black text
   ink-dim   #6B6E76   muted slate
   line      rgba(20,21,26,0.10)
   panel     #FFFFFF
   indigo    #3D5AFE   primary — "capture" blue
   flash     #FFC53D   secondary — camera-flash yellow
   mint      #22C58B   success / done state
--------------------------------------------------------- */

const C = {
  bg: "#F7F8FA",
  ink: "#14151A",
  dim: "#6B6E76",
  dim2: "#9DA0A8",
  line: "rgba(20,21,26,0.10)",
  panel: "#FFFFFF",
  indigo: "#3D5AFE",
  indigoDim: "#EEF0FF",
  flash: "#FFC53D",
  mint: "#22C58B",
};

/* a tiny fake "webpage" used inside every decorative device frame —
   these frames are a permanent design element, not tied to any real capture */
function MockPage({ variant = "site" }) {
  return (
    <div className="flex h-full w-full flex-col" style={{ background: "#fff" }}>
      <div
        className="flex items-center gap-1.5 px-2 py-1.5"
        style={{ borderBottom: `1px solid ${C.line}` }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#28C840" }} />
      </div>
      <div className="flex-1 p-2.5">
        <div
          className="mb-2 h-3 w-2/5 rounded-sm"
          style={{ background: C.ink, opacity: 0.85 }}
        />
        <div
          className="mb-3 h-1.5 w-3/5 rounded-sm"
          style={{ background: C.dim2 }}
        />
        {variant === "site" && (
          <div className="grid grid-cols-3 gap-1.5">
            {[C.indigo, C.flash, C.mint].map((c, i) => (
              <div key={i} className="rounded-sm" style={{ height: 26, background: c, opacity: 0.18 }} />
            ))}
          </div>
        )}
        {variant === "portfolio" && (
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-sm" style={{ height: 18, background: C.indigo, opacity: i % 2 ? 0.12 : 0.22 }} />
            ))}
          </div>
        )}
        {variant === "social" && (
          <div className="flex h-full items-center justify-center">
            <div
              className="h-10 w-10 rounded-full"
              style={{ background: `linear-gradient(135deg, ${C.indigo}, ${C.flash})` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function CornerBrackets({ color = C.indigo }) {
  const s = 14;
  const style = (pos) => ({
    position: "absolute",
    width: s,
    height: s,
    borderColor: color,
    ...pos,
  });
  return (
    <>
      <div style={{ ...style({ top: -1, left: -1, borderTop: "2px solid", borderLeft: "2px solid" }) }} />
      <div style={{ ...style({ top: -1, right: -1, borderTop: "2px solid", borderRight: "2px solid" }) }} />
      <div style={{ ...style({ bottom: -1, left: -1, borderBottom: "2px solid", borderLeft: "2px solid" }) }} />
      <div style={{ ...style({ bottom: -1, right: -1, borderBottom: "2px solid", borderRight: "2px solid" }) }} />
    </>
  );
}

/* purely decorative — always shows the mock page, regardless of capture state */
function DeviceFrame({ label, dims, w, h, variant, rotate = 0, delay = 0 }) {
  return (
    <div
      className="relative shrink-0 fadeUp"
      style={{ width: w, height: h, transform: `rotate(${rotate}deg)`, animationDelay: `${delay}ms` }}
    >
      <div
        className="group relative h-full w-full overflow-hidden rounded-xl"
        style={{
          background: C.panel,
          border: `1px solid ${C.line}`,
          boxShadow: "0 30px 60px -20px rgba(20,21,26,0.18)",
        }}
      >
        <MockPage variant={variant} />
        <div className="pointer-events-none absolute inset-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <CornerBrackets />
        </div>
      </div>
      <div
        className="mt-2 flex items-center justify-between text-[11px]"
        style={{ color: C.dim2, fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span>{label}</span>
        <span>{dims}</span>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs"
      style={{
        background: C.panel,
        border: `1px solid ${C.line}`,
        color: C.dim,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, big = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 ${
        big ? "px-7 py-4 text-base" : "px-5 py-3 text-sm"
      }`}
      style={{
        color: "#fff",
        background: C.ink,
        fontFamily: "'Sora', sans-serif",
        boxShadow: `0 10px 30px -10px rgba(20,21,26,0.45)`,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, small = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-medium transition-colors duration-300 ${small ? "px-3.5 py-2 text-xs" : "px-5 py-3 text-sm"}`}
      style={{
        color: C.ink,
        border: `1px solid ${C.line}`,
        fontFamily: "'Sora', sans-serif",
        background: C.panel,
      }}
    >
      {children}
    </button>
  );
}

function SectionEyebrow({ index, label }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.indigo, fontSize: 12, letterSpacing: 2 }}>
        {index}
      </span>
      <span style={{ width: 28, height: 1, background: C.line }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.dim, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

const sizes = [
  { name: "Desktop", dims: "1920 × 1080", tag: "Full page or viewport" },
  { name: "Tablet", dims: "1024 × 768", tag: "Landscape & portrait" },
  { name: "Mobile", dims: "390 × 844", tag: "iOS & Android safe area" },
  { name: "Social card", dims: "1200 × 630", tag: "OG / Twitter preview" },
  { name: "Square", dims: "1080 × 1080", tag: "Instagram, gig covers" },
  { name: "Custom", dims: "W × H", tag: "Any size you type in" },
];

const useCases = [
  { t: "Fiverr / Upwork gig covers", d: "Turn a live project URL into a clean cover image without opening a design tool." },
  { t: "Portfolio case studies", d: "Consistent, high-res frames for every project on your site — same crop, every time." },
  { t: "Figma & design files", d: "Drop a real, current screenshot into a mockup instead of an outdated static export." },
  { t: "Social previews", d: "Generate the 1200×630 card your link will actually show when it's shared." },
];

const exampleLinks = ["dribbble.com/you", "yourname.dev", "fiverr.com/your-gig"];

function ResultRow({ result }) {
  const { name, width, height, png, jpeg } = result;
  return (
    <div
      className="hoverCard flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
      style={{ background: C.panel, border: `1px solid ${C.line}` }}
    >
      <div
        className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-44"
        style={{ background: C.bg, border: `1px solid ${C.line}` }}
      >
        <img src={png} alt={`${name} screenshot`} className="h-full w-full object-cover object-top" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>{name}</h3>
        <p style={{ color: C.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
          {width} × {height}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <a href={png} download={`${name.replace(/\s+/g, "-").toLowerCase()}-original.png`}>
          <GhostButton small>PNG · original</GhostButton>
        </a>
        <a href={jpeg} download={`${name.replace(/\s+/g, "-").toLowerCase()}-web.jpg`}>
          <GhostButton small>JPG · compressed</GhostButton>
        </a>
      </div>
    </div>
  );
}

export default function FramelyLanding() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [menuOpen, setMenuOpen] = useState(false);
  const [results, setResults] = useState([]); // [{ name, width, height, png, jpeg }]
  const [errorMsg, setErrorMsg] = useState("");

  const handleGenerate = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/screenshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Couldn't capture that page.");
      setResults(data.results || []);
      setStatus("ready");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'Inter', sans-serif", minHeight: "100%" }} className="w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .fadeUp { animation: fadeUp 0.8s cubic-bezier(.19,1,.22,1) both; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px);} to {opacity:1; transform:none;} }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hoverCard { transition: all .3s cubic-bezier(.19,1,.22,1); }
        .hoverCard:hover { transform: translateY(-4px); border-color: ${C.indigo}55 !important; box-shadow: 0 20px 40px -18px rgba(20,21,26,0.15); }
        ::selection { background: ${C.indigo}; color: #fff; }
        input::placeholder { color: ${C.dim2}; }
      `}</style>

      {/* NAV */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: C.ink }}
          >
            F
          </div>
          <span className="text-lg font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
            Framely
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex" style={{ color: C.dim, fontSize: 14 }}>
          <a className="hover:text-black transition-colors" href="#sizes">Sizes</a>
          <a className="hover:text-black transition-colors" href="#how">How it works</a>
          <a className="hover:text-black transition-colors" href="#use-cases">Use cases</a>
        </div>
        <div className="hidden md:block">
          <PrimaryButton>Capture a page</PrimaryButton>
        </div>
        <button className="md:hidden text-sm" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>
      {menuOpen && (
        <div className="mx-6 mb-4 flex flex-col gap-4 rounded-xl p-5 md:hidden" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
          {["Sizes", "How it works", "Use cases"].map((t) => (
            <a key={t} style={{ color: C.dim }} href="#">{t}</a>
          ))}
          <PrimaryButton>Capture a page</PrimaryButton>
        </div>
      )}

      {/* HERO */}
      <header className="mx-auto max-w-6xl px-6 pb-8 pt-8 md:pt-14">
        <div className="fadeUp text-center">
          <Badge>● Paste a link, pick a size, download the shot</Badge>
          <h1
            className="mx-auto mt-7 max-w-3xl text-[38px] leading-[1.12] font-semibold tracking-tight md:text-[62px]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Any link. Every size.
            <br />
            One clean{" "}
            <span style={{ color: C.indigo }}>screenshot.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg" style={{ color: C.dim }}>
            Paste a website, a portfolio, or any live URL — Framely captures it
            in the exact dimensions you need, ready to drop into a gig cover,
            a case study, or a Figma frame.
          </p>
        </div>

        {/* capture bar */}
        <div className="fadeUp mx-auto mt-10 max-w-2xl" style={{ animationDelay: "0.1s" }}>
          <div
            className="flex flex-col gap-3 rounded-2xl p-2.5 sm:flex-row"
            style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(20,21,26,0.25)" }}
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <span style={{ color: C.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>https://</span>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourportfolio.com"
                className="flex-1 bg-transparent py-3 text-sm outline-none"
                style={{ color: C.ink, fontFamily: "'JetBrains Mono', monospace" }}
              />
            </div>
            <PrimaryButton onClick={handleGenerate} disabled={status === "loading"}>
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <span className="spin inline-block h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: "#fff", borderTopColor: "transparent" }} />
                  Capturing
                </span>
              ) : status === "ready" ? (
                "Capture again"
              ) : (
                "Generate shots →"
              )}
            </PrimaryButton>
          </div>
          {status === "error" && (
            <p className="mt-3 text-center text-sm" style={{ color: "#E0453C" }}>
              {errorMsg}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs" style={{ color: C.dim2 }}>
            <span>Try:</span>
            {exampleLinks.map((s) => (
              <button
                key={s}
                onClick={() => setUrl(s)}
                className="rounded-full px-3 py-1"
                style={{ border: `1px solid ${C.line}`, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* device frame fan — permanent design element, not tied to a live capture */}
        <div className="relative mx-auto mt-16 flex min-h-[210px] max-w-4xl items-end justify-center gap-5 md:gap-8">
          <DeviceFrame label="Mobile" dims="390×844" w={92} h={190} variant="portfolio" rotate={-6} delay={0} />
          <DeviceFrame label="Square" dims="1080×1080" w={140} h={140} variant="social" rotate={-2} delay={80} />
          <DeviceFrame label="Desktop" dims="1920×1080" w={280} h={175} variant="site" rotate={0} delay={0} />
          <DeviceFrame label="Social card" dims="1200×630" w={190} h={110} variant="social" rotate={3} delay={120} />
          <DeviceFrame label="Tablet" dims="1024×768" w={120} h={160} variant="portfolio" rotate={7} delay={160} />
        </div>

        {/* results — the actual captured screenshots, listed clearly above the fold, not squeezed into the mock frames */}
        {(status === "loading" || status === "ready") && (
          <div className="fadeUp mx-auto mt-14 max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium" style={{ fontFamily: "'Sora', sans-serif" }}>
                {status === "loading" ? "Capturing your page…" : `Captured from ${url}`}
              </h3>
              {status === "ready" && (
                <span style={{ color: C.dim2, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                  {results.length} sizes
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {status === "loading" &&
                sizes.slice(0, 5).map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{ background: C.panel, border: `1px solid ${C.line}` }}
                  >
                    <div className="h-16 w-24 shrink-0 animate-pulse rounded-lg" style={{ background: C.bg }} />
                    <div className="flex-1">
                      <div className="h-3 w-24 animate-pulse rounded" style={{ background: C.bg }} />
                    </div>
                  </div>
                ))}
              {status === "ready" && results.map((r) => <ResultRow key={r.name} result={r} />)}
            </div>
          </div>
        )}
      </header>

      {/* SIZES */}
      <section id="sizes" className="mx-auto max-w-6xl px-6 py-24">
        <SectionEyebrow index="01" label="Output sizes" />
        <h2 className="max-w-xl text-3xl font-semibold md:text-5xl" style={{ fontFamily: "'Sora', sans-serif" }}>
          Six formats. One capture.
        </h2>
        <p className="mt-4 max-w-lg" style={{ color: C.dim }}>
          Every size is generated from the same capture, so nothing ever looks
          out of sync across platforms.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sizes.map((s) => (
            <div key={s.name} className="hoverCard rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>{s.name}</h3>
                <span style={{ color: C.indigo, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>{s.dims}</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: C.dim }}>{s.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <SectionEyebrow index="02" label="The flow" />
        <h2 className="max-w-xl text-3xl font-semibold md:text-5xl" style={{ fontFamily: "'Sora', sans-serif" }}>
          Paste. Pick. Download.
        </h2>
        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px md:block" style={{ background: C.line }} />
          {[
            { n: "01", t: "Paste any URL", d: "A live website, a portfolio page, a Figma share link — anything that renders in a browser." },
            { n: "02", t: "Pick your sizes", d: "Choose from the standard set or type an exact width and height." },
            { n: "03", t: "Download the set", d: "Every frame lands in one folder, named and sized, ready to upload." },
          ].map((s) => (
            <div key={s.n} className="relative">
              <div
                className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-full text-sm"
                style={{ background: C.bg, border: `1px solid ${C.indigo}`, color: C.indigo, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {s.n}
              </div>
              <h3 className="text-xl font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>{s.t}</h3>
              <p className="mt-2 text-sm" style={{ color: C.dim }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="mx-auto max-w-6xl px-6 py-24">
        <SectionEyebrow index="03" label="Who it's for" />
        <h2 className="max-w-xl text-3xl font-semibold md:text-5xl" style={{ fontFamily: "'Sora', sans-serif" }}>
          Built for the last mile of shipping work.
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((u) => (
            <div key={u.t} className="hoverCard flex gap-4 rounded-2xl p-6" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: C.flash }} />
              <div>
                <h3 className="text-base font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>{u.t}</h3>
                <p className="mt-1.5 text-sm" style={{ color: C.dim }}>{u.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-28 pt-6 text-center">
        <div className="rounded-2xl px-8 py-16" style={{ background: C.ink }}>
          <h2 className="mx-auto max-w-xl text-3xl font-semibold text-white md:text-5xl" style={{ fontFamily: "'Sora', sans-serif" }}>
            Your next screenshot is one link away.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              className="rounded-xl px-7 py-4 text-base font-medium transition-transform hover:-translate-y-0.5"
              style={{ background: "#fff", color: C.ink, fontFamily: "'Sora', sans-serif" }}
            >
              Capture your first page →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t px-6 py-10" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white" style={{ background: C.ink }}>F</div>
            <span style={{ fontFamily: "'Sora', sans-serif" }}>Framely</span>
          </div>
          <div className="flex gap-6 text-sm" style={{ color: C.dim2 }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
          <span style={{ color: C.dim2, fontSize: 13 }}>© 2026 Framely</span>
        </div>
      </footer>
    </div>
  );
}
