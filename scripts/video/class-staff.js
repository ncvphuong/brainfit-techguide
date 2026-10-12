const { makeVideo } = require('./lib');
const { guide } = require('./hq');
let who;
makeVideo({
  name: 'class-staff', who: 'ma', startPath: '/acp/class_rooms/1407',
  beats: [
    { say: 'To add a trainer, open the class page and click the plus next to Trainers. For an assistant coach, use the plus next to Assistant Coaches.',
      run: async c => { const b = await c.tag(`return document.querySelector('.bp-cd-add[data-label="trainer"]')`, 'add'); const a = await c.tag(`return document.querySelector('.bp-cd-add[data-label="assistant"], .bp-cd-add[data-label*="assist"]')`, 'add2').catch(() => null); await c.hl(b, 5); if (a) await c.hl(a, 5); await c.glide(b); await c.sleep(1800); await c.click(b); await c.sleep(900); await c.unhl(); } },
    { say: 'Search by name or username. The list only shows staff of this class\'s centre who are not in the class yet. Click Add.',
      run: async c => {
        who = await c.page.evaluate(() => { const li = [...document.querySelectorAll('#bpCdStaffList li')].find(l => !l.hidden); return li ? li.querySelector('b').textContent : null; });
        const s = await c.tag(`return document.querySelector('#bpCdStaffSearch')`, 'srch'); await c.hl(s, 4); await c.type(s, who.split(' ').slice(-1)[0]); await c.sleep(600); await c.unhl();
        const a = await c.tag(`return [...document.querySelectorAll('#bpCdStaffList li')].find(l => !l.hidden)?.querySelector('.bp-cd-staff-add')`, 'addbtn'); await c.hl(a, 5); await c.glide(a);
      } },
    { say: 'The trainer now shows on the class.',
      run: async c => {
        const a = await c.tag(`return [...document.querySelectorAll('#bpCdStaffList li')].find(l => !l.hidden)?.querySelector('.bp-cd-staff-add')`, 'addbtn'); await c.click(a, { wait: true }); await c.unhl(); await c.sleep(1000);
        const ch = await c.tag(`return [...document.querySelectorAll('.bp-cd-staff')].find(x => x.textContent.includes(${JSON.stringify(who)}))`, 'chip'); await c.hl(ch, 4); await c.glide(ch);
      } },
    { say: 'To remove someone, click the cross on their name, and confirm with Remove. This only changes who teaches the class. The class\'s games and students stay as they are.',
      run: async c => {
        const x = await c.tag(`return [...document.querySelectorAll('.bp-cd-staff')].find(x => x.textContent.includes(${JSON.stringify(who)}))?.querySelector('.bp-cd-staff-x')`, 'x'); await c.hl(x, 4); await c.click(x); await c.sleep(1500);
        await c.unhl(); const k = await c.tag(`return document.querySelector('.swal2-confirm')`, 'ok'); await c.hl(k, 5); await c.glide(k); await c.sleep(900); await c.click(k, { wait: true }); await c.unhl();
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(async e => { console.error(e.message); process.exit(1); });
