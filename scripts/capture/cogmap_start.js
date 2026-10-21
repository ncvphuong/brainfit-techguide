// TechGuide > CogMAP Management > "Student CogMAP" + "Class Start CogMAP" screenshots (server12, demo centre #132, as power_ma_sg).
// Needs the demo data from server/guide_cogmap_start.rb (MODE=seed) - the flows really start CogMAP for the Demo CogMAP students.
// usage: node cogmap_start.js <out dir> <part: student | centre | class>   (re-seed between the centre and the class part)
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; const PART = process.argv[3]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const IDS = JSON.parse(require('fs').readFileSync(__dirname + '/cs_ids.json', 'utf8')); // from server/guide_cogmap_start.rb
const NOSETUP = IDS.nosetup, ACTIVE = IDS.active, WITHRESULT = 57377, CLASS_A = IDS.classA, CENTRE = 132;
const VW = 1500, VH = 900;
async function tag(page, sel, name) { await page.evaluate((sel, name) => { const e = document.querySelector(sel); e && e.setAttribute('data-tg-' + name, '1'); return !!e; }, sel, name); }
async function ctlRow(page) {
  await page.evaluate(() => {
    const l = [...document.querySelectorAll('label,b,strong,p,div,td,span')].find(e => e.children.length === 0 && /COGMAP VERSION 2 CONTROL/i.test(e.textContent.trim()));
    const row = l && (l.closest('.row, .form-group, tr') || l.parentElement); row && row.setAttribute('data-tg-ctl', '1');
    const h = [...document.querySelectorAll('.panel-title,h1,h2,h3,h4,h5')].find(e => e.textContent.trim() === 'CogMAP V2 Questions');
    h && h.scrollIntoView({ block: 'start' }); window.scrollBy(0, -330);
  });
}
async function modal(page) { return page.evaluate(() => { const m = document.querySelector('#cm2s .cm2s-card, #cm2s [class*=card], #cm2s'); const r = m.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }); }
async function shotModal(page, file) { await sleep(400); const el = await page.$('#cm2s .cm2s-dialog, #cm2s .cm2s-panel, #cm2s .cm2s-card'); if (el) await el.screenshot({ path: file }); else await shot(page, file); console.log('modal', file); }
async function clickBtn(page, sel) { await page.evaluate(s => document.querySelector(s).click(), sel); await sleep(700); }
async function pickCustomBasic(page, ticks) {
  await page.evaluate(() => document.querySelector('[data-course="basic"]').click()); await sleep(300);
  await page.evaluate(() => document.querySelector('input[name="cm2s-preset"][value="basic_custom"]').click()); await sleep(300);
}
async function tickQs(page, nums) { for (const n of nums) await page.evaluate(n => document.querySelector(`.cm2s-q input[value="${n}"]`).click(), n); await sleep(300); }

