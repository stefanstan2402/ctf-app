// ==========================================================================
// CONFIG — paste your Apps Script Web App URL here after deploying it
// (see README.md, step 2). Until then, solves are only saved locally.
// ==========================================================================
const CONFIG = {
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyKN3ywoFsx8KN_GPFzq-sv2Ni1eWo6X9OgcrKve3NGOwCu2FOuFAQxo5PqofizDSwh/exec",
};

// Challenges. `hash` is the SHA-256 hex of the flag — never put the plaintext
// flag here, this file is public. Generate hashes with the snippet in README.md.
// Keep ids and points in sync with ANSWERS in apps-script/Code.gs.
const CHALLENGES = [
  {
    id: "console",
    title: "console.log",
    points: 100,
    description:
      'Hello, World! Open the console to find the first flag. <a href="./challenges/console/">link</a>',
    hash: "e9f56d786de0a92f2cb27f1d703c4cb0a9a0bf5846c5acec0e7d5cec6ed26e9f",
  },
  {
    id: "comments",
    title: "Comments",
    points: 100,
    description:
      'Find the flag hidden in the comments. <a href="./challenges/comments/">link</a>',
    hash: "7de7a12c2cf63d929810995272d710cee2545660d9c487fc6a5cc8d396903e6d",
  },
  {
    id: "storage",
    title: "Local Storage",
    points: 100,
    description:
      'Find the flag hidden in local storage. <a href="./challenges/storage/">link</a>',
    hash: "7af13823af51821247bfac495638fa82553aee5e02853287e17bc106159dfffe",
  },
  {
    id: "id",
    title: "#id",
    points: 100,
    description:
      'The element with the <code>flag</code> id hides a flag. <a href="./challenges/id/">link</a>',
    hash: "abf6bbc732d5ad46411ca03a6fd71fec44aeab96231e40f13a91ca037e5a08e2",
  },
  {
    id: "button",
    title: "Button",
    points: 100,
    description:
      'Press the button to get the flag. <a href="./challenges/button/">link</a>',
    hash: "8703b125c5fa16c6f5070b01744e139c3a6d16fc286f535cc4360f4cd81447ef",
  },
  {
    id: "variable",
    title: "Variable",
    points: 100,
    description:
      'Look inside the JavaScript files to find the flag. <a href="./challenges/variable/">link</a>',
    hash: "d9d1605099e2cfc9c1cbd0c1f7ce4b1aa9d3fd8580a2c0dcbf76c6cbc1bde4fe",
  },
  {
    id: "grades",
    title: "Grades",
    points: 200,
    description:
      'Help the teacher calculate the average grade. Flag format: <code>flag{X.XX}</code>. <a href="./challenges/grades/">link</a>',
    hash: "fea0a9f8ce1b6a82ef1a9404c55a4eba0beca0104415bdc95c24603d6ad5eb79",
  },
  {
    id: "colors",
    title: "Colors",
    points: 200,
    description:
      'Sum the <code>data-value</code> of the red circles, then of the blue ones. Flag format: <code>flag{redsum + bluesum}</code> concatenated. <a href="./challenges/colors/">link</a>',
    hash: "4d937a34c76398b2e327ae85ccce8042b5ef4eb8ee5106fac7ebd0ab88df50d5",
  },
  {
    id: "post",
    title: "POST Request",
    points: 200,
    description:
      'Make a POST request to the <code>?api=flag</code> endpoint. Inspect the page for similar requests. <a href="./challenges/post/">link</a>',
    hash: "f0110a2ecb10fa05a34e799bf101c3963e792210a9f54b4c6326a65fc83f818a",
  },
  {
    id: "patch",
    title: "PATCH Request",
    points: 200,
    description:
      'The request this page makes doesn’t quite work. Patch its payload. <a href="./challenges/patch/">link</a>',
    hash: "241d19404d3c3ef33fe31d4a33be773909d8cfe467ea4a5d1add656975a9d5d7",
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
