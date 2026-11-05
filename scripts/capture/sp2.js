// SCH public availability guide, part 2 (dev, centre 132): theme, enrolment request pop-up, Brian booking, staff Public requests.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { openSch, goSch } = require('./schlib');
const { mark, clear } = require('./lib');
const OUT = process.argv[2] || 'out/sp';
const L = fs.readFileSync(__dirname + '/sch_link.txt', 'utf8').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const setv = (p, sel, v) => p.evaluate((sel, v) => { const e = document.querySelector(sel); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, sel, v);
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
  const ctx = await browser.createBrowserContext();
  const p = await ctx.newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await p.emulateTimezone('Asia/Singapore');
  await p.goto(L, { waitUntil: 'networkidle2' }); await sleep(1200);
  // theme toggle (top right) + dark
  const tg = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].slice(0, 3); const r = b.map(x => x.getBoundingClientRect()); const l = Math.min(...r.map(x => x.left)), t = Math.min(...r.map(x => x.top)); const d = document.createElement('div'); d.id = 'tgbox'; Object.assign(d.style, { position: 'absolute', left: l + 'px', top: t + 'px', width: (Math.max(...r.map(x => x.right)) - l) + 'px', height: (Math.max(...r.map(x => x.bottom)) - t) + 'px', pointerEvents: 'none' }); document.body.appendChild(d); return true; });
  await mark(p, '#tgbox', { pad: 5 }); await p.screenshot({ path: `${OUT}/pb-1.png` }); await clear(p);
  await p.evaluate(() => document.getElementById('tgbox').remove());
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '☾').click()); await sleep(600);
  await p.screenshot({ path: `${OUT}/pb-2.png` });
  await p.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '◐').click()); await sleep(400);
  // enrolment request pop-up
  await p.click('.card.go:not(.full)'); await sleep(900);
  await p.type('#wl-name', 'Sample Parent', { delay: 15 }); await p.type('#wl-email', 'sample.parent@example.com', { delay: 10 });
  await p.type('#wl-phone', '9123 4567', { delay: 10 }); await p.type('#wl-child', 'Sample Child', { delay: 10 }); await p.type('#wl-age', '8', { delay: 10 });
  await p.evaluate(() => { const d = document.querySelector('input[type=date]'); d.value = '2026-12-05'; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.type('#wl-note', 'Prefers Saturday mornings. (sample)', { delay: 5 }); await sleep(300);
  await p.screenshot({ path: `${OUT}/pb-3.png` });
  await p.evaluate(() => { const s = document.querySelector('#wl-cc'); const r = s.getBoundingClientRect(); const d = document.createElement('div'); d.id = 'ccbox'; Object.assign(d.style, { position: 'absolute', left: r.left + 'px', top: (r.top + scrollY) + 'px', width: r.width + 'px', height: r.height + 'px' }); document.body.appendChild(d); });
  console.log('countries', await p.evaluate(() => [...document.querySelectorAll('#wl-cc option')].map(o => o.textContent)));
  await mark(p, '#ccbox', { pad: 4 }); await p.screenshot({ path: `${OUT}/pb-4.png` }); await clear(p); await p.evaluate(() => document.getElementById('ccbox').remove());
  await p.click('#wl-send'); await sleep(2500);
  await p.screenshot({ path: `${OUT}/pb-5.png` });
  console.log(await p.evaluate(() => document.body.innerText.slice(0, 300)));
  await ctx.close();
  // Brian booking (fresh visitor)
  const c2 = await browser.createBrowserContext(); const q = await c2.newPage(); await q.setViewport({ width: 1440, height: 900 });
  await q.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await q.emulateTimezone('Asia/Singapore');
  await q.goto(L, { waitUntil: 'networkidle2' }); await sleep(1000); await q.click('#brian-fab'); await sleep(1000);
  const ask = async t => { await q.type('#bin', t, { delay: 15 }); await q.click('#bsend'); let last = -1, same = 0; for (let i = 0; i < 60 && same < 3; i++) { await sleep(1000); const n = await q.evaluate(() => document.querySelector('#brian-panel').innerText.length); same = n === last ? same + 1 : 0; last = n; } await sleep(400); };
  await ask('I would like to enrol my child in the Saturday 2pm class.'); await q.screenshot({ path: `${OUT}/pb-6.png` });
  await ask('My name is Sample Parent, email sample.brian@example.com, phone +65 9123 4567. Child: Sample Child, age 8.'); await q.screenshot({ path: `${OUT}/pb-7.png` });
  await ask('Yes, that is correct.'); await q.screenshot({ path: `${OUT}/pb-8.png` });
  console.log((await q.evaluate(() => document.querySelector('#brian-panel').innerText)).slice(-900));
  await c2.close(); await browser.close();
  // staff: Class Groups menu, Waitlist tabs, Public enrolment requests (masked)
  const { browser: sb, page } = await openSch({ width: 1440, height: 900 });
  await goSch(page, '/classrooms/waitlist/'); await sleep(1500);
  await page.click('#class-groups-menu-button'); await sleep(600);
  await page.evaluate(() => { const m = document.querySelector('#class-groups-menu-button').parentElement; m.setAttribute('data-tg', '1'); });
  await mark(page, 'a[href*="public-waitlist-requests"]', { pad: 3 }); await page.screenshot({ path: `${OUT}/pb-9.png` }); await clear(page);
  await page.keyboard.press('Escape'); await page.mouse.click(700, 700); await sleep(400);
  await page.screenshot({ path: `${OUT}/pb-9b.png` });
  await goSch(page, '/classrooms/public-waitlist-requests/'); await sleep(1500);
  await page.evaluate(() => {
    const map = { 'DEV Check': 'Sample Parent A', 'dev.check@example.com': 'parent.a@example.com', 'Linh Nguyen': 'Sample Parent B', 'linh.qa@example.com': 'parent.b@example.com', 'QA Parent': 'Sample Parent C', 'qa.parent@example.com': 'parent.c@example.com', 'DEV Child': 'Child A', 'Minh': 'Child B', 'QA Child': 'Child C', '+84987654321': '+6590000002', '+6591234567': '+6590000001' };
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let t = n.nodeValue; for (const k of Object.keys(map)) t = t.split(k).join(map[k]); n.nodeValue = t; }
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.href = '#'; });
  });
  await page.screenshot({ path: `${OUT}/pb-10.png` });
  await sb.close();
})().catch(e => { console.error(e); process.exit(1); });
