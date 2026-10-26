// Claw Paper Scissors — pixel cats play best-of-3 rock paper scissors; players call the winner.
(() => {
'use strict';

// ---------- constants ----------
const W = 256, H = 224, S = 3, GROUND = 184, LX = 64, RX = 192;
const BEAT = 500, FORCE_MS = 15000, MAX_PLAYERS = 4;
const OUT = '#0e0a1c', INK = '#f4ecd8', DIM = '#a698d0', RED = '#f83848', BLUE = '#3cbcfc', GOLD = '#f8b800', GOOD = '#58d854';
const PCOLORS = ['#58d854', '#f8b800', '#f878f8', '#fca044'];
const KEY = 'claw-paper-scissors-v2';
const cv = document.getElementById('screen');
const ctx = cv.getContext('2d');

// 16x16 sitting cat, authored as the left half and mirrored.
const HALF = [
  '..o.....', '.obo....', '.obpo...', '.obppooo',
  '.obbbbbb', 'obbbbbbb', 'obbhebbb', 'obbeebbb',
  'obbbbbww', 'obbbbwwp', '.obbbwwm', '..oobbww',
  '..obbbww', '..obbbww', '..obobbw', '..oooooo'
];
const SPR = HALF.map(r => r + [...r].reverse().join(''));

const ICONS = {
  rock: ['....oooo....','..oogglloo..','.ogggggllgo.','oggggggggggo','ogdggggggggo','ogggggggdggo','oggdgggggggo','.ogggggggdo.','..oooooooo..'],
  paper: ['.oooooooo...','.owwwwwwoo..','.ownnnnwwoo.','.owwwwwwwwo.','.ownnnnnwwo.','.owwwwwwwwo.','.ownnnnnnwo.','.owwwwwwwwo.','.ownnnwwwwo.','.owwwwwwwwo.','.oooooooooo.'],
  scissors: ['.o.......o..','.so.....os..','..so...os...','...so.os....','....sos.....','....oko.....','..rrr.rrr...','.r..r.r..r..','.r..r.r..r..','..rr...rr...']
};
const ICOL = { o: OUT, g: '#9c9cb0', l: '#d8d8e8', d: '#5c5c74', w: '#fcfcfc', n: '#7c94d8', s: '#c8d0e0', k: '#5c5c74', r: RED };
const SIGNS = ['rock', 'paper', 'scissors'];
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const VERB = { rock: 'SMASHES', paper: 'COVERS', scissors: 'CUTS' };

// bias = [rock, paper, scissors]
const ROSTER = [
  { name: 'MOCHI',      base: '#fcfcfc', sec: '#c4c4d4', eye: '#3cbcfc', pat: 'solid',  acc: 'bow',     bias: [.2, .5, .3] },
  { name: 'BISCUIT',    base: '#fca044', sec: '#d8600c', eye: '#58d854', pat: 'tabby',  acc: 'none',    bias: [.55, .2, .25] },
  { name: 'SIR POUNCE', base: '#2c2c3c', sec: '#2c2c3c', eye: '#f8b800', pat: 'tuxedo', acc: 'glasses', bias: [.25, .25, .5] },
  { name: 'NOODLE',     base: '#9c9cac', sec: '#5c5c70', eye: '#58d854', pat: 'tabby',  acc: 'bandana', bias: [.2, .3, .5] },
  { name: 'PEPPER',     base: '#2a2a3a', sec: '#2a2a3a', eye: '#f8b800', pat: 'solid',  acc: 'none',    bias: [1/3, 1/3, 1/3] },
  { name: 'OLIVE',      base: '#fcfcfc', sec: '#fc9838', ter: '#2c2c3c', eye: '#58d854', pat: 'calico', acc: 'none', bias: [.3, .5, .2] },
  { name: 'GIZMO',      base: '#f0d8a8', sec: '#6c4020', eye: '#3cbcfc', pat: 'point',  acc: 'glasses', bias: [.25, .45, .3] },
  { name: 'MARMALADE',  base: '#fc9838', sec: '#d85c10', eye: '#58d854', pat: 'solid',  acc: 'crown',   bias: [.6, .2, .2] },
  { name: 'SOCKS',      base: '#2c2c3c', sec: '#2c2c3c', eye: '#58d854', pat: 'tuxedo', acc: 'bandana', bias: [.3, .3, .4] },
  { name: 'LUNA',       base: '#7c84a8', sec: '#5c6488', eye: '#f8b800', pat: 'solid',  acc: 'none',    bias: [.2, .55, .25] },
  { name: 'TOFU',       base: '#fce0a8', sec: '#e0b070', eye: '#3cbcfc', pat: 'tabby',  acc: 'bow',     bias: [.25, .25, .5] },
  { name: 'ZIGGY',      base: '#ac7c50', sec: '#6c4420', eye: '#f8b800', pat: 'tabby',  acc: 'crown',   bias: [1/3, 1/3, 1/3] }
];
ROSTER.forEach((c, i) => { c.seed = i * 1.7; c.pitch = 480 + i * 37; });
const favSign = c => { const m = Math.max(...c.bias); return m < .4 ? null : SIGNS[c.bias.indexOf(m)]; };
const favors = c => (favSign(c) || 'chaos').toUpperCase();

// ---------- cat sprite ----------
const TABBY = new Set(['5,4','10,4','5,5','10,5','7,4','8,4','1,8','14,8','1,9','14,9','3,12','12,12','3,13','12,13']);
function pat(c, x, y) {
  switch (c.pat) {
    case 'tabby': return TABBY.has(x + ',' + y) ? c.sec : c.base;
    case 'tuxedo': return (y >= 11 && x >= 5 && x <= 10) || y === 14 ? '#fcfcfc' : c.base;
    case 'calico':
      if (y <= 7 && x <= 6) return c.sec;
      if ((x >= 10 && y >= 9) || (y <= 4 && x >= 11)) return c.ter;
      return c.base;
    case 'point': return y <= 3 || y === 14 || (y >= 7 && y <= 10 && x >= 4 && x <= 11) ? c.sec : c.base;
    default: return c.base;
  }
}
const tailTip = c => c.pat === 'calico' ? c.ter : c.pat === 'tuxedo' ? '#fcfcfc' : c.sec;

function drawCat(g, c, ox, oy, s, o = {}) {
  const fill = (x, y, col) => { g.fillStyle = col; g.fillRect(ox + x * s, oy + y * s, s, s); };
  const sw = Math.round(Math.sin((o.time || 0) * 0.005 + c.seed));
  const pts = [[1,14],[0,14],[-1,13],[-1,12],[-1,11],[-1,10],[0,9]].map(([x, y], i) => {
    const xx = x + (i >= 4 ? sw : 0);
    return [o.flip ? 15 - xx : xx, y];
  });
  pts.forEach(([x, y]) => { fill(x - 1, y, OUT); fill(x + 1, y, OUT); fill(x, y - 1, OUT); fill(x, y + 1, OUT); });
  pts.forEach(([x, y], i) => fill(x, y, i >= 5 ? tailTip(c) : c.base));
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    let ch = SPR[y][x];
    if (ch === '.') continue;
    if (o.blink && (ch === 'e' || ch === 'h')) ch = y === 7 ? 'o' : 'b';
    const col = ch === 'o' || ch === 'm' ? OUT : ch === 'p' ? '#f8a4c0' : ch === 'e' ? c.eye : ch === 'h' ? '#fcfcfc'
      : ch === 'w' ? (c.base === '#fcfcfc' ? '#e4e0f0' : '#fcfcfc') : pat(c, x, y);
    fill(x, y, col);
  }
  if (c.acc === 'bow') { [[3,1],[3,2],[4,2],[6,2],[7,2],[7,1]].forEach(p => fill(...p, RED)); fill(5, 2, '#a81020'); }
  if (c.acc === 'crown') {
    for (let x = 5; x <= 10; x++) fill(x, 2, GOLD);
    [[5,1],[7,1],[8,1],[10,1],[5,0],[10,0]].forEach(p => fill(...p, GOLD));
    fill(7, 2, RED); fill(8, 2, RED);
  }
  if (c.acc === 'glasses') {
    [[2,3,4,5],[10,11,12,13]].forEach(a => {
      a.forEach(x => { fill(x, 5, GOLD); fill(x, 8, GOLD); });
      [6,7].forEach(y => { fill(a[0], y, GOLD); fill(a[3], y, GOLD); });
    });
    for (let x = 6; x <= 9; x++) fill(x, 6, GOLD);
  }
  if (c.acc === 'bandana') {
    for (let x = 3; x <= 12; x++) fill(x, 11, RED);
    for (let x = 5; x <= 10; x++) fill(x, 12, RED);
    for (let x = 6; x <= 9; x++) fill(x, 13, RED);
    fill(7, 12, '#fcfcfc'); fill(4, 11, '#fcfcfc'); fill(11, 11, '#fcfcfc');
  }
}
function portrait(c) {
  const p = document.createElement('canvas'); p.width = 20; p.height = 18;
  drawCat(p.getContext('2d'), c, 2, 1, 1, {});
  return p;
}

// ---------- background ----------
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
(() => {
  const g = bg.getContext('2d'), r = rng(7);
  g.fillStyle = '#160e30'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#22164a';
  for (let y = 70; y < 150; y++) for (let x = (y % 2); x < W; x += 2) if (r() < (y - 70) / 80) g.fillRect(x, y, 1, 1);
  for (let y = -11; y <= 11; y++) for (let x = -11; x <= 11; x++) if (x * x + y * y <= 121) { g.fillStyle = '#fce0a8'; g.fillRect(226 + x, 30 + y, 1, 1); }
  g.fillStyle = '#e8c48c'; [[222,26,3],[230,33,2],[227,22,2]].forEach(([x, y, s]) => g.fillRect(x, y, s, s));
  let x = -4;
  while (x < W) {
    const w = 14 + Math.floor(r() * 18), top = 104 + Math.floor(r() * 44);
    g.fillStyle = '#251a4e'; g.fillRect(x, top, w, GROUND - top);
    g.fillStyle = '#3a2c6e'; g.fillRect(x, top, w, 1);
    for (let wy = top + 4; wy < GROUND - 4; wy += 6) for (let wx = x + 3; wx < x + w - 3; wx += 5) {
      g.fillStyle = r() < .22 ? GOLD : '#2e2260'; g.fillRect(wx, wy, 2, 3);
    }
    x += w + 1;
  }
  g.fillStyle = '#3a2a64'; g.fillRect(0, GROUND, W, H - GROUND);
  g.fillStyle = '#6c5cac'; g.fillRect(0, GROUND, W, 3);
  g.fillStyle = '#241848'; g.fillRect(0, GROUND + 3, W, 1);
  g.fillStyle = '#2c1f52';
  for (let y = GROUND + 9, row = 0; y < H; y += 6, row++) {
    g.fillRect(0, y, W, 1);
    for (let bx = row % 2 ? 6 : 0; bx < W; bx += 12) g.fillRect(bx, y - 5, 1, 5);
  }
})();
const STARS = (() => { const r = rng(42), a = []; while (a.length < 44) { const x = r() * W | 0, y = r() * 100 | 0; if ((x - 226) ** 2 + (y - 30) ** 2 > 260) a.push([x, y, r() * 6]); } return a; })();

// ---------- drawing helpers ----------
function font(size) { ctx.font = `${size}px "Press Start 2P", monospace`; }
function text(str, x, y, size = 8, color = INK) {
  font(size);
  while (size > 8 && ctx.measureText(str).width > 244) { size -= 8; font(size); }
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillStyle = OUT; ctx.fillText(str, x + 1, y + 1);
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
function bubble(cx, cy, edge = OUT) {
  const w = 30, h = 28, x = cx - w / 2, y = cy - h / 2;
  ctx.fillStyle = edge; ctx.fillRect(x - 1, y, w + 2, h); ctx.fillRect(x, y - 1, w, h + 2);
  ctx.fillRect(cx - 3, y + h, 6, 2); ctx.fillRect(cx - 2, y + h + 2, 4, 2); ctx.fillRect(cx - 1, y + h + 4, 2, 1);
  ctx.fillStyle = '#f4ecd8'; ctx.fillRect(x, y, w, h); ctx.fillRect(cx - 2, y + h, 4, 2); ctx.fillRect(cx - 1, y + h + 2, 2, 1);
}
function icon(sign, cx, cy, alpha = 1) {
  const rows = ICONS[sign], s = 2, ox = Math.round(cx - 12), oy = Math.round(cy - rows.length);
  ctx.globalAlpha = alpha;
  rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch !== '.') { ctx.fillStyle = ICOL[ch]; ctx.fillRect(ox + x * s, oy + y * s, s, s); } }));
  ctx.globalAlpha = 1;
}
function spotlight(cx) {
  ctx.save(); ctx.globalAlpha = .16; ctx.fillStyle = '#fce0a8';
  ctx.beginPath(); ctx.moveTo(cx - 6, 0); ctx.lineTo(cx + 6, 0); ctx.lineTo(cx + 34, GROUND); ctx.lineTo(cx - 34, GROUND); ctx.fill();
  ctx.globalAlpha = .3; ctx.fillRect(cx - 34, GROUND, 68, 3); ctx.restore();
}
// player tokens: a colored tile with the player's initial
function tokens(list, cx, y) {
  const n = list.length, step = 11, x0 = Math.round(cx - (n * step - 2) / 2);
  font(8); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  list.forEach((p, i) => {
    const x = x0 + i * step;
    ctx.fillStyle = OUT; ctx.fillRect(x - 1, y - 1, 11, 11);
    ctx.fillStyle = p.color; ctx.fillRect(x, y, 9, 9);
    ctx.fillStyle = OUT; ctx.fillText(p.name[0], x + 5, y + 1);
  });
}

