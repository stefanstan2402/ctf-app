# Mini CTF

A static CTF app (plain HTML/CSS/JS) with a live leaderboard backed by a
Google Sheet — no server, no database.

- Flags are stored as **SHA-256 hashes** in `app.js`, so answers aren't
  readable from the source.
- Solves are verified and recorded by a small **Google Apps Script** web app
  (`apps-script/Code.gs`) that appends rows to a Google Sheet and serves the
  leaderboard as JSON. The script re-checks the answer hash and owns the point
  values, so a tampered frontend can't post fake scores.
- Deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

## Setup

### 1. Create the Google Sheet + script

1. Create a new Google Sheet (any name).
2. Open **Extensions → Apps Script**, delete the boilerplate, and paste in the
   contents of `apps-script/Code.gs`. Save.
3. Click **Deploy → New deployment → Web app** with:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
4. Authorize when prompted, then copy the Web App URL
   (`https://script.google.com/macros/s/…/exec`).

### 2. Point the frontend at it

In `app.js`, set:

```js
const CONFIG = { SCRIPT_URL: "https://script.google.com/macros/s/…/exec" };
```

### 3. Deploy to GitHub Pages

1. Create a GitHub repo and push this project to `main`.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` now redeploys the site automatically
   (`.github/workflows/deploy.yml`).

## Adding or changing challenges

1. Pick a flag, e.g. `flag{my_new_flag}`.
2. Get its SHA-256 hash — either in a terminal:

   ```sh
   printf 'flag{my_new_flag}' | sha256sum
   ```

   or in the browser DevTools console:

   ```js
   const h = async s => [...new Uint8Array(await crypto.subtle.digest(
     "SHA-256", new TextEncoder().encode(s)))]
     .map(b => b.toString(16).padStart(2, "0")).join("");
   await h("flag{my_new_flag}");
   ```

3. Add an entry to `CHALLENGES` in `app.js` (id, title, points, description,
   hash) **and** a matching entry to `ANSWERS` in the Apps Script.
4. In Apps Script, redeploy: **Deploy → Manage deployments → ✏️ → New version**.
   (Editing the code alone doesn't update the live URL.)

Answers are compared after trimming whitespace and are case-sensitive.

## Current challenges

The 10 challenges come from the STS Bootcamp 2025 set. Their pages live in
`challenges/<id>/` and are served statically. The `post` and `patch`
challenges originally used an Express API; here the Apps Script emulates it
(`POST <script-url>?api=<endpoint>`), so `patch` was adapted from
"fix the HTTP method" to "fix the request payload".

The source material (including flags and solutions) is kept locally in
`bootcamp-2025/`, which is **gitignored on purpose** — never commit it, the
repo and the site are public. Flags in this repo exist only as SHA-256 hashes,
except the ones intentionally hidden in the challenge pages themselves.

## Syncing next year's set (bootcamp-2026)

1. Clone/copy the new challenge repo into the project root (e.g.
   `bootcamp-2026/`) and add that folder to `.gitignore` **before anything
   else**.
2. Copy each challenge's public files into `challenges/<id>/` — only
   `index.html` and any `index.js` the page actually includes. **Never copy**
   `solution.js` or `RESULTS.md`.
3. Challenges that call a backend API need adapting: point their `fetch` at
   the Apps Script URL with `?api=<endpoint>`, drop the `Content-Type` header
   (it breaks CORS on Apps Script), and add the endpoint to `handleApi` /
   `API_FLAGS` in `apps-script/Code.gs`. Note Apps Script only supports GET
   and POST, so method-based challenges (PATCH/PUT/DELETE) must be reworked.
4. For every challenge, hash its flag (recipe above) and update **both**
   `CHALLENGES` in `app.js` and `ANSWERS` in `apps-script/Code.gs`.
5. Update the Apps Script: paste the new `Code.gs`, then
   **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**
   (keeps the same URL). Verify in an incognito window that the URL still
   returns JSON without a login prompt.
6. Reset the leaderboard: in the Google Sheet, rename the `solves` tab to
   `solves-2025` (archives last year); the script auto-creates a fresh
   `solves` tab on first use.
7. Commit and push — GitHub Actions redeploys the site.

## Limitations

This is honor-system friendly, not tamper-proof: anyone who solves a challenge
legitimately gets recorded, and the script rejects wrong answers — but players
can submit under any name, and there's no authentication. Fine for a
classroom/friends CTF; use a real platform (e.g. CTFd) for competitive events.
