# Anti-Bot Demo Landing Page (Vite + React + TS)

Single-page marketing/lead-gen landing page that demonstrates practical, client-side techniques to make automated scraping and bot-based form analysis more difficult. This is a demo only (no backend submission).

## How to Run

1. Install deps:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Anti-Bot Techniques Used

1. Behavioral gating (human signals + time on page)
- The form does not render until mouse movement, scroll, keypress, and a few seconds have elapsed.
- Blocks fast, static scrapes and basic headless automation that renders once and snapshots.
- Implementation: `src/App.tsx`

2. Dynamic form construction
- The form and its fields are created only after the gating criteria are met.
- There are no input fields in the initial HTML for scrapers to fingerprint.
- Implementation: `src/App.tsx` + `src/components/AntiBotForm.tsx`

3. Closed Shadow DOM encapsulation
- The form lives inside a custom element with `mode: 'closed'` Shadow DOM.
- Naive DOM parsers and simple `document.querySelector` calls cannot see inside.
- Implementation: `src/components/AntiBotForm.tsx`

4. Randomized/obfuscated field attributes
- Inputs use randomized `data-*` attributes rather than predictable `name="email"` fields.
- Common scraping heuristics that search for typical field names fail.
- Implementation: `src/components/AntiBotForm.tsx`

5. Honeypot field
- A visually hidden decoy input is added; bots that blindly fill inputs will trigger a block.
- Implementation: `src/components/AntiBotForm.tsx`

## UX Notes
- For real users, the form remains accessible: labels are present, required fields are enforced, and the UI communicates why the form is locked.
- Submissions log to the console and show a success message on the page.

## Caveats
- These techniques are friction, not security. Advanced automation (Playwright/Puppeteer with custom scripts) can still pass.
- Closed Shadow DOM can impact accessibility tooling and some automated testing tools.
- Behavioral gating can frustrate legitimate users with assistive tech or strict privacy settings.
- Avoid using these patterns for critical accessibility workflows without additional accommodations.

## Project Structure
- `src/App.tsx`: Page layout, hero, dummy content, behavioral gating.
- `src/components/AntiBotForm.tsx`: Web Component + closed Shadow DOM form.
- `tailwind.config.js`, `postcss.config.js`: Tailwind setup.

