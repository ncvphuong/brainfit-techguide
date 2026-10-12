// Scripted training videos for the TechGuide (server12 / dev only).
// Narration (ElevenLabs) -> one clip per step; Puppeteer drives Chrome in real time, holding each step for as long as its
// clip lasts; Chrome's screencast is mixed with the clips by ffmpeg. See doc/hq/training_center/plan_training_videos_2026-10-12.html
// in brainfit-ruby. The ElevenLabs key is read from the user's motion_graphic/.env at run time and never printed or stored here.
// Temp files (Chrome profiles etc.) go on the Transcend SSD, never the internal disk.
process.env.TMPDIR = process.env.TMPDIR_VIDEO || '/Volumes/Transcend/development/tmp/bf-second-dev/tmp';
require('fs').mkdirSync(process.env.TMPDIR, { recursive: true });
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { execFileSync } = require('child_process');
const { open } = require('../capture/lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ENV_FILE = process.env.ELEVEN_ENV_FILE || '/Volumes/Transcend/development/random_stuff/motion_graphic/.env';
const VOICE = process.env.VOICE_NAME || 'Alice';
const CACHE = path.join(__dirname, 'out', 'tts-cache');

function elevenKey() {
  const env = Object.fromEntries(fs.readFileSync(ENV_FILE, 'utf8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
  const k = (env.ELEVENLABS_API_KEY || '').trim().replace(/^["']|["']$/g, '');
  if (!k) throw new Error('ELEVENLABS_API_KEY not found in ' + ENV_FILE);
  return k;
}
async function eleven(method, url, body) {
  const res = await fetch(url, { method, headers: { 'xi-api-key': elevenKey(), 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
}
let voiceId;
async function voice() {
  if (voiceId) return voiceId;
  const { voices } = await (await eleven('GET', 'https://api.elevenlabs.io/v1/voices')).json();
  const v = voices.find(v => v.name.toLowerCase().startsWith(VOICE.toLowerCase()));
  if (!v) throw new Error('voice not found: ' + VOICE);
  return (voiceId = v.voice_id);
}
// One mp3 per line of narration, cached by text so re-recording doesn't re-bill.
async function tts(text) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, crypto.createHash('sha1').update(VOICE + '|' + text).digest('hex').slice(0, 16) + '.mp3');
  if (!fs.existsSync(file)) {
    const res = await eleven('POST', `https://api.elevenlabs.io/v1/text-to-speech/${await voice()}?output_format=mp3_44100_128`,
      { text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true, speed: 0.97 } });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  const dur = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString());
  return { file, dur };
}

// Overlays that survive page navigations: a visible cursor, click ripple, caption bar.
const OVERLAY = () => {
  const css = `body{padding-bottom:120px!important}#__cur{animation:__tick .25s steps(2,end) infinite;position:fixed;z-index:2147483647;left:0;top:0;width:22px;height:22px;pointer-events:none;transform:translate(-3px,-2px);filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
  .__rip{position:fixed;z-index:2147483646;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:3px solid #2563eb;pointer-events:none;animation:__rip .55s ease-out forwards}
  @keyframes __tick{0%{opacity:1}100%{opacity:.985}}
  @keyframes __rip{to{transform:scale(3.2);opacity:0}}
  #__cap{position:fixed;z-index:2147483645;left:50%;bottom:22px;transform:translateX(-50%);max-width:78%;padding:10px 20px;border-radius:12px;background:rgba(15,23,42,.88);color:#fff;font:600 18px/1.35 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-align:center;pointer-events:none;box-shadow:0 6px 22px rgba(0,0,0,.35)}
  .__hl{position:absolute;z-index:99999;pointer-events:none;border:3px solid #e11d48;border-radius:8px;box-shadow:0 0 0 4px rgba(225,29,72,.2);animation:__pulse 1.1s ease-in-out infinite}
  @keyframes __pulse{50%{box-shadow:0 0 0 9px rgba(225,29,72,.08)}}`;
  const boot = () => {
    if (document.getElementById('__cur')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const c = document.createElement('div'); c.id = '__cur';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 2l7.5 19 2.7-7.6L21 10.7z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    const [x, y] = (sessionStorage.__cp || '60,60').split(',').map(Number); c.style.left = x + 'px'; c.style.top = y + 'px'; document.body.appendChild(c);
    if (sessionStorage.__cap) { const k = document.createElement('div'); k.id = '__cap'; k.textContent = sessionStorage.__cap; document.body.appendChild(k); }
    document.addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; sessionStorage.__cp = e.clientX + ',' + e.clientY; }, true);
    document.addEventListener('mousedown', e => { const r = document.createElement('div'); r.className = '__rip'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 700); }, true);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
};

function makeCtx(page) {
  const ctx = {
    page, sleep,
    async go(p) { await page.goto('https://brainfit.dev3.powerdigital.sg' + p, { waitUntil: 'networkidle2', timeout: 60000 }); await page.addStyleTag({ content: '*{animation-duration:0s!important;transition:none!important}.__rip,.__hl,#__cap,#__cur{animation:revert!important}' }).catch(() => {}); await sleep(500); },
    async caption(text) { await page.evaluate(t => { sessionStorage.__cap = t; let k = document.getElementById('__cap'); if (!k) { k = document.createElement('div'); k.id = '__cap'; document.body.appendChild(k); } k.textContent = t; }, text); },
    // Tag the element found by a function body (returns an Element) so later calls can reach it with a selector.
    async tag(fnBody, name = 'a') { const ok = await page.evaluate((b, n) => { const el = new Function(b)(); if (!el) return false; document.querySelectorAll(`[data-v-${n}]`).forEach(e => e.removeAttribute(`data-v-${n}`)); el.setAttribute(`data-v-${n}`, '1'); return true; }, fnBody, name); if (!ok) throw new Error('element not found: ' + fnBody.slice(0, 90)); return `[data-v-${name}]`; },
    async center(sel) { const r = await page.evaluate(s => { const el = document.querySelector(s); let b = el.getBoundingClientRect(); if (b.height < 480) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); b = el.getBoundingClientRect(); } const top = Math.max(b.top, 80), bot = Math.min(b.bottom, innerHeight - 80); return { x: b.left + Math.min(b.width / 2, 120), y: (top + bot) / 2 }; }, sel); return r; },
    async glide(sel) { const t = await ctx.center(sel); await sleep(150); const cur = await page.evaluate(() => (sessionStorage.__cp || '60,60').split(',').map(Number)); const n = 28; for (let i = 1; i <= n; i++) { const e = i / n, k = e < .5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2; await page.mouse.move(cur[0] + (t.x - cur[0]) * k, cur[1] + (t.y - cur[1]) * k); await sleep(18); } },
    async click(sel, opts = {}) { await ctx.glide(sel); await sleep(250); if (opts.wait) await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }), page.mouse.click(...(await ctx.pos()))]); else await page.mouse.click(...(await ctx.pos())); if (opts.wait) await sleep(600); },
    async pos() { return page.evaluate(() => (sessionStorage.__cp || '0,0').split(',').map(Number)); },
    async hl(sel, pad = 5) { await page.evaluate((s, p) => { document.querySelectorAll(s).forEach(el => { const r = el.getBoundingClientRect(); if (!r.width) return; const b = document.createElement('div'); b.className = '__hl'; Object.assign(b.style, { left: r.left + scrollX - p + 'px', top: r.top + scrollY - p + 'px', width: r.width + p * 2 + 'px', height: r.height + p * 2 + 'px' }); document.body.appendChild(b); }); }, sel, pad); },
    async unhl() { await page.evaluate(() => document.querySelectorAll('.__hl').forEach(e => e.remove())).catch(() => {}); },
    async type(sel, text) { await ctx.click(sel); await page.keyboard.type(text, { delay: 70 }); },
    async scrollTo(sel, offset = 90) { await page.evaluate((s, o) => { const el = document.querySelector(s); window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - o, behavior: 'smooth' }); }, sel, offset); await sleep(900); },
  };
  return ctx;
}

