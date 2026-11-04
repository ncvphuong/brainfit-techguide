// Assessor forms guide, part 1: build a questionnaire form as the ML on server12 (dev), set Public, save, publish.
const { open, go, mark, clear, shot } = require('./lib');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/af';
const setv = (page, el, v) => page.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, el, v);
const hideToast = page => page.evaluate(() => document.querySelectorAll('[class*=toast]').forEach(e => { e.style.display = 'none'; }));
const view = (page, sel, block = 'center') => page.evaluate((sel, block) => { const e = document.querySelector(sel); e && e.scrollIntoView({ block }); }, sel, block);
(async () => {
  const { browser, page } = await open('ml', { width: 1440, height: 900 });
  await go(page, '/acp/cogmap-assessor-forms');
  await page.evaluate(() => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes('SG BF Training Centre 2027')) tr.style.display = 'none'; }));
  await mark(page, 'a[href$="/new"]', { pad: 4 }); await shot(page, `${OUT}/af-1.png`); await clear(page);
  await go(page, '/acp/cogmap-assessor-forms/new');
  await page.type('.afe-title-input', 'Training Centre feedback (demo)', { delay: 20 });
  await page.type('.afe-sec-title', 'Your visit', { delay: 20 });
  await page.type('.afe-q-label', 'How was your visit?', { delay: 20 });
  await page.evaluate(() => document.querySelector('.afe-opt-input').select()); await page.keyboard.type('Great');
  await page.evaluate(() => [...document.querySelectorAll('.afe-opt-add button')].find(b => b.textContent.trim() === 'Add option').click()); await sleep(300);
  await page.evaluate(() => [...document.querySelectorAll('.afe-opt-input')].pop().select()); await page.keyboard.type('Could be better');
  await page.type('.afe-center-search', 'Training Centre 2027', { delay: 20 }); await sleep(900);
  console.log('centre click', await page.evaluate(() => { const els = [...document.querySelectorAll('body *')].filter(e => e.offsetParent && e.textContent.trim() === 'SG BF Training Centre 2027'); const el = els[els.length - 1]; if (el) { el.click(); return el.tagName; } return false; }));
  await sleep(600);
  await page.evaluate(() => { const s = document.querySelector('.afe-center-search'); s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.evaluate(() => { const cb = [...document.querySelectorAll('input[type=checkbox]')].find(c => (c.closest('label,div') || {}).textContent?.includes('About a student')); if (cb && cb.checked) cb.click(); });
  await sleep(400);
  // question 2 + 3 (only the active card has its editor open)
  for (const [label, type] of [['What did you enjoy most?', 'text'], ['Any other comments?', 'textarea']]) {
    await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.textContent.trim() === 'Question').pop().click()); await sleep(700);
    await page.type('.afe-q-label', label, { delay: 15 });
    await page.select('select[aria-label="Question type"]', type); await sleep(400);
  }
  await sleep(3500); // let the editor's toast fade
  // shot 2: title, About a student off, who can fill it in, centre
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300);
  await mark(page, 'select[aria-label="Who can fill it in"]', { pad: 6 });
  await page.evaluate(() => { const cb = [...document.querySelectorAll('input[type=checkbox]')].find(c => (c.closest('label,div') || {}).textContent?.includes('About a student')); (cb.closest('label') || cb.parentElement).setAttribute('data-ab', '1'); }); await mark(page, '[data-ab]', { pad: 6 });
  await hideToast(page); await shot(page, `${OUT}/af-2.png`); await clear(page);
  // Public
  await page.select('select[aria-label="Who can fill it in"]', 'public'); await sleep(600);
  await view(page, 'select[aria-label="Who can fill it in"]', 'start'); await page.evaluate(() => window.scrollBy(0, -140)); await sleep(200);
  await mark(page, 'select[aria-label="Who can fill it in"]', { pad: 6 }); await hideToast(page); await shot(page, `${OUT}/af-3.png`); await clear(page);
  await page.evaluate(() => { const cb = [...document.querySelectorAll('.afe-switch-input')].pop(); if (!cb.checked) cb.click(); }); await sleep(300);
  await page.click('.afe-btn-primary'); await sleep(2500);
  console.log('url', page.url());
  const link = await page.evaluate(() => document.querySelector('input[aria-label="Public link"]')?.value);
  console.log('link', link); fs.writeFileSync('af_link.txt', link || '');
  const id = page.url().match(/forms\/(\d+)/)[1]; fs.writeFileSync('af_id.txt', id);
  await go(page, `/acp/cogmap-assessor-forms/${id}/edit`); await sleep(1500);
  await view(page, 'select[aria-label="Who can fill it in"]', 'start'); await page.evaluate(() => window.scrollBy(0, -140)); await sleep(300);
  await page.evaluate(() => { const i = document.querySelector('input[aria-label="Public link"]'); i.value = i.value.replace(/^https:\/\/[^/]+/, 'https://hq.brainfitstudio.com'); }); // dev host -> the real site's address
  await mark(page, 'input[aria-label="Public link"]', { pad: 6 }); await shot(page, `${OUT}/af-4.png`); await clear(page);
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(300); await mark(page, 'select[aria-label="Author"]', { pad: 6 }); await shot(page, `${OUT}/af-5.png`); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
