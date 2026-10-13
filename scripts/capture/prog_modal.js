// Course Progression guide, shot 1: Add resource ("+") then its edit pop-up with type Quiz. Nothing is saved; the empty placeholder "+" creates is removed by id afterwards (server/zz_ph.rb).
const { open, go, mark, clear, shot } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const { browser, page } = await open('author', { width: 1600, height: 900 });
  await go(page, '/acp/courses/338/edit');
  await page.evaluate(() => document.querySelector('a[href*="/acp/media/topic/"]').click()); await sleep(3000);
  await page.evaluate(() => { const r = [...document.querySelectorAll('tr, div')].find(e => e.children.length && e.textContent.trim().startsWith('media title') && e.querySelector('a.update-form, a[href*="edit"]')); const a = r?.querySelector('a.update-form, a[href*="edit"]'); a?.click(); });
  await sleep(3000);
  console.log(await page.evaluate(() => { const m = [...document.querySelectorAll('.modal')].find(m => getComputedStyle(m).display === 'block'); const s = m?.querySelector('select'); return JSON.stringify(s ? [s.name, [...s.options].map(o => o.value + ':' + o.text)] : null); }));
  await page.evaluate(() => { const m = [...document.querySelectorAll('.modal')].find(m => getComputedStyle(m).display === 'block'); const s = [...m.querySelectorAll('select')].find(s => [...s.options].some(o => /quiz/i.test(o.text))); if (s) { const o = [...s.options].find(o => /quiz/i.test(o.text)); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); (s.closest('.form-group') || s).setAttribute('data-tg-t', '1'); } });
  await sleep(1200); await mark(page, '[data-tg-t]', { pad: 4 });
  await shot(page, process.argv[2] + '/prog-1b.png'); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
