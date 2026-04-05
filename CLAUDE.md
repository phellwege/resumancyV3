# ResumancyV4

## Project Overview
A React-based resume building SaaS application hosted on Firebase. Users create base resumes, tailor them to job descriptions, get gap analyses, and generate cover letters. Monetized via Stripe subscriptions.

## Tech Stack
- **Frontend**: React 18, React Router v6, React Bootstrap, styled-components
- **Backend**: Firebase Cloud Functions (Node.js 22), Firestore, Firebase Auth (email link sign-in)
- **AI**: OpenAI GPT-4o-mini for resume generation, tailoring, gap analysis, cover letters
- **Payments**: Stripe (subscriptions, billing portal, coupons)
- **Hosting**: Firebase Hosting
- **PDF**: @react-pdf/renderer for resume PDF generation

## Project Structure
- `src/` - React frontend
  - `views/` - Page-level components (Home, Create, Tailor, Account, etc.)
  - `components/` - Reusable UI components
  - `context/` - React contexts (AuthContext, DataContext, UserContext)
  - `config/` - Configuration files
- `functions/` - Firebase Cloud Functions (resume generation, Stripe integration, cleanup)
- `firestore.rules` - Firestore security rules
- `storage.rules` - Firebase Storage rules

## Key Commands
- `npm start` - Start dev server
- `npm run build` - Production build
- `firebase deploy` - Deploy to Firebase
- `firebase deploy --only functions` - Deploy only cloud functions

## Known Issues
- Firestore rules have an open wildcard rule (`allow read, write: if true`) that overrides all other rules
- `generateBaseResume.js` has a Promise.all destructuring mismatch (5 promises, 4 variables, `customSection` undefined)
- `DataContext.js:186` increments tailored resume usage by 2 instead of 1
- Several cloud functions (deleteUserAccount, createStripePortalSession, createStripeCoupon) lack auth verification
