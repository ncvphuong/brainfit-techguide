const { makeVideo } = require('./lib');
const { guide } = require('./hq');
const clean = async () => console.log('remove:', await guide('MODE=remove'));
makeVideo({
  name: 'class-enrol', who: 'ma', startPath: '/acp/class_rooms/1407',
  before: async () => { await clean(); console.log('example student without a class:', (await guide('MODE=create NOCLASS=1')).split('\n').pop()); },
  after: clean,
  beats: [
    { say: 'To put students into a class, open the class page and click Enroll students.',
      run: async c => { const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Enroll students/i.test(b.textContent) && b.offsetParent && !b.closest('.modal'))`, 'enrol'); await c.hl(b, 6); await c.glide(b); await c.sleep(900); await c.click(b); await c.sleep(2200); await c.unhl(); } },
    { say: 'Pick one or more students, then click Submit. The list shows the students of this class\'s centre who are not in a class yet. A student who is already in another class has to be moved from their own edit page instead.',
      run: async c => {
        await c.page.waitForSelector('select.add_students', { timeout: 30000 });
        const g = await c.tag(`return document.querySelector('select.add_students').closest('.form-group')`, 'sel'); await c.hl(g, 4); await c.glide(g); await c.sleep(900);
        await c.page.evaluate(() => { const s = document.querySelector('select.add_students'); const o = [...s.options].find(o => /Chloe Tan/.test(o.text)); if (o) $(s).val([o.value]).trigger('change'); });
        await c.sleep(1800); await c.unhl();
        const b = await c.tag(`return document.querySelector('#form-add-students button[type=submit]')`, 'sub'); await c.hl(b, 5); await c.glide(b);
      } },
    { say: 'The student is added to the class list straight away. From the same list you can add class, habit and FFW points, or unenroll the student again.',
      run: async c => {
        await c.sleep(500); const b = await c.tag(`return document.querySelector('#form-add-students button[type=submit]')`, 'sub'); await c.glide(b); await c.sleep(300); await c.page.evaluate(() => document.querySelector('#form-add-students button[type=submit]').click()); await c.unhl();
        await c.page.waitForFunction(() => [...document.querySelectorAll('.list-students tbody tr')].some(t => t.textContent.includes('Chloe Tan')), { timeout: 60000 });
        await c.sleep(2500);
        const l = await c.tag(`return [...document.querySelectorAll('.bp-content label')].find(l => l.textContent.trim().startsWith('Students'))`, 'lab'); await c.scrollTo(l, 100);
        const r = await c.tag(`return [...document.querySelectorAll('.list-students tbody tr')].find(t => t.textContent.includes('Chloe Tan'))`, 'new'); await c.hl(r, 3); await c.glide(r); await c.sleep(1500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(async e => { console.error(e.message); await clean(); process.exit(1); });
