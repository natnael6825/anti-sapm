import { useEffect, useMemo, useState } from 'react';
import { AntiBotForm } from './components/AntiBotForm';
import type { LeadData } from './components/AntiBotForm';

const useHumanSignals = () => {
  const [signals, setSignals] = useState({
    moved: false,
    scrolled: false,
    typed: false,
    seconds: 0,
  });

  useEffect(() => {
    const onMove = () => setSignals((prev) => ({ ...prev, moved: true }));
    const onScroll = () => setSignals((prev) => ({ ...prev, scrolled: true }));
    const onKey = () => setSignals((prev) => ({ ...prev, typed: true }));

    window.addEventListener('mousemove', onMove, { once: true });
    window.addEventListener('scroll', onScroll, { once: true });
    window.addEventListener('keydown', onKey, { once: true });

    const timer = window.setInterval(() => {
      setSignals((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.clearInterval(timer);
    };
  }, []);

  return signals;
};

function App() {
  const [submitted, setSubmitted] = useState<LeadData | null>(null);
  const signals = useHumanSignals();

  const ready = useMemo(() => {
    // Technique: behavioral gating based on human-like signals + time on page.
    return signals.moved && signals.scrolled && signals.typed && signals.seconds >= 4;
  }, [signals]);

  const handleSubmit = (data: LeadData) => {
    console.log('Anti-bot demo submission', data);
    setSubmitted(data);
  };

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden hero-sheen">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-emerald-300/60 blur-3xl float-slow" />
          <div className="absolute left-0 top-32 h-80 w-80 rounded-full bg-teal-400/50 blur-3xl float-fast" />
          <div className="absolute bottom-0 right-20 h-48 w-48 rounded-full bg-sky-300/50 blur-3xl float-slow" />
          <div className="absolute top-1/2 left-1/3 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl float-fast" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20">
          <div className="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl fade-in">
              <div className="pill shimmer">
                ✨ Anti-Bot Demo - Making automated scraping harder
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
                A lead-gen landing page that doesn't hand bots your form fields.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-700">
                This single-page demo showcases practical, client-side friction against
                automated scraping, DOM analysis, and headless form submission scripts.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <button className="cta-button">🚀 See the demo flow</button>
                <span className="text-sm font-semibold text-slate-700">
                  Scroll to unlock the secure form.
                </span>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-white/90 px-5 py-3 shadow-md hover-lift border border-emerald-100">
                  🔒 Closed Shadow DOM
                </div>
                <div className="rounded-2xl bg-white/90 px-5 py-3 shadow-md hover-lift border border-sky-100">
                  ⚡ Dynamic Fields
                </div>
                <div className="rounded-2xl bg-white/90 px-5 py-3 shadow-md hover-lift border border-amber-100">
                  🍯 Honeypot Gating
                </div>
                <div className="rounded-2xl bg-white/90 px-5 py-3 shadow-md hover-lift border border-teal-100">
                  🎭 Obfuscated Attrs
                </div>
              </div>
            </div>
            <div className="w-full max-w-md glass-panel p-7 noise-mask accent-border fade-in stagger-1">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                🛡️ Secure Demo Form
              </div>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Request a demo</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                We only show the form after human interaction patterns are detected.
              </p>
              <div className="mt-6">
                {/* Technique: dynamic form construction (form is not rendered until ready). */}
                <AntiBotForm ready={ready} onSubmit={handleSubmit} />
              </div>
              {submitted && (
                <div className="mt-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-sm text-emerald-900 shadow-lg slide-up">
                  <p className="font-bold text-base">✅ Submission captured (demo only)</p>
                  <p className="mt-2 text-emerald-800">
                    Thanks {submitted.name}! We logged your request in the console.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8 grid-fade">
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: '⏱️ Behavioral gating',
              text: "Bots that render once and scrape immediately won't see the form or its fields.",
              delay: 'fade-in stagger-1',
            },
            {
              title: '🍯 Hidden honeypot',
              text: 'If a scraper blindly fills every input, it hits the decoy and gets blocked.',
              delay: 'fade-in stagger-2',
            },
            {
              title: '🌑 Shadow DOM isolation',
              text: 'Closed shadow roots hide form structure from naive DOM selectors and parsers.',
              delay: 'fade-in stagger-3',
            },
          ].map((card) => (
            <div key={card.title} className={`soft-card ${card.delay}`}>
              <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h3 className="section-title">Why this matters</h3>
            <p className="mt-4 text-slate-600">
              Typical scrapers use static HTML snapshots or simple query selectors.
              By delaying construction, randomizing attributes, and moving the form into
              a closed Shadow DOM, we force automation to simulate real interaction and
              run more expensive instrumentation.
            </p>
            <div className="mt-6 grid gap-4">
              {[
                'Fewer static form signatures to fingerprint.',
                'More friction for headless browser automation.',
                'Cleaner signal to distinguish real users from bots.',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                  <div className="mt-1 icon-dot" />
                  <p className="text-sm text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border-2 border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/30 p-7 shadow-lg noise-mask fade-in stagger-2">
            <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Human signals detected
            </h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className={signals.moved ? 'icon-dot' : 'h-2 w-2 rounded-full bg-slate-300'}></span>
                  Mouse movement
                </span>
                <span className={`font-bold ${signals.moved ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {signals.moved ? '✓ Captured' : 'Waiting...'}
                </span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className={signals.scrolled ? 'icon-dot' : 'h-2 w-2 rounded-full bg-slate-300'}></span>
                  Scroll event
                </span>
                <span className={`font-bold ${signals.scrolled ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {signals.scrolled ? '✓ Captured' : 'Waiting...'}
                </span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className={signals.typed ? 'icon-dot' : 'h-2 w-2 rounded-full bg-slate-300'}></span>
                  Keyboard input
                </span>
                <span className={`font-bold ${signals.typed ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {signals.typed ? '✓ Captured' : 'Waiting...'}
                </span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-white/60 border border-slate-100">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span className={signals.seconds >= 4 ? 'icon-dot' : 'h-2 w-2 rounded-full bg-slate-300'}></span>
                  Time on page
                </span>
                <span className={`font-bold ${signals.seconds >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {signals.seconds >= 4 ? `✓ ${signals.seconds}s` : `${signals.seconds}s`}
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-emerald-200/50 bg-gradient-to-r from-white via-emerald-50/30 to-white mt-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-slate-600 md:flex-row md:items-center">
          <span className="font-medium">🛡️ Anti-bot demo landing page. No data stored.</span>
          <span className="font-medium">Built with Vite + React + TypeScript + Tailwind CSS.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

