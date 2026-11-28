/**
 * Neon Runner Server v1
 * Ranking global + base para salas 1v1
 * Roda no Termux (Android) 24h
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const BOARD_FILE = path.join(DATA_DIR, 'ranking.json');
const MAX_BOARD = 100;
const MAX_PER_PLAYER = 5;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadBoard() {
  try {
    if (fs.existsSync(BOARD_FILE)) {
      const j = JSON.parse(fs.readFileSync(BOARD_FILE, 'utf8'));
      return Array.isArray(j) ? j : [];
    }
  } catch (e) {
    console.error('loadBoard', e.message);
  }
  return [];
}

function saveBoard(board) {
  fs.writeFileSync(BOARD_FILE, JSON.stringify(board, null, 2));
}

let board = loadBoard();

const hits = new Map();
function rateLimit(ip, max = 30, windowMs = 60000) {
  const now = Date.now();
  let arr = hits.get(ip) || [];
  arr = arr.filter((t) => now - t < windowMs);
  if (arr.length >= max) return false;
  arr.push(now);
  hits.set(ip, arr);
  return true;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '64kb' }));

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    name: 'Neon Runner Server',
    version: '1.0.0',
    endpoints: ['GET /health', 'GET /ranking', 'POST /score', 'WS /ws'],
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, scores: board.length, uptime: process.uptime() });
});

app.get('/ranking', (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10)));
  const mode = (req.query.mode || '').toString();
  let list = board.slice();
  if (mode) list = list.filter((x) => x.mode === mode);
  list.sort((a, b) => b.s - a.s);
  res.json({ ok: true, ranking: list.slice(0, limit) });
});

app.post('/score', (req, res) => {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || '?';
  if (!rateLimit(ip, 20, 60000)) {
    return res.status(429).json({ ok: false, error: 'Muitas tentativas. Espere um pouco.' });
  }

  const body = req.body || {};
  let name = String(body.name || 'Runner').trim().slice(0, 16) || 'Runner';
  name = name.replace(/[<>]/g, '');
  const s = Math.floor(Number(body.s) || 0);
  const d = Math.floor(Number(body.d) || 0);
  const mode = String(body.mode || 'endless').slice(0, 24);
  const hero = String(body.hero || '').slice(0, 16);

  if (s < 0 || s > 50_000_000 || d < 0 || d > 5_000_000) {
    return res.status(400).json({ ok: false, error: 'Pontuação inválida' });
  }
  if (s > d * 80 + 50000) {
    return res.status(400).json({ ok: false, error: 'Pontuação suspeita' });
  }

  const entry = {
    n: name,
    s,
    d,
    mode,
    hero,
    dt: new Date().toISOString().slice(0, 10),
    t: Date.now(),
  };

  board.push(entry);
  const byKey = new Map();
  for (const e of board) {
    const key = (e.n + '|' + e.mode).toLowerCase();
    const arr = byKey.get(key) || [];
    arr.push(e);
    byKey.set(key, arr);
  }
  let next = [];
  for (const arr of byKey.values()) {
    arr.sort((a, b) => b.s - a.s);
    next.push(...arr.slice(0, MAX_PER_PLAYER));
  }
  next.sort((a, b) => b.s - a.s);
  board = next.slice(0, MAX_BOARD);
  saveBoard(board);

  const rank = board.findIndex((x) => x.t === entry.t && x.n === entry.n && x.s === entry.s) + 1;
  console.log(`[score] #${rank || '?'} ${name} ${s} (${mode}) from ${ip}`);
  res.json({ ok: true, rank: rank || null, entry, total: board.length });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
const rooms = new Map();

function randCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

wss.on('connection', (ws) => {
  ws.meta = { room: null, name: 'Runner' };

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    const type = msg.type;

    if (type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
      return;
    }

    if (type === 'create') {
      let code = randCode();
      while (rooms.has(code)) code = randCode();
      const seed = msg.seed || Math.floor(Math.random() * 1e9);
      rooms.set(code, {
        players: new Map([[ws, { name: String(msg.name || 'Runner').slice(0, 16), ready: false }]]),
        seed,
        created: Date.now(),
      });
      ws.meta.room = code;
      ws.meta.name = String(msg.name || 'Runner').slice(0, 16);
      ws.send(JSON.stringify({ type: 'created', code, seed }));
      return;
    }

    if (type === 'join') {
      const code = String(msg.code || '');
      const room = rooms.get(code);
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', error: 'Sala não encontrada' }));
        return;
      }
      if (room.players.size >= 2) {
        ws.send(JSON.stringify({ type: 'error', error: 'Sala cheia' }));
        return;
      }
      const name = String(msg.name || 'Runner').slice(0, 16);
      room.players.set(ws, { name, ready: false });
      ws.meta.room = code;
      ws.meta.name = name;
      const names = [...room.players.values()].map((p) => p.name);
      for (const [client] of room.players) {
        client.send(JSON.stringify({ type: 'joined', code, seed: room.seed, players: names }));
      }
      return;
    }

    if (type === 'progress' && ws.meta.room) {
      const room = rooms.get(ws.meta.room);
      if (!room) return;
      for (const [client] of room.players) {
        if (client !== ws && client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: 'rival',
              name: ws.meta.name,
              d: msg.d || 0,
              lane: msg.lane || 0,
              y: msg.y || 0,
              dead: !!msg.dead,
            })
          );
        }
      }
    }
  });

  ws.on('close', () => {
    const code = ws.meta.room;
    if (!code) return;
    const room = rooms.get(code);
    if (!room) return;
    room.players.delete(ws);
    if (room.players.size === 0) rooms.delete(code);
    else {
      for (const [client] of room.players) {
        client.send(JSON.stringify({ type: 'left', name: ws.meta.name }));
      }
    }
  });
});

setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.created > 3600000) rooms.delete(code);
  }
}, 60000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Neon Runner Server em http://0.0.0.0:${PORT}`);
  console.log(`Ranking: ${board.length} entradas`);
});
