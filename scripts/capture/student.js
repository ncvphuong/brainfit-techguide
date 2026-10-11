// TechGuide > BrainFit HQ > Student Management screenshots (server12, demo centre #132, as power_ma_sg).
const { open, go, mark, markText, clear, shot, clickText } = require('./lib');
const { execSync } = require('child_process');
const OUT = process.argv[2];
const fs = require('fs'); fs.mkdirSync(OUT, { recursive: true });
const runner = mode => execSync(`ssh -i ~/.ssh/ip14-alex deploy@45.63.26.194 'export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; cd /home/deploy/brainfitstudio && MODE=${mode} RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_student.rb 2>&1 | grep -v "warning:\\|Bundler\\|^\\s*from"'`).toString().trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function rowAction(page, username, icon) {
  // marks one action button (by FA icon) in the row of `username`
  return page.evaluate((username, icon) => {
    const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('@' + username) || t.textContent.includes(username));
    if (!tr) return null; const btn = tr.querySelector(`i.fa-${icon}`)?.closest('a,button'); if (!btn) return null;
    btn.setAttribute('data-tg-row', '1'); return true;
  }, username, icon);
}
(async () => {
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  // ---- Create
  await go(page, '/acp/students?center_id=132');
  await page.evaluate(() => { const a = [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Add'); a && a.setAttribute('data-tg-add', '1'); });
  await mark(page, '[data-tg-add]', { pad: 6 }); await page.evaluate(() => { const a = [...document.querySelectorAll('.bp-nav a, .bp-nav button')].find(a => a.textContent.trim().startsWith('Students')); a && a.setAttribute('data-tg-menu', '1'); }); await mark(page, '[data-tg-menu]', { pad: 3 });
  await shot(page, `${OUT}/student-create-1.png`); await clear(page);
  await go(page, '/acp/students/new');
  await page.evaluate(() => { const s = document.getElementById('customer_id'); const o = [...s.options].find(o => /Evelyn Nair/.test(o.text)); $(s).val(o.value).trigger('change'); });
  await sleep(2500);
  await page.evaluate(() => { const s = document.querySelector('select[name="data[class_room_id]"]'); const o = [...s.options].find(o => /Junior EQ: N2/.test(o.text)); if (o) $(s).val(o.value).trigger('change'); });
  await sleep(500);
  await mark(page, '#customer_id + .select2, .select2-container:has(+ #customer_id), select#customer_id ~ span.select2', { pad: 4 });
  await page.evaluate(() => { const l = [...document.querySelectorAll('label')].filter(l => /Parents|Classes/.test(l.textContent)); l.forEach(x => x.closest('.form-group').setAttribute('data-tg-pc', '1')); });
  await clear(page); await mark(page, '[data-tg-pc]', { pad: 2 });
  await shot(page, `${OUT}/student-create-2.png`); await clear(page);
  await page.type('input[name="data[username]"]', 'sgtc27_guide01'); await page.type('input[name="data[name]"]', 'Chloe Tan');
  await page.evaluate(() => { const d = document.querySelector('input[name="data[dob]"]'); d.value = '2019/03/14'; const g = document.querySelector('select[name="data[gender]"]'); $(g).val($(g).find('option').filter((i, o) => /Female/.test(o.text)).val()).trigger('change'); $('.datepicker').hide(); });
  await page.evaluate(() => { [...document.querySelectorAll('input[type=password]')].forEach(i => i.closest('.form-group').setAttribute('data-tg-pw', '1')); [...document.querySelectorAll('button')].filter(b => /Save Without Chat Room/.test(b.textContent)).forEach(b => b.setAttribute('data-tg-save', '1')); });
  await mark(page, '[data-tg-pw]', { pad: 2 }); await mark(page, '[data-tg-save]', { pad: 5 });
  await shot(page, `${OUT}/student-create-3.png`); await clear(page);
  console.log(runner('create'));
  await go(page, '/acp/students?center_id=132&name=sgtc27_guide01');
  await page.evaluate(() => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('sgtc27_guide01')); tr && tr.setAttribute('data-tg-row1', '1'); });
  await mark(page, '[data-tg-row1]', { pad: 2 }); await shot(page, `${OUT}/student-create-4.png`); await clear(page);
  // ---- Edit
  await rowAction(page, 'sgtc27_guide01', 'pencil'); await mark(page, '[data-tg-row]', { pad: 4 });
  await shot(page, `${OUT}/student-edit-1.png`); await clear(page);
  const uid = await page.evaluate(() => { const a = document.querySelector('[data-tg-row]'); return a && a.getAttribute('href').match(/students\/(\d+)/)[1]; });
  await go(page, `/acp/students/${uid}/edit`);
  await page.evaluate(() => { [...document.querySelectorAll('button')].filter(b => /^\s*(Save|Update)/i.test(b.textContent)).forEach(b => b.setAttribute('data-tg-save', '1')); });
  await mark(page, '[data-tg-save]', { pad: 5 }); await shot(page, `${OUT}/student-edit-2.png`, { full: true }); await clear(page);
  // ---- Assign games (example student)
  await go(page, '/acp/students?center_id=132&name=sgtc27_guide01');
  await rowAction(page, 'sgtc27_guide01', 'gamepad'); await mark(page, '[data-tg-row]', { pad: 4 });
  await shot(page, `${OUT}/student-games-1.png`); await clear(page);
  await go(page, `/acp/students/${uid}/show_game`);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(b => b.textContent.trim() === 'Add Games'); b && b.setAttribute('data-tg-add', '1'); b && b.scrollIntoView({ block: 'center' }); });
  await mark(page, '[data-tg-add]', { pad: 5 }); await shot(page, `${OUT}/student-games-2.png`); await clear(page);
  await clickText(page, 'button, a', 'Add Games'); await sleep(1200);
  await page.evaluate(() => { const s = document.querySelector('#modalGame select[name="game_ids[]"]'); const o = [...s.options].find(o => /Dancing Patterns|Rainbow Sounds|Eye Spy/.test(o.text)) || s.options[0]; $(s).val([o.value]).trigger('change'); });
  await sleep(600);
  await page.evaluate(() => { const s = document.querySelector('#modalGame select[name="game_ids[]"]'); s.closest('.form-group, .row')?.setAttribute('data-tg-g', '1'); document.querySelector('#modalGame #btnRedeem')?.setAttribute('data-tg-sub', '1'); });
  await mark(page, '[data-tg-g]', { pad: 3 }); await mark(page, '[data-tg-sub]', { pad: 5 });
  await shot(page, `${OUT}/student-games-3.png`); await clear(page);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}), page.click('#modalGame #btnRedeem')]);
  await sleep(1500);
  await page.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3,h4,h5,.panel-title')].find(h => h.textContent.trim() === 'Smart Workout'); h && h.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); const t = h && h.parentElement.querySelector('table, .dataTables_wrapper'); });
  await shot(page, `${OUT}/student-games-4.png`);
  // ---- View (a demo student with progress)
  await go(page, '/acp/students?center_id=132&name=sgtc27_s07');
  await rowAction(page, 'sgtc27_s07', 'search'); await mark(page, '[data-tg-row]', { pad: 4 });
  await shot(page, `${OUT}/student-view-1.png`); await clear(page);
  const vid = await page.evaluate(() => document.querySelector('[data-tg-row]').getAttribute('href').match(/students\/(\d+)/)[1]);
  await go(page, `/acp/students/${vid}`);
  await shot(page, `${OUT}/student-view-2.png`);
  await page.evaluate(() => { document.getElementById('bp-sd-performance').scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); }); await sleep(800);
  await shot(page, `${OUT}/student-view-3.png`);
  await page.evaluate(() => { document.getElementById('bp-sd-progress').scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); }); await sleep(1500);
  await mark(page, '.bp-sd-nav', { pad: 3 }); await shot(page, `${OUT}/student-view-4.png`); await clear(page);
  await page.evaluate(() => { document.getElementById('bp-sd-sessions').scrollIntoView({ block: 'start' }); window.scrollBy(0, -140); }); await sleep(2500);
  await shot(page, `${OUT}/student-view-5.png`);
  await page.evaluate(() => window.scrollTo(0, 0)); await mark(page, '#bpSdPasswordToggle', { pad: 4 }); await mark(page, '.bp-sd-actions', { pad: 4 });
  await shot(page, `${OUT}/student-view-6.png`, { clip: { x: 0, y: 140, width: 1600, height: 560 } }); await clear(page);
  await browser.close();
  console.log(runner('remove'));
})().catch(e => { console.error(e); try { console.log(runner('remove')); } catch (x) {} process.exit(1); });