// ---------- sound ----------
let actx = null, master = null, soundOn = false, keepAlive = null;
// iOS mutes Web Audio under the silent switch unless a media element is playing,
// so a silent looping WAV keeps the page in "playback" mode.
function silentWav() {
  const n = 8000, b = new ArrayBuffer(44 + n), v = new DataView(b);
  const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, 8000, true); v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
}
function unlockAudio() {
  if (!soundOn) return;
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
  try {
    if (!keepAlive) { keepAlive = new Audio(silentWav()); keepAlive.loop = true; keepAlive.setAttribute('playsinline', ''); }
    const p = keepAlive.play(); if (p && p.catch) p.catch(() => {});
  } catch (e) {}
  try {
    if (!actx) {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = .9; master.connect(actx.destination);
    }
    const src = actx.createBufferSource(); src.buffer = actx.createBuffer(1, 1, 22050); src.connect(master); src.start(0);
    if (actx.state !== 'running') actx.resume();
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && soundOn && actx && actx.state !== 'running') actx.resume(); });
function tone(f, d, at = 0, type = 'square', vol = .12, to) {
  if (!soundOn || !actx) return;
  if (actx.state !== 'running') actx.resume();
  const t0 = actx.currentTime + .01 + at, o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + d);
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
  o.connect(g).connect(master); o.start(t0); o.stop(t0 + d + .02);
}
const meow = (p, at = 0) => { tone(p, .1, at, 'square', .1, p * 1.7); tone(p * 1.7, .22, at + .1, 'square', .1, p * .85); };
const jingle = () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .14, i * .11));

