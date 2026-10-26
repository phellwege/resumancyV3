# Resumancy

AI resume builder: write a base resume once, then tailor it to any job description in seconds, with a matching cover letter, a job-relevance score and a skill-gap analysis.

This is the static, bring-your-own-key edition. It runs entirely in the browser:

- **No backend.** No accounts, no database, no analytics, no cookies.
- **Your own OpenAI key.** Paste it in Settings and pick a model. Requests go straight from your browser to `api.openai.com`. The key stays in memory, or in this browser's localStorage only if you tick "Remember".
- **Your data stays local.** Profile, resumes and cover letters live in localStorage. Export, import or delete them from Data & Settings.

## Run it locally

```bash
npm ci
npm start
```

Opens on http://localhost:3000. To check the production build:

```bash
npm run build
```

then serve the `build/` folder with any static file server.

## Deploy

`.github/workflows/deploy-pages.yml` builds and publishes to GitHub Pages on pushes to `main` or `static-byok`. In the repo settings, set Pages > Source to "GitHub Actions". The app uses hash routing (`/#/Review`) and relative asset paths (`"homepage": "."`), so it works at a project URL (`user.github.io/repo/`) or on a custom domain with no extra config.

## How it works

| Piece | File |
| --- | --- |
| OpenAI calls (fetch, retries, friendly errors, reasoning-model handling) | `src/lib/openai.js` |
| Prompts for base resume, tailoring, cover letter, gap analysis | `src/lib/resumeAI.js` |
| Key and model settings modal | `src/components/ApiKeySettings.js` |
| Local persistence (safe localStorage wrappers) | `src/lib/storage.js`, `src/context/UserContext.js` |
| Match % scoring (local keyword + similarity heuristic, no AI call) | `src/components/user/SendMatch.js` |
| PDF export | `@react-pdf/renderer`, `src/components/Review/resumeStyles/` |

The original hosted version used Firebase Auth, Firestore, Cloud Functions and Stripe subscriptions. Those were removed for this edition; the prompts were ported unchanged from the old Cloud Functions.
