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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <header className="relative overflow-hidden hero-sheen">
        <div className="absolute inset-0">
          <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-emerald-200/70 blur-3xl float-slow" />
          <div className="absolute left-0 top-32 h-72 w-72 rounded-full bg-teal-300/40 blur-3xl float-fast" />
          <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl float-slow" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="pill">
                Anti-Bot Demo - These techniques make automated scraping harder
              </div>
              <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900 md:text-5xl">
                A lead-gen landing page that doesn't hand bots your form fields.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                This single-page demo showcases practical, client-side friction against
                automated scraping, DOM analysis, and headless form submission scripts.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button className="cta-button">See the demo flow</button>
                <span className="text-sm font-medium text-slate-600">
                  Scroll to unlock the secure form.
                </span>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  Closed Shadow DOM form
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  Dynamic field creation
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  Honeypot + behavioral gating
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  Obfuscated data attributes
                </div>
              </div>
            </div>
            <div className="w-full max-w-md glass-panel p-6 noise-mask accent-border">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Secure Demo Form
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Request a demo</h2>
              <p className="mt-2 text-sm text-slate-600">
                We only show the form after human interaction patterns are detected.
              </p>
              <div className="mt-6">
                {/* Technique: dynamic form construction (form is not rendered until ready). */}
                <AntiBotForm ready={ready} onSubmit={handleSubmit} />
              </div>
              {submitted && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Submission captured (demo only)</p>
                  <p className="mt-2 text-emerald-800">
                    Thanks {submitted.name}! We logged your request in the console.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 grid-fade">
        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Behavioral gating',
              text: "Bots that render once and scrape immediately won't see the form or its fields.",
            },
            {
              title: 'Hidden honeypot',
              text: 'If a scraper blindly fills every input, it hits the decoy and gets blocked.',
            },
            {
              title: 'Shadow DOM isolation',
              text: 'Closed shadow roots hide form structure from naive DOM selectors and parsers.',
            },
          ].map((card) => (
            <div key={card.title} className="soft-card">
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{card.text}</p>
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
          <div className="rounded-3xl border border-emerald-200/60 bg-white/80 p-6 shadow-sm noise-mask">
            <h4 className="text-lg font-semibold text-slate-900">Human signals detected</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span>Mouse movement</span>
                <span className={signals.moved ? 'text-emerald-700' : 'text-slate-400'}>
                  {signals.moved ? 'Captured' : 'Waiting'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Scroll event</span>
                <span className={signals.scrolled ? 'text-emerald-700' : 'text-slate-400'}>
                  {signals.scrolled ? 'Captured' : 'Waiting'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Keyboard input</span>
                <span className={signals.typed ? 'text-emerald-700' : 'text-slate-400'}>
                  {signals.typed ? 'Captured' : 'Waiting'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Time on page</span>
                <span className={signals.seconds >= 4 ? 'text-emerald-700' : 'text-slate-400'}>
                  {signals.seconds}s
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-emerald-100 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center">
          <span>Anti-bot demo landing page. No data stored.</span>
          <span>Built with Vite + React + TypeScript + Tailwind CSS.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