// ---------- persistence ----------
const store = (() => {
  let s = { players: [], rounds: 10, rec: {} };
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (v && typeof v === 'object') s = Object.assign(s, v); } catch (e) {}
  ROSTER.forEach(c => { s.rec[c.name] = s.rec[c.name] || { w: 0, l: 0 }; });
  s.players = (s.players || []).filter(p => p && p.name).slice(0, MAX_PLAYERS);
  return s;
})();
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };

// ---------- game state ----------
// mode 'attract' loops on its own; mode 'session' waits for every player's pick.
const st = { phase: 'intro', t: 0, L: null, R: null, score: { l: 0, r: 0 }, throw: null, res: 0,
  throwNo: 0, beat: -1, winner: null, lastPair: '', summary: '' };
let session = null, paused = false, clock = 0, flash = 0;
const parts = [];

function pickSign(c) { let r = Math.random(); for (let i = 0; i < 3; i++) { if ((r -= c.bias[i]) <= 0) return SIGNS[i]; } return 'paper'; }
const picked = side => session ? session.players.filter(p => p.pick === side) : [];

function newRound() {
  let a, b, key;
  do { a = ROSTER[Math.random() * ROSTER.length | 0]; b = ROSTER[Math.random() * ROSTER.length | 0]; key = [a.name, b.name].sort().join(); }
  while (a === b || key === st.lastPair);
  st.lastPair = key; st.L = a; st.R = b;
  st.score = { l: 0, r: 0 }; st.throw = null; st.throwNo = 0; st.winner = null; st.summary = '';
  if (session) {
    session.roundNo++; session.voteT = 0; session.forceShown = false;
    session.players.forEach(p => { p.pick = null; p.gain = undefined; });
  }
  enter('intro');
  meow(a.pitch, .3); meow(b.pitch, .9);
}

