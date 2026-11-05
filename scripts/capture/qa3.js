// Quiz AI guide, part 3: review screen after a Google Form link import, answer key, save. Master admin on server12 (dev).
const { open, go, mark, clear, shot, clickText } = require('./lib');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qa';
const LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSfm47SGCix--W-jjMN4gt4VQVNrbuoh6VMdlX7-acBDbTyQYA/viewform';
const view = (page, sel, block = 'start') => page.evaluate((sel, block) => { const e = typeof sel === 'string' ? document.querySelector(sel) : sel; e && e.scrollIntoView({ block }); }, sel, block);
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => { window.confirm = () => true; });
  await go(page, '/acp/quizzes');
  await clickText(page, 'a,button', 'Add'); await sleep(400);
  await clickText(page, 'button', 'Import an existing quiz'); await sleep(400);
  await page.type('#qaImpLink', LINK, { delay: 1 });
  await page.click('#qaImpBtn');
  await page.waitForFunction(() => !document.getElementById('qaStepPreview').hidden, { timeout: 240000 });
  await sleep(3000);
  // skipped list open
  await page.evaluate(() => { document.getElementById('qaSkipped').open = true; });
  await view(page, '#qaQuizTitle', 'center'); await page.evaluate(() => document.querySelector('#qaStepPreview').closest('div[style*=overflow], .qa-body, .qa-box')?.scrollTo?.(0,0)); await sleep(300);
  await mark(page, '#qaSkipped', { pad: 6 }); await shot(page, `${OUT}/qi-4.png`); await clear(page);
  console.log('skipped', await page.evaluate(() => document.getElementById('qaSkippedList').innerText.slice(0, 400)));
  await page.evaluate(() => { document.getElementById('qaSkipped').open = false; });
  // first question that has options
  const idx = await page.evaluate(() => [...document.querySelectorAll('.qa-q')].findIndex(q => q.querySelectorAll('.qa-opt').length >= 2));
  console.log('first choice question index', idx);
  await page.evaluate(i => { document.querySelectorAll('.qa-q')[i].setAttribute('data-sel', '1'); }, idx);
  await view(page, '[data-sel]', 'start'); await sleep(300);
  await mark(page, '[data-sel] .qa-need', { pad: 4 }); await shot(page, `${OUT}/qi-5.png`); await clear(page);
  // footer: Next missing answer
  await mark(page, '#qaNextMissing', { pad: 4 }); await shot(page, `${OUT}/qi-6.png`); await clear(page);
  // keep only 3 questions with options, drop the rest
  for (;;) {
    const removed = await page.evaluate(() => {
      const qs = [...document.querySelectorAll('.qa-q')]; let keep = 0;
      for (const q of qs) { if (q.querySelectorAll('.qa-opt').length >= 2 && keep < 3) { keep++; continue; } q.querySelector('[data-act="remove-q"]').click(); return true; }
      return false;
    });
    if (!removed) break; await sleep(60);
  }
  console.log('left', await page.evaluate(() => document.querySelectorAll('.qa-q').length));
  // tick first option of each (single), or first of multiple
  await page.evaluate(() => document.querySelectorAll('.qa-q').forEach(q => { const i = q.querySelector('[data-f="is_answer"]'); i.click(); }));
  await sleep(500);
  await view(page, '#qaQuestions', 'start'); await sleep(300);
  await mark(page, '[data-f="is_answer"]', { pad: 3 }); await shot(page, `${OUT}/qi-7.png`); await clear(page);
  await page.evaluate(() => document.getElementById('qaQuizTitle').scrollIntoView({ block: 'center' }));
  await page.evaluate(() => { const t = document.getElementById('qaQuizTitle'); t.value = 'Scholar PT coordination check (demo)'; t.dispatchEvent(new Event('input', { bubbles: true })); });
  await mark(page, '#qaSave', { pad: 4 }); await shot(page, `${OUT}/qi-8.png`); await clear(page);
  console.log('summary', await page.evaluate(() => document.getElementById('qaSummary').innerText));
  await page.click('#qaSave'); await sleep(3500);
  console.log('url', page.url());
  await shot(page, `${OUT}/qi-9.png`);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
