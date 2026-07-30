// The Apps Script URL lives in config.js (shared with teams.html).

// Challenges. `hash` is the SHA-256 hex of the flag — never put the plaintext
// flag here, this file is public. Generate hashes with the snippet in README.md.
// Keep ids and points in sync with ANSWERS in apps-script/Code.gs.
const CHALLENGES = [
  {
    id: "console",
    title: "console.log",
    points: 100,
    description:
      'Deschide consola pentru a găsi primul flag. <a href="./challenges/console/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "e9f56d786de0a92f2cb27f1d703c4cb0a9a0bf5846c5acec0e7d5cec6ed26e9f",
  },
  {
    id: "comments",
    title: "Comments",
    points: 100,
    description:
      'Găsește flag-ul ascuns în comentarii. <a href="./challenges/comments/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "7de7a12c2cf63d929810995272d710cee2545660d9c487fc6a5cc8d396903e6d",
  },
  {
    id: "storage",
    title: "Local Storage",
    points: 100,
    description:
      'Găsește flag-ul ascuns în local storage. <a href="./challenges/storage/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "7af13823af51821247bfac495638fa82553aee5e02853287e17bc106159dfffe",
  },
  {
    id: "id",
    title: "#id",
    points: 100,
    description:
      'Elementul cu id-ul <code>flag</code> ascunde un flag. <a href="./challenges/id/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "abf6bbc732d5ad46411ca03a6fd71fec44aeab96231e40f13a91ca037e5a08e2",
  },
  {
    id: "button",
    title: "Button",
    points: 100,
    description:
      'Apasă butonul pentru a obține flag-ul. <a href="./challenges/button/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "8703b125c5fa16c6f5070b01744e139c3a6d16fc286f535cc4360f4cd81447ef",
  },
  {
    id: "variable",
    title: "Variable",
    points: 100,
    description:
      'Caută în fișierele JavaScript pentru a găsi flag-ul. <a href="./challenges/variable/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "d9d1605099e2cfc9c1cbd0c1f7ce4b1aa9d3fd8580a2c0dcbf76c6cbc1bde4fe",
  },
  {
    id: "robots",
    title: "robots.txt",
    points: 100,
    description:
      'Crawlerele verifică <code>robots.txt</code> înainte să se uite în jur. Poate ar trebui și tu. <a href="./challenges/robots/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "dce7526be431b86222df7e1ca9d05950be5d180e6cbabb79ac7a81b6f8e82c78",
  },
  {
    id: "hidden",
    title: "Hidden Element",
    points: 100,
    description:
      'Flag-ul se află într-un element cu <code>display:none</code>. <a href="./challenges/hidden/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "859871e5eb5195cba7349081d9c7bd7e099beeb3564257aa40a3e5f475ec2191",
  },
  {
    id: "cookie",
    title: "Cookie Monster",
    points: 150,
    description:
      'Ești autentificat ca utilizator obișnuit. Găsește o modalitate de a deveni <code>admin</code>. <a href="./challenges/cookie/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "1f3b650ab794a4414c85064ecf249f18c38b7da65377ac4919d71b1d64f84c95",
  },
  {
    id: "grades",
    title: "Grades",
    points: 200,
    description:
      'Calculează media. Flag format: <code>flag{X.XX}</code>. <a href="./challenges/grades/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "fea0a9f8ce1b6a82ef1a9404c55a4eba0beca0104415bdc95c24603d6ad5eb79",
  },
  {
    id: "colors",
    title: "Colors",
    points: 200,
    description:
      'Adună <code>data-value</code> a cercurilor roșii, apoi a celor albastre. Concatenează rezultatele, flag format: flag{suma1suma2}. <a href="./challenges/colors/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "4d937a34c76398b2e327ae85ccce8042b5ef4eb8ee5106fac7ebd0ab88df50d5",
  },
  {
    id: "post",
    title: "POST Request 1",
    points: 200,
    description:
      'Trimite o cerere POST către endpoint-ul <code>?api=flag</code>. Inspectează pagina pentru cereri similare. <a href="./challenges/post/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "f0110a2ecb10fa05a34e799bf101c3963e792210a9f54b4c6326a65fc83f818a",
  },
  {
    id: "patch",
    title: "POST Request 2",
    points: 200,
    description:
      'Cererea făcută de această pagină nu funcționează chiar corect. Modifică-i payload-ul. <a href="./challenges/patch/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hash: "241d19404d3c3ef33fe31d4a33be773909d8cfe467ea4a5d1add656975a9d5d7",
  },
  {
    id: "xss",
    title: "Reflected XSS",
    points: 250,
    description:
      'Parametrul de căutare este afișat fără filtrare. <a href="./challenges/xss/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hints: ["poți folosi o poză", "vezi sursa"],
    hash: "8709f54dabc9f6bddaeadfe36378f471ebecc65a0603aa73edca623955e37000",
  },
  {
    id: "proto",
    title: "Prototype Pollution",
    points: 300,
    description:
      'Modificarea unui obiect JavaScript afectează verificarea rolului. <a href="./challenges/proto/" target="_blank" rel="noopener" class="challenge-link">link</a>',
    hints: ["Prototype pollution, isAdmin"],
    hash: "29ac3f5f84acf80c38767f6628e4850fdda5cca8ff04eaf192cd5634ab468a1b",
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

// Team and player are chosen once in the join modal and then locked.
function getPlayerName() {
  return (localStorage.getItem("ctf-name") || "").trim();
}

function getTeamName() {
  return (localStorage.getItem("ctf-team") || "").trim();
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
      ${renderHints(ch.hints)}
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
    for (const btn of card.querySelectorAll(".hint-btn")) {
      btn.addEventListener("click", onToggleHint);
    }
    container.appendChild(card);
  }

  updateScore();
}

function renderHints(hints) {
  if (!hints || !hints.length) return "";
  return `
    <div class="hints">
      ${hints
        .map(
          (hint, i) => `
        <button type="button" class="hint-btn">Hint ${i + 1}</button>
        <span class="hint-text" hidden>${hint}</span>`
        )
        .join("")}
    </div>
  `;
}

function onToggleHint(event) {
  const btn = event.currentTarget;
  const text = btn.nextElementSibling;
  text.hidden = !text.hidden;
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
        <td>${escapeHtml(r.team)}</td>
        <td>${r.members}</td>
        <td>${r.solves}</td>
        <td>${r.points}</td>
      </tr>`
    )
    .join("");
  container.innerHTML = `
    <table>
      <thead><tr><th>#</th><th>Team</th><th>Members</th><th>Solves</th><th>Points</th></tr></thead>
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
  const team = getTeamName();

  if (!team || !name) {
    feedback.textContent = "Join with a team first — reload the page.";
    feedback.className = "feedback error";
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

  const result = await submitSolve(team, name, id, answer);
  if (result && result.ok && result.duplicate) {
    feedback.textContent = "Correct! Your team had already solved this one.";
  } else if (result && result.ok) {
    feedback.textContent = "Correct! Solve recorded for your team. 🎉";
  } else {
    feedback.textContent =
      "Correct! (Could not reach the leaderboard — solve saved locally.)";
  }

  renderChallenges();
  loadLeaderboard();
}

// Register the player on the teams roster the moment they join, so teams
// are visible before their first solve. Fire-and-forget: if it fails, the
// roster still picks the player up from their first recorded solve.
function registerJoin(team, name) {
  if (CONFIG.SCRIPT_URL.startsWith("PASTE_")) return;
  fetch(CONFIG.SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action: "join", team, name }),
  }).catch(() => {});
}

async function submitSolve(team, name, challengeId, answer) {
  if (CONFIG.SCRIPT_URL.startsWith("PASTE_")) return null;
  try {
    // No Content-Type header on purpose: a text/plain body keeps this a CORS
    // "simple request", which Apps Script web apps accept cross-origin.
    const res = await fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ team, name, challengeId, answer }),
    });
    return await res.json();
  } catch {
    return null;
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

function updateIdentityLabels() {
  $("#team-label").textContent = getTeamName() || "—";
  $("#player-label").textContent = getPlayerName() || "—";
}

function initIdentity() {
  updateIdentityLabels();
  if (getTeamName() && getPlayerName()) return;

  const modal = $("#join-modal");
  modal.hidden = false;
  $("#join-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const team = $("#join-team").value.trim();
    const name = $("#join-name").value.trim();
    if (!team || !name) return;
    localStorage.setItem("ctf-team", team);
    localStorage.setItem("ctf-name", name);
    modal.hidden = true;
    updateIdentityLabels();
    registerJoin(team, name);
  });
  $("#join-team").focus();
}

initIdentity();

$("#refresh-board").addEventListener("click", loadLeaderboard);

renderChallenges();
loadLeaderboard();
