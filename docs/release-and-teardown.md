# Resumancy: static release and live teardown

Branch `static-byok` (worktree `C:\repo\resumancy-static`) holds the static bring-your-own-key edition. Nothing has been pushed, published or torn down. Every step below is Peter's to run.

Status 2026-10-26: built, tested locally with a stubbed OpenAI and a fake key, 5 unit tests passing. Not yet run against OpenAI with a real key.

## 0. Smoke test with your own key (5 minutes)

```bash
cd C:\repo\resumancy-static
npm start
```

Get started, paste a key, pick `gpt-4o-mini`, fill the profile, create a base resume, tailor one job, open the PDF. This is the one path not yet run for real (browser to OpenAI with a valid key).

## 1. Where it is published

**Decided 2026-10-26 (Peter): Option B.** `static-byok` pushed to origin 2026-10-26; flip the repo to public in GitHub settings (Settings > General > Danger Zone > Change visibility).

`phellwege/resumancyV3` is private. GitHub Pages on a private repo needs a paid plan, and a private repo is not viewable as a portfolio piece.

- **Option A (recommended): fresh public repo, no history.** History holds no secret keys (scanned all 290 commits 2026-10-26: only a placeholder `sk_test_yourSecretKey`, Stripe publishable keys, pricing-table ids and an OpenAI org id, all public by design), but it is the old SaaS with its TODO lists. A clean repo shows only the demo.
  ```bash
  cd C:\repo\resumancy-static
  git checkout --orphan public-main
  git commit -m "Resumancy: static bring-your-own-key edition"
  # create the empty public repo on github.com first, e.g. phellwege/resumancy
  git remote add public https://github.com/phellwege/resumancy.git
  git push public public-main:main
  ```
- **Option B: make resumancyV3 public** and push `static-byok`. Exposes full history.
  ```bash
  git push origin static-byok
  ```

## 2. Enable Pages

Repo Settings > Pages > Build and deployment > Source: **GitHub Actions**. The workflow `.github/workflows/deploy-pages.yml` runs on push to `main` or `static-byok` (or Actions tab > Deploy to GitHub Pages > Run workflow). Site appears at `https://phellwege.github.io/<repo>/`.

## 3. Optional: point resumancy.com at it (open decision in DECISIONS.md)

Do this only after the live teardown, or the live app stops being reachable mid-wind-down.

1. Pages settings > Custom domain: `resumancy.com`, save, then tick Enforce HTTPS once the cert is issued.
2. At the DNS provider: apex `A` records to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (and `AAAA` 2606:50c0:8000::153, 8001::153, 8002::153, 8003::153); `www` CNAME to `phellwege.github.io`.
3. Remove the Firebase Hosting custom-domain entries for resumancy.com in the Firebase console so the two do not fight over the cert.

No code change is needed: the app uses relative paths and hash routes.

## 4. Live teardown runbook (read only, Peter runs it in person)

Order matters: stop money first, then data, then compute, then the project.

1. **Stripe (stop billing).**
   - Dashboard > Customers: list active subscriptions. Cancel each (immediately, or at period end with a notice). Decide refunds for the current period.
   - Optional courtesy email to active subscribers that the service is closing and the free demo URL.
   - Products: archive the Basic/Premium prices (`price_1QrL8v...`, `price_1QrL8r...`) and the pricing tables.
   - Developers > Webhooks: delete the endpoint pointing at the `customerSubscriptionCreated` Cloud Function.
   - Developers > API keys: roll/delete the secret key used by Functions.
   - Coupons: delete referral coupons if any remain.
2. **User data (privacy).**
   - Optional: export Firestore first if you want an archive (`gcloud firestore export gs://<bucket>`), and decide how long to keep it.
   - The demo is not a migration path; users' data does not move. If you promised deletion in the privacy policy, delete the Firestore `users` and `gapAnalyses` collections and the Auth users (Authentication > Users).
3. **Cloud Functions.** `firebase functions:list --project resumancy`, then `firebase functions:delete <name> --project resumancy` for each, or delete them in the console. Delete the `GPT_API_KEY` secret in Secret Manager.
4. **OpenAI.** Revoke the server key that was in `GPT_API_KEY` at platform.openai.com/api-keys.
5. **GitHub.** Delete repo secret `FIREBASE_SERVICE_ACCOUNT_RESUMANCY` (Settings > Secrets and variables > Actions) and the matching service account key in Google Cloud IAM.
6. **Hosting and project.** Firebase Hosting: disable the site (`firebase hosting:disable --project resumancy`). Then either delete the whole Firebase/GCP project `resumancy` (frees the Firebase project slot for fitstudio; 30-day recovery window) or keep it empty.
7. **Email and misc.** Support@Resumancy.com mailbox, Cookie-Script account, Google Analytics property `G-YTGPCZP1EQ`, LinkedIn company page link in the footer: keep or close as you like.
8. **Domain.** Either step 3 above, or let resumancy.com lapse.

## Known limits of the demo

- Match % is a local keyword heuristic, as before.
- OpenAI's reply to an invalid key on chat completions has no CORS headers, so the app can only say "key invalid or offline" in that case. Test key in Settings gives the precise answer.
- Bundle is about 680 kB gzipped (react-pdf). Fine for a demo.
