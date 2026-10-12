const { makeVideo } = require('./lib');
const { menu, classRow, group, CLASS_LIST } = require('./hq');
makeVideo({
  name: 'class-edit', who: 'ma', startPath: CLASS_LIST,
  beats: [
    { say: 'To edit a class, click the pencil icon on the class\'s row in the Class list. The pencil on the class page does the same.',
      run: async c => { const m = await menu(c, 'Class'); await c.hl(m); await c.glide(m); await c.sleep(800); await c.unhl(); const p = await classRow(c, 'pencil'); await c.hl(p, 5); await c.glide(p); await c.sleep(900); await c.click(p, { wait: true }); await c.unhl(); } },
    { say: 'You can change the centre, the class name and code, the trainers, the assistant coaches and the program.',
      run: async c => {
        await c.page.waitForSelector('input[name="data[name]"], input[name*="name"]', { timeout: 30000 }).catch(() => {});
        for (const l of ['Centers', 'Class Name', 'Code', 'Trainers', 'Assistant Coaches', 'Program']) { const g = await group(c, l); await c.hl(g, 4); await c.glide(g); await c.sleep(1000); await c.unhl(); }
      } },
    { say: 'When you are done, click Save. The same page also lists the class\'s students, assessment templates and alumni students.',
      run: async c => {
        const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save' && b.offsetParent)`, 'save'); await c.hl(b, 6); await c.glide(b); await c.sleep(1200); await c.unhl();
        const l = await c.tag(`return [...document.querySelectorAll('.bp-content label')].find(l => l.textContent.trim().startsWith('Students'))`, 'lab'); await c.scrollTo(l, 100);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
