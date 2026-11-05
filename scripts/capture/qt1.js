// Timed quiz guide, part 1 (dev): quiz form, list badge, Super Admin Author filter. Uses QA quiz 156 and unticks it at the end.
const { open, go, mark, clear, shot, clickText } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qt';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes/156/edit');
  const info = await page.evaluate(() => [...document.querySelectorAll('input,select')].filter(e => e.offsetParent || e.type === 'checkbox').map(e => e.name + '|' + e.id + '|' + e.type));
  console.log(info);
  const cb = '#quiz_timed, input[name*="timed"]';
  await page.evaluate(() => { const c = [...document.querySelectorAll('input[type=checkbox]')].find(e => (e.closest('label,div') || {}).textContent.includes('Timed quiz')); c.setAttribute('data-timed', '1'); });
  await page.evaluate(() => window.scrollTo(0, 0));
  await mark(page, '[data-timed]', { pad: 6 }); await shot(page, `${OUT}/qt-1.png`); await clear(page);
  await page.click('[data-timed]'); await sleep(500);
  console.log(await page.evaluate(() => [...document.querySelectorAll('input')].filter(e => e.offsetParent).map(e => e.name + '|' + e.id + '|' + e.type + '|' + e.value)));
  await shot(page, `${OUT}/qt-2.png`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
