// Course Progression guide: the certificate page (opened from the dashboard's View link) and cropped dashboard / progression box.
const { open, go, mark, clear, shot } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const OUT = process.argv[2];
  const { browser, page } = await open('author', { width: 1600, height: 900 });
  await go(page, '/acp/courses/338/progression');
  await page.evaluate(() => [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'View')?.setAttribute('data-tg-v', '1'));
  const href = await page.evaluate(() => document.querySelector('[data-tg-v]').href);
  await mark(page, 'thead', { pad: 3 }); await clear(page);
  await mark(page, '[data-tg-v]', { pad: 4 }); await shot(page, OUT + '/prog-4.png', { clip: { x: 0, y: 0, width: 1600, height: 470 } }); await clear(page);
  await go(page, href.replace(/^https?:\/\/[^/]+/, '')); await sleep(1000);
  await shot(page, OUT + '/prog-5.png', { full: true });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
