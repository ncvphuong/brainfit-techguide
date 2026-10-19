// Student Journey screenshots (server12 / training centre #132 only, as the centre admin sgtc27_ca01; read-only: only the
// filter form is submitted, which is a GET). Demo data comes from server/guide_journey.rb (MODE=seed). Usage: node journey.js out/journey
const { open, go, mark, clear, shot } = require('./lib');
const dir = process.argv[2] || 'out/journey';
require('fs').mkdirSync(dir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rect = (page, sel, idx = 0) => page.evaluate((sel, idx) => { const e = document.querySelectorAll(sel)[idx]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; }, sel, idx);
const clip = (r, pad = 10) => ({ x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + pad * 2, height: r.height + pad * 2 });
(async () => {
  const { browser, page } = await open('ca', { width: 1440, height: 900 });
  await go(page, '/acp?acp_theme=brainpal');

  // 1. menu: Students > Student Journey (right under Trial Class & CogMAP)
  const btn = await page.evaluateHandle(() => [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(b => b.textContent.trim().startsWith('Students')));
  await btn.asElement().click(); await sleep(700);
  await page.evaluate(() => { const a = [...document.querySelectorAll('.bp-dd.is-open a')].find(a => a.textContent.trim() === 'Student Journey'); if (a) a.setAttribute('data-sj', '1'); });
  await mark(page, '[data-sj="1"]', { pad: 3 });
  await shot(page, `${dir}/sj-menu.png`, { clip: { x: 0, y: 0, width: 1000, height: 360 } });
  await clear(page);

  // 2. open the page
  await go(page, '/acp/students/journey'); await sleep(2500);
  await page.evaluate(() => scrollTo(0, 0));
  const head = await rect(page, '.bp-pagehead');
  const form = await rect(page, 'form[action$="/students/journey"]');
  await mark(page, 'form[action$="/students/journey"]', { pad: 5 });
  await shot(page, `${dir}/sj-filters.png`, { clip: { x: 0, y: 70, width: 1260, height: form.y + form.height + 60 - 70 } });
  await clear(page);
  const kp = await rect(page, '.sj-kpis');
  await mark(page, '.sj-kpis', { pad: 5 });
  await shot(page, `${dir}/sj-kpis.png`, { clip: clip(kp, 14) });
  await clear(page);

  // 3. flow chart, with a tooltip on a band
  const flow = await rect(page, '.sj-card', 0);
  await page.evaluate(y => scrollTo(0, y - 80), flow.y);
  await sleep(500);
  const fr = await rect(page, '.sj-card', 0);
  await page.mouse.move(fr.x + fr.width * 0.5 - 0, fr.y - (await page.evaluate(() => scrollY)) + fr.height * 0.28); await sleep(900);
  await shot(page, `${dir}/sj-flow.png`, { clip: clip(await rect(page, '.sj-card', 0), 10) });
  await page.mouse.move(5, 5);

  // 4. by month, tooltip on a bar
  const mo = await rect(page, '.sj-card', 1);
  await page.evaluate(y => scrollTo(0, y - 80), mo.y); await sleep(500);
  const mr = await rect(page, '.sj-card', 1); const sy = await page.evaluate(() => scrollY);
  await page.mouse.move(mr.x + mr.width * 0.68, mr.y - sy + mr.height * 0.55); await sleep(900);
  await shot(page, `${dir}/sj-month.png`, { clip: clip(await rect(page, '.sj-card', 1), 10) });
  await page.mouse.move(5, 5);

  // 5. the two lists
  const cards = await page.evaluate(() => [...document.querySelectorAll('.sj-card')].map(c => c.textContent.trim().slice(0, 30)));
  console.log('cards', JSON.stringify(cards));
  const lw = await rect(page, '.sj-card', 2);
  const lr = await rect(page, '.sj-card', 3);
  await page.evaluate(y => scrollTo(0, y - 60), lw.y); await sleep(500);
  const both = { x: Math.min(lw.x, lr.x), y: Math.min(lw.y, lr.y), width: Math.max(lw.x + lw.width, lr.x + lr.width) - Math.min(lw.x, lr.x), height: Math.max(lw.height, lr.height) };
  await shot(page, `${dir}/sj-lists.png`, { clip: clip(both, 10) });

  // 6. filter: started as Trial
  await page.evaluate(() => scrollTo(0, 0));
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), (async () => { await page.select('select[name="start_type"]', 'trial_class'); await page.evaluate(() => document.querySelector('form[action$="/students/journey"]').submit()); })()]);
  await sleep(2500);
  const tf = await rect(page, '.sj-card', 0);
  await page.evaluate(y => scrollTo(0, y - 80), tf.y); await sleep(400);
  await shot(page, `${dir}/sj-trial.png`, { clip: clip(await rect(page, '.sj-card', 0), 10) });
  const kt = await rect(page, '.sj-kpis'); console.log('trial kpis', JSON.stringify(await page.evaluate(() => document.querySelector('.sj-kpis').innerText.replace(/\n+/g, ' | '))));

  // 7. Activity Log on a student page (Trial -> CogMAP -> Enrolled demo student)
  await go(page, '/acp/students/journey'); await sleep(2000);
  const href = await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Demo Journey 02'); return a && a.getAttribute('href'); });
  console.log('student link', href);
  await go(page, href); await sleep(1500);
  const box = await page.evaluate(() => {
    const h = [...document.querySelectorAll('.panel-title, h1, h2, h3, h4')].find(e => e.textContent.trim() === 'Activity Log'); if (!h) return null;
    const top = (h.closest('.panel-heading') || h).getBoundingClientRect(); const panel = (h.closest('.panel-heading') || h).parentElement.getBoundingClientRect();
    return { x: 0, y: top.top + scrollY - 10, width: 1440, height: 270 };
  });
  console.log('activity log box', JSON.stringify(box));
  if (!box) throw new Error('no Activity Log panel');
  await page.evaluate(y => scrollTo(0, y), box.y); await sleep(500);
  await shot(page, `${dir}/sj-activity.png`, { clip: box });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
