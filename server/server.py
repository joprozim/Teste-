#!/usr/bin/env python3
"""
Neon Runner Server (Python) — ranking global
Não precisa de npm/node. Ideal pro Termux.
  python3 server.py
"""
from __future__ import annotations

import json
import os
import re
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

PORT = int(os.environ.get("PORT", "3000"))
DATA_DIR = Path(__file__).resolve().parent / "data"
BOARD_FILE = DATA_DIR / "ranking.json"
MAX_BOARD = 100
MAX_PER_PLAYER = 5

DATA_DIR.mkdir(parents=True, exist_ok=True)
_lock = threading.Lock()
_hits: dict[str, list[float]] = {}


def load_board() -> list:
    try:
        if BOARD_FILE.exists():
            data = json.loads(BOARD_FILE.read_text("utf-8"))
            return data if isinstance(data, list) else []
    except Exception as e:
        print("load_board:", e)
    return []


def save_board(board: list) -> None:
    BOARD_FILE.write_text(json.dumps(board, ensure_ascii=False, indent=2), "utf-8")


board = load_board()


def rate_limit(ip: str, max_hits: int = 20, window_ms: int = 60_000) -> bool:
    now = time.time() * 1000
    arr = [t for t in _hits.get(ip, []) if now - t < window_ms]
    if len(arr) >= max_hits:
        _hits[ip] = arr
        return False
    arr.append(now)
    _hits[ip] = arr
    return True


def cors(handler: BaseHTTPRequestHandler) -> None:
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")


def send_json(handler: BaseHTTPRequestHandler, code: int, obj: dict) -> None:
    body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
    handler.send_response(code)
    cors(handler)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        print("[%s] %s" % (self.address_string(), fmt % args))

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        cors(self)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        qs = parse_qs(parsed.query)

        if path in ("/", "/health"):
            with _lock:
                n = len(board)
            return send_json(
                self,
                200,
                {
                    "ok": True,
                    "name": "Neon Runner Server",
                    "version": "1.0.0-py",
                    "scores": n,
                    "uptime": time.time(),
                },
            )

        if path == "/ranking":
            try:
                limit = min(50, max(1, int(qs.get("limit", ["20"])[0])))
            except ValueError:
                limit = 20
            mode = (qs.get("mode", [""])[0] or "").strip()
            with _lock:
                lst = list(board)
            if mode:
                lst = [x for x in lst if x.get("mode") == mode]
            lst.sort(key=lambda x: int(x.get("s") or 0), reverse=True)
            return send_json(self, 200, {"ok": True, "ranking": lst[:limit]})

        return send_json(self, 404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        if path != "/score":
            return send_json(self, 404, {"ok": False, "error": "not found"})

        ip = self.headers.get("X-Forwarded-For", self.client_address[0]).split(",")[0].strip()
        if not rate_limit(ip):
            return send_json(self, 429, {"ok": False, "error": "Muitas tentativas. Espere um pouco."})

        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            return send_json(self, 400, {"ok": False, "error": "JSON inválido"})

        name = re.sub(r"[<>]", "", str(body.get("name") or "Runner").strip())[:16] or "Runner"
        try:
            s = int(float(body.get("s") or 0))
            d = int(float(body.get("d") or 0))
        except (TypeError, ValueError):
            return send_json(self, 400, {"ok": False, "error": "Pontuação inválida"})
        mode = str(body.get("mode") or "endless")[:24]
        hero = str(body.get("hero") or "")[:16]

        if s < 0 or s > 50_000_000 or d < 0 or d > 5_000_000:
            return send_json(self, 400, {"ok": False, "error": "Pontuação inválida"})
        if s > d * 80 + 50_000:
            return send_json(self, 400, {"ok": False, "error": "Pontuação suspeita"})

        entry = {
            "n": name,
            "s": s,
            "d": d,
            "mode": mode,
            "hero": hero,
            "dt": time.strftime("%Y-%m-%d"),
            "t": int(time.time() * 1000),
        }

        global board
        with _lock:
            board.append(entry)
            by_key: dict[str, list] = {}
            for e in board:
                key = (str(e.get("n", "")) + "|" + str(e.get("mode", ""))).lower()
                by_key.setdefault(key, []).append(e)
            next_list: list = []
            for arr in by_key.values():
                arr.sort(key=lambda x: int(x.get("s") or 0), reverse=True)
                next_list.extend(arr[:MAX_PER_PLAYER])
            next_list.sort(key=lambda x: int(x.get("s") or 0), reverse=True)
            board = next_list[:MAX_BOARD]
            save_board(board)
            rank = next(
                (
                    i + 1
                    for i, x in enumerate(board)
                    if x.get("t") == entry["t"] and x.get("n") == entry["n"] and x.get("s") == entry["s"]
                ),
                None,
            )

        print(f"[score] #{rank or '?'} {name} {s} ({mode}) from {ip}")
        return send_json(
            self,
            200,
            {"ok": True, "rank": rank, "entry": entry, "total": len(board)},
        )


def main() -> None:
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Neon Runner Server (Python) em http://0.0.0.0:{PORT}")
    print(f"Ranking: {len(board)} entradas")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nParando...")
        server.server_close()


if __name__ == "__main__":
    main()