function enter(p) {
  st.phase = p; st.t = 0; st.beat = -1;
  if (p === 'chant') st.throwNo++;
  if (p === 'allin') { tone(330, .08); tone(660, .12, .08); }
  renderPanel(); renderMeta();
}

function setPick(i, side) {
  if (!session || !(st.phase === 'intro' || st.phase === 'vote') || paused) return;
  const p = session.players[i];
  if (!p) return;
  const wasNew = !p.pick;
  p.pick = side;
  tone(wasNew ? 880 : 660, .06);
  updateRow(i); renderStatus();
  if (st.phase === 'vote') checkAllIn();
}
function checkAllIn() { if (session.players.every(p => p.pick)) enter('allin'); }
function forceStart() { if (session && st.phase === 'vote' && session.players.some(p => p.pick)) enter('allin'); }

function finish() {
  const w = st.score.l > st.score.r ? 'l' : 'r';
  st.winner = w;
  const win = w === 'l' ? st.L : st.R, lose = w === 'l' ? st.R : st.L;
  store.rec[win.name].w++; store.rec[lose.name].l++;
  if (session) {
    const voters = session.players.filter(p => p.pick);
    const right = voters.filter(p => p.pick === w).length, wrong = voters.length - right;
    const upset = right > 0 && right < wrong;
    voters.forEach(p => {
      if (p.pick === w) { p.gain = upset ? 2 : 1; p.score += p.gain; p.streak++; }
      else { p.gain = 0; p.streak = 0; }
    });
    st.summary = !voters.length ? 'NOBODY PICKED' : right === voters.length ? 'EVERYONE CALLED IT!' : !right ? 'NOBODY CALLED IT!'
      : upset ? 'UPSET BONUS +2!' : `${right} OF ${voters.length} CALLED IT`;
  }
  persist(); renderTable();
  jingle(); meow(win.pitch, .55);
  confetti(w === 'l' ? LX : RX, [GOLD, RED, BLUE, GOOD, INK]);
}
function confetti(cx, colors) {
  for (let i = 0; i < 40; i++) parts.push({ x: cx, y: 120, vx: (Math.random() - .5) * .16, vy: -Math.random() * .16 - .04, g: .0003, life: 1400 + Math.random() * 600, color: colors[i % colors.length] });
}

