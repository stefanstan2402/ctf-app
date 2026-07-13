// Mini CTF leaderboard — Google Apps Script web app.
// Paste this into Extensions → Apps Script of a Google Sheet, then deploy
// as a Web App (Execute as: Me, Who has access: Anyone). See README.md.
//
// The script is the source of truth: it re-verifies answers and owns the
// point values, so a tampered frontend can't submit fake solves.

var SHEET_NAME = 'solves';

// Keep ids in sync with CHALLENGES in app.js. `hash` = SHA-256 hex of the flag.
var ANSWERS = {
  b64:    { points: 100, hash: 'c5bafb65ecdc6b98db0762c0fa7b1c427f1ce4387d69eb827da57adc5998467a' },
  rot13:  { points: 150, hash: 'cd16ed0aa7a47a07d4f839ad48e1d62f6dd27f7cd4119fb7161ec5f72d5d06dd' },
  source: { points: 50,  hash: '3970057d1399e15824a7b7e07ba6579a021f6226e037532b3da13a329f716021' },
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var name = String(data.name || '').trim().slice(0, 32);
    var challengeId = String(data.challengeId || '');
    var answer = String(data.answer || '').trim();
    var challenge = ANSWERS[challengeId];

    if (!name || !challenge) {
      return jsonResponse({ ok: false, error: 'bad request' });
    }
    if (sha256Hex(answer) !== challenge.hash) {
      return jsonResponse({ ok: false, error: 'wrong answer' });
    }

    var sheet = getSheet();
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === name && rows[i][1] === challengeId) {
        return jsonResponse({ ok: true, duplicate: true });
      }
    }

    sheet.appendRow([name, challengeId, challenge.points, new Date()]);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'server error' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  var rows = getSheet().getDataRange().getValues();
  var players = {};

  for (var i = 1; i < rows.length; i++) {
    var name = rows[i][0];
    var points = Number(rows[i][2]) || 0;
    var time = new Date(rows[i][3]).getTime() || 0;
    if (!players[name]) {
      players[name] = { name: name, points: 0, solves: 0, lastSolve: 0 };
    }
    players[name].points += points;
    players[name].solves += 1;
    players[name].lastSolve = Math.max(players[name].lastSolve, time);
  }

  var board = Object.keys(players).map(function (k) { return players[k]; });
  // Highest points first; ties broken by who got there earlier.
  board.sort(function (a, b) {
    return b.points - a.points || a.lastSolve - b.lastSolve;
  });

  return jsonResponse({ ok: true, leaderboard: board });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['name', 'challenge', 'points', 'timestamp']);
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
