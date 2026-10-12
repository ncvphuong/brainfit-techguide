// TechGuide > BrainFit HQ > Training Centre page: what the practice centre contains (server12 #132, as power_ma_sg).
const { open, go, mark, clear, shot } = require('./lib');
const { openSch, goSch } = require('./schlib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const onlyTC = page => page.evaluate(() => document.querySelectorAll('tbody tr').forEach(tr => { if (!/Training Centre 2027|sgtc27/.test(tr.textContent)) tr.style.display = 'none'; }));
(async () => {
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  await go(page, '/acp/centers?name=Training+Centre+2027'); await onlyTC(page); await shot(page, `${OUT}/tc-centre.png`, { clip: { x: 0, y: 0, width: 1600, height: 520 } });
  await go(page, '/acp/class_rooms?center_id=132'); await shot(page, `${OUT}/tc-classes.png`, { full: true });
  await go(page, '/acp/students?center_id=132'); await shot(page, `${OUT}/tc-students.png`);
  await go(page, '/acp/trainers?center_id=132'); await onlyTC(page); await shot(page, `${OUT}/tc-trainers.png`);
  await go(page, '/acp/customers?center_id=132'); await onlyTC(page); await shot(page, `${OUT}/tc-parents.png`);
  await go(page, '/acp/class_rooms/1407'); await shot(page, `${OUT}/tc-class.png`);
  const sid = await page.evaluate(() => { const a = [...document.querySelectorAll('a[href]')].find(a => /\/acp\/(students|trainers)\/\d+/.test(a.getAttribute('href')) && /Sarah Ng/.test(a.closest('tr')?.textContent || '')); return a ? a.getAttribute('href') : null; });
  await go(page, '/acp/students?center_id=132&name=sgtc27_s07');
  const sp = await page.evaluate(() => [...document.querySelectorAll('tbody a[href]')].map(a => a.getAttribute('href')).find(h => /^\/acp\/students\/\d+$/.test(h)));
  if (sp) { await go(page, sp); await shot(page, `${OUT}/tc-student.png`); }
  await browser.close();
  const s = await openSch({ width: 1600, height: 900 });
  await goSch(s.page, '/classrooms/class-groups/?term=7'); await s.page.evaluate(() => document.querySelectorAll('tbody tr').forEach(tr => { if (!/Training Centre 2027/.test(tr.textContent)) tr.style.display = 'none'; })); await shot(s.page, `${OUT}/tc-groups.png`);
  await s.browser.close();
})().catch(e => { console.error(e); process.exit(1); });
