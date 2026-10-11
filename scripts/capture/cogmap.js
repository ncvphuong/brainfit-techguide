// TechGuide > BrainFit HQ > CogMAP Management screenshots (server12, demo centre #132, as power_ma_sg). Read-only:
// presets are only opened (not changed), Merge/Reset are only highlighted (never submitted).
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CLASS_ID = 1407, SID = 57377; // Scholar T1: SmartFit Lower Pri, Sarah Ng (sgtc27_s07, 2 rounds)
async function tagNear(page, text, name, up = 'div') {
  return page.evaluate((text, name, up) => {
    const el = [...document.querySelectorAll('h1,h2,h3,h4,h5,label,.panel-title,b,strong,p,div')].find(e => e.children.length < 3 && e.textContent.trim() === text);
    if (!el) return false; (el.closest(up) || el).setAttribute('data-tg-' + name, '1'); return true;
  }, text, name, up);
}
async function menu(page, group, item) {
  await page.evaluate(() => { const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith('Reports')); b && b.click(); }); await sleep(800);
  await page.evaluate((group, item) => {
    const col = [...document.querySelectorAll('.bp-dd.is-open .bp-dd-cols > *')].find(c => c.textContent.toUpperCase().includes(group.toUpperCase()));
    const a = col && [...col.querySelectorAll('a')].find(a => a.textContent.trim() === item); a && a.setAttribute('data-tg-mi', '1');
    document.querySelector('.bp-nav > .bp-dd.is-open > button')?.setAttribute('data-tg-mb', '1');
  }, group, item);
  await mark(page, '[data-tg-mb]', { pad: 3 }); await mark(page, '[data-tg-mi]', { pad: 3 });
}
(async () => {
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  // ---- Class: levels & questions
  await go(page, `/acp/class_rooms/${CLASS_ID}/show_game`);
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3,h4,h5,.panel-title,label,p,div')].find(e => e.children.length === 0 && e.textContent.trim() === 'CogMap V2 Questions');
    const after = el => h && (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const sel = [...document.querySelectorAll('select')].find(after);
    (sel?.nextElementSibling?.classList.contains('select2') ? sel.nextElementSibling : sel)?.setAttribute('data-tg-v2', '1');
    if (sel) sel.setAttribute('data-tg-v2sel', '1');
    const cb = [...document.querySelectorAll('input[type=checkbox]')].find(after);
    let grid = cb; while (grid && grid.parentElement && grid.parentElement.querySelectorAll('input[type=checkbox]').length < 20) grid = grid.parentElement;
    grid = grid?.parentElement; grid?.setAttribute('data-tg-v2grid', '1');
    const ctl = [...document.querySelectorAll('label,b,strong,p,div,td')].find(e => e.children.length === 0 && /COGMAP VERSION 2 CONTROL/i.test(e.textContent.trim()));
    (ctl?.closest('.row, .form-group, tr') || ctl)?.setAttribute('data-tg-ctl', '1');
  });
  await mark(page, '[data-tg-v2]', { pad: 4 }); await mark(page, '[data-tg-v2grid]', { pad: 4 }); await mark(page, '[data-tg-ctl]', { pad: 4 });
  await shot(page, `${OUT}/cogmap-class-1.png`); await clear(page);
  await page.evaluate(() => { const s = document.querySelector('[data-tg-v2sel]'); s && $(s).select2('open'); });
  await sleep(700); await shot(page, `${OUT}/cogmap-class-2.png`);
  await page.keyboard.press('Escape'); await sleep(300);
  // ---- Student: levels & questions + reset link
  await go(page, `/acp/students/${SID}/show_game`);
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3,h4,h5,.panel-title,label,p,div')].find(e => e.children.length === 0 && e.textContent.trim() === 'CogMap V2 Questions');
    const after = el => h && (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
    const sel = [...document.querySelectorAll('select')].find(after);
    (sel?.nextElementSibling?.classList.contains('select2') ? sel.nextElementSibling : sel)?.setAttribute('data-tg-v2', '1');
    if (sel) sel.setAttribute('data-tg-v2sel', '1');
    const cb = [...document.querySelectorAll('input[type=checkbox]')].find(after);
    let grid = cb; while (grid && grid.parentElement && grid.parentElement.querySelectorAll('input[type=checkbox]').length < 20) grid = grid.parentElement;
    grid = grid?.parentElement; grid?.setAttribute('data-tg-v2grid', '1');
    const ctl = [...document.querySelectorAll('label,b,strong,p,div,td')].find(e => e.children.length === 0 && /COGMAP VERSION 2 CONTROL/i.test(e.textContent.trim()));
    (ctl?.closest('.row, .form-group, tr') || ctl)?.setAttribute('data-tg-ctl', '1');
    [...document.querySelectorAll('a')].find(a => /reset_cog_map$/.test(a.getAttribute('href') || ''))?.setAttribute('data-tg-reset', '1');
  });
  await mark(page, '[data-tg-v2]', { pad: 4 }); await mark(page, '[data-tg-v2grid]', { pad: 4 }); await mark(page, '[data-tg-ctl]', { pad: 4 });
  await shot(page, `${OUT}/cogmap-student-1.png`); await clear(page);
  // ---- View results
  await go(page, `/acp/students/${SID}`);
  await mark(page, '#bp-sd-cogmap', { pad: 4 });
  await page.evaluate(() => document.querySelector('#bp-sd-cogmap a.btn')?.setAttribute('data-tg-open', '1')); await mark(page, '[data-tg-open]', { pad: 3 });
  await shot(page, `${OUT}/cogmap-results-1.png`); await clear(page);
  await go(page, `/acp/students/${SID}/cogmap_metter_chart_v2?round=2`);
  await page.evaluate(() => { const f = document.querySelector('.panel-body form, form') || document.querySelector('select')?.closest('div'); f?.setAttribute('data-tg-ctrl', '1'); [...document.querySelectorAll('a,button')].find(b => b.textContent.trim() === 'Print')?.setAttribute('data-tg-print', '1'); });
  await mark(page, '[data-tg-ctrl]', { pad: 4 }); await mark(page, '[data-tg-print]', { pad: 4 });
  await shot(page, `${OUT}/cogmap-results-2.png`, { clip: { x: 0, y: 0, width: 1600, height: 260 } }); await clear(page);
  for (const [txt, file] of [['Cognitive Skills Summary', 'cogmap-results-3'], ['Motor Skills Results', 'cogmap-results-4']]) {
    await page.evaluate(t => { const el = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === t); el && el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -40); }, txt); await sleep(800);
    await shot(page, `${OUT}/${file}.png`);
  }
  // ---- Standard Score (search + print)
  await go(page, '/acp/cog_maps_v2/standard_score');
  await menu(page, 'CogMaps V2', 'Standard Score'); await shot(page, `${OUT}/cogmap-print-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 460 } }); await clear(page); await page.mouse.click(1500, 850);
  await go(page, '/acp/cog_maps_v2/standard_score?center_id=132&name=Sarah+Ng');
  await page.evaluate(() => { document.querySelector('input[name="name"]')?.closest('div')?.setAttribute('data-tg-q', '1'); const a = [...document.querySelectorAll('tbody a')].find(a => a.textContent.trim() === 'Sarah Ng'); a?.setAttribute('data-tg-stu', '1'); });
  await mark(page, '[data-tg-q]', { pad: 3 }); await mark(page, '[data-tg-stu]', { pad: 4 });
  await shot(page, `${OUT}/cogmap-print-2.png`); await clear(page);
  const href = await page.evaluate(() => document.querySelector('[data-tg-stu]')?.getAttribute('href'));
  if (href) {
    await go(page, href);
    await page.evaluate(() => { [...document.querySelectorAll('select')].slice(0, 2).forEach(s => (s.closest('.form-group, .col-md-2, .col-md-3, div') || s).setAttribute('data-tg-sel', '1')); [...document.querySelectorAll('a,button,input[type=submit]')].filter(b => /^(Show|Print)$/.test((b.textContent || b.value || '').trim())).forEach(b => b.setAttribute('data-tg-btn', '1')); });
    await mark(page, '[data-tg-sel]', { pad: 3 }); await mark(page, '[data-tg-btn]', { pad: 4 });
    await shot(page, `${OUT}/cogmap-print-3.png`); await clear(page);
  }
  // ---- Merge Score (highlight only)
  await go(page, '/acp/cog_maps_v2/merge-score');
  await menu(page, 'CogMaps V2', 'Merge Score'); await shot(page, `${OUT}/cogmap-merge-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 460 } }); await clear(page); await page.mouse.click(1500, 850);
  await go(page, '/acp/cog_maps_v2/merge-score?center_id=132&name=Sarah+Ng');
  await page.evaluate(() => [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Merge questions')?.setAttribute('data-tg-mq', '1'));
  await mark(page, '[data-tg-mq]', { pad: 4 }); await shot(page, `${OUT}/cogmap-merge-2.png`); await clear(page);
  const mq = await page.evaluate(() => document.querySelector('[data-tg-mq]')?.getAttribute('href'));
  if (mq) {
    await go(page, mq);
    await page.evaluate(() => { document.querySelectorAll('select.select-session').forEach(s => (s.closest('.col-md-4, .col-sm-4, div') || s).setAttribute('data-tg-r', '1')); document.querySelectorAll('button.submit').forEach(b => b.setAttribute('data-tg-save', '1')); });
    await mark(page, '[data-tg-r]', { pad: 3 }); await mark(page, '[data-tg-save]', { pad: 4 });
    await shot(page, `${OUT}/cogmap-merge-3.png`, { full: true }); await clear(page);
  }
  // ---- Reset (highlight only)
  { // the Reset link only shows for Super Admin / Master Licensee: this one shot is the group's ML
    const ml = await open('ml', { width: 1600, height: 900 });
    await go(ml.page, `/acp/students/${SID}/show_game`);
    await ml.page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => /reset_cog_map$/.test(a.getAttribute('href') || '')); a?.closest('.form-group')?.setAttribute('data-tg-reset', '1'); });
    await mark(ml.page, '[data-tg-reset]', { pad: 4 }); await shot(ml.page, `${OUT}/cogmap-reset-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 620 } });
    await ml.browser.close();
  }
  await go(page, `/acp/students/${SID}/reset_cog_map`);
  await page.evaluate(() => { [...document.querySelectorAll('a,button')].filter(b => /^Reset( All CogMap Progress)?$/.test(b.textContent.trim())).forEach(b => b.setAttribute('data-tg-rs', '1')); });
  await mark(page, '[data-tg-rs]', { pad: 3 }); await shot(page, `${OUT}/cogmap-reset-2.png`, { clip: { x: 0, y: 0, width: 1600, height: 560 } }); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