function nextRound() {
  if (!session || st.phase !== 'result') return;
  if (session.roundNo >= session.rounds) {
    enter('final'); jingle(); jingle();
    const top = ranked()[0];
    confetti(LX, [top.color, GOLD, INK]); confetti(RX, [top.color, GOLD, INK]);
  } else newRound();
}
const ranked = () => [...session.players].sort((a, b) => b.score - a.score || b.streak - a.streak);

function startSession() {
  if (!store.players.length) return;
  unlockAudio();
  session = { players: store.players.map(p => ({ name: p.name, color: p.color, score: 0, streak: 0, pick: null })), rounds: store.rounds, roundNo: 0, voteT: 0 };
  document.getElementById('endBtn').hidden = false;
  newRound();
}
function endSession() {
  session = null;
  document.getElementById('endBtn').hidden = true;
  newRound();
}

function update(dt) {
  st.t += dt;
  const t = st.t;
  switch (st.phase) {
    case 'intro':
      if (t >= 2200) { if (session) { enter('vote'); checkAllIn(); } else enter('chant'); }
      break;
    case 'vote':
      session.voteT += dt;
      if (!session.forceShown && session.voteT >= FORCE_MS) { session.forceShown = true; renderStatus(); }
      break;
    case 'allin':
      if (t >= 1100) enter('chant');
      break;
    case 'chant': {
      const b = Math.floor(t / BEAT);
      if (b !== st.beat && b < 4) { st.beat = b; tone([392, 440, 494, 784][b], b === 3 ? .18 : .09); }
      if (t >= BEAT * 4) {
        const a = pickSign(st.L), b2 = pickSign(st.R);
        st.throw = { l: a, r: b2 };
        st.res = a === b2 ? 0 : BEATS[a] === b2 ? 1 : -1;
        if (st.res > 0) st.score.l++; else if (st.res < 0) st.score.r++;
        flash = 160; tone(st.res ? 988 : 220, .2, 0, st.res ? 'square' : 'triangle', .14);
        enter('reveal');
      }
      break;
    }
    case 'reveal':
      if (t >= 2300) {
        if (st.score.l >= 2 || st.score.r >= 2) { enter('result'); finish(); renderPanel(); }
        else enter('chant');
      }
      break;
    case 'result':
      if (!session && t >= 4800) newRound();
      break;
  }
}

