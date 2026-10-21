// Class Start CogMAP + centre Start CogMAP (the Start CogMAP modal). server12 / training centre #132 only, as power_ma_sg.
// The run really starts CogMAP for the Demo CogMAP students (../capture/server/guide_cogmap_start.rb, re-seeded here, removed afterwards).
const { execFileSync } = require('child_process');
const path = require('path');
execFileSync(path.join(__dirname, '../capture/reseed_cs.sh'), ['seed'], { stdio: 'inherit' });
const IDS = require('../capture/cs_ids.json');
const { makeVideo } = require('./lib');
const click = async (c, fnBody, opts) => { const el = await c.tag(fnBody, 'm'); await c.click(el, opts); await c.sleep(900); };
const dlg = '#cm2s .cm2s-dialog';
const next = c => click(c, `return document.querySelector('[data-cm2s-next]')`);
makeVideo({
  name: 'cogmap-start-class', who: 'ma', startPath: `/acp/class_rooms/${IDS.classA}/show_game`,
  beats: [
    { say: 'To start CogMAP for a whole class, open the class\'s Game config page. The old CogMAP V2 preset and question form is gone. Instead there is one button: Start CogMAP.',
      run: async c => { const b = await c.tag(`return document.querySelector('[data-cm2s-open]')`, 'open'); await c.scrollTo(b, 300); await c.hl(b, 5); await c.glide(b); await c.sleep(2200); } },
    { say: 'Click it. A window opens with three steps: preset, questions, and confirm. First choose the course, then the preset. Here we choose Basic, and Custom Basic.',
      run: async c => {
        await c.unhl(); await click(c, `return document.querySelector('[data-cm2s-open]')`); await c.sleep(600);
        await click(c, `return document.querySelector('[data-course="basic"]')`);
        await click(c, `return document.querySelector('input[name="cm2s-preset"][value="basic_custom"]').closest('label')`); await c.sleep(600);
      } },
    { say: 'Click Next. A named preset ticks its own questions. A custom preset needs at least one question, so tick the ones to ask.',
      run: async c => {
        await next(c); await c.sleep(500);
        for (const n of [1, 2, 3]) await click(c, `return document.querySelector('.cm2s-q input[value="${n}"]').closest('label')`);
        await c.sleep(600);
      } },
    { say: 'Click Next to confirm. Every student in the class is listed with their status. A student who is in the middle of a round is marked: will be restarted. Their unfinished round closes as finished, and they start again with this setup.',
      run: async c => { await next(c); await c.sleep(1800); await c.page.evaluate(() => { const t = document.querySelector('.cm2s-dialog'); t.scrollTo({ top: 120, behavior: 'smooth' }); }); await c.sleep(3500); } },
    { say: 'Click Start CogMAP. While it runs the window is locked, so it cannot be closed, and it says: running, please do not close this popup. Each student moves to Started, or Restarted, one by one.',
      run: async c => {
        await c.page.setRequestInterception(true);
        c.page.on('request', r => { if (r.method() === 'POST' && /cogmap_v2_start_student/.test(r.url())) setTimeout(() => r.continue().catch(() => {}), 1500); else r.continue().catch(() => {}); });
        await click(c, `return document.querySelector('[data-cm2s-next]')`); await c.sleep(6500);
      } },
    { say: 'When it finishes you get a summary. Click Done. Each student now has this setup of their own, and the class keeps nothing. One entry for the class start is saved in the Activity Log.',
      run: async c => {
        await c.page.waitForFunction(() => document.querySelector('[data-cm2s-next]')?.textContent.trim() === 'Done', { timeout: 60000 }); await c.sleep(2500);
        await click(c, `return document.querySelector('[data-cm2s-next]')`, { wait: true }); await c.sleep(1200);
      } },
    { say: 'To start several classes at once, open the centre\'s Game config page and click Start CogMAP. It is the same window with one extra step first: tick the classes. Then it works the same way, with students grouped by class.',
      run: async c => {
        await c.go('/acp/centers/132/show_game');
        const b = await c.tag(`return document.querySelector('[data-cm2s-open]')`, 'open'); await c.scrollTo(b, 300); await c.hl(b, 5); await c.glide(b); await c.sleep(1500); await c.unhl();
        await click(c, `return document.querySelector('[data-cm2s-open]')`); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1)))))
  .catch(e => { console.error(e.message); process.exit(1); })
  .finally(() => { try { execFileSync(path.join(__dirname, '../capture/reseed_cs.sh'), ['unseed'], { stdio: 'inherit' }); } catch (e) {} });
