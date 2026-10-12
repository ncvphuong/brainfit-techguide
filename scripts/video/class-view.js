const { makeVideo } = require('./lib');
const { menu, classRow, CLASS_LIST } = require('./hq');
makeVideo({
  name: 'class-view', who: 'ma', startPath: CLASS_LIST,
  beats: [
    { say: 'To look at a class, open Class in the top menu. Click the class name, or the eye icon in the Action column.',
      run: async c => { const m = await menu(c, 'Class'); await c.hl(m); await c.glide(m); await c.sleep(900); await c.unhl(); const e = await classRow(c, 'eye'); await c.hl(e, 5); await c.glide(e); await c.sleep(900); await c.click(e, { wait: true }); await c.unhl(); } },
    { say: 'The class page shows the class details: the centre, the code, the program, the trainers, the assistant coaches and how many students the class has.',
      run: async c => { await c.page.waitForSelector('.bp-sd-hero'); const h = await c.tag(`return document.querySelector('.bp-sd-hero')`, 'hero'); await c.hl(h, 4); await c.glide(h); } },
    { say: 'The pencil at the top right opens the full edit page. The gamepad opens the class\'s game config.',
      run: async c => { await c.unhl(); const a = await c.tag(`return document.querySelector('.bp-sd-hero a i.fa-pencil').closest('a')`, 'pen'); const b = await c.tag(`return document.querySelector('.bp-sd-hero a i.fa-gamepad').closest('a')`, 'pad'); await c.hl(a, 5); await c.hl(b, 5); await c.glide(a); await c.sleep(1800); await c.glide(b); } },
    { say: 'Below the details is the Students list, with each student\'s class, habit and FFW points. Use plus and minus to add or redeem points, and Unenroll to take a student out of the class.',
      run: async c => { await c.unhl(); const l = await c.tag(`return [...document.querySelectorAll('.bp-content label')].find(l => l.textContent.trim().startsWith('Students'))`, 'lab'); await c.scrollTo(l, 100); const t = await c.tag(`return document.querySelector('.list-students')`, 'tbl'); await c.hl(t, 4); await c.glide(t); } },
    { say: 'Further down are the class\'s Assessment Templates and the Alumni Students.',
      run: async c => { await c.unhl(); await c.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })); await c.sleep(1500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
