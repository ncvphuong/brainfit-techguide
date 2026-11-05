// Timed quiz guide, part 2: save a 2-minute limit on QA quiz 156, list badge, Author filter (Super Admin). Dev only.
const { open, go, mark, clear, shot, clickText } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qt';
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes/156/edit');
  await page.evaluate(() => { const c = document.getElementById('quiz-timed'); if (!c.checked) c.click(); });
  await sleep(400);
  await page.evaluate(() => { const i = document.querySelector('input[name="data[time_limit_minutes]"]'); i.value = '2'; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.evaluate(() => { document.getElementById('quiz-timed').closest('div').setAttribute('data-t1', '1'); document.querySelector('input[name="data[time_limit_minutes]"]').closest('div').setAttribute('data-t2', '1'); });
  await mark(page, '[data-t1]', { pad: 4 }); await mark(page, '[data-t2]', { pad: 4 }); await shot(page, `${OUT}/qt-2.png`); await clear(page);
  await clickText(page, 'button', 'Save'); await sleep(3500);
  console.log(page.url());
  await go(page, '/acp/quizzes'); await sleep(800);
  await page.evaluate(() => { const b = [...document.querySelectorAll('.badge,span,label')].find(e => /Timed\s*2\s*min/i.test(e.textContent) && e.children.length === 0); if (b) b.setAttribute('data-bd', '1'); });
  await mark(page, '[data-bd]', { pad: 4 }); await shot(page, `${OUT}/qt-3.png`); await clear(page);
  await browser.close();
  // Super Admin
  const { browser: b2, page: p2 } = await open('sa', { width: 1440, height: 900 });
  await go(p2, '/acp/quizzes'); await sleep(800);
  console.log(await p2.evaluate(() => [...document.querySelectorAll('select')].map(s => s.name + '|' + [...s.options].map(o => o.textContent.trim()).join(','))));
  await p2.evaluate(() => { const s = [...document.querySelectorAll('select')].find(s => /All authors/.test(s.textContent)); if (s) s.closest('div,form').setAttribute('data-au', '1'); });
  await mark(p2, '[data-au]', { pad: 4 }); await shot(p2, `${OUT}/qt-4.png`); await clear(p2);
  await b2.close();
})().catch(e => { console.error(e); process.exit(1); });
