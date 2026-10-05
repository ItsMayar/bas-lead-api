# BAS Lead API

A small backend API I built to track leads for BAS Innovations. It's my first project using CI and security scanning in GitHub Actions, so I used it to learn how that works.

## What it does
You can add, list, update and delete leads (company name, service line, stage). It checks the input before saving, and stores everything in a simple JSON file. There's no database yet, because I didn't need one for this.

Endpoints: `POST /leads`, `GET /leads`, `GET /leads/:id`, `PATCH /leads/:id`, `DELETE /leads/:id`, `GET /health`

## Run it
```
npm install
npm start
npm test
```
It runs on http://localhost:3000. For example:
```
curl -X POST http://localhost:3000/leads -H "Content-Type: application/json" -d '{"name": "Al Faisal Trading Co.", "product": "Pulse", "stage": "New lead"}'
```

## GitHub Actions
Two workflows run on every push and pull request:
- **CI** runs the tests
- **SAST Scan** runs Semgrep and uploads what it finds to the Security tab

## What I learned
- CI failed on my first push. The cause was npm caching with no lockfile, then a test script that Node 22 didn't read the way I expected. Fixing both taught me to read the Actions logs properly.
- Semgrep found 5 things in my own project. Four were about using version tags instead of commit hashes for actions, which is a supply-chain risk. The fifth was a CSRF warning that doesn't apply, since the API has no logins or cookies.

## What's next
Pin the actions to commit hashes, add a real database, and add authentication.
