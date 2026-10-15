// CoachSpace guide screenshots. Dev (server12), trainer sgtc27_t04 of the training centre; cookie 'cs' in cookies.json (git-ignored).
// Read-only: modals and forms are opened but nothing is saved. Usage: node coachspace.js out/cs
const { open, go, mark, markText, clear, shot, clickText } = require('./lib');
const fs = require('fs');
const OUT = process.argv[2] || 'out/cs'; fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ev = (page, body) => page.evaluate(new Function('return (' + body + ')')());
(async () => {
  const { browser, page } = await open('cs', { width: 1280, height: 800 });
  const S = (n, o) => shot(page, `${OUT}/${n}.png`, o);
  const hl = async (fn, pad = 5) => { await page.evaluate(b => { const el = new Function(b)(); if (el) el.setAttribute('data-tg', '1'); }, fn); await mark(page, '[data-tg="1"]', { pad }); await page.evaluate(() => document.querySelectorAll('[data-tg]').forEach(e => e.removeAttribute('data-tg'))); };
  const byText = (sel, re) => `return [...document.querySelectorAll('${sel}')].filter(e => e.offsetParent && /${re}/i.test(e.textContent.trim().replace(/\\s+/g, ' ')))[0]`;
  // dashboard
  await go(page, '/coachspace'); await sleep(800);
  await hl(byText('main *, div', '^3 students in your roster')); await hl(byText('div', '^Students 3$')); await S('dashboard'); await clear(page);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /Search students, notes, tasks/.test(b.textContent)).click()); await sleep(600);
  await page.keyboard.type('Faith', { delay: 60 }); await sleep(1500); await S('search'); await page.keyboard.press('Escape'); await sleep(300);
  await page.evaluate(() => document.querySelector('button[aria-label="More"]').click()); await sleep(600); await hl(`return document.querySelector('button[aria-label="More"]')`); await S('more-menu'); await clear(page);
  // students
  await go(page, '/coachspace/students'); await sleep(500);
  await page.evaluate(() => { const s = [...document.querySelectorAll('summary')].find(e => /Inactive/.test(e.textContent)); if (s) s.click(); }); await sleep(600);
  await hl(`return document.querySelector('select[name=class_room_id]')`); await hl(`return document.querySelector('select[name=sort]')`); await hl(`return document.querySelector('input[name=q]')`); await S('students', { full: true }); await clear(page);
  await go(page, '/coachspace/students/57378'); await sleep(600);
  await hl(`return document.querySelector('select[name=touch_level]')`); await hl(byText('button', '^Add to watchlist')); await S('student-top'); await clear(page);
  await page.evaluate(() => scrollTo(0, 560)); await sleep(500);
  await hl(byText('a', 'Open in chat')); await S('student-mid'); await clear(page);
  await page.evaluate(() => scrollTo(0, 99999)); await sleep(500); await S('student-bottom');
  // notes
  await go(page, '/coachspace/students/57378'); await sleep(400);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /Add note/.test(b.textContent)).click()); await sleep(500);
  await page.evaluate(() => scrollTo(0, 560)); await sleep(300);
  await hl(`return document.querySelector('textarea[name=body]').closest('form')`, 6); await S('note-form'); await clear(page);
  await go(page, '/coachspace/notes'); await sleep(500); await S('notes-page');
  // calendar
  await go(page, '/coachspace/calendar?week=2027-01-04'); await sleep(800);
  await hl(byText('button', '^Monday 4:00 PM')); await S('calendar'); await clear(page);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /^Monday 4:00 PM/.test(b.textContent.trim())).click()); await sleep(900); await S('calendar-class');
  await go(page, '/coachspace/calendar?view=sessions'); await sleep(500); await S('sessions');
  // tasks
  await go(page, '/coachspace/tasks'); await sleep(500);
  for (const t of ['^Templates', '^Assign \\(Group\\)', '^Assign \\(Student\\)', '^Add Adhoc Task']) await hl(byText('a, button', t));
  await S('tasks'); await clear(page);
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /Add Adhoc Task/.test(b.textContent)).click()); await sleep(700); await S('task-modal');
  await go(page, '/coachspace/task_templates'); await sleep(400); await S('templates');
  await go(page, '/coachspace/task_templates/17'); await sleep(400); await S('template-detail', { full: true });
  await go(page, '/coachspace/tasks/assign-student'); await sleep(400); await S('assign-student');
  // progress meetings
  await go(page, '/coachspace/progress_meetings'); await sleep(500); await S('pm-list');
  await page.evaluate(() => [...document.querySelectorAll('button')].find(b => /Create PM/.test(b.textContent)).click()); await sleep(600);
  await page.type('#createPmPairSearch', 'Daniel', { delay: 60 }); await sleep(1500); await S('pm-create-search');
  const rh = await page.evaluateHandle(() => [...document.querySelectorAll('#createPmPairResults *')].filter(e => e.offsetParent && e.children.length === 0 && /Faith/.test(e.textContent))[0]); await rh.asElement().click(); await sleep(700); await page.type('textarea[name=summary]', 'Reviewed the first weeks.', { delay: 20 }); await S('pm-create'); await page.evaluate(() => document.getElementById('createPmModal').classList.add('hidden'));
  await go(page, '/coachspace/progress_meetings?view=calendar'); await sleep(500); await S('pm-calendar');
  // cogmap + signal + settings
  await go(page, '/coachspace/students/57377'); await sleep(500);
  await page.evaluate(() => { const h = [...document.querySelectorAll('div')].find(d => d.offsetParent && /^COGMAP$/i.test(d.textContent.trim())); h.scrollIntoView({ block: 'start' }); scrollBy(0, -90); }); await sleep(400); await S('cogmap-card');
  await go(page, '/coachspace/cog_maps?student_id=57377'); await sleep(400); await hl(byText('a', 'Standard score'), 4); await S('cogmap-page'); await clear(page);
  await go(page, '/coachspace/signal'); await sleep(400); await S('signal');
  await go(page, '/coachspace/settings'); await sleep(400); await S('settings');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
