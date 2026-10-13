// TechGuide > BrainFit HQ > Course Management > Course Progression (server12, as course author power_ml). Read-only: nothing is saved.
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const C = 338;
(async () => {
  const { browser, page } = await open('author', { width: 1600, height: 900 });
  const frame = async (sel, file, pad = 4) => { await page.evaluate(s => { const e = document.querySelector(s); e?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); }, sel); await sleep(400); await mark(page, sel, { pad }); await shot(page, file); await clear(page); };
  // 1. quizzes sit in topics: the "+" on a topic
  await go(page, `/acp/courses/${C}/edit`);
  await page.evaluate(() => { const h = [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Topic'); h?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); document.querySelector('a[href*="/acp/media/topic/"]')?.setAttribute('data-tg-plus', '1'); });
  await mark(page, '[data-tg-plus]', { pad: 4 }); await shot(page, `${OUT}/prog-1.png`); await clear(page);
  // 2. progression box (course 338, already on)
  await frame('.bp-ce-prog', `${OUT}/prog-2.png`);
  // 3. top bar Progression button
  await go(page, `/acp/courses/${C}/edit`);
  await mark(page, '.bp-ce-bar', { pad: 4 }); await shot(page, `${OUT}/prog-3.png`, { clip: { x: 0, y: 0, width: 1600, height: 260 } }); await clear(page);
  // 4. dashboard
  await go(page, `/acp/courses/${C}/progression`); await shot(page, `${OUT}/prog-4.png`, { full: true });
  console.log(await page.evaluate(() => [...document.querySelectorAll('a')].filter(a => a.textContent.trim() === 'View').map(a => a.getAttribute('href').replace(/[^/]+$/, '<token>')).join(',')));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
