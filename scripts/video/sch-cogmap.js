const { makeVideo } = require('./lib');
const { btn, onlyTraining, byText } = require('./schh');
const hlBtn = async (c, re, name = 'b') => { const b = await byText(c, 'button', re, name); await c.hl(b, 5); await c.glide(b); return b; };
makeVideo({
  name: 'sch-cogmap', site: 'sch', startPath: '/classrooms/booking/',
  beats: [
    { say: 'To book a CogMAP assessment, open Booking and click Select on Cogmap Assessment.',
      run: async c => {
        const card = await c.tag(`const card = [...document.querySelectorAll('div')].find(d => d.querySelector('h3,h4') && /Cogmap Assessment/.test(d.querySelector('h3,h4').textContent) && d.querySelector('button,a')); return card`, 'cm'); await c.hl(card, 4); await c.glide(card); await c.sleep(2000);
        await c.page.evaluate(() => [...document.querySelector('[data-v-cm]').querySelectorAll('button,a')].find(x => /Select/.test(x.textContent)).click()); await c.sleep(1500); await c.unhl();
      } },
    { say: 'Check the centre, the one selected at the top right, and click Continue.',
      run: async c => { const s = await c.tag(`return document.querySelector('header select, nav select, #center-select, [name*=center]')?.closest('div')`, 'ctr').catch(() => null); if (s) { await c.hl(s, 5); await c.glide(s); } await c.sleep(2000); await c.unhl(); await hlBtn(c, /^Continue/, 'cont'); await c.sleep(1200); await btn(c, /^Continue/); await c.sleep(1500); await c.unhl(); } },
    { say: 'Search for the parent by name or email, and click Select. Or fill in the form below to create a new parent.',
      run: async c => { await c.type('#parent-search-input', 'sgtc27.p04'); await btn(c, /^Search$/); await c.sleep(3200); await onlyTraining(c); const s = await byText(c, 'button', /^Select$/, 'sel'); await c.hl(s, 5); await c.glide(s); await c.sleep(1500); await btn(c, /^Select$/); await c.sleep(1500); await c.unhl(); } },
    { say: 'Pick the student, or add a new one, then continue.',
      run: async c => {
        await hlBtn(c, /^Continue/, 'cont'); await c.sleep(1000); await btn(c, /^Continue/); await c.sleep(2800); await c.unhl();
        const st = await c.tag(`const b = [...document.querySelectorAll('button')].find(b => { if (!b.offsetParent || !/Select/.test(b.textContent)) return false; let e = b; for (let i = 0; i < 5; i++) { e = e.parentElement; if (e.textContent.includes('Sarah Ng')) return !e.textContent.includes('Faith Ng'); } return false; }); return b`, 'st'); await c.hl(st, 5); await c.glide(st); await c.sleep(1500); await c.page.evaluate(() => document.querySelector('[data-v-st]').click()); await c.sleep(1500); await c.unhl(); await hlBtn(c, /^Continue/, 'cont2'); await c.sleep(900); await btn(c, /^Continue/); await c.sleep(2500); await c.unhl();
      } },
    { say: 'Choose the session. Search a class group and pick one of its sessions. Or click Create One-off Adhoc Session to book a slot outside the class timetable: pick the trainer, the date and the time, then Use This Slot.',
      run: async c => {
        const a = await hlBtn(c, /Create One-off Adhoc Session/, 'adhoc'); await c.sleep(1200); await btn(c, /Create One-off Adhoc Session/); await c.sleep(2500); await c.page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' })); await c.sleep(2500); await c.unhl();
        await c.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await c.sleep(600);
        await hlBtn(c, /Use Existing Class Session/, 'ex'); await c.sleep(900); await btn(c, /Use Existing Class Session/); await c.sleep(1200); await c.unhl();
        await c.type('#session-group-search-input', 'Monday 4'); await btn(c, /^Search$/); await c.sleep(3200); await onlyTraining(c);
        await btn(c, /^Monday 4:00 PM - 5:50 PM Scholar T1: SmartFit Lower/); await c.sleep(2600); await onlyTraining(c);
      } },
    { say: 'Pick the session, check the summary, and click Confirm Booking. The booking shows in See All Bookings and on the calendar. We stop before confirming.',
      run: async c => {
        await c.page.evaluate(() => { const e = [...document.querySelectorAll('[onclick^="selectSession"]')].find(e => /2027-01-11|Jan 11, 2027/.test(e.textContent)); e && e.click(); }); await c.sleep(1500);
        await btn(c, /^Continue/); await c.sleep(2600);
        const cf = await byText(c, 'button', /Confirm/, 'cf', true); await c.scrollTo(cf, 300); await c.hl(cf, 6); await c.glide(cf); await c.sleep(2000);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
