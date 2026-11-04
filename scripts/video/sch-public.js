// SCH public class availability page + Brian (dev SCH, training centre #132 only). Staff side as the MA capture account, the Super Admin-only screens with a dev-only SA session.
// Nothing is changed: the link buttons are only pointed at, Brian is asked two questions. The link's secret code is masked on every page.
const fs = require('fs'), path = require('path');
const { makeVideo } = require('./lib');
const LINK = process.env.PA_LINK; if (!LINK) throw new Error('set PA_LINK');
const SA = JSON.parse(fs.readFileSync(path.join(__dirname, '../capture/sch_cookie_sa.json'), 'utf8'));
const hold = async (c, sel, pad = 4, ms = 1500) => { await c.hl(sel, pad); await c.glide(sel); await c.sleep(ms); await c.unhl(); };
const ask = async (c, q) => {
  await c.type('#bin', q); const before = await c.page.evaluate(() => document.querySelector('#brian-panel').innerText.length);
  const s = await c.tag(`return document.querySelector('#bsend')`, 'bs'); await c.click(s);
  let last = -1, same = 0; for (let i = 0; i < 40 && same < 3; i++) { await c.sleep(1000); const n = await c.page.evaluate(() => document.querySelector('#brian-panel').innerText.length); if (n > before && n === last) same++; else same = 0; last = n; }
};
makeVideo({
  name: 'sch-public', site: 'sch', startPath: '/classrooms/class-groups/availability/',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { // never show the secret code
      const m = () => document.querySelectorAll('input').forEach(i => { if (/public\/availability/.test(i.value)) i.value = 'https://scheduling.brainfitstudio.com/public/availability/••••••••••••••••/'; });
      const b = () => { m(); setInterval(m, 150); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
    await c.page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  },
  beats: [
    { say: 'Each centre can have a public link that shows which weekly class slots still have space. Nobody has to log in to open it. Staff manage it in Scheduling, under Class Groups, Class Availability. Select the centre at the top, then click Public Link at the top right.',
      run: async c => { await c.sleep(2000); const b = await c.tag(`return document.querySelector('#public-link-btn')`, 'plb'); await c.hl(b, 5); await c.glide(b); await c.sleep(900); await c.unhl(); await c.click(b); await c.sleep(1500); } },
    { say: 'The window shows the link. Copy link copies the address to send to families. Turn off stops the page showing anything until you turn it on again. New link makes a new address and the old one stops working at once. Super Admin, Master Licensee, Master Admin and Centre Admin can manage it. Treat the link like a password: anyone who has it can see the page.',
      run: async c => {
        for (const t of ['Copy link', 'Turn off', 'New link']) { const b = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && e.textContent.trim() === '${t}')`, 'pb'); await hold(c, b, 5, 1700); }
        await c.page.keyboard.press('Escape'); await c.sleep(800);
      } },
    { say: 'This is what a visitor sees. It lists the active, published class groups of the current term, with each class, day and time, and how many places are taken out of the capacity. A full class is marked Full in red. Times are shown in the visitor\'s own timezone. There are no student or teacher names. On a phone it is a list by day instead of a weekly calendar.',
      run: async c => { await c.go(LINK); await c.sleep(2500); const f = await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length === 0 && /6\\/6/.test(e.textContent) && /Full/.test(e.parentElement.textContent))?.closest('div')`, 'fl'); if (f) await hold(c, f, 4, 2500); await c.sleep(1500); } },
    { say: 'Visitors can also ask Brian, the assistant at the bottom right. Brian only knows this centre\'s availability. It answers in English, Vietnamese, Bahasa Indonesia, Thai or Simplified Chinese, in the language the visitor writes in. Ask for a Saturday morning class, and Brian lists what has space.',
      run: async c => { const f = await c.tag(`return document.querySelector('#brian-fab')`, 'fab'); await c.click(f); await c.sleep(1200); await ask(c, 'Is there a Saturday morning class with space?'); await c.sleep(1500); } },
    { say: 'Ask in Vietnamese, and Brian answers in Vietnamese. Brian cannot enrol anyone, see names or change anything. It always points visitors to the centre to confirm a place. Questions are limited to 300 characters, and the visitor is told that chats are recorded and not to share personal details.',
      run: async c => { await ask(c, 'Có lớp nào vào thứ Năm còn chỗ không?'); await c.sleep(2500); } },
    { say: 'Only a Super Admin sees two more controls in the same window. Brian chat ON or OFF switches Brian for a centre, and the page itself keeps working when Brian is off. Brian conversations opens the log.',
      run: async c => {
        await c.page.setCookie({ name: SA.name, value: SA.value, domain: 'scheduling.dev3.powerdigital.sg', path: '/', secure: true });
        await c.go('/classrooms/class-groups/availability/'); await c.sleep(2000);
        const pb = await c.tag(`return document.querySelector('#public-link-btn')`, 'plb'); await c.click(pb); await c.sleep(1200);
        const b = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian chat/.test(e.textContent))`, 'bc'); await hold(c, b, 5, 2000);
        const l = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian conversations/.test(e.textContent))`, 'bl'); await hold(c, l, 5, 1500); await c.go('/classrooms/brian-conversations/'); await c.sleep(1500);
      } },
    { say: 'Every Brian conversation is saved, with the centre, the date and each question and answer. Brian has a spend cap of 30 dollars a month. When it is reached Brian stops answering and the availability page keeps working. Chats are recorded, so tell visitors not to type personal details.',
      run: async c => {
        await c.page.evaluate(() => { const d = [...document.querySelectorAll('details')].find(e => /2 turns/.test(e.textContent)); if (d) d.open = true; }); await c.sleep(800);
        const d = await c.tag(`return [...document.querySelectorAll('details')].find(e => e.open)`, 'dt'); if (d) await hold(c, d, 4, 3500);
        const sp = await c.tag(`return [...document.querySelectorAll('p,div,span')].find(e => /spend/i.test(e.textContent) && e.children.length < 4)`, 'sp'); if (sp) await hold(c, sp, 4, 2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
