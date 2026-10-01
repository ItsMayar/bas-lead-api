# BAS Lead API

A small backend API for tracking BAS leads — companion service to the BAS lead-pipeline tool. Built as a hands-on DevSecOps learning project: a real Express API with CI (automated tests) and a SAST (static application security testing) scan running on every push and pull request via GitHub Actions.

## What's here

- `server.js` / `routes/leads.js` — an Express API with basic input validation (`POST /leads`, `GET /leads`, `GET /leads/:id`, `PATCH /leads/:id`, `DELETE /leads/:id`, `GET /health`)
- `data/store.js` — a simple JSON-file-backed data store
- `tests/leads.test.js` — tests using Node's built-in test runner
- `.github/workflows/ci.yml` — runs `npm test` on every push/PR
- `.github/workflows/sast.yml` — runs [Semgrep](https://semgrep.dev) (SAST) on every push/PR, using its default security ruleset, and uploads results to GitHub's Security tab

## Running it locally

```bash
npm install
npm start        # starts the API on http://localhost:3000
npm test          # runs the test suite
```

Try it:

```bash
curl -X POST http://localhost:3000/leads \
  -H "Content-Type: application/json" \
  -d '{"name": "Al Faisal Trading Co.", "product": "Pulse", "stage": "New lead"}'

curl http://localhost:3000/leads
```

## Setting this up on GitHub

1. Create a new **empty** repository on GitHub (no README/license — this project already has them): [github.com/new](https://github.com/new)
2. From this project folder, run:
   ```bash
   git remote add origin https://github.com/<your-username>/bas-lead-api.git
   git branch -M main
   git push -u origin main
   ```
3. Go to the **Actions** tab on GitHub — both workflows (`CI` and `SAST Scan`) will run automatically on that first push.
4. Once the SAST scan finishes, check the **Security → Code scanning** tab on the repo to see the Semgrep findings (if any) laid out the way a real security dashboard would show them.

## Why this exists

This project was built specifically to get hands-on, honest experience with the kind of CI/CD security tooling (SAST scanning integrated into a pipeline, automated on every push) that application-security and DevSecOps roles expect — rather than just reading about it.
