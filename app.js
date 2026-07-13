// ==========================================================================
// CONFIG — paste your Apps Script Web App URL here after deploying it
// (see README.md, step 2). Until then, solves are only saved locally.
// ==========================================================================
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwbxYbTF5La_QByN2jxyuwUpc8aHgDSeC94wKWLCyagSkVfIr7QYgYGw7mDsODMjp6b/exec",
};

// Challenges. `hash` is the SHA-256 hex of the flag — never put the plaintext
// flag here, this file is public. Generate hashes with the snippet in README.md.
// Keep ids and points in sync with ANSWERS in apps-script/Code.gs.
const CHALLENGES = [
  {
    id: "b64",
    title: "Base64 Basics",
    points: 100,
    description:
      "Someone left this note behind: <code>ZmxhZ3tiNjRfZGVjMGRlcn0=</code>. Decode it.",
    hash: "c5bafb65ecdc6b98db0762c0fa7b1c427f1ce4387d69eb827da57adc5998467a",
  },
  {
    id: "rot13",
    title: "Roman Rotation",
    points: 150,
    description:
      "Caesar would be proud: <code>synt{ebg13_znfgre}</code>",
    hash: "cd16ed0aa7a47a07d4f839ad48e1d62f6dd27f7cd4119fb7161ec5f72d5d06dd",
  },
  {
    id: "source",
    title: "Hidden in Plain Sight",
    points: 50,
    description:
      "The flag is somewhere on this very page. Look closer.",
    hash: "3970057d1399e15824a7b7e07ba6579a021f6226e037532b3da13a329f716021",
  },
];

// ==========================================================================

const $ = (sel) => document.querySelector(sel);

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- local state (name + solved set survive reloads) ---------------------

function getSolved() {
  try {
    return new Set(JSON.parse(localStorage.getItem("ctf-solved") || "[]"));
  } catch {
    return new Set();
  }
}

function markSolved(id) {
  const solved = getSolved();
  solved.add(id);
  localStorage.setItem("ctf-solved", JSON.stringify([...solved]));
}

function getPlayerName() {
  return $("#player-name").value.trim();
}

// --- rendering ------------------------------------------------------------

function renderChallenges() {
  const solved = getSolved();
  const container = $("#challenges");
  container.innerHTML = "";

  for (const ch of CHALLENGES) {
    const card = document.createElement("div");
    card.className = "card" + (solved.has(ch.id) ? " solved" : "");
    card.innerHTML = `
      <div class="card-head">
        <h3>${ch.title}</h3>
        <span class="points">${ch.points} pts</span>
      </div>
      <p>${ch.description}</p>
      <form data-id="${ch.id}">
        <input type="text" placeholder="flag{...}" autocomplete="off"
               ${solved.has(ch.id) ? "disabled" : ""}>
        <button type="submit" ${solved.has(ch.id) ? "disabled" : ""}>
          ${solved.has(ch.id) ? "Solved ✔" : "Submit"}
        </button>
      </form>
      <p class="feedback" aria-live="polite"></p>
    `;
    card.querySelector("form").addEventListener("submit", onSubmitFlag);
    container.appendChild(card);
  }

  updateScore();
}

function updateScore() {
  const solved = getSolved();
  const total = CHALLENGES.filter((c) => solved.has(c.id)).reduce(
    (sum, c) => sum + c.points,
    0
  );
  $("#player-score").textContent = `${total} pts`;
}

function renderLeaderboard(rows) {
  const container = $("#leaderboard");
  if (!rows.length) {
    container.innerHTML = `<p class="muted">No solves yet — be the first!</p>`;
    return;
  }
  const body = rows
    .map(
      (r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.solves}</td>
        <td>${r.points}</td>
      </tr>`
    )
    .join("");
  container.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Player</th><th>Solves</th><th>Points</th></tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// --- submit + leaderboard I/O ----------------------------------------------

async function onSubmitFlag(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.dataset.id;
  const challenge = CHALLENGES.find((c) => c.id === id);
  const input = form.querySelector("input");
  const feedback = form.parentElement.querySelector(".feedback");
  const answer = input.value.trim();
  const name = getPlayerName();

  if (!name) {
    feedback.textContent = "Set your player name first (top of the page).";
    feedback.className = "feedback error";
    $("#player-name").focus();
    return;
  }
  if (!answer) return;

  if ((await sha256Hex(answer)) !== challenge.hash) {
    feedback.textContent = "Wrong flag, try again.";
    feedback.className = "feedback error";
    return;
  }

  feedback.textContent = "Correct! Recording your solve…";
  feedback.className = "feedback ok";
  markSolved(id);

  const recorded = await submitSolve(name, id, answer);
  feedback.textContent = recorded
    ? "Correct! Solve recorded on the leaderboard. 🎉"
    : "Correct! (Could not reach the leaderboard — solve saved locally.)";

  renderChallenges();
  loadLeaderboard();
}

async function submitSolve(name, challengeId, answer) {
  if (CONFIG.SCRIPT_URL.startsWith("PASTE_")) return false;
  try {
    // No Content-Type header on purpose: a text/plain body keeps this a CORS
    // "simple request", which Apps Script web apps accept cross-origin.
    const res = await fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ name, challengeId, answer }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

async function loadLeaderboard() {
  if (CONFIG.SCRIPT_URL.startsWith("PASTE_")) {
    $("#leaderboard").innerHTML =
      `<p class="muted">Leaderboard not configured yet — set SCRIPT_URL in app.js.</p>`;
    return;
  }
  try {
    const res = await fetch(CONFIG.SCRIPT_URL);
    const data = await res.json();
    renderLeaderboard(data.leaderboard || []);
  } catch {
    $("#leaderboard").innerHTML =
      `<p class="muted">Could not load the leaderboard. Try refreshing.</p>`;
  }
}

// --- init -------------------------------------------------------------------

const nameInput = $("#player-name");
nameInput.value = localStorage.getItem("ctf-name") || "";
nameInput.addEventListener("change", () => {
  localStorage.setItem("ctf-name", nameInput.value.trim());
});

$("#refresh-board").addEventListener("click", loadLeaderboard);

renderChallenges();
loadLeaderboard();
