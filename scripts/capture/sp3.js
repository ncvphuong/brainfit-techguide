// SCH guide: re-take the thank-you message and Brian's confirmation, waiting until they have fully appeared (dev, centre 132).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const L = fs.readFileSync(__dirname + '/sch_link.txt', 'utf8').trim(), OUT = process.argv[2] || 'out/sp';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
  const c = await browser.createBrowserContext(); const p = await c.newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await p.emulateTimezone('Asia/Singapore');
  await p.goto(L, { waitUntil: 'networkidle2' }); await sleep(1000);
  await p.click('.card.go:not(.full)'); await sleep(800);
  await p.type('#wl-name', 'Sample Parent'); await p.type('#wl-email', 'sample.parent@example.com'); await p.type('#wl-phone', '9123 4567'); await p.type('#wl-child', 'Sample Child'); await p.type('#wl-age', '8');
  await p.click('#wl-send'); await sleep(5000);
  console.log((await p.evaluate(() => document.querySelector('.modal, [role=dialog], #wl-modal')?.innerText || document.body.innerText)).slice(0, 300));
  await p.screenshot({ path: `${OUT}/pb-5.png` });
  await c.close();
  const c2 = await browser.createBrowserContext(); const q = await c2.newPage(); await q.setViewport({ width: 1440, height: 900 });
  await q.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await q.emulateTimezone('Asia/Singapore');
  await q.goto(L, { waitUntil: 'networkidle2' }); await sleep(1000); await q.click('#brian-fab'); await sleep(800);
  const ask = async t => { await q.type('#bin', t, { delay: 10 }); await q.click('#bsend'); await sleep(2500); for (let i = 0; i < 60; i++) { const busy = await q.evaluate(() => /(^|\n)\.\.\.(\n|$)/.test(document.querySelector('#brian-panel').innerText) || document.querySelector('#bsend').disabled); if (!busy) break; await sleep(1000); } await sleep(800); };
  await ask('I would like to enrol my child in the Saturday 2pm class.');
  await ask('My name is Sample Parent, email sample.brian@example.com, phone +65 9123 4567. Child: Sample Child, age 8. No preferred start date.');
  await q.screenshot({ path: `${OUT}/pb-7.png` });
  await ask('Yes, that is correct.'); await q.screenshot({ path: `${OUT}/pb-8.png` });
  console.log((await q.evaluate(() => document.querySelector('#brian-panel').innerText)).slice(-500));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
