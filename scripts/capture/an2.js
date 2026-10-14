// Assessor Notes guide, retakes: the Forms list with the demo form only (Preview / Edit / Duplicate marked) and the preview page.
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2], TC = 'SG BF Training Centre 2027', NAME = 'Demo CogMAP Assessor Notes';
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/cogmap-assessor-forms');
  await page.evaluate(tc => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes(tc)) tr.style.display = 'none'; }), TC);
  const id = await page.evaluate(n => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td strong')?.textContent.trim() === n); tr.querySelectorAll('a').forEach(a => a.setAttribute('data-tg-b', '1')); return [...tr.querySelectorAll('a')].map(a => (a.href.match(/cogmap-assessor-forms\/(\d+)/) || [])[1]).find(Boolean); }, NAME);
  console.log('demo form id', id);
  await mark(page, '[data-tg-b]', { pad: 3 }); await shot(page, `${OUT}/an-6.png`); await clear(page);
  await go(page, `/acp/cogmap-assessor-forms/${id}/preview`); await shot(page, `${OUT}/an-7.png`, { full: true });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
