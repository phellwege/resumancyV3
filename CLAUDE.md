# Resumancy (static BYOK edition)

## Project Overview
Static React (CRA) resume builder, hosted on GitHub Pages as a portfolio demo. Users create a base resume, tailor it to job descriptions, and get a cover letter, match % and gap analysis. No backend: visitors bring their own OpenAI API key and pick the model; all data lives in their browser's localStorage.

The live hosted version (Firebase Auth/Firestore/Functions + Stripe) lives on `main`. This branch (`static-byok`) removed all of that. Do not add a backend, analytics or anything that stores visitor data server side.

## Tech Stack
- React 18, React Router v6 (HashRouter), React Bootstrap, styled-components
- OpenAI Chat Completions called directly from the browser with the visitor's key (`src/lib/openai.js`)
- @react-pdf/renderer for PDF export

## Key files
- `src/lib/openai.js` - fetch client, model list, retries, reasoning-model params
- `src/lib/resumeAI.js` - prompts (ported from the old Cloud Functions)
- `src/lib/storage.js` - try/catch localStorage wrappers and the list of keys
- `src/context/AuthContext.js` - API key + model state (keeps the old `useAuth()` shape)
- `src/context/DataContext.js` - local data store (keeps the old `useData()` function names)
- `src/components/ApiKeySettings.js` - settings modal, opened via `handleOpenLoginModal()` from UserContext

## Gotchas
- `globalStyle.js` hides `.btn-outline-light` in light mode and `.btn-outline-secondary` in dark mode. Pairs of these buttons are deliberate theme twins; new buttons should use other variants.
- OpenAI's 401 for a bad key on chat completions has no CORS headers, so the browser sees a network error. `openai.js` maps that to an "invalid key or offline" message.

## Commands
- `npm start` - dev server on :3000
- `npm run build` - static build in `build/`
- Deploy: push to `main`/`static-byok` with `.github/workflows/deploy-pages.yml` (Pages source = GitHub Actions)
