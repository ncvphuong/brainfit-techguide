const { open, go, mark, clear, shot } = require('./lib');
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes/157/edit');
  await page.evaluate(() => { const c = [...document.querySelectorAll('input[type=checkbox]')].find(e => (e.closest('label,div')||{}).textContent.includes('Timed quiz')); const row = c.closest('.form-group') || c.closest('div'); let n = c; while (n.parentElement && !n.parentElement.querySelector('input[name*=title], #quiz_title')) n = n.parentElement; n.style.display = 'none'; });
  await shot(page, 'out/qa/qi-9.png');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