function draw() {
  ctx.drawImage(bg, 0, 0);
  STARS.forEach(([x, y, p]) => { const tw = Math.sin(clock * .002 + p); if (tw > -.3) { ctx.fillStyle = tw > .7 ? '#fcfcfc' : '#8c80c0'; ctx.fillRect(x, y, 1, 1); } });

  const { phase, t, L, R } = st;
  if (phase === 'reveal' && st.res) spotlight(st.res > 0 ? LX : RX);
  if (phase === 'result') spotlight(st.winner === 'l' ? LX : RX);

  let lx = LX, rx = RX, liftL = 0, liftR = 0, sinkL = 0, sinkR = 0;
  if (phase === 'intro') { const p = Math.min(1, t / 900), e = 1 - (1 - p) ** 3; lx = LX - (1 - e) * 120; rx = RX + (1 - e) * 120; }
  if (phase === 'chant') liftL = liftR = (t % BEAT) < 140 && t < BEAT * 4 ? 4 : 0;
  if (phase === 'allin') liftL = liftR = Math.round(Math.abs(Math.sin(t / 110)) * 3);
  if (phase === 'result') {
    const hop = Math.round(Math.abs(Math.sin(t / 170)) * 10);
    if (st.winner === 'l') { liftL = hop; sinkR = 3; } else { liftR = hop; sinkL = 3; }
  }
  if (phase === 'final') { liftL = Math.round(Math.abs(Math.sin(t / 170)) * 8); liftR = Math.round(Math.abs(Math.cos(t / 170)) * 8); }
  const blinkOf = c => ((clock + c.seed * 1000) % 3400) < 130;
  const sadL = phase === 'result' && st.winner === 'r', sadR = phase === 'result' && st.winner === 'l';
  drawCat(ctx, L, Math.round(lx - 24), GROUND - 48 - liftL + sinkL, S, { time: clock, blink: sadL || blinkOf(L) });
  drawCat(ctx, R, Math.round(rx - 24), GROUND - 48 - liftR + sinkR, S, { time: clock, flip: true, blink: sadR || blinkOf(R) });

  if (phase !== 'intro' || t > 700) {
    text(L.name, LX, 190, 8, RED); text(R.name, RX, 190, 8, BLUE);
    if (phase !== 'final') [[LX, st.score.l], [RX, st.score.r]].forEach(([cx, sc]) => {
      for (let i = 0; i < 2; i++) { const x = cx - 7 + i * 10; ctx.fillStyle = OUT; ctx.fillRect(x - 1, 201, 6, 6); ctx.fillStyle = i < sc ? GOLD : '#3a2a64'; ctx.fillRect(x, 202, 4, 4); }
    });
  }

  // who picked whom (hidden until everyone is in)
  const revealed = session && ['allin', 'chant', 'reveal', 'result'].includes(phase);
  if (revealed) { tokens(picked('l'), LX, 211); tokens(picked('r'), RX, 211); }
  if (!session && phase !== 'intro' && Math.floor(clock / 600) % 2) text('PRESS START BELOW', 128, 212, 8, GOLD);

  const by = 92;
  if (session && (phase === 'vote' || (phase === 'intro' && t > 900))) {
    [[LX, L], [RX, R]].forEach(([cx, c]) => {
      bubble(cx, by);
      const f = favSign(c);
      if (f) icon(f, cx, by - 2, .85); else text('?', cx, by - 8, 16, DIM);
      font(8); ctx.textAlign = 'center'; ctx.fillStyle = '#5c5c74'; ctx.fillText(f ? 'LIKES' : 'CHAOS', cx, by + 6);
    });
  } else if (phase === 'chant') {
    bubble(LX, by); bubble(RX, by);
    icon(SIGNS[Math.floor(t / 90) % 3], LX, by); icon(SIGNS[(Math.floor(t / 90) + 1) % 3], RX, by);
  } else if (phase === 'reveal' && st.throw) {
    bubble(LX, by, st.res > 0 ? GOLD : OUT); bubble(RX, by, st.res < 0 ? GOLD : OUT);
    icon(st.throw.l, LX, by); icon(st.throw.r, RX, by);
  }

  if (phase === 'intro') {
    text(session ? `ROUND ${session.roundNo}` : 'EXHIBITION', 128, 16, 16, GOLD);
    if (t > 500) text(`${L.name} VS ${R.name}`, 128, 40, 8);
  } else if (phase === 'vote') {
    const n = session.players.filter(p => p.pick).length;
    text('PICK A WINNER', 128, 16, 16, GOLD);
    text(`ROUND ${session.roundNo} OF ${session.rounds}`, 128, 40, 8);
    text(`${n}/${session.players.length}`, 128, 126, 16, INK);
    text('LOCKED', 128, 146, 8, DIM);
  } else if (phase === 'allin') {
    text('ALL IN!', 128, 16, 16, GOLD);
    text('NO TAKE-BACKS', 128, 40, 8);
  } else if (phase === 'chant') {
    const words = ['ROCK...', 'PAPER...', 'SCISSORS...', 'SHOOT!'], b = Math.min(3, Math.floor(t / BEAT));
    text(words[b], 128, 16, 16, b >= 3 ? GOLD : INK);
    text(`THROW ${st.throwNo}  ${st.score.l}-${st.score.r}`, 128, 40, 8, DIM);
  } else if (phase === 'reveal' && st.throw) {
    const { l, r } = st.throw;
    if (!st.res) { text('DRAW!', 128, 16, 16, INK); text(`BOTH THREW ${l.toUpperCase()}`, 128, 40, 8); }
    else {
      const [w, lo, name, col] = st.res > 0 ? [l, r, L.name, RED] : [r, l, R.name, BLUE];
      text(name + ' +1', 128, 16, 16, col);
      text(`${w.toUpperCase()} ${VERB[w]} ${lo.toUpperCase()}`, 128, 40, 8);
    }
  } else if (phase === 'result') {
    const wc = st.winner === 'l' ? L : R;
    text(wc.name + ' WINS!', 128, 16, 16, st.winner === 'l' ? RED : BLUE);
    text(`TAKES IT ${Math.max(st.score.l, st.score.r)}-${Math.min(st.score.l, st.score.r)}`, 128, 40, 8);
    if (st.summary) text(st.summary, 128, 54, 8, GOLD);
  } else if (phase === 'final') {
    const r = ranked(), tie = r.length > 1 && r[0].score === r[1].score;
    text('FINAL SCORES', 128, 16, 16, GOLD);
    if (tie) text('TIE GAME!', 128, 44, 16, INK);
    else { text(`${r[0].name} WINS!`, 128, 44, 16, r[0].color); text(`${r[0].score} POINTS`, 128, 66, 8); }
  }

  for (const p of parts) {
    ctx.globalAlpha = Math.min(1, p.life / 300);
    ctx.fillStyle = p.color; ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
  }
  ctx.globalAlpha = 1;
  if (flash > 0) { ctx.globalAlpha = flash / 400; ctx.fillStyle = '#fcfcfc'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (paused) { ctx.fillStyle = 'rgba(14,10,28,.6)'; ctx.fillRect(0, 0, W, H); text('PAUSED', 128, 104, 16, GOLD); }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last); last = now;
  if (!paused) {
    clock += dt; update(dt); flash = Math.max(0, flash - dt);
    for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.vy += (p.g || 0) * dt; p.x += (p.vx || 0) * dt; p.y += p.vy * dt; p.life -= dt; if (p.life <= 0) parts.splice(i, 1); }
  }
  draw();
  requestAnimationFrame(frame);
}

