# Neon Runner Server

Servidor leve pro ranking global e (depois) 1v1.

## No Termux (Android)

```bash
pkg update && pkg install nodejs-lts
cd ~/neon-server
npm install
npm start
```

Porta **3000**.

### 24h ligado

```bash
npm install -g pm2
pm2 start index.js --name neon
pm2 save
termux-wake-lock
```

### URL pública

```bash
pkg install cloudflared
cloudflared tunnel --url http://localhost:3000
```

Cole o link `https://....trycloudflare.com` no jogo (Online → Servidor).

## API

- GET `/health`
- GET `/ranking?limit=20`
- POST `/score` body `{ name, s, d, mode, hero }`
- WS `/ws` (salas 1v1 — fase 2)
