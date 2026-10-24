# Bench Academy (PWA)

Static site, no build step. Serve this folder over HTTPS (service workers and iOS install require it; `localhost` also works for testing).

## Host it
- Tailnet: `tailscale serve --bg --set-path /bench ./` from this folder gives you an HTTPS URL on your tailnet.
- Or any static host: GitHub Pages, Cloudflare Pages, an nginx container in your homelab.

## Install
- iPhone/iPad: open the URL in Safari, Share, Add to Home Screen.
- Android/Chrome: open the URL, menu, Install app.

## Update
Edit `index.html`, then bump `CACHE` in `sw.js` (e.g. `bench-academy-v2`) so installed copies drop the old cache.

Lesson progress is stored in localStorage on the device.
