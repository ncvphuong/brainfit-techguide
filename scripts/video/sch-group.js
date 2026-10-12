const { makeVideo } = require('./lib');
const { onlyTraining, byText } = require('./schh');
makeVideo({
  name: 'sch-group', site: 'sch', startPath: '/classrooms/classes/',
  beats: [
    { say: 'A class group is one weekly slot of a class, for example Monday 4 to 5:50 PM, for one term. A class can have several groups. Open the Classes page, and click the plus icon on the class\'s row to create a group.',
      run: async c => { const p = await c.tag(`const tr = [...document.querySelectorAll('tr')].find(t => t.textContent.includes('Scholar T1: SmartFit Lower Pri')); return tr?.querySelector('a[href$="/create/"]')`, 'cr'); await c.scrollTo(p, 300); await c.hl(p, 5); await c.glide(p); await c.sleep(1500); await c.unhl(); } },
    { say: 'Fill in the form. Give the group a name, usually the day and time, and a group type, which is Normal for regular classes. Set the term start and end dates, the maximum participants, the expanded capacity for extra seats, and the maximum change requests per student per term.',
      run: async c => {
        await c.go('/classrooms/class-groups/1407/create/'); await c.type('input[name=name]', 'Saturday 10:00 AM - 11:50 AM');
        await c.page.evaluate(() => { const set = (n, v) => { const e = document.querySelector(`[name="${n}"]`); if (e) { e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); } }; set('start_date', '2027-01-04'); set('end_date', '2027-04-18'); set('max_participants', '6'); set('expanded_capacity', '8'); set('max_change_requests', '5'); });
        await c.sleep(1500); const f = await c.tag(`return document.querySelector('input[name=start_date]')?.closest('.form-group, div')`, 'dt'); await c.hl(f, 4); await c.glide(f); await c.sleep(3500);
      } },
    { say: 'In Session Templates, choose the day and the start and end time. Sessions are created every week of the term, skipping the holiday template\'s dates. Then pick the teachers and the students of the group.',
      run: async c => {
        await c.unhl(); await c.page.evaluate(() => { const set = (n, v) => { const e = document.querySelector(`[name="${n}"]`); if (e) { e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); } }; set('template_day[]', 'Saturday'); set('template_start_hour[]', '10'); set('template_start_minute[]', '00'); set('template_end_hour[]', '11'); set('template_end_minute[]', '50'); document.querySelectorAll('input[name=trainer_ids], input[name=student_ids]').forEach(x => { x.checked = true; }); });
        const t = await c.tag(`return document.querySelector('[name="template_day[]"]')?.closest('.form-group, div')`, 'tpl').catch(() => null); if (t) { await c.scrollTo(t, 200); await c.hl(t, 4); await c.glide(t); } await c.sleep(4000);
      } },
    { say: 'Click Create Class Group. We stop here without creating a new one. The groups that already exist appear in Class Groups, where you pick the term in the filter and see each group\'s capacity, members, period and status.',
      run: async c => {
        await c.unhl(); const s = await byText(c, 'button', /Create Class Group/, 'sub'); await c.scrollTo(s, 300); await c.hl(s, 6); await c.glide(s); await c.sleep(1800); await c.unhl();
        await c.go('/classrooms/class-groups/?term=7&class=1407'); await onlyTraining(c); await c.sleep(3500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