async function student(page) {
  await go(page, `/acp/students/${NOSETUP}/show_game`); await ctlRow(page); await mark(page, '[data-tg-ctl]', { pad: 4 });
  await shot(page, `${OUT}/cogmap-start-student-1.png`); await clear(page);
  // preset select (select2)
  await page.evaluate(() => { const h = [...document.querySelectorAll('.panel-title')].find(e => e.textContent.trim() === 'CogMAP V2 Questions'); const after = el => h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING; const s = [...document.querySelectorAll('select')].find(after); s.setAttribute('data-tg-sel', '1'); $(s).select2('open'); });
  await sleep(700); await shot(page, `${OUT}/cogmap-start-student-2.png`);
  await page.keyboard.press('Escape'); await sleep(300);
  // pick Custom Basic, tick two questions -> Activate is enabled
  await page.evaluate(() => { const s = document.querySelector('[data-tg-sel]'); s.selectedIndex = [...s.options].findIndex(o => o.textContent.trim() === 'Custom Basic'); $(s).trigger('change'); });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}); await sleep(1200);
  console.log('after preset', page.url());
  for (const n of [1, 2]) { await page.evaluate(n => document.querySelectorAll('input.cm-level-v2')[n - 1].click(), n); await sleep(900); }
  await page.reload({ waitUntil: 'networkidle2' }); await sleep(600);
  await ctlRow(page); await mark(page, '[data-tg-ctl]', { pad: 4 }); await shot(page, `${OUT}/cogmap-start-student-3.png`); await clear(page);
  // an active student: keep at least one question
  await go(page, `/acp/students/${ACTIVE}/show_game`); await ctlRow(page);
  await page.evaluate(() => { window.__v2 = [...document.querySelectorAll('input.cm-level-v2')]; });
  await shot(page, `${OUT}/cogmap-start-student-4.png`);
  for (const i of [2, 1, 0]) { await page.evaluate(i => window.__v2[i].click(), i); await sleep(1200); }
  await shot(page, `${OUT}/cogmap-start-student-5.png`);
  // Show Latest CogMAP
  await go(page, `/acp/students/${WITHRESULT}/show_game`); await ctlRow(page);
  await page.evaluate(() => [...document.querySelectorAll('a')].find(a => /Show Latest CogMAP/.test(a.textContent))?.setAttribute('data-tg-latest', '1'));
  await mark(page, '[data-tg-latest]', { pad: 3 }); await shot(page, `${OUT}/cogmap-start-student-6.png`); await clear(page);
}
// ---- class / centre: the Start CogMAP modal
async function startBtn(page) { await page.evaluate(() => document.querySelector('[data-cm2s-open]').setAttribute('data-tg-open', '1')); }
async function delayStarts(page, ms) { // slow each per-student POST so the one-by-one animation can be captured (a real run takes a few seconds)
  await page.setRequestInterception(true);
  page.on('request', r => { if (r.method() === 'POST' && /cogmap_v2_start_student/.test(r.url())) setTimeout(() => r.continue().catch(() => {}), ms); else r.continue().catch(() => {}); });
}
async function flow(page, kind, f) {
  const P = kind === 'class' ? 'cogmap-start-class' : 'cogmap-start-centre';
  await go(page, kind === 'class' ? `/acp/class_rooms/${IDS.classA}/show_game` : `/acp/centers/${CENTRE}/show_game`);
  await page.evaluate(() => { const b = document.querySelector('[data-cm2s-open]'); b.scrollIntoView({ block: 'center' }); }); await sleep(300);
  await startBtn(page); await mark(page, '[data-tg-open]', { pad: 4 }); await shot(page, `${OUT}/${P}-1.png`); await clear(page);
  await clickBtn(page, '[data-cm2s-open]'); await sleep(900);
  let n = 2;
  if (kind === 'centre') {
    for (const nm of ['Demo CogMAP Class A', 'Demo CogMAP Class B']) { // the list re-renders on each tick: click one at a time
      await page.evaluate(nm => { const c = [...document.querySelectorAll('#cm2s [data-class]')].find(c => c.closest('label').textContent.includes(nm)); if (!c.checked) c.click(); }, nm); await sleep(400);
    }
    await sleep(500); await shotModal(page, `${OUT}/${P}-${n++}.png`); await clickBtn(page, '[data-cm2s-next]');
  }
  await page.evaluate(() => document.querySelector('[data-course="basic"]').click()); await sleep(300);
  await page.evaluate(v => document.querySelector(`input[name="cm2s-preset"][value="${v}"]`).click(), f.preset); await sleep(400);
  await shotModal(page, `${OUT}/${P}-${n++}.png`); await clickBtn(page, '[data-cm2s-next]');
  if (f.tick) await tickQs(page, f.tick);
  await shotModal(page, `${OUT}/${P}-${n++}.png`); await clickBtn(page, '[data-cm2s-next]'); await sleep(1500);
  await shotModal(page, `${OUT}/${P}-${n++}.png`);
  await delayStarts(page, 2200);
  await page.evaluate(() => document.querySelector('[data-cm2s-next]').click());
  await sleep(3700); await shotModal(page, `${OUT}/${P}-${n++}.png`);   // running, second student mid-way
  await page.waitForFunction(() => document.querySelector('[data-cm2s-next]').textContent.trim() === 'Done', { timeout: 60000 }); await sleep(500);
  await shotModal(page, `${OUT}/${P}-${n++}.png`);
}
async function cls(page) { await flow(page, 'class', { preset: 'basic_custom', tick: [1, 2, 3] }); }
async function centre(page) { await flow(page, 'centre', { preset: 'basic_4_6_cognitive_map' }); }
module.exports = { student };
(async () => {
  const { browser, page } = await open('ma', { width: VW, height: VH });
  page.on('console', m => { if (/error/i.test(m.type())) console.log('console', m.text().slice(0, 120)); });
  if (PART === 'student') await student(page);
  if (PART === 'centre') await centre(page);
  if (PART === 'class') await cls(page);
  await browser.close();
})();
