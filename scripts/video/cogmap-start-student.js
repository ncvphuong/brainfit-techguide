// Student CogMAP (CogMAP V2 control on the student's Show game page). server12 / training centre #132 only, as power_ma_sg.
// Demo students come from ../capture/server/guide_cogmap_start.rb (re-seeded here, removed afterwards).
const { execFileSync } = require('child_process');
const path = require('path');
execFileSync(path.join(__dirname, '../capture/reseed_cs.sh'), ['seed'], { stdio: 'inherit' });
const IDS = require('../capture/cs_ids.json');
const { makeVideo } = require('./lib');
const cbLabel = (c, n) => c.tag(`const i = document.querySelectorAll('input.cm-level-v2')[${n}]; return i && document.querySelector('label[for="' + i.id + '"]')`, 'q');
const v2sel = c => c.tag(`const h = [...document.querySelectorAll('.panel-title')].find(e => e.textContent.trim() === 'CogMAP V2 Questions'); const s = [...document.querySelectorAll('select')].find(e => h.compareDocumentPosition(e) & 4); return s.nextElementSibling?.classList.contains('select2') ? s.nextElementSibling : s`, 'sel');
const ctl = c => c.tag(`const l = [...document.querySelectorAll('label,b,strong,p,div,td,span')].find(e => e.children.length === 0 && /COGMAP VERSION 2 CONTROL/i.test(e.textContent.trim())); return l.closest('.row, .form-group, tr') || l.parentElement`, 'ctl');
const focusV2 = c => c.page.evaluate(() => { const h = [...document.querySelectorAll('.panel-title')].find(e => e.textContent.trim() === 'CogMAP V2 Questions'); window.scrollTo(0, h.getBoundingClientRect().top + scrollY - 260); });
makeVideo({
  name: 'cogmap-start-student', who: 'ma', startPath: `/acp/students/${IDS.nosetup}/show_game`,
  beats: [
    { say: 'CogMAP version 2 now uses only the student\'s own setup: a preset and at least one question. Nothing is taken from the class or the centre any more. Open the student\'s Game config page, and find CogMAP version 2 control.',
      run: async c => { await focusV2(c); await c.sleep(600); const t = await ctl(c); await c.hl(t, 4); await c.glide(t); await c.sleep(1500); } },
    { say: 'This student has no setup yet, so Activate is greyed out, with a note: choose a preset and at least one question first. A student with no setup is not offered CogMAP in the app.',
      run: async c => { await c.sleep(3500); } },
    { say: 'Open the preset box under CogMAP V2 Questions, and choose a preset. Here we pick Custom Basic.',
      run: async c => {
        await c.unhl(); const s = await v2sel(c); await c.hl(s, 3); await c.click(s); await c.sleep(1000);
        const o = await c.tag(`return [...document.querySelectorAll('.select2-results__option')].find(o => o.textContent.trim() === 'Custom Basic')`, 'opt');
        await c.click(o, { wait: true }); await c.sleep(1200); await focusV2(c); await c.sleep(500);
      } },
    { say: 'A custom preset starts with no questions ticked, so tick the questions this student should do. A named preset like Foundation ticks its own questions for you.',
      run: async c => { await c.unhl(); for (const n of [0, 1, 2]) { const l = await cbLabel(c, n); await c.click(l); await c.sleep(1100); } } },
    { say: 'Now the student has a preset and questions. Reload the page, and Activate is available. Click Activate. The status changes to Active, and the student is asked to do CogMAP in the app.',
      run: async c => {
        await c.go(`/acp/students/${IDS.nosetup}/show_game`); await focusV2(c); await c.sleep(500);
        const a = await c.tag(`return [...document.querySelectorAll('a')].find(a => /reset_round_v2/.test(a.getAttribute('href') || ''))`, 'act');
        await c.hl(a, 4); await c.click(a, { wait: true }); await c.sleep(1200); await focusV2(c); await c.sleep(800); const t = await ctl(c); await c.hl(t, 4); await c.sleep(1800);
      } },
    { say: 'While CogMAP is active you cannot untick the last question. The page keeps it ticked and explains: keep at least one question, or stop CogMAP first.',
      run: async c => { await c.unhl(); for (const n of [2, 1, 0]) { const l = await cbLabel(c, n); await c.click(l); await c.sleep(1300); } await c.sleep(1500); } },
    { say: 'When a student has finished at least one round, Show Latest CogMAP opens the latest result in a new tab.',
      run: async c => {
        await c.go('/acp/students/57377/show_game'); await focusV2(c); await c.sleep(600);
        const b = await c.tag(`return [...document.querySelectorAll('a')].find(a => /Show Latest CogMAP/.test(a.textContent))`, 'latest');
        await c.hl(b, 4); await c.glide(b); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1)))))
  .catch(e => { console.error(e.message); process.exit(1); })
  .finally(() => { try { execFileSync(path.join(__dirname, '../capture/reseed_cs.sh'), ['unseed'], { stdio: 'inherit' }); } catch (e) {} });
