# Bench Academy

Learn the Pokémon Trading Card Game by playing it: nine hands-on lessons, a coached match against an AI rival, and two-phone play with a friend. Installable PWA, works offline, no accounts.

Live: https://jmelowry.github.io/bench-academy/

## Play a friend (two phones, no server)
Phones connect directly over a WebRTC data channel. Connection details are exchanged by scanning QR codes:
host shows a code, guest scans it and shows a reply, host scans the reply. A text-code fallback covers cases where the camera isn't available.

- **Sync model:** lockstep. Both phones run the same engine from a shared random seed and exchange only player actions (`app.js` → `act()` / `applyAction()`).
- **Reconnect:** the action log is saved locally. On reconnect the host sends seed + log and the guest replays it, so a game survives app switches or reloads.
- **Network:** a public STUN server helps each phone learn its own address; no game data passes through it. Same Wi-Fi or one phone on the other's hotspot is most reliable.
- **Trust:** casual, face-to-face play. Each phone holds the full game state, so it isn't cheat-proof.

## Files
- `index.html` – shell and styles
- `app.js` – game engine, lessons, AI rival, UI
- `net.js` – WebRTC link, code packing, QR display and camera scanner
- `vendor/` – qrcode-generator (MIT) and jsQR (Apache-2.0)
- `art/` – FLUX card art as WebP; `.github/workflows/fetch-art.yml` can import new art from `art/sources.json`
- `sw.js` – offline cache

## Hosting and updates
Static site, no build step. Serve over HTTPS (service worker, camera and install all require it).
After changing any file, bump `CACHE` in `sw.js` so installed copies update.
