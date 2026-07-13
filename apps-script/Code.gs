// Mini CTF leaderboard — Google Apps Script web app.
// Paste this into Extensions → Apps Script of a Google Sheet, then deploy
// as a Web App (Execute as: Me, Who has access: Anyone). See README.md.
//
// The script is the source of truth: it re-verifies answers and owns the
// point values, so a tampered frontend can't submit fake solves.

var SHEET_NAME = 'solves';

// Keep ids in sync with CHALLENGES in app.js. `hash` = SHA-256 hex of the flag.
var ANSWERS = {
  console:  { points: 100, hash: 'e9f56d786de0a92f2cb27f1d703c4cb0a9a0bf5846c5acec0e7d5cec6ed26e9f' },
  comments: { points: 100, hash: '7de7a12c2cf63d929810995272d710cee2545660d9c487fc6a5cc8d396903e6d' },
  storage:  { points: 100, hash: '7af13823af51821247bfac495638fa82553aee5e02853287e17bc106159dfffe' },
  id:       { points: 100, hash: 'abf6bbc732d5ad46411ca03a6fd71fec44aeab96231e40f13a91ca037e5a08e2' },
  button:   { points: 100, hash: '8703b125c5fa16c6f5070b01744e139c3a6d16fc286f535cc4360f4cd81447ef' },
  variable: { points: 100, hash: 'd9d1605099e2cfc9c1cbd0c1f7ce4b1aa9d3fd8580a2c0dcbf76c6cbc1bde4fe' },
  grades:   { points: 200, hash: 'fea0a9f8ce1b6a82ef1a9404c55a4eba0beca0104415bdc95c24603d6ad5eb79' },
  colors:   { points: 200, hash: '4d937a34c76398b2e327ae85ccce8042b5ef4eb8ee5106fac7ebd0ab88df50d5' },
  post:     { points: 200, hash: 'f0110a2ecb10fa05a34e799bf101c3963e792210a9f54b4c6326a65fc83f818a' },
  patch:    { points: 200, hash: '241d19404d3c3ef33fe31d4a33be773909d8cfe467ea4a5d1add656975a9d5d7' },
};

// Fake API for the "post" and "patch" challenges (the static site has no
// backend, so this script plays the role of the original Express routes).
// Called as POST <url>?api=<endpoint>. These flags are meant to be
// discoverable by players — that IS the challenge.
var API_FLAGS = {
  'not-flag':    'flag{9f1542126021b1cfd4149786d15650a6}', // decoy
  'flag':        'flag{854bb29bf0baa53d4316331ee46b145a}',
  'update-flag': 'flag{f4b81eb8985d22c59bff7895135ccced}',
};

function handleApi(endpoint, data) {
  if (endpoint === 'not-flag' || endpoint === 'flag') {
    if ((data.api_key || null) !== 'flag_holder') {
      return jsonResponse({ error: 'forbidden' });
    }
    return jsonResponse({ flag: API_FLAGS[endpoint] });
  }
  if (endpoint === 'update-flag') {
    if (!data.flag) {
      return jsonResponse({ flag: null });
    }
    return jsonResponse({ flag: API_FLAGS['update-flag'] });
  }
  return jsonResponse({ error: 'not found' });
}

function doPost(e) {
  if (e.parameter.api) {
    try {
      return handleApi(e.parameter.api, JSON.parse(e.postData.contents));
    } catch (err) {
      return jsonResponse({ error: 'bad request' });
    }
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var team = String(data.team || '').trim().slice(0, 32);
    var name = String(data.name || '').trim().slice(0, 32);
    var challengeId = String(data.challengeId || '');
    var answer = String(data.answer || '').trim();
    var challenge = ANSWERS[challengeId];

    if (!team || !name || !challenge) {
      return jsonResponse({ ok: false, error: 'bad request' });
    }
    if (sha256Hex(answer) !== challenge.hash) {
      return jsonResponse({ ok: false, error: 'wrong answer' });
    }

    // A challenge counts once per TEAM, whichever member submits it.
    var sheet = getSheet();
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === team && rows[i][2] === challengeId) {
        return jsonResponse({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([team, name, challengeId, challenge.points, new Date()]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'server error' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  var rows = getSheet().getDataRange().getValues();
  var teams = {};

  for (var i = 1; i < rows.length; i++) {
    var team = rows[i][0];
    var name = rows[i][1];
    var points = Number(rows[i][3]) || 0;
    var time = new Date(rows[i][4]).getTime() || 0;
    if (!teams[team]) {
      teams[team] = { team: team, points: 0, solves: 0, lastSolve: 0, memberSet: {} };
    }
    teams[team].points += points;
    teams[team].solves += 1;
    teams[team].lastSolve = Math.max(teams[team].lastSolve, time);
    teams[team].memberSet[name] = true;
  }

  var board = Object.keys(teams).map(function (k) {
    var t = teams[k];
    return {
      team: t.team,
      points: t.points,
      solves: t.solves,
      lastSolve: t.lastSolve,
      members: Object.keys(t.memberSet).length,
    };
  });
  // Highest points first; ties broken by who got there earlier.
  board.sort(function (a, b) {
    return b.points - a.points || a.lastSolve - b.lastSolve;
  });

  return jsonResponse({ ok: true, leaderboard: board });
}

// Reset the leaderboard: archives the current 'solves' tab under a timestamped
// name and starts a fresh, empty one. Challenges are untouched (they live in
// code, not in the sheet). Run it from the Apps Script editor: select
// "resetLeaderboard" in the function dropdown at the top, press ▶ Run.
function resetLeaderboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) {
    var stamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'yyyy-MM-dd-HHmmss'
    );
    sheet.setName(SHEET_NAME + '-' + stamp);
  }
  getSheet();
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['team', 'name', 'challenge', 'points', 'timestamp']);
  }
  return sheet;
}

function sha256Hex(text) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    text,
    Utilities.Charset.UTF_8
  );
  return bytes
    .map(function (b) {
      var hex = ((b + 256) % 256).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
