// Timed quiz guide cleanup (dev only): untick Timed on QA quiz 156.
const { open, go, clickText } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes/156/edit');
  await page.evaluate(() => { const c = document.getElementById('quiz-timed'); if (c.checked) c.click(); });
  await sleep(300); await clickText(page, 'button', 'Save'); await sleep(3000);
  await go(page, '/acp/quizzes/156/edit');
  console.log('timed now', await page.evaluate(() => document.getElementById('quiz-timed').checked));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
