// Capture helpers for TechGuide screenshots against server12 (dev). Cookies come from mint.rb (server-side session).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const HOST = 'brainfit.dev3.powerdigital.sg';
const BASE = 'https://' + HOST;
async function open(who, opts = {}) {
  const jar = JSON.parse(fs.readFileSync(__dirname + '/cookies.json', 'utf8'))[who];
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-features=RenderDocument,BackForwardCache,ProactivelyThrottleBackgroundTabs'], defaultViewport: { width: opts.width || 1440, height: opts.height || 900 } });
  const page = await browser.newPage();
  await page.setCookie(...Object.entries(jar).filter(([k]) => k !== '_user').map(([name, value]) => ({ name, value, domain: HOST, path: '/', secure: true })));
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem('bp-mode', 'light'); } catch (e) {} });
  page.on('dialog', d => d.dismiss());
  return { browser, page };
}
async function go(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' }).catch(() => {});
  await new Promise(r => setTimeout(r, 600));
}
// Red box around the element(s) a step talks about (removed by clear()).
async function mark(page, selector, opts = {}) {
  await page.evaluate((sel, pad) => {
    const els = typeof sel === 'string' ? document.querySelectorAll(sel) : [];
    els.forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      const b = document.createElement('div'); b.className = '__tg_mark';
      Object.assign(b.style, { position: 'absolute', left: (r.left + scrollX - pad) + 'px', top: (r.top + scrollY - pad) + 'px', width: (r.width + pad * 2) + 'px', height: (r.height + pad * 2) + 'px',
        border: '3px solid #e11d48', borderRadius: '8px', zIndex: 99999, pointerEvents: 'none', boxShadow: '0 0 0 3px rgba(225,29,72,.18)' });
      document.body.appendChild(b);
    });
  }, selector, opts.pad || 4);
}
async function markText(page, tag, text, opts = {}) {
  const sel = await page.evaluate((tag, text) => {
    const el = [...document.querySelectorAll(tag)].find(e => e.offsetParent && e.textContent.trim().replace(/\s+/g, ' ').includes(text));
    if (!el) return null; el.setAttribute('data-tg', '1'); return '[data-tg="1"]';
  }, tag, text);
  if (sel) { await mark(page, sel, opts); await page.evaluate(() => document.querySelectorAll('[data-tg]').forEach(e => e.removeAttribute('data-tg'))); }
  return !!sel;
}
async function clear(page) { await page.evaluate(() => document.querySelectorAll('.__tg_mark').forEach(e => e.remove())); }
async function shot(page, file, opts = {}) {
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: file, fullPage: !!opts.full, clip: opts.clip });
  console.log('shot', file);
}
async function clickText(page, tag, text) {
  const ok = await page.evaluate((tag, text) => {
    const el = [...document.querySelectorAll(tag)].find(e => e.offsetParent && e.textContent.trim().replace(/\s+/g, ' ').includes(text));
    if (el) { el.click(); return true; } return false;
  }, tag, text);
  await new Promise(r => setTimeout(r, 700));
  return ok;
}
module.exports = { open, go, mark, markText, clear, shot, clickText, BASE };
