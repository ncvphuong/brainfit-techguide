// Timed quiz guide, part 3: CoachSpace take-quiz (dev, trainer of the training centre, QA quiz 156 timed 2 min).
const { open, go, mark, clear, shot } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qt';
(async () => {
  const { browser, page } = await open('cs', { width: 1280, height: 800 });
  await go(page, '/coachspace/courses/338'); await sleep(800);
  await page.evaluate(() => { const b = document.querySelectorAll('.cs-toggle-quiz')[1]; b.scrollIntoView({ block: 'center' }); b.click(); });
  await sleep(2500);
  console.log(await page.evaluate(() => document.body.innerText.slice(0, 400)));
  await shot(page, `${OUT}/qt-5.png`);
  const bar = await page.evaluate(() => { const e = [...document.querySelectorAll('div,section,header')].find(x => /Timed quiz/.test(x.textContent) && x.children.length < 6 && x.getBoundingClientRect().height < 120); if (!e) return null; e.setAttribute('data-bar', '1'); return e.className; });
  console.log('bar', bar);
  await mark(page, '[data-bar]', { pad: 4 }); await shot(page, `${OUT}/qt-6.png`); await clear(page);
  await page.evaluate(() => { const q = document.querySelector('.cs-quiz-timer').closest('form, div').parentElement; const r = [...document.querySelectorAll('input[type=radio]')].find(i => i.offsetParent); if (r) r.click(); });
  // scroll: the bar stays on top
  await page.evaluate(() => window.scrollTo(0, 500)); await sleep(500); await shot(page, `${OUT}/qt-7.png`);
  await page.evaluate(() => window.scrollTo(0, 0));
  // wait for the last minute (red)
  await sleep(62000);
  await shot(page, `${OUT}/qt-8.png`);
  // reload while running: it resumes
  await page.reload({ waitUntil: 'networkidle2' }); await sleep(2500);
  await shot(page, `${OUT}/qt-9.png`);
  // let it run out
  await sleep(65000);
  await shot(page, `${OUT}/qt-10.png`);
  console.log(await page.evaluate(() => document.body.innerText.slice(0, 500)));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
