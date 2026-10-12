const { makeVideo } = require('./lib');
const { student, menu, addTab, rowIcon, SEARCH_NAME } = require('./hq');
makeVideo({
  name: 'student-create', who: 'ma', startPath: '/acp/students?center_id=132&name=sgtc27_s07',
  before: async () => { console.log('cleanup:', await student('remove')); console.log('create (saved server-side before filming; no password is typed on screen):', (await student('create')).split('\n').pop()); },
  beats: [
    { say: 'To create a student, open Students in the top menu, then click Add at the top right of the student list.',
      run: async c => { const m = await menu(c, 'Students'); await c.hl(m); await c.glide(m); await c.sleep(1200); await c.unhl(); const a = await addTab(c); await c.hl(a); await c.click(a, { wait: true }); } },
    { say: 'Choose the parent first. The classes list then shows the classes of that parent\'s centre. Pick the student\'s class.',
      run: async c => {
        await c.page.waitForSelector('#customer_id', { timeout: 30000 });
        const p = await c.tag(`return document.querySelector('#customer_id').closest('.form-group')`, 'f'); await c.hl(p); await c.glide(p); await c.sleep(600);
        await c.page.evaluate(() => { const s = document.getElementById('customer_id'); const o = [...s.options].find(o => /Evelyn Nair/.test(o.text)); $(s).val(o.value).trigger('change'); });
        await c.sleep(3000); await c.unhl();
        const k = await c.tag(`return document.querySelector('select[name="data[class_room_id]"]').closest('.form-group')`, 'f'); await c.hl(k); await c.glide(k); await c.sleep(500);
        await c.page.evaluate(() => { const s = document.querySelector('select[name="data[class_room_id]"]'); const o = [...s.options].find(o => /Junior EQ: N2/.test(o.text)); if (o) $(s).val(o.value).trigger('change'); });
      } },
    { say: 'Now fill in the username, the name, the day of birth and the gender.',
      run: async c => {
        await c.unhl();
        await c.type('input[name="data[username]"]', 'sgtc27_guide01');
        await c.type('input[name="data[name]"]', 'Chloe Tan');
        const d = await c.tag(`return document.querySelector('input[name="data[dob]"]')`, 'f'); await c.glide(d);
        await c.page.evaluate(() => { const d = document.querySelector('input[name="data[dob]"]'); d.value = '2019/03/14'; $('.datepicker').hide(); });
        const g = await c.tag(`return document.querySelector('select[name="data[gender]"]').closest('.form-group')`, 'f'); await c.glide(g); await c.sleep(300);
        await c.page.evaluate(() => { const g = document.querySelector('select[name="data[gender]"]'); $(g).val($(g).find('option').filter((i, o) => /Female/.test(o.text)).val()).trigger('change'); });
      } },
    { say: 'Type a password twice. The student uses it to log in to the app.',
      run: async c => { const pw = await c.tag(`return [...document.querySelectorAll('input[type=password]')][0].closest('.form-group')`, 'f'); await c.page.evaluate(() => document.querySelectorAll('input[type=password]').forEach(i => i.closest('.form-group').setAttribute('data-v-pw', '1'))); await c.hl('[data-v-pw]'); await c.glide(pw); } },
    { say: 'Then click Save Without Chat Room. Save And Create Chat Room does the same, and also opens a private chat room between the parent and the trainer.',
      run: async c => {
        await c.unhl();
        const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Save Without Chat Room/.test(b.textContent))`, 'save'); await c.hl(b, 6); await c.glide(b);
        await c.sleep(2500);
        const b2 = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Save And Create Chat Room/.test(b.textContent))`, 'save2'); await c.hl(b2, 6); await c.glide(b2);
      } },
    { say: 'The new student now shows in the list, with their class and centre.',
      run: async c => { await c.unhl(); await c.go('/acp/students?center_id=132&name=sgtc27_guide01'); const r = await c.tag(`return [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('sgtc27_guide01'))`, 'row'); await c.hl(r, 3); await c.glide(r); } },
    { say: 'Usernames must be unique across BrainFit, so if the save fails, try a different username.',
      run: async c => { await c.sleep(300); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
