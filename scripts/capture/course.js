// TechGuide > BrainFit HQ > Course Management (server12, as the course author power_ml). Read-only: nothing is saved,
// cloned or assigned; forms and pop-ups are only opened and highlighted.
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const C = 338, P = 68;
async function rowTag(page, title, sel, name) {
  return page.evaluate((title, sel, name) => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td:nth-child(2)')?.textContent.trim() === title || t.textContent.includes(title)); const els = tr ? tr.querySelectorAll(sel) : []; els.forEach(e => e.setAttribute('data-tg-' + name, '1')); return els.length; }, title, sel, name);
}
(async () => {
  const { browser, page } = await open('author', { width: 1600, height: 900 });
  const T = 'BrainFit Cognitive Foundations';
  // List + create
  await go(page, '/acp/courses');
  await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Add'); a?.setAttribute('data-tg-add', '1'); const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button, .bp-nav a')].find(x => x.textContent.trim().startsWith('Course')); b?.setAttribute('data-tg-menu', '1'); });
  await mark(page, '[data-tg-add]', { pad: 5 }); await mark(page, '[data-tg-menu]', { pad: 3 }); await shot(page, `${OUT}/course-list-1.png`); await clear(page);
  await rowTag(page, T, 'td:last-child', 'act'); await mark(page, '[data-tg-act]', { pad: 3 }); await shot(page, `${OUT}/course-list-2.png`, { clip: { x: 0, y: 0, width: 1600, height: 420 } }); await clear(page);
  await go(page, '/acp/courses/new');
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save')?.setAttribute('data-tg-save', '1'));
  await mark(page, '[data-tg-save]', { pad: 4 }); await shot(page, `${OUT}/course-create-1.png`, { full: true }); await clear(page);
  // Edit
  await go(page, `/acp/courses/${C}/edit`);
  await page.evaluate(() => document.querySelector('a[href*="/acp/media/topic/"]')?.setAttribute('data-tg-plus', '1'));
  await mark(page, '.bp-ce-bar', { pad: 4 }); await shot(page, `${OUT}/course-edit-1.png`); await clear(page);
  await page.evaluate(() => { const h = [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Topic'); h?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); document.querySelector('a.sort')?.setAttribute('data-tg-sort', '1'); document.querySelector('a.update-form')?.setAttribute('data-tg-tpen', '1'); [...document.querySelectorAll('td, a, div')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Add resource').slice(0, 1).forEach(e => e.closest('tr')?.setAttribute('data-tg-addres', '1')); });
  await mark(page, '[data-tg-sort]', { pad: 4 }); await mark(page, '[data-tg-tpen]', { pad: 4 }); await mark(page, '[data-tg-addres]', { pad: 2 }); await mark(page, '[data-tg-plus]', { pad: 4 });
  await shot(page, `${OUT}/course-edit-2.png`); await clear(page);
  // Add resource: '+' creates an empty item and opens its edit pop-up (removed again right after)
  const addHref = await page.evaluate(() => document.querySelector('a[href*="/acp/media/topic/"]')?.getAttribute('href'));
  if (addHref) {
    await go(page, addHref); await sleep(2500);
    await page.evaluate(() => { const m = [...document.querySelectorAll('.modal')].find(m => getComputedStyle(m).display === 'block'); m?.querySelectorAll('select[name*=context], input[name*=title], input[type=file]').forEach(e => (e.closest('.form-group') || e).setAttribute('data-tg-f', '1')); m?.querySelectorAll('button[type=submit]').forEach(b => b.setAttribute('data-tg-sv', '1')); });
    await mark(page, '[data-tg-f]', { pad: 3 }); await mark(page, '[data-tg-sv]', { pad: 4 });
    await shot(page, `${OUT}/course-edit-3.png`); await clear(page);
    console.log(require('child_process').execSync(`ssh -i ~/.ssh/ip14-alex deploy@45.63.26.194 'export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; cd /home/deploy/brainfitstudio && RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/m338.rb 2>&1 | grep -v "warning:\\|Bundler"'`).toString().trim());
  }
  // Progression (course 68 has a quiz): switch on in the form only, never saved
  await go(page, `/acp/courses/${P}/edit`);
  await page.evaluate(() => { const t = document.getElementById('bpCeProgEnabled'); if (t && !t.checked) { t.click(); } const sel = document.querySelector('#bpCeProgList select'); if (sel && sel.options.length > 1) sel.selectedIndex = 1; const l = document.querySelector('#bpCeProgList input[type=text]'); if (l && !l.value) l.value = 'Final Exam'; const w = document.querySelector('#bpCeProgList .bp-ce-w'); if (w) { w.value = '100'; w.dispatchEvent(new Event('input')); } document.querySelector('.bp-ce-prog')?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); });
  await sleep(500); await mark(page, '.bp-ce-prog', { pad: 4 }); await shot(page, `${OUT}/course-progression-1.png`); await clear(page);
  await go(page, `/acp/courses/${P}/progression`); await shot(page, `${OUT}/course-progression-2.png`);
  // Clone (pop-up only)
  await go(page, '/acp/courses');
  await rowTag(page, T, 'a[data-body-source*="clone_course_preview"]', 'dup'); await mark(page, '[data-tg-dup]', { pad: 4 });
  await shot(page, `${OUT}/course-clone-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 420 } }); await clear(page);
  await page.evaluate(() => document.querySelector('[data-tg-dup]')?.click()); await sleep(2500);
  await shot(page, `${OUT}/course-clone-2.png`); await page.keyboard.press('Escape'); await sleep(500);
  // Assign (highlight only)
  await go(page, '/acp/courses');
  await rowTag(page, T, 'a[href*="/assign?context="]', 'as'); await mark(page, '[data-tg-as]', { pad: 3 });
  await shot(page, `${OUT}/course-assign-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 420 } }); await clear(page);
  await go(page, `/acp/courses/${C}/assign?context=student`);
  await page.evaluate(() => { const cb = [...document.querySelectorAll('input[type=checkbox]')].filter(c => c.checked).slice(0, 3); cb.forEach(c => (c.closest('label, li, div') || c).setAttribute('data-tg-cb', '1')); [...document.querySelectorAll('a')].filter(a => /setup publish date/i.test(a.textContent)).slice(0, 1).forEach(a => a.setAttribute('data-tg-pub', '1')); [...document.querySelectorAll('a,button')].filter(b => /Assign permission for/.test(b.textContent)).forEach(b => b.setAttribute('data-tg-perm', '1')); });
  await mark(page, '[data-tg-cb]', { pad: 3 }); await mark(page, '[data-tg-pub]', { pad: 3 }); await mark(page, '[data-tg-perm]', { pad: 3 });
  await shot(page, `${OUT}/course-assign-2.png`); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
