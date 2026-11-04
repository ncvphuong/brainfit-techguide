// Assessor forms guide, part 2: the public page on a phone (no login), then the response in Notes, the closed link, back to Draft.
const { open, go, mark, clear, shot, BASE } = require('./lib');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/af';
const ID = fs.readFileSync('af_id.txt', 'utf8').trim(), LINK = fs.readFileSync('af_link.txt', 'utf8').trim();
const EMAIL = 'sample.visitor@example.com';
(async () => {
  const { browser, page } = await open('ml', { width: 1440, height: 900 });
  // public page: a fresh context with no BrainFit session, phone size
  const ctx = await browser.createBrowserContext(); const ph = await ctx.newPage();
  await ph.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await ph.setViewport({ width: 390, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ph.goto(LINK, { waitUntil: 'networkidle2' }); await sleep(500);
  await ph.screenshot({ path: `${OUT}/af-6.png` });
  await ph.type('#pf_name', 'Sample Visitor', { delay: 20 }); await ph.type('#pf_email', EMAIL, { delay: 20 });
  console.log(await ph.evaluate(() => [...document.querySelectorAll('form input, form textarea')].map(e => e.type + ':' + e.name).join(' ')));
  await ph.evaluate(() => { const r = [...document.querySelectorAll('label')].find(l => l.textContent.trim() === 'Great'); r && r.click(); });
  const txt = await ph.$$('input[type=text]:not(#pf_name):not(#pf_website)'); if (txt[0]) await txt[0].type('The games', { delay: 20 });
  const ta = await ph.$('textarea'); if (ta) await ta.type('Thank you!', { delay: 20 });
  await ph.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
  await ph.screenshot({ path: `${OUT}/af-7.png`, fullPage: true });
  await Promise.all([ph.waitForNavigation({ waitUntil: 'networkidle2' }), ph.click('button[type=submit]')]); await sleep(600);
  await ph.screenshot({ path: `${OUT}/af-8.png` });
  // Notes: filtered to Public + the email, so only this response shows
  await go(page, `/acp/cogmap-assessor-notes?source=public&q=${encodeURIComponent(EMAIL)}`);
  await mark(page, 'select[name=source]', { pad: 4 }); await mark(page, 'input[name=q]', { pad: 4 }); await shot(page, `${OUT}/af-9.png`); await clear(page);
  // + New Assessor Note -> general form
  await go(page, '/acp/cogmap-assessor-notes/new'); await shot(page, `${OUT}/af-10.png`);
  // closed link: switch Published off, open the link, switch it back off for good (Draft)
  await go(page, `/acp/cogmap-assessor-forms/${ID}/edit`); await sleep(1500);
  await page.evaluate(() => { const cb = [...document.querySelectorAll('.afe-switch-input')].pop(); if (cb.checked) cb.click(); }); await sleep(300);
  await page.click('.afe-btn-primary'); await sleep(2500);
  await ph.goto(LINK, { waitUntil: 'networkidle2' }); await sleep(500);
  await ph.screenshot({ path: `${OUT}/af-11.png` });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
