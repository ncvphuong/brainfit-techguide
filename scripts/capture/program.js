// TechGuide > BrainFit HQ > Program Management screenshots (server12, demo centre #132, as power_ma_sg).
// Creates a temporary "SG BF Training Demo" program, adds class 1407 to it, then removes it (server/guide_program.rb).
const { open, go, mark, clear, shot } = require('./lib');
const { execSync } = require('child_process');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const cleanup = () => execSync(`ssh -i ~/.ssh/ip14-alex deploy@45.63.26.194 'export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; cd /home/deploy/brainfitstudio && RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_program.rb 2>&1 | grep -v "warning:\\|Bundler\\|^\\s*from\\|cipher\\|====="'`).toString().trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const NAME = 'SG BF Training Demo';
(async () => {
  console.log(cleanup());
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  try {
    // ---- Where Program is
    await go(page, '/acp');
    await page.evaluate(() => { const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith('Accounts')); b.click(); b.setAttribute('data-tg-btn', '1'); }); await sleep(1200);
    await page.evaluate(() => { const a = [...document.querySelectorAll('.bp-nav a')].find(a => a.offsetParent && a.textContent.trim() === 'Program'); a.setAttribute('data-tg-prog', '1'); });
    await mark(page, '[data-tg-btn]', { pad: 3 }); await mark(page, '[data-tg-prog]', { pad: 3 });
    await shot(page, `${OUT}/program-1.png`, { clip: { x: 0, y: 0, width: 1600, height: 520 } }); await clear(page);
    // ---- List + New Program
    await go(page, '/acp/programs');
    await page.evaluate(() => [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'New Program')?.setAttribute('data-tg-new', '1'));
    await mark(page, '[data-tg-new]', { pad: 4 }); await shot(page, `${OUT}/program-2.png`); await clear(page);
    await go(page, '/acp/programs/new');
    await page.type('#program_name', NAME);
    await page.evaluate(() => { const s = document.getElementById('program_master_licensee_id'); s.value = [...s.options].find(o => o.value).value; s.dispatchEvent(new Event('change', { bubbles: true })); if (window.$) $(s).trigger('change'); });
    await page.select('#program_program_type', 'Scholar');
    await page.type('#program_description', 'Practice program for the training centre.');
    await mark(page, 'input[type=submit][value="Create Program"]', { pad: 4 }); await shot(page, `${OUT}/program-3.png`); await clear(page);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('input[type=submit][value="Create Program"]')]); await sleep(800);
    const href = await page.evaluate(n => [...document.querySelectorAll('a')].find(a => a.textContent.trim() === n)?.getAttribute('href'), NAME);
    console.log('program', href);
    // ---- Add Class
    await go(page, href);
    await mark(page, '[data-target="#addClassModal"]', { pad: 4 }); await shot(page, `${OUT}/program-4.png`); await clear(page);
    await page.click('[data-target="#addClassModal"]'); await sleep(800);
    await page.evaluate(() => { $('#add_class_select').val('1407').trigger('change'); }); await sleep(500);
    await mark(page, '#addClassNextBtn', { pad: 4 }); await shot(page, `${OUT}/program-5.png`); await clear(page);
    await page.click('#addClassNextBtn'); await sleep(600);
    await mark(page, '#addClassStep2 input[type=submit]', { pad: 4 }); await shot(page, `${OUT}/program-6.png`); await clear(page);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('#addClassStep2 input[type=submit]')]); await sleep(800);
    const users = await page.evaluate(() => (document.body.innerText.match(/@?[a-z0-9_]+/g) || []));
    const enrolled = await page.evaluate(() => [...document.querySelectorAll('table')].pop().innerText);
    if (!/sgtc27_|Training/.test(enrolled)) console.log('WARN enrolled table:', enrolled.slice(0, 300));
    await shot(page, `${OUT}/program-7.png`, { full: true });
    // ---- From the class side
    await go(page, '/acp/class_rooms/1407/edit'); await sleep(1500);
    await page.evaluate(() => { const s = document.getElementById('programs'); s.closest('.form-group').setAttribute('data-tg-pf', '1'); s.closest('.form-group').scrollIntoView({ block: 'center' }); }); await sleep(500);
    await mark(page, '[data-tg-pf]', { pad: 4 }); await shot(page, `${OUT}/program-8.png`); await clear(page);
  } finally { await browser.close(); console.log(cleanup()); }
})().catch(e => { console.error(String(e)); process.exit(1); });
