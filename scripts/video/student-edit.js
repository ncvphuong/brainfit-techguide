const { makeVideo } = require('./lib');
const { student, menu, rowIcon, SEARCH_NAME } = require('./hq');
makeVideo({
  name: 'student-edit', who: 'ma', startPath: '/acp/students?center_id=132&name=sgtc27_s07',
  before: async () => { const r = await student('create'); console.log('example student:', r.split('\n').pop()); },
  beats: [
    { say: 'To edit a student, open Students and search for the student by name or username.',
      run: async c => {
        const m = await menu(c, 'Students'); await c.hl(m); await c.glide(m); await c.sleep(800); await c.unhl();
        await c.page.evaluate(sel => { const i = document.querySelector(sel); i.value = ''; }, SEARCH_NAME);
        await c.type(SEARCH_NAME, 'sgtc27_guide01');
        const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Search' && b.offsetParent)`, 'go'); await c.click(b, { wait: true });
      } },
    { say: 'Click the pencil icon in the Action column of that student\'s row.',
      run: async c => { const p = await rowIcon(c, 'sgtc27_guide01', 'pencil'); await c.hl(p, 5); await c.glide(p); await c.sleep(1200); await c.click(p, { wait: true }); await c.unhl(); } },
    { say: 'Change what you need on the form: the parent, the class, the name, the email, the date of birth or the gender. Here we give the student a longer name.',
      run: async c => {
        await c.page.waitForSelector('input[name="data[name]"]', { timeout: 30000 });
        const k = await c.tag(`return document.querySelector('select[name="data[class_room_id]"]').closest('.form-group')`, 'f'); await c.hl(k); await c.glide(k); await c.sleep(1500); await c.unhl();
        const n = await c.tag(`return document.querySelector('input[name="data[name]"]')`, 'f'); await c.click(n);
        await c.page.evaluate(() => document.querySelector('input[name="data[name]"]').select());
        await c.page.keyboard.type('Chloe Tan Mei', { delay: 70 });
      } },
    { say: 'Leave the password empty to keep the current password. Then click Save.',
      run: async c => {
        const pw = await c.tag(`return [...document.querySelectorAll('input[type=password]')][0].closest('.form-group')`, 'f'); await c.page.evaluate(() => document.querySelectorAll('input[type=password]').forEach(i => i.closest('.form-group').setAttribute('data-v-pw', '1'))); await c.hl('[data-v-pw]'); await c.glide(pw); await c.sleep(1000); await c.unhl();
        const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => /^\\s*(Save|Update)/i.test(b.textContent) && b.offsetParent)`, 'save'); await c.hl(b, 6); await c.click(b); await c.unhl();
      } },
    { say: 'After saving, the list shows the student with the new name. Moving a student to another class changes which class games they get, but their progress so far is kept.',
      run: async c => {
        await c.page.waitForFunction(() => /Chloe Tan Mei/.test(document.body.innerText), { timeout: 60000 });
        await c.sleep(1500); await c.page.evaluate(() => window.scrollTo(0, 0)); await c.sleep(300);
        const r = await c.tag(`return [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('sgtc27_guide01'))`, 'row'); await c.hl(r, 3); await c.glide(r);
      } },
  ],
  after: async () => { console.log('remove:', await student('remove')); },
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
