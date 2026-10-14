// TechGuide > CogMAP Assessor Notes (server12 dev, power_ma_sg, training centre "SG BF Training Centre 2027" only).
// Writes: one demo form (+ a duplicate) and one note for the demo student sgtc27_s30; the forms are its duplicate is removed again at the end by exact id; the demo form is deleted after the videos
// through the app's own Delete button. Never touches form #1 or any other centre; other centres' rows are hidden in every shot.
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TC = 'SG BF Training Centre 2027', STU = 'sgtc27_s30', NAME = 'Demo CogMAP Assessor Notes';
const tag = (page, js, n) => page.evaluate((js, n) => { const el = new Function(js)(); document.querySelectorAll('[data-tg-' + n + ']').forEach(e => e.removeAttribute('data-tg-' + n)); if (el) el.setAttribute('data-tg-' + n, '1'); return !!el; }, js, n);
const onlyTC = page => page.evaluate(tc => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes(tc) && !tr.textContent.includes('No ')) tr.style.display = 'none'; }), TC);
const rowBtn = (page, rowText, label, n) => tag(page, `const tr = [...document.querySelectorAll('tbody tr')].find(t => t.offsetParent && t.textContent.includes(${JSON.stringify(rowText)})); return tr && [...tr.querySelectorAll('a,button')].find(a => a.textContent.trim() === ${JSON.stringify(label)})`, n);
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  page.removeAllListeners('dialog'); page.on('dialog', d => d.accept());
  const ids = [];
  try {
    // 1. the menu entry
    await go(page, '/acp'); await page.evaluate(() => { const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith('Accounts')); b?.click(); });
    await sleep(800); await tag(page, `return [...document.querySelectorAll('.bp-dd.is-open a')].find(a => a.textContent.trim() === 'Assessor Notes')`, 'menu');
    await mark(page, '[data-tg-menu]', { pad: 4 }); await shot(page, `${OUT}/an-1.png`, { clip: { x: 0, y: 0, width: 1440, height: 520 } }); await clear(page);
    // 2. forms tab (before): other centres hidden
    await go(page, '/acp/cogmap-assessor-forms'); await onlyTC(page);
    await tag(page, `return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Forms' && a.closest('.an-tabs, ul, nav, div'))`, 'tab').catch(() => {});
    await tag(page, `return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === '+ New Form')`, 'newform'); await mark(page, '[data-tg-newform]', { pad: 4 });
    await shot(page, `${OUT}/an-2.png`); await clear(page);
    // 3. new form
    await go(page, '/acp/cogmap-assessor-forms/new');
    await page.type('input[name="form[name]"]', NAME, { delay: 10 });
    await page.select('select[name="form[language]"]', await page.evaluate(() => [...document.querySelector('select[name="form[language]"]').options].find(o => o.text === 'English').value));
    await page.evaluate(tc => { const l = [...document.querySelectorAll('.fe-centres label')].find(l => l.textContent.trim() === tc); l.querySelector('input').click(); }, TC);
    await page.evaluate(() => document.querySelector('.an-section').setAttribute('data-tg-top', '1')); await mark(page, '[data-tg-top]', { pad: 4 });
    await shot(page, `${OUT}/an-3.png`); await clear(page);
    // sections and questions
    await page.evaluate(() => { const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }; set(document.querySelector('#fe_sections input[placeholder="Section title"]'), 'Assessment details'); const q = document.querySelector('#fe_sections .fe-q input[placeholder="Question"]'); set(q, 'Type of assessment'); });
    await page.evaluate(() => { const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }; const ta = document.querySelector('#fe_sections .fe-q textarea'); set(ta, 'Initial assessment\nRe-assessment'); });
    const addQ = async (label, type, opts) => { await page.evaluate(() => [...document.querySelectorAll('#fe_sections button')].filter(b => b.textContent.trim() === '+ Question')[0].click()); await sleep(200);
      await page.evaluate((label, type, opts) => { const qs = [...document.querySelectorAll('#fe_sections > .an-section')][0].querySelectorAll(':scope > div > .fe-q'); const q = qs[qs.length - 1]; const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }; set(q.querySelector('input[placeholder="Question"]'), label); const sel = q.querySelector('select'); set(sel, [...sel.options].find(o => o.text === type).value); }, label, type, opts); await sleep(200);
      if (opts) await page.evaluate(opts => { const qs = [...document.querySelectorAll('#fe_sections > .an-section')][0].querySelectorAll(':scope > div > .fe-q'); const ta = qs[qs.length - 1].querySelector('textarea'); ta.value = opts; ta.dispatchEvent(new Event('input', { bubbles: true })); }, opts); };
    console.log('types', await page.evaluate(() => [...document.querySelector('#fe_sections .fe-q select').options].map(o => o.text)));
    await addQ('Assessor name', 'Short text'); await addQ('Date of assessment', 'Date');
    await addQ('How was the child\'s attention?', 'Multiple choice', 'Stayed focused\nNeeded reminders\nEasily distracted');
    await addQ('Other comments', 'Long text');
    await page.evaluate(() => { const o = [...document.querySelectorAll('#fe_sections .fe-q')].find(q => /attention/.test(q.querySelector('input').value)); o.querySelector('input[type=checkbox]').click(); });
    await sleep(500);
    await page.evaluate(() => document.querySelector('#fe_sections').scrollIntoView({ block: 'start' })); await page.evaluate(() => window.scrollBy(0, -90));
    await tag(page, `return document.querySelector('#fe_sections .fe-q')`, 'q1'); await tag(page, `return document.querySelector('#fe_sections .fe-tools')`, 'tools');
    await mark(page, '[data-tg-q1]', { pad: 3 }); await mark(page, '[data-tg-tools]', { pad: 3 }); await shot(page, `${OUT}/an-4.png`); await clear(page);
    await page.evaluate(() => document.querySelector('#fe_form [type=submit]').scrollIntoView({ block: 'center' }));
    await tag(page, `return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '+ Sub-section')`, 'sub'); await tag(page, `return document.querySelector('#fe_form [type=submit]')`, 'save');
    await mark(page, '[data-tg-sub]', { pad: 4 }); await mark(page, '[data-tg-save]', { pad: 4 }); await shot(page, `${OUT}/an-5.png`); await clear(page);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('#fe_form [type=submit]')]);
    await sleep(800); await onlyTC(page);
    const formId = await page.evaluate(n => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td strong')?.textContent.trim() === n); return tr && [...tr.querySelectorAll('a')].map(a => (a.href.match(/cogmap-assessor-forms\/(\d+)/) || [])[1]).find(Boolean); }, NAME); ids.push(formId); console.log('form id', formId);
    // 6. list with Preview / Edit / Duplicate
    await rowBtn(page, NAME, 'Preview', 'pv'); await rowBtn(page, NAME, 'Edit', 'ed'); await rowBtn(page, NAME, 'Duplicate', 'dup');
    await mark(page, '[data-tg-pv]', { pad: 3 }); await mark(page, '[data-tg-ed]', { pad: 3 }); await mark(page, '[data-tg-dup]', { pad: 3 });
    await shot(page, `${OUT}/an-6.png`); await clear(page);
    // 7. preview
    await go(page, `/acp/cogmap-assessor-forms/${formId}/preview`); await shot(page, `${OUT}/an-7.png`, { full: true });
    // 8. duplicate (the copy starts Off)
    await go(page, '/acp/cogmap-assessor-forms'); await rowBtn(page, NAME, 'Duplicate', 'dup');
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.evaluate(() => document.querySelector('[data-tg-dup]').click())]); await sleep(800);
    console.log('after duplicate:', page.url()); await shot(page, `${OUT}/an-8.png`);
    const copyId = (page.url().match(/cogmap-assessor-forms\/(\d+)/) || [])[1]; if (copyId && copyId !== formId) ids.push(copyId); console.log('copy id', copyId);
    // 9. notes list (empty or existing), new note: student search
    await go(page, '/acp/cogmap-assessor-notes'); await onlyTC(page); await tag(page, `return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === '+ New Assessor Note')`, 'nn'); await mark(page, '[data-tg-nn]', { pad: 4 }); await shot(page, `${OUT}/an-9.png`); await clear(page);
    await go(page, '/acp/cogmap-assessor-notes/new'); await page.type('#an_student_search', STU, { delay: 30 }); await sleep(1800);
    await mark(page, '#an_student_results', { pad: 4 }); await shot(page, `${OUT}/an-10.png`); await clear(page);
    await page.evaluate(() => document.querySelector('#an_student_results button')?.click()); await sleep(2500);
    console.log('after pick:', page.url());
    // 11. choose a form or the form itself
    await shot(page, `${OUT}/an-11.png`);
    if (/form_id=/.test(page.url()) === false && await page.evaluate(() => !!document.querySelector('.an-formpick'))) {
      await page.evaluate(n => [...document.querySelectorAll('.an-formpick a')].find(a => a.textContent.includes(n)).click(), NAME); await sleep(2500);
    }
    await page.evaluate(() => { const set = (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
      const f = document.querySelector('form[action*="cogmap-assessor-notes"]'); const radios = f.querySelectorAll('input[type=radio]'); radios[0]?.click();
      const txt = f.querySelector('input[type=text]'); if (txt) set(txt, 'Coach Raymond'); const d = f.querySelector('input[type=date]'); if (d) set(d, '2026-10-14');
      const cb = f.querySelector('input[type=checkbox]'); cb?.click(); const ta = f.querySelector('textarea'); if (ta) set(ta, 'Settled quickly and stayed calm throughout the assessment.'); });
    await sleep(500); await shot(page, `${OUT}/an-12.png`, { full: true });
    await tag(page, `return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save Assessor Note')`, 'sv'); await mark(page, '[data-tg-sv]', { pad: 4 });
    await page.evaluate(() => document.querySelector('[data-tg-sv]').scrollIntoView({ block: 'center' })); await shot(page, `${OUT}/an-13.png`); await clear(page);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('[data-tg-sv]')]); await sleep(800);
    console.log('note url', page.url()); await shot(page, `${OUT}/an-14.png`, { full: true });
    // 15. list with the note
    await go(page, '/acp/cogmap-assessor-notes'); await onlyTC(page); await shot(page, `${OUT}/an-15.png`);
  } finally {
    // remove the demo forms by exact id (the app's own Delete form button)
    // only the duplicate is removed here; the demo form stays until the videos are filmed
    for (const id of ids.slice(1).filter(Boolean)) { try { await go(page, `/acp/cogmap-assessor-forms/${id}/edit`); await page.evaluate(() => [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Delete form')?.click()); await sleep(1500); await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Yes, delete')?.click()); await sleep(2500); // the app's own confirm pop-up console.log('deleted form', id); } catch (e) { console.log('delete failed', id, e.message); } }
    console.log('FORM IDS', ids.join(','));
    await browser.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
