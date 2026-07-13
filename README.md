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

## Sample challenges (spoilers!)

| id     | flag                 |
|--------|----------------------|
| b64    | `flag{b64_dec0der}`  |
| rot13  | `flag{rot13_master}` |
| source | `flag{v13w_s0urce}`  |

Replace these before running a real event.

## Limitations

This is honor-system friendly, not tamper-proof: anyone who solves a challenge
legitimately gets recorded, and the script rejects wrong answers — but players
can submit under any name, and there's no authentication. Fine for a
classroom/friends CTF; use a real platform (e.g. CTFd) for competitive events.
