// SCH guide, part 3 (dev, centre 132): Brian passes a visitor to the front desk, staff list incl. "Contact requests from Brian", attendance with date of birth.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const { openSch, goSch } = require('./schlib');
const { mark, clear } = require('./lib');
const OUT = process.argv[2] || 'out/sp';
const L = fs.readFileSync(__dirname + '/sch_link.txt', 'utf8').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
  const c = await browser.createBrowserContext(); const q = await c.newPage(); await q.setViewport({ width: 1440, height: 900 });
  await q.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await q.emulateTimezone('Asia/Singapore');
  await q.goto(L, { waitUntil: 'networkidle2' }); await sleep(1000); await q.click('#brian-fab'); await sleep(800);
  const ask = async t => { await q.type('#bin', t, { delay: 10 }); await q.click('#bsend'); await sleep(2500); for (let i = 0; i < 60; i++) { const busy = await q.evaluate(() => /(^|\n)\.\.\.(\n|$)/.test(document.querySelector('#brian-panel').innerText) || document.querySelector('#bsend').disabled); if (!busy) break; await sleep(1000); } await sleep(800); };
  await ask('Can I talk to a real person? I have a question about prices.');
  await q.screenshot({ path: `${OUT}/pc-1.png` });
  await sleep(13000);
  await ask('Sample Parent, sample.contact@example.com. I want to know the price of the Saturday class.');
  await q.screenshot({ path: `${OUT}/pc-2.png` });
  await sleep(13000);
  await ask('Yes, that is correct.'); await sleep(1500);
  await q.screenshot({ path: `${OUT}/pc-3.png` });
  console.log((await q.evaluate(() => document.querySelector('#brian-panel').innerText)).slice(-600));
  await browser.close();
  const { browser: sb, page } = await openSch({ width: 1440, height: 900 });
  await goSch(page, '/classrooms/public-waitlist-requests/'); await sleep(1500);
  const mask = () => page.evaluate(() => {
    const map = { 'DEV Check': 'Sample Parent A', 'dev.check@example.com': 'parent.a@example.com', 'Linh Nguyen': 'Sample Parent B', 'linh.qa@example.com': 'parent.b@example.com', 'QA Parent': 'Sample Parent C', 'qa.parent@example.com': 'parent.c@example.com', 'DEV Child': 'Child A', 'Minh': 'Child B', 'QA Child': 'Child C', '+84987654321': '+6590000002', '+6591234567': '+6590000001' };
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let t = n.nodeValue; for (const k of Object.keys(map)) t = t.split(k).join(map[k]); n.nodeValue = t; }
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.removeAttribute('href'); });
  });
  await mask(); await page.screenshot({ path: `${OUT}/pc-4.png` });
  await page.evaluate(() => { const h = [...document.querySelectorAll('h2,h3,h4')].find(e => /Contact requests from Brian/i.test(e.textContent)); if (h) { h.scrollIntoView({ block: 'start' }); h.setAttribute('data-tg', '1'); } window.scrollBy(0, -20); });
  await sleep(400); await mark(page, '[data-tg]', { pad: 6 }); await page.screenshot({ path: `${OUT}/pc-5.png` }); await clear(page);
  // attendance with DOB: class group 1320
  await goSch(page, '/classrooms/class-group/1320/'); await sleep(2000);
  await page.screenshot({ path: `${OUT}/pc-6.png` });
  console.log(await page.evaluate(() => [...document.querySelectorAll('a,button')].filter(e => e.offsetParent && /attend|session/i.test(e.textContent)).map(e => e.tagName + ' ' + (e.getAttribute('href') || e.id) + ' ' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)).slice(0, 15)));
  await sb.close();
})().catch(e => { console.error(e); process.exit(1); });