// ---------- DOM ----------
const panel = document.getElementById('panel');
function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat().forEach(k => k != null && e.append(k));
  return e;
}

function renderMeta() {
  const m = document.getElementById('meta');
  if (!session) m.textContent = 'ATTRACT MODE';
  else m.replaceChildren('ROUND ', el('b', {}, String(session.roundNo)), ` OF ${session.rounds}`);
}

function renderPanel() {
  // Attract mode changes phase every few seconds; don't rebuild the lobby under someone typing a name.
  if (!session) { if (panel.dataset.mode !== 'lobby') renderLobby(); return; }
  panel.dataset.mode = st.phase === 'final' ? 'final' : 'rows';
  if (st.phase === 'final') return renderFinal();
  renderRows();
}

function renderLobby() {
  panel.dataset.mode = 'lobby';
  const players = store.players;
  const full = players.length >= MAX_PLAYERS;
  const list = el('ul', { class: 'players' },
    players.length ? players.map((p, i) => el('li', { style: `--pc:${p.color}` },
      el('span', { class: 'sw' }), el('span', { class: 'pn' }, p.name),
      el('button', { class: 'x', type: 'button', 'aria-label': `Remove ${p.name}`, onclick: () => { store.players.splice(i, 1); persist(); renderLobby(); } }, 'X')))
    : el('li', { class: 'empty' }, 'Add 1 to 4 players to start.'));
  const input = el('input', { id: 'nameIn', maxlength: '8', placeholder: 'NAME', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', enterkeyhint: 'done', 'aria-label': 'Player name', disabled: full });
  const form = el('form', { class: 'addrow', onsubmit: e => {
    e.preventDefault();
    const name = input.value.trim().toUpperCase().replace(/[^A-Z0-9 !?.-]/g, '').slice(0, 8);
    if (!name || store.players.length >= MAX_PLAYERS) return;
    if (store.players.some(p => p.name === name)) { input.value = ''; input.placeholder = 'TAKEN'; return; }
    const used = new Set(store.players.map(p => p.color));
    store.players.push({ name, color: PCOLORS.find(c => !used.has(c)) });
    persist(); renderLobby();
    const again = document.getElementById('nameIn'); if (again && !again.disabled) again.focus();
  } }, input, el('button', { class: 'btn', type: 'submit', disabled: full }, 'ADD'));
  const chips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Rounds per game' }, el('span', { class: 'lbl' }, 'ROUNDS'),
    [5, 10, 15].map(n => el('button', { class: 'btn', type: 'button', 'aria-pressed': String(store.rounds === n), onclick: () => { store.rounds = n; persist(); renderLobby(); } }, String(n))));
  const start = el('button', { class: 'btn big', type: 'button', disabled: !players.length, onclick: startSession }, 'START');
  panel.replaceChildren(
    el('h2', {}, "WHO'S PLAYING?"), list, form, chips, start,
    el('p', { class: 'hint' }, 'Each round two cats play best of 3. Everyone picks a winner, and the match starts once all picks are in. A right call is 1 point; a right call most of the table missed is 2.')
  );
  renderStatus();
}

function renderRows() {
  const rows = el('div', { class: 'rows' }, session.players.map((p, i) => buildRow(p, i)));
  panel.replaceChildren(rows);
  renderStatus();
}
function buildRow(p, i) {
  const pickBtn = side => {
    const c = side === 'l' ? st.L : st.R;
    return el('button', { class: `pick ${side}`, type: 'button', 'data-i': i, 'data-side': side, 'aria-label': `${p.name} picks ${c.name}` },
      portrait(c), el('span', { class: 'cn' }, c.name));
  };
  const row = el('div', { class: 'row', style: `--pc:${p.color}`, id: `row${i}` }, pickBtn('l'),
    el('div', { class: 'who' }, el('span', { class: 'pn' }, p.name), el('span', { class: 'ps' }, `${p.score} PTS`), el('span', { class: 'st' })),
    pickBtn('r'));
  paintRow(row, p);
  return row;
}
function paintRow(row, p) {
  const open = st.phase === 'intro' || st.phase === 'vote';
  const st_ = row.querySelector('.st');
  row.classList.toggle('open', open && !p.pick);
  row.classList.toggle('locked', open && !!p.pick);
  row.classList.toggle('shown', !open);
  row.querySelectorAll('.pick').forEach(b => {
    b.disabled = !open;
    b.classList.toggle('chosen', !open && b.dataset.side === p.pick);
  });
  row.querySelector('.ps').textContent = `${p.score} PTS`;
  st_.className = 'st';
  if (open) st_.textContent = p.pick ? 'LOCKED' : 'PICK!';
  else if (st.phase === 'result') {
    if (!p.pick) st_.textContent = 'SAT OUT';
    else if (p.gain) { st_.textContent = p.gain > 1 ? '+2 UPSET' : '+1'; st_.classList.add('good'); }
    else { st_.textContent = 'MISSED'; st_.classList.add('bad'); }
  } else st_.textContent = p.pick ? '' : 'SAT OUT';
}
function updateRow(i) { const row = document.getElementById(`row${i}`); if (row) paintRow(row, session.players[i]); }

function renderFinal() {
  let prev = null, rank = 0;
  const items = ranked().map((p, i) => {
    if (p.score !== prev) { rank = i + 1; prev = p.score; }
    return el('li', { style: `--pc:${p.color}` }, el('span', { class: 'rk' }, `#${rank}`), el('span', { class: 'pn' }, p.name), el('span', { class: 'pts' }, `${p.score} PTS`));
  });
  panel.replaceChildren(el('h2', {}, 'FINAL SCORES'), el('ol', { class: 'podium' }, items),
    el('div', { class: 'btnrow' },
      el('button', { class: 'btn big', type: 'button', onclick: startSession }, 'PLAY AGAIN'),
      el('button', { class: 'btn', type: 'button', onclick: endSession }, 'CHANGE PLAYERS')));
  renderStatus();
}

function renderStatus() {
  const s = document.getElementById('status');
  let force = null;
  if (!session) s.textContent = '';
  else if (st.phase === 'intro' || st.phase === 'vote') {
    const waiting = session.players.filter(p => !p.pick).map(p => p.name);
    s.textContent = waiting.length ? `WAITING ON ${waiting.join(', ')}` : 'ALL IN';
    if (st.phase === 'vote' && session.forceShown && session.players.some(p => p.pick) && waiting.length)
      force = el('button', { class: 'btn', type: 'button', onclick: forceStart }, 'START WITHOUT THEM');
  } else if (st.phase === 'result') {
    const lastRound = session.roundNo >= session.rounds;
    s.replaceChildren(el('button', { class: 'btn big', type: 'button', onclick: nextRound }, lastRound ? 'FINAL SCORES' : 'NEXT ROUND'));
    return;
  } else s.textContent = st.phase === 'final' ? 'GAME OVER' : 'PICKS LOCKED';
  if (force) s.append(' ', force);
}

function renderTable() {
  const tb = document.getElementById('standings');
  const rows = [...ROSTER].sort((a, b) => (store.rec[b.name].w - store.rec[a.name].w) || (store.rec[a.name].l - store.rec[b.name].l) || a.name.localeCompare(b.name));
  tb.replaceChildren(...rows.map(c => el('tr', {},
    el('td', { class: 'cat' }, portrait(c), c.name),
    el('td', { class: 'num' }, String(store.rec[c.name].w)),
    el('td', { class: 'num' }, String(store.rec[c.name].l)),
    el('td', {}, favors(c)))));
}

// Picks fire on pointerdown so several people can tap at once on one screen;
// keyboard activation (click with detail 0) still works.
panel.addEventListener('pointerdown', e => {
  const b = e.target.closest('.pick');
  if (!b || b.disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
  unlockAudio();
  setPick(+b.dataset.i, b.dataset.side);
});
panel.addEventListener('click', e => {
  const b = e.target.closest('.pick');
  if (b && !b.disabled && e.detail === 0) setPick(+b.dataset.i, b.dataset.side);
});

const soundBtn = document.getElementById('soundBtn'), pauseBtn = document.getElementById('pauseBtn');
soundBtn.addEventListener('click', () => {
  soundOn = !soundOn; soundBtn.textContent = soundOn ? 'SOUND ON' : 'SOUND OFF'; soundBtn.setAttribute('aria-pressed', String(soundOn));
  if (soundOn) { unlockAudio(); meow(600); } else if (keepAlive) keepAlive.pause();
});
function togglePause() { paused = !paused; pauseBtn.textContent = paused ? 'RESUME' : 'PAUSE'; pauseBtn.setAttribute('aria-pressed', String(paused)); }
pauseBtn.addEventListener('click', togglePause);
document.getElementById('endBtn').addEventListener('click', endSession);
document.addEventListener('keydown', e => {
  if (e.key === ' ' && !['BUTTON', 'INPUT'].includes(e.target.tagName)) { e.preventDefault(); togglePause(); }
});

renderTable(); newRound();
requestAnimationFrame(frame);
})();
