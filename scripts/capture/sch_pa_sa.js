// SCH public availability guide, Super Admin-only screens (dev only, centre 132): Brian chat ON/OFF and the conversations log. Nothing is clicked that changes anything.
const { openSch, goSch } = require('./schlib');
const { mark, clear } = require('./lib');
const OUT = process.argv[2] || 'out/af';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const maskLink = page => page.evaluate(() => document.querySelectorAll('input').forEach(i => { if (/public\/availability/.test(i.value)) i.value = 'https://scheduling.brainfitstudio.com/public/availability/••••••••••••••••/'; }));
(async () => {
  const { browser, page } = await openSch({ width: 1440, height: 900, cookie: 'sch_cookie_sa.json' });
  await goSch(page, '/classrooms/class-groups/availability/'); await sleep(2500);
  await page.click('#public-link-btn'); await sleep(1000); await maskLink(page);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian chat/.test(e.textContent)); b && b.setAttribute('data-tg', '1'); const c = [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian conversations/.test(e.textContent)); c && c.setAttribute('data-tg2', '1'); });
  await mark(page, '[data-tg]', { pad: 4 }); await mark(page, '[data-tg2]', { pad: 4 }); await page.screenshot({ path: `${OUT}/pa-7.png` }); await clear(page);
  await goSch(page, '/classrooms/brian-conversations/'); await sleep(1200);
  await page.screenshot({ path: `${OUT}/pa-8.png` });
  // open the newest conversation
  const opened = await page.evaluate(() => { const d = [...document.querySelectorAll('details')].find(e => /2 turns/.test(e.textContent)); if (d) { d.open = true; return 'details'; } return null; });
  console.log('opened', opened); await sleep(1500);
  await page.screenshot({ path: `${OUT}/pa-9.png` });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
