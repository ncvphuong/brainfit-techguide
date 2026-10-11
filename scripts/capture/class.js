// TechGuide > BrainFit HQ > Class Management screenshots (server12, demo centre #132, as power_ma_sg).
const { open, go, mark, clear, shot } = require('./lib');
const { execSync } = require('child_process');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const runner = (env) => execSync(`ssh -i ~/.ssh/ip14-alex deploy@45.63.26.194 'export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; cd /home/deploy/brainfitstudio && ${env} RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_student.rb 2>&1 | grep -v "warning:\\|Bundler\\|^\\s*from\\|cipher\\|====="'`).toString().trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CLASS = 'Scholar T1: SmartFit Lower Pri';
const rowOf = `(c) => [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td')?.textContent.trim() === c)`;
(async () => {
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  // ---- View a class
  await go(page, '/acp/class_rooms?center_id=132&name=T1%3A+SmartFit+Lower');
  await page.evaluate(c => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td')?.textContent.trim() === c); tr?.querySelector('i.fa-eye')?.closest('a')?.setAttribute('data-tg-eye', '1'); tr?.querySelector('td a')?.setAttribute('data-tg-name', '1'); }, CLASS);
  await mark(page, '[data-tg-eye]', { pad: 4 }); await mark(page, '[data-tg-name]', { pad: 4 });
  await shot(page, `${OUT}/class-view-1.png`); await clear(page);
  const cid = await page.evaluate(() => document.querySelector('[data-tg-name]').getAttribute('href').match(/\d+$/)[0]);
  console.log('class', cid);
  await go(page, `/acp/class_rooms/${cid}`);
  await shot(page, `${OUT}/class-view-2.png`);
  await page.evaluate(() => { const l = [...document.querySelectorAll('label')].find(l => l.textContent.trim().startsWith('Students')); l && l.scrollIntoView({ block: 'start' }); window.scrollBy(0, -90); }); await sleep(500);
  await shot(page, `${OUT}/class-view-3.png`);
  // ---- Trainers & coaches
  await go(page, `/acp/class_rooms/${cid}`);
  await mark(page, '.bp-cd-add', { pad: 5 }); await mark(page, '.bp-cd-staff-x', { pad: 3 });
  await shot(page, `${OUT}/class-staff-1.png`, { clip: { x: 0, y: 140, width: 1600, height: 520 } }); await clear(page);
  await page.click('.bp-cd-add[data-label="trainer"]'); await sleep(500);
  const pick = await page.evaluate(() => { const li = [...document.querySelectorAll('#bpCdStaffList li')].find(l => !l.hidden); return li ? li.querySelector('b').textContent : null; });
  console.log('pick', pick);
  if (pick) { await page.type('#bpCdStaffSearch', pick.split(' ').slice(-1)[0]); await sleep(400); }
  await page.evaluate(() => { const li = [...document.querySelectorAll('#bpCdStaffList li')].find(l => !l.hidden); li?.querySelector('.bp-cd-staff-add')?.setAttribute('data-tg-addbtn', '1'); });
  await mark(page, '#bpCdStaffSearch', { pad: 3 }); await mark(page, '[data-tg-addbtn]', { pad: 4 });
  await shot(page, `${OUT}/class-staff-2.png`); await clear(page);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}), page.click('[data-tg-addbtn]')]); await sleep(800);
  await page.evaluate(n => { const chip = [...document.querySelectorAll('.bp-cd-staff')].find(c => c.textContent.includes(n)); chip?.setAttribute('data-tg-chip', '1'); }, pick);
  await mark(page, '[data-tg-chip]', { pad: 4 }); await shot(page, `${OUT}/class-staff-3.png`, { clip: { x: 0, y: 140, width: 1600, height: 520 } }); await clear(page);
  await page.evaluate(() => document.querySelector('[data-tg-chip] .bp-cd-staff-x').click()); await sleep(900);
  await shot(page, `${OUT}/class-staff-4.png`);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}), page.evaluate(() => document.querySelector('.swal2-confirm')?.click())]); await sleep(800);
  console.log('trainer removed again:', !(await page.evaluate(n => [...document.querySelectorAll('.bp-cd-staff')].some(c => c.textContent.includes(n)), pick)));
  // ---- Enrol students (temporary example student with no class)
  console.log(runner('MODE=create NOCLASS=1'));
  await go(page, `/acp/class_rooms/${cid}`);
  await page.evaluate(() => [...document.querySelectorAll('.bp-cd-quick button')].find(b => /Enroll/.test(b.textContent))?.setAttribute('data-tg-enrol', '1'));
  await mark(page, '[data-tg-enrol]', { pad: 5 }); await shot(page, `${OUT}/class-enrol-1.png`, { clip: { x: 0, y: 140, width: 1600, height: 560 } }); await clear(page);
  await page.click('[data-tg-enrol]'); await sleep(1000);
  await page.evaluate(() => { const s = document.querySelector('select.add_students'); const o = [...s.options].find(o => /Chloe Tan/.test(o.text)); if (o) $(s).val([o.value]).trigger('change'); });
  await sleep(500);
  await page.evaluate(() => { document.querySelector('select.add_students').closest('.form-group').setAttribute('data-tg-sel', '1'); document.querySelector('#form-add-students button[type=submit]').setAttribute('data-tg-sub', '1'); });
  await mark(page, '[data-tg-sel]', { pad: 3 }); await mark(page, '.bp-cd-enrol-hint', { pad: 3 }); await mark(page, '[data-tg-sub]', { pad: 4 });
  await shot(page, `${OUT}/class-enrol-2.png`); await clear(page);
  await page.click('[data-tg-sub]'); await sleep(2500);
  await page.evaluate(() => { const tr = [...document.querySelectorAll('.list-students tbody tr')].find(t => t.textContent.includes('Chloe Tan')); tr?.setAttribute('data-tg-new', '1'); tr?.scrollIntoView({ block: 'center' }); });
  await mark(page, '[data-tg-new]', { pad: 2 }); await shot(page, `${OUT}/class-enrol-3.png`); await clear(page);
  console.log(runner('MODE=remove'));
  // ---- Assign games to a class
  console.log(runner('MODE=class_games STEP=save'));
  await go(page, '/acp/class_rooms?center_id=132&name=T1%3A+SmartFit+Lower');
  await page.evaluate(c => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td')?.textContent.trim() === c); tr?.querySelector('i.fa-gamepad')?.closest('a')?.setAttribute('data-tg-gp', '1'); }, CLASS);
  await mark(page, '[data-tg-gp]', { pad: 4 }); await shot(page, `${OUT}/class-games-1.png`); await clear(page);
  await go(page, `/acp/class_rooms/${cid}/show_game`);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button,a')].find(b => b.textContent.trim() === 'Add Games'); b?.setAttribute('data-tg-add', '1'); b?.scrollIntoView({ block: 'center' }); });
  await mark(page, '[data-tg-add]', { pad: 5 }); await shot(page, `${OUT}/class-games-2.png`); await clear(page);
  await page.click('[data-tg-add]'); await sleep(1200);
  const modal = await page.evaluate(() => { const m = [...document.querySelectorAll('.modal')].find(m => getComputedStyle(m).display === 'block'); return m ? m.id : null; });
  console.log('modal', modal); console.log('preselected', await page.evaluate(id => [...document.querySelectorAll(`#${id} select[name="game_ids[]"] option:checked`)].map(o => o.text.trim()), modal));
  await page.evaluate(id => { const s = document.querySelector(`#${id} select[name="game_ids[]"]`); const o = [...s.options].find(o => /Dancing Patterns|Rainbow Sounds|Eye Spy/.test(o.text) && !o.selected) || s.options[0]; window.__tgBefore = $(s).val(); $(s).val([...($(s).val() || []), o.value]).trigger('change'); s.closest('.form-group, .row')?.setAttribute('data-tg-g', '1'); document.querySelector(`#${id} button[type=submit]`)?.setAttribute('data-tg-sub2', '1'); }, modal);
  await sleep(500); await mark(page, '[data-tg-g]', { pad: 3 }); await mark(page, '[data-tg-sub2]', { pad: 4 });
  await shot(page, `${OUT}/class-games-3.png`); await clear(page);
  await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}), page.click('[data-tg-sub2]')]); await sleep(1500);
  await page.evaluate(() => { const h = [...document.querySelectorAll('h1,h2,h3,h4,h5')].find(h => h.textContent.trim() === 'Smart Workout'); h?.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); });
  await shot(page, `${OUT}/class-games-4.png`);
  console.log(runner('MODE=class_games STEP=restore'));
  // ---- Edit
  await go(page, '/acp/class_rooms?center_id=132&name=T1%3A+SmartFit+Lower');
  await page.evaluate(c => { const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td')?.textContent.trim() === c); tr?.querySelector('i.fa-pencil')?.closest('a')?.setAttribute('data-tg-pen', '1'); }, CLASS);
  await mark(page, '[data-tg-pen]', { pad: 4 }); await shot(page, `${OUT}/class-edit-1.png`); await clear(page);
  await go(page, `/acp/class_rooms/${cid}/edit`); await shot(page, `${OUT}/class-edit-2.png`);
  await browser.close();
})().catch(e => { console.error(e); try { console.log(runner('MODE=remove')); console.log(runner('MODE=class_games STEP=restore')); } catch (x) {} process.exit(1); });
