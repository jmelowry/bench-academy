// Bench Academy: serverless two-phone link.
// Phones connect peer to peer over a WebRTC data channel. The connection details are
// exchanged by scanning QR codes (or pasting text codes), so no game server is involved.
'use strict';
const Net = (() => {
  // STUN only helps each phone learn its own network address; game data never goes through it.
  const ICE = [{ urls: 'stun:stun.l.google.com:19302' }];
  const api = { onOpen: null, onClose: null, onMessage: null, onFail: null };
  let pc = null, dc = null;

  /* ---- code packing: [ 'B', 'A', flag, ...payload ] ---- */
  const hasZ = typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
  async function zip(bytes, compress){
    const s = new Blob([bytes]).stream().pipeThrough(compress ? new CompressionStream('deflate-raw') : new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }
  function slim(sdp){
    // Keep UDP IPv4 and mDNS (.local) candidates only; they are all two phones side by side need.
    return sdp.split('\r\n').filter(l => {
      if (!l) return false;
      if (l.startsWith('a=candidate:')){
        const p = l.split(' ');
        if ((p[2]||'').toLowerCase() !== 'udp') return false;
        if ((p[4]||'').includes(':')) return false;
      }
      return true;
    }).join('\r\n') + '\r\n';
  }
  async function pack(desc){
    const json = new TextEncoder().encode(JSON.stringify({ t: desc.type === 'offer' ? 'o' : 'a', s: slim(desc.sdp) }));
    const body = hasZ ? await zip(json, true) : json;
    const out = new Uint8Array(body.length + 3);
    out.set([0x42, 0x41, hasZ ? 1 : 0]); out.set(body, 3);
    return out;
  }
  function fromText(s){
    s = s.trim().replace(/^BA-/, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return Uint8Array.from(atob(s), c => c.charCodeAt(0));
  }
  async function unpack(input){
    let bytes;
    try { bytes = typeof input === 'string' ? fromText(input) : input; } catch (e) { throw new Error(`That doesn't look like a Bench Academy code.`); }
    if (bytes[0] !== 0x42 || bytes[1] !== 0x41) throw new Error(`That doesn't look like a Bench Academy code.`);
    let body = bytes.slice(3);
    if (bytes[2] === 1){
      if (!hasZ) throw new Error('This browser is too old to read that code. Update iOS or your browser and try again.');
      body = await zip(body, false);
    }
    const o = JSON.parse(new TextDecoder().decode(body));
    return { type: o.t === 'o' ? 'offer' : 'answer', sdp: o.s };
  }
  api.toText = bytes => {
    let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
    return 'BA-' + btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  api.qrSvg = bytes => {
    let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
    const q = qrcode(0, 'L'); q.addData(bin, 'Byte'); q.make();
    return q.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
  };

  /* ---- peer connection ---- */
  function bind(ch){
    dc = ch;
    ch.onopen = () => api.onOpen && api.onOpen();
    ch.onclose = () => { if (dc === ch){ dc = null; api.onClose && api.onClose(); } };
    ch.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (err) { return; } api.onMessage && api.onMessage(m); };
  }
  function fresh(){
    api.close();
    const p = new RTCPeerConnection({ iceServers: ICE });
    p.onconnectionstatechange = () => { if (pc === p && p.connectionState === 'failed') api.onFail && api.onFail(); };
    pc = p; return p;
  }
  function gathered(p, ms = 3000){
    return new Promise(res => {
      if (p.iceGatheringState === 'complete') return res();
      const t = setTimeout(res, ms);
      p.addEventListener('icegatheringstatechange', () => { if (p.iceGatheringState === 'complete'){ clearTimeout(t); res(); } });
    });
  }
  api.close = () => {
    const d = dc, p = pc; dc = null; pc = null;
    try { d && d.close(); } catch (e) {}
    try { p && p.close(); } catch (e) {}
  };
  api.host = async () => {
    const p = fresh();
    bind(p.createDataChannel('game', { ordered: true }));
    await p.setLocalDescription(await p.createOffer());
    await gathered(p);
    return pack(p.localDescription);
  };
  api.join = async code => {
    const offer = await unpack(code);
    if (offer.type !== 'offer') throw new Error(`That's a reply code. Scan the code on the host's screen.`);
    const p = fresh();
    p.ondatachannel = e => bind(e.channel);
    await p.setRemoteDescription(offer);
    await p.setLocalDescription(await p.createAnswer());
    await gathered(p);
    return pack(p.localDescription);
  };
  api.accept = async code => {
    const ans = await unpack(code);
    if (ans.type !== 'answer') throw new Error(`That's a host code. Scan the reply on your friend's screen.`);
    if (!pc) throw new Error('Tap Host a game first.');
    await pc.setRemoteDescription(ans);
  };
  api.send = o => { if (dc && dc.readyState === 'open') dc.send(JSON.stringify(o)); };
  api.isOpen = () => !!dc && dc.readyState === 'open';

  /* ---- camera QR scanner ---- */
  api.scan = async onCode => {
    const el = document.getElementById('scan'), v = el.querySelector('video');
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    } catch (e) {
      throw new Error('The camera is unavailable. Allow camera access for this app, or use a text code instead.');
    }
    el.hidden = false; v.srcObject = stream;
    try { await v.play(); } catch (e) {}
    const c = document.createElement('canvas'), ctx = c.getContext('2d', { willReadFrequently: true });
    let done = false, last = 0;
    const stop = () => { done = true; stream.getTracks().forEach(t => t.stop()); v.srcObject = null; el.hidden = true; };
    el.querySelector('#scan-cancel').onclick = stop;
    const tick = t => {
      if (done) return;
      if (t - last > 120 && v.readyState >= 2 && v.videoWidth){
        last = t;
        const w = Math.min(720, v.videoWidth), h = Math.round(v.videoHeight * w / v.videoWidth);
        c.width = w; c.height = h; ctx.drawImage(v, 0, 0, w, h);
        const r = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
        if (r && r.binaryData && r.binaryData[0] === 0x42 && r.binaryData[1] === 0x41){
          stop(); if (navigator.vibrate) navigator.vibrate(40);
          onCode(new Uint8Array(r.binaryData)); return;
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  return api;
})();
