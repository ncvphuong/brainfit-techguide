const { makeVideo } = require('./lib');
const { menu, rowIcon, SEARCH_NAME } = require('./hq');
const card = (c, id) => c.tag(`return document.getElementById(${JSON.stringify(id)})`, 'card');
makeVideo({
  name: 'student-view', who: 'ma', startPath: '/acp/students?center_id=132&name=sgtc27_s07',
  beats: [
    { say: 'To see everything about one student, open Students and click the magnifier icon on the student\'s row.',
      run: async c => { const m = await menu(c, 'Students'); await c.hl(m); await c.glide(m); await c.sleep(900); await c.unhl(); const v = await rowIcon(c, 'sgtc27_s07', 'search'); await c.hl(v, 5); await c.glide(v); await c.sleep(900); await c.click(v, { wait: true }); await c.unhl(); } },
    { say: 'The top of the page shows the profile on the left, with the centre, the class, the parent and the trainer. On the right are the parent or guardian, and the CogMAP V2 card.',
      run: async c => { await c.page.waitForSelector('#bp-sd-cogmap', { timeout: 30000 }); const p = await c.tag(`return document.querySelector('.bp-sd-grid .bp-sd-col .bp-sd-card')`, 'card'); await c.hl(p, 4); await c.glide(p); await c.sleep(3000); await c.unhl(); const g = await c.tag(`return [...document.querySelectorAll('h3')].find(h => h.textContent.trim().startsWith('Parent'))?.closest('.bp-sd-card')`, 'card'); await c.hl(g, 4); await c.glide(g); } },
    { say: 'The CogMAP card shows how many sessions are completed, the average score, and each skill\'s score per round. Click Open to see the report for that round.',
      run: async c => { await c.unhl(); const k = await card(c, 'bp-sd-cogmap'); await c.hl(k, 4); await c.glide(k); await c.sleep(4500); const o = await c.tag(`return [...document.querySelectorAll('#bp-sd-cogmap a, #bp-sd-cogmap button')].find(b => b.textContent.trim() === 'Open')`, 'open'); await c.hl(o, 4); await c.glide(o); } },
    { say: 'Game Performance shows the student\'s best games by completion.',
      run: async c => { await c.unhl(); const k = await card(c, 'bp-sd-performance'); await c.scrollTo(k, 90); await c.hl(k, 4); await c.glide(k); } },
    { say: 'Progress lists the Smart Workout and Smart Moves results. Change the period at the top right of the section. The section bar stays at the top while you scroll, so you can jump to any section.',
      run: async c => { await c.unhl(); const k = await card(c, 'bp-sd-progress'); await c.scrollTo(k, 100); await c.hl(k, 4); await c.glide(k); await c.sleep(3500); await c.unhl(); const n = await c.tag(`return document.querySelector('.bp-sd-nav')`, 'nav'); await c.hl(n, 3); await c.glide(n); } },
    { say: 'Class Sessions shows the upcoming and past class sessions from the scheduling app, in your own time zone.',
      run: async c => { await c.unhl(); const k = await card(c, 'bp-sd-sessions'); await c.scrollTo(k, 100); await c.hl(k, 4); await c.glide(k); } },
    { say: 'Back at the top, the buttons on the right go to Edit, Game config and Progress report. Reveal shows the student\'s password for thirty seconds, and every reveal is logged.',
      run: async c => {
        await c.unhl(); await c.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await c.sleep(1000);
        const b = await c.tag(`const e = document.querySelector('.bp-sd-grid i.fa-pencil'); return e && e.closest('div')`, 'btns'); await c.hl(b, 6); await c.glide(b); await c.sleep(3500); await c.unhl();
        const r = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Reveal/.test(b.textContent) && b.offsetParent)`, 'reveal'); await c.hl(r, 5); await c.glide(r);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
