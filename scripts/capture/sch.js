// TechGuide > BrainFit HQ > Scheduling screenshots: dev scheduling (server12), training centre only, as power_ma_sg.
// Read-only: forms are filled and pop-ups opened, but Save / Create / Confirm / Approve are never clicked.
const { openSch, goSch } = require('./schlib'); const { mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const tagText = (page, sel, re, name, last = false) => page.evaluate((sel, src, name, last) => { const r = new RegExp(src); const els = [...document.querySelectorAll(sel)].filter(e => e.offsetParent && r.test(e.textContent.trim().replace(/\s+/g, ' '))); const e = last ? els[els.length - 1] : els[0]; if (e) { e.setAttribute('data-tg-' + name, '1'); return true; } return false; }, sel, re.source, name, last);
const click = (page, sel) => page.evaluate(s => { const e = document.querySelector(s); e && e.click(); return !!e; }, sel);
// Screenshots show the training centre only: hide result cards that belong to any other centre.
const onlyTraining = page => page.evaluate(() => [...document.querySelectorAll('button, [onclick], tr, li, div')].forEach(e => {
  const t = e.textContent; if (t.length > 600 || !/(SG|MY|ID|PH|TH|VN|CN|TR|AU) (BrainFit|BF) /.test(t) || /Training Centre 2027/.test(t)) return;
  if (e.children.length && [...e.children].some(c => /Training Centre 2027/.test(c.textContent))) return;
  e.style.display = 'none'; }));
(async () => {
  const { browser, page } = await openSch({ width: 1600, height: 900 });
  // ---- Holiday templates
  await goSch(page, '/classrooms/config/holiday-templates/');
  await tagText(page, 'a,button', /Create Template/, 'new'); await page.evaluate(() => document.querySelector('a[href="/classrooms/config/holiday-templates/11/edit/"]')?.setAttribute('data-tg-edit', '1'));
  await mark(page, '[data-tg-new]', { pad: 4 }); await mark(page, '[data-tg-edit]', { pad: 4 }); await shot(page, `${OUT}/sch-holiday-1.png`); await clear(page);
  const editHref = (await page.evaluate(() => document.querySelector('[data-tg-edit]')?.getAttribute('href'))) || '/classrooms/config/holiday-templates/11/edit/';
  await goSch(page, '/classrooms/config/holiday-templates/create/'); await shot(page, `${OUT}/sch-holiday-2.png`, { full: true });
  if (editHref) {
    await goSch(page, editHref);
    await tagText(page, 'a,button', /Add Holiday/, 'add'); await mark(page, '[data-tg-add]', { pad: 4 }); await shot(page, `${OUT}/sch-holiday-3.png`, { full: true }); await clear(page);
    await click(page, '[data-tg-add]'); await sleep(1200); await shot(page, `${OUT}/sch-holiday-4.png`);
  }
  // ---- Calendar / schedule
  await goSch(page, '/classrooms/calendar/');
  for (let i = 0; i < 3; i++) { await click(page, '.fc-next-button'); await sleep(1200); }
  await sleep(1500); await shot(page, `${OUT}/sch-calendar-1.png`, { full: true });
  await click(page, '.fc-timeGridWeek-button'); await sleep(800); await click(page, '.fc-next-button'); await sleep(2000); await shot(page, `${OUT}/sch-calendar-2.png`, { full: true });
  await goSch(page, '/classrooms/class-group/1195/'); await shot(page, `${OUT}/sch-calendar-3.png`, { full: true });
  // ---- Create a class group (form filled, not submitted)
  await goSch(page, '/classrooms/classes/');
  await page.evaluate(() => { const tr = [...document.querySelectorAll('tr')].find(t => t.textContent.includes('Scholar T1: SmartFit Lower Pri')); tr?.querySelector('a[href$="/create/"]')?.setAttribute('data-tg-cr', '1'); });
  await mark(page, '[data-tg-cr]', { pad: 4 }); await shot(page, `${OUT}/sch-group-1.png`); await clear(page);
  await goSch(page, '/classrooms/class-groups/1407/create/');
  await page.type('input[name=name]', 'Saturday 10:00 AM - 11:50 AM');
  await page.evaluate(() => { const set = (n, v) => { const e = document.querySelector(`[name="${n}"]`); if (e) { e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); } };
    set('start_date', '2027-01-04'); set('end_date', '2027-04-18'); set('max_participants', '6'); set('expanded_capacity', '8'); set('max_change_requests', '5');
    set('template_day[]', 'Saturday'); set('template_start_hour[]', '10'); set('template_start_minute[]', '00'); set('template_end_hour[]', '11'); set('template_end_minute[]', '50');
    document.querySelectorAll('input[name=trainer_ids], input[name=student_ids]').forEach(c => { c.checked = true; });
    [...document.querySelectorAll('button[type=submit]')].find(b => /Create Class Group/.test(b.textContent))?.setAttribute('data-tg-sub', '1'); });
  await mark(page, '[data-tg-sub]', { pad: 4 }); await shot(page, `${OUT}/sch-group-2.png`, { full: true }); await clear(page);
  await goSch(page, '/classrooms/class-groups/?term=7&class=1407'); await onlyTraining(page); await shot(page, `${OUT}/sch-group-3.png`);
  // ---- Book a CogMAP assessment (up to Confirm, not clicked)
  const btn = async re => page.evaluate(src => { const r = new RegExp(src); const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && r.test(b.textContent.trim().replace(/\s+/g, ' '))); b && b.click(); return !!b; }, re.source);
  await goSch(page, '/classrooms/booking/');
  await page.evaluate(() => { const card = [...document.querySelectorAll('div')].find(d => d.querySelector('h3,h4') && /Cogmap Assessment/.test(d.querySelector('h3,h4').textContent) && d.querySelector('button,a')); card?.setAttribute('data-tg-cm', '1'); });
  await mark(page, '[data-tg-cm]', { pad: 4 }); await shot(page, `${OUT}/sch-cogmap-1.png`); await clear(page);
  await page.evaluate(() => [...document.querySelector('[data-tg-cm]').querySelectorAll('button,a')].find(x => /Select/.test(x.textContent)).click()); await sleep(1200);
  await shot(page, `${OUT}/sch-cogmap-2.png`); await btn(/^Continue/); await sleep(1500);
  await page.type('#parent-search-input', 'sgtc27.p04'); await btn(/^Search$/); await sleep(3000);
  await tagText(page, 'button', /^Select$/, 'sel'); await mark(page, '[data-tg-sel]', { pad: 4 }); await shot(page, `${OUT}/sch-cogmap-3.png`); await clear(page);
  await btn(/^Select$/); await sleep(1500); await btn(/^Continue/); await sleep(2500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find(b => { if (!b.offsetParent || !/Select/.test(b.textContent)) return false; let e = b; for (let i = 0; i < 5; i++) { e = e.parentElement; if (e.textContent.includes('Sarah Ng')) return !e.textContent.includes('Faith Ng'); } return false; }); b?.setAttribute('data-tg-st', '1'); });
  await mark(page, '[data-tg-st]', { pad: 4 }); await shot(page, `${OUT}/sch-cogmap-4.png`, { clip: { x: 0, y: 0, width: 1600, height: 1050 } }); await clear(page);
  await click(page, '[data-tg-st]'); await sleep(1500); await btn(/^Continue/); await sleep(2500);
  await btn(/Create One-off Adhoc Session/); await sleep(1200); await shot(page, `${OUT}/sch-cogmap-7.png`, { full: true });
  await btn(/Use Existing Class Session/); await sleep(1000);
  await page.type('#session-group-search-input', 'Monday 4'); await btn(/^Search$/); await sleep(3000); await onlyTraining(page);
  await btn(/^Monday 4:00 PM - 5:50 PM Scholar T1: SmartFit Lower/); await sleep(2500); await onlyTraining(page);
  await shot(page, `${OUT}/sch-cogmap-5.png`, { full: true });
  await page.evaluate(() => { const e = [...document.querySelectorAll('[onclick^="selectSession"]')].find(e => /2027-01-11|Jan 11, 2027/.test(e.textContent)); e && e.click(); }); await sleep(1500);
  await btn(/^Continue/); await sleep(2500);
  await tagText(page, 'button', /Confirm/, 'cf', true); await mark(page, '[data-tg-cf]', { pad: 4 }); await shot(page, `${OUT}/sch-cogmap-6.png`, { full: true }); await clear(page);
  // ---- Unrestricted session change (up to Approve, not clicked)
  await goSch(page, '/classrooms/requests/new-2/');
  await page.type('#student-search-input', 'Sarah Ng'); await btn(/^Search$/); await sleep(3000); await onlyTraining(page);
  await shot(page, `${OUT}/sch-change-1.png`);
  await page.evaluate(() => { const e = [...document.querySelectorAll('button, [onclick]')].filter(b => b.offsetParent && /Sarah Ng/.test(b.textContent)).pop(); e?.click(); }); await sleep(2500);
  await btn(/^Monday 4:00 PM/); await sleep(2500); await shot(page, `${OUT}/sch-change-2.png`, { full: true });
  await btn(/2027-01-11/); await sleep(2500);
  await page.type('#to-group-search-input', 'Sunday 10'); await btn(/^Search$/); await sleep(3000); await onlyTraining(page);
  await shot(page, `${OUT}/sch-change-3.png`, { full: true });
  await btn(/^Sunday 10:00 AM - 11:50 AM Scholar T2: SmartFit Lower/); await sleep(2500); await onlyTraining(page);
  await btn(/2027-05-09/); await sleep(2500);
  await tagText(page, 'button', /Approve and Execute Change/, 'ap'); await mark(page, '[data-tg-ap]', { pad: 4 }); await shot(page, `${OUT}/sch-change-4.png`, { full: true }); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