// beats: [{ say: 'narration', run: async ctx => {...} }]
async function makeVideo({ name, who = 'ma', beats, before, after, startPath = '/acp' }) {
  const outDir = path.join(__dirname, 'out'); fs.mkdirSync(outDir, { recursive: true });
  console.log(`[${name}] narration`);
  const clips = []; for (const b of beats) clips.push(await tts(b.say));
  const { browser, page } = await open(who, { width: 1280, height: 720 });
  await page.evaluateOnNewDocument(OVERLAY);
  const ctx = makeCtx(page);
  if (before) await before(ctx);
  await ctx.go(startPath); await sleep(500);
  // Frames come from CDP's screencast with their own timestamps (a frame is only sent when the page changes), so the
  // video timeline is exact even when a page load stalls; the narration is placed on the same clock.
  const frameDir = path.join(outDir, name + '_frames'); fs.rmSync(frameDir, { recursive: true, force: true }); fs.mkdirSync(frameDir, { recursive: true });
  // Frames are taken by polling page.screenshot (CDP's screencast stalled behind some overlays and stopped sending frames).
  const frames = []; let recording = true;
  const cdp = { send: async () => { recording = false; } };
  const poller = (async () => { while (recording) { const t = Date.now() / 1000; try { const f = path.join(frameDir, String(frames.length).padStart(6, '0') + '.jpg'); await page.screenshot({ path: f, type: 'jpeg', quality: 85 }); frames.push({ t, f }); } catch (e) { /* navigation in flight: skip */ await sleep(60); } } })();
  await ctx.caption(' ').catch(() => {}); await sleep(900);
  const starts = [];
  for (let i = 0; i < beats.length; i++) {
    const s = Date.now(); starts.push(s / 1000);
    await ctx.caption(beats[i].say).catch(() => {});
    try { await beats[i].run(ctx); } catch (e) { console.error(`[${name}] beat ${i + 1} failed: ${e.message}`); recording = false; await poller; await browser.close(); if (after) await after().catch(() => {}); throw e; }
    const left = clips[i].dur * 1000 + 700 - (Date.now() - s); if (left > 0) await sleep(left); else console.log(`  beat ${i + 1} actions overran narration by ${(-left / 1000).toFixed(1)}s`);
    await ctx.unhl().catch(() => {});
  }
  await sleep(900); const endT = Date.now() / 1000; recording = false; await poller; await browser.close();
  if (after) await after();
  if (!frames.length) throw new Error('no screencast frames captured');
  const T0 = frames[0].t;
  console.log(`  frames: ${frames.length}, first->last ${(frames[frames.length - 1].t - T0).toFixed(1)}s, run end ${(endT - T0).toFixed(1)}s; longest gap ${Math.max(...frames.map((f, i) => i ? f.t - frames[i - 1].t : 0)).toFixed(1)}s`);
  const list = frames.map((fr, i) => `file '${fr.f}'\nduration ${Math.max(0.001, ((frames[i + 1] ? frames[i + 1].t : Math.max(endT, fr.t + 0.1)) - fr.t)).toFixed(4)}`).join('\n') + `\nfile '${frames[frames.length - 1].f}'\n`;
  const listFile = path.join(outDir, name + '_frames.txt'); fs.writeFileSync(listFile, list);
  const webm = path.join(outDir, name + '_silent.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', listFile, '-vf', 'fps=30,scale=1280:720', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', webm]);
  fs.rmSync(frameDir, { recursive: true, force: true }); fs.rmSync(listFile, { force: true });
  const t0 = T0; // clock for the audio: seconds since the first frame
  const mp4 = path.join(outDir, name + '.mp4');
  starts.forEach((v, i) => { starts[i] = Math.max(0, v - t0); });
  const args = ['-y', '-v', 'error', '-i', webm]; clips.forEach(c => args.push('-i', c.file));
  const fc = clips.map((c, i) => `[${i + 1}:a]adelay=${Math.round(starts[i] * 1000)}|${Math.round(starts[i] * 1000)}[a${i}]`).join(';') + ';' + clips.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${clips.length}:normalize=0,apad[aout]`;
  args.push('-filter_complex', fc, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-t', String(Math.max(0.5, endT - T0).toFixed(2)), mp4);
  execFileSync('ffmpeg', args);
  const vd = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).toString());
  console.log(`[${name}] ${mp4}  ${vd.toFixed(1)}s  (narration ${clips.reduce((a, c) => a + c.dur, 0).toFixed(1)}s)`);
  return { mp4, starts, clips };
}
module.exports = { makeVideo, sleep };
