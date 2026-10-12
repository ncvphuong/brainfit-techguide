const { makeVideo } = require('./lib');
const { btn, onlyTraining, byText } = require('./schh');
makeVideo({
  name: 'sch-change', site: 'sch', startPath: '/classrooms/requests/new-2/',
  beats: [
    { say: 'An unrestricted session change moves a student from one session to another, in any class group, without the usual change request limits. Use it for special cases. Normal changes go through Requests. Open Requests, then New unrestricted, search the student by name and pick them.',
      run: async c => { await c.type('#student-search-input', 'Sarah Ng'); await btn(c, /^Search$/); await c.sleep(3200); await onlyTraining(c); await c.sleep(1500);
        await c.page.evaluate(() => { const e = [...document.querySelectorAll('button, [onclick]')].filter(b => b.offsetParent && /Sarah Ng/.test(b.textContent)).pop(); e && e.setAttribute('data-v-pick', '1'); });
        await c.hl('[data-v-pick]', 4); await c.glide('[data-v-pick]'); await c.sleep(1200); await c.page.evaluate(() => document.querySelector('[data-v-pick]')?.click()); await c.sleep(2500); await c.unhl(); } },
    { say: 'In FROM, pick the student\'s class group, then the session they won\'t attend.',
      run: async c => { const b = await byText(c, 'button', /^Monday 4:00 PM/, 'from'); await c.hl(b, 5); await c.glide(b); await c.sleep(1200); await btn(c, /^Monday 4:00 PM/); await c.sleep(2600); await c.unhl(); await onlyTraining(c);
        const s = await byText(c, 'button', /2027-01-11/, 'sess'); await c.hl(s, 5); await c.glide(s); await c.sleep(1500); await btn(c, /2027-01-11/); await c.sleep(2500); await c.unhl(); } },
    { say: 'In TO, search the class group they will join instead, by class or group name, and pick the session.',
      run: async c => { await c.type('#to-group-search-input', 'Sunday 10'); await btn(c, /^Search$/); await c.sleep(3200); await onlyTraining(c);
        const g = await byText(c, 'button', /^Sunday 10:00 AM - 11:50 AM Scholar T2: SmartFit Lower/, 'to'); await c.hl(g, 5); await c.glide(g); await c.sleep(1200); await btn(c, /^Sunday 10:00 AM - 11:50 AM Scholar T2: SmartFit Lower/); await c.sleep(2600); await onlyTraining(c); await c.unhl();
        const s = await byText(c, 'button', /2027-05-09/, 'tos'); await c.hl(s, 5); await c.glide(s); await c.sleep(1200); await btn(c, /2027-05-09/); await c.sleep(2500); await c.unhl(); } },
    { say: 'Check the FROM and TO sessions, add a note if needed, and click Approve and Execute Change. The change happens straight away. We stop here without approving.',
      run: async c => { const a = await byText(c, 'button', /Approve and Execute Change/, 'ap'); await c.scrollTo(a, 300); await c.hl(a, 6); await c.glide(a); await c.sleep(3000); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
