const { makeVideo } = require('./lib');
const { btn, onlyTraining } = require('./schh');
makeVideo({
  name: 'sch-calendar', site: 'sch', startPath: '/classrooms/calendar/',
  beats: [
    { say: 'Open Calendar, and pick the centre, and a class if you like. The month view shows every session as a block. Use the arrows to move between months. The training centre\'s classes start in January 2027.',
      run: async c => {
        const f = await c.tag(`return [...document.querySelectorAll('label')].find(l => l.textContent.trim() === 'Center')?.closest('div')`, 'cen'); await c.hl(f, 4); await c.glide(f); await c.sleep(2500); await c.unhl();
        for (let i = 0; i < 3; i++) { const n = await c.tag(`return document.querySelector('.fc-next-button')`, 'nx'); await c.glide(n); await c.sleep(300); await c.page.evaluate(() => document.querySelector('.fc-next-button').click()); await c.sleep(1400); }
        await c.sleep(1500);
      } },
    { say: 'Switch to week, day or list to see the times. Click a session to see who is coming and to take attendance.',
      run: async c => {
        const w = await c.tag(`return document.querySelector('.fc-timeGridWeek-button')`, 'wk'); await c.hl(w, 4); await c.glide(w); await c.sleep(900); await c.page.evaluate(() => document.querySelector('.fc-timeGridWeek-button').click()); await c.sleep(1200); await c.unhl();
        await c.page.evaluate(() => document.querySelector('.fc-next-button').click()); await c.sleep(2500);
        await onlyTraining(c); await c.sleep(1500);
      } },
    { say: 'To see one class group\'s whole term, open it from Class Groups. You see its session template, which is the day and time, every week\'s session with its attendance count, the trainer, the students and the waitlist.',
      run: async c => { await c.go('/classrooms/class-group/1195/'); await c.sleep(2500); await c.page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' })); await c.sleep(2500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
