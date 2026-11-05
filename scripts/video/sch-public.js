// SCH public class availability page + Brian (dev SCH, training centre #132 only). Staff side as the MA capture account, the Super Admin-only screens with a dev-only SA session.
// A sample enrolment request is sent on dev (fake parent, example.com), and Brian is asked a few questions. The link's secret code is masked on every page and sample names on the staff list are replaced.
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
    await c.page.evaluateOnNewDocument(() => { // never show the secret code; replace the names of earlier dev test requests on the staff list
      const map = { 'DEV Check': 'Sample Parent A', 'dev.check@example.com': 'parent.a@example.com', 'Linh Nguyen': 'Sample Parent B', 'linh.qa@example.com': 'parent.b@example.com', 'QA Parent': 'Sample Parent C', 'qa.parent@example.com': 'parent.c@example.com', 'DEV Child': 'Child A', 'Minh': 'Child B', 'QA Child': 'Child C', '+84987654321': '+6590000002', '+6591234567': '+6590000001' };
      const m = () => {
        document.querySelectorAll('input').forEach(i => { if (/public\/availability/.test(i.value)) i.value = 'https://scheduling.brainfitstudio.com/public/availability/••••••••••••••••/'; });
        if (location.pathname.includes('public-waitlist-requests')) { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let t = n.nodeValue; for (const k of Object.keys(map)) t = t.split(k).join(map[k]); if (t !== n.nodeValue) n.nodeValue = t; } document.querySelectorAll('a[href^="mailto:"]').forEach(a => { a.removeAttribute('href'); }); }
      };
      const b = () => { m(); setInterval(m, 150); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
    await c.page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  },
  beats: [
    { say: 'Each centre can have a public link to a page that shows which weekly classes have space. Nobody has to log in. Staff manage it in Scheduling, under Class Groups, Class Availability. Select the centre, then click Public Link at the top right.',
      run: async c => { await c.sleep(2000); const b = await c.tag(`return document.querySelector('#public-link-btn')`, 'plb'); await c.hl(b, 5); await c.glide(b); await c.sleep(900); await c.unhl(); await c.click(b); await c.sleep(1500); } },
    { say: 'Copy link copies the address to post on your website, QR codes or WhatsApp. Turn off pauses the page, and Turn on opens it again with the same address. New link makes a new address and the old one stops working at once, so use it only if the link has been compromised, and then update every place it was posted. The link does not change when classes or terms change.',
      run: async c => {
        for (const t of ['Copy link', 'Turn off', 'New link']) { const b = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && e.textContent.trim() === '${t}')`, 'pb'); await hold(c, b, 5, 2600); }
        await c.page.keyboard.press('Escape'); await c.sleep(800);
      } },
    { say: 'This is what a parent sees. It lists the Normal and Premium classes of the current and future terms, with the day, the time, and Available or Full. There are no numbers and no names. Times are in the visitor\'s own timezone. The switch at the top right sets light, system or dark theme, and the page remembers it.',
      run: async c => {
        await c.go(LINK); await c.sleep(2500);
        const f = await c.tag(`return [...document.querySelectorAll('.card.full')][0]`, 'fl'); if (f) await hold(c, f, 4, 2500);
        const dk = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '☾')`, 'dk'); await c.hl(dk, 6); await c.glide(dk); await c.sleep(700); await c.click(dk); await c.sleep(2500); await c.unhl();
        const sy = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '◐')`, 'sy'); await c.click(sy); await c.sleep(1200);
      } },
    { say: 'A parent taps a class, even a full one, and the Interest to Enroll window opens. They give their name, email, phone with a country, the child\'s name and age, an optional start date and message, and click Submit. This is an enrolment request, not a confirmed place. Nothing is held and nothing is created in HQ.',
      run: async c => {
        const k = await c.tag(`return document.querySelector('.card.go:not(.full)')`, 'cd'); await c.click(k); await c.sleep(1200);
        await c.type('#wl-name', 'Sample Parent'); await c.type('#wl-email', 'sample.parent@example.com'); await c.type('#wl-phone', '9123 4567');
        await c.type('#wl-child', 'Sample Child'); await c.type('#wl-age', '8');
        await c.page.evaluate(() => { const d = document.querySelector('input[type=date]'); d.value = '2026-12-05'; d.dispatchEvent(new Event('input', { bubbles: true })); d.dispatchEvent(new Event('change', { bubbles: true })); });
        await c.type('#wl-note', 'Prefers Saturday mornings. (sample)'); await c.sleep(800);
        const s = await c.tag(`return document.querySelector('#wl-send')`, 'sd'); await c.hl(s, 5); await c.glide(s); await c.sleep(700); await c.unhl(); await c.click(s); await c.sleep(3500);
      } },
    { say: 'The parent gets a thank-you email, and the class trainers, the centre front desk and the centre admins get a New enrolment enquiry email. In Scheduling, open Class Groups, Enrolment Request. Admin roles see every request with the parent, the child, the class and a status: New, Contacted, Converted or Dismissed. Contact the parent, update the status and add a note. Enrolling the child still happens in the usual way.',
      run: async c => {
        await c.go('/classrooms/class-groups/availability/'); await c.sleep(1500);
        const m = await c.tag(`return document.querySelector('#class-groups-menu-button')`, 'mn'); await c.click(m); await c.sleep(800);
        const e = await c.tag(`return document.querySelector('a[href*="public-waitlist-requests"]')`, 'er'); await hold(c, e, 4, 2000);
        await c.go('/classrooms/public-waitlist-requests/'); await c.sleep(2000);
        const t = await c.tag(`return document.querySelector('tbody tr, table')`, 'tb'); await hold(c, t, 4, 3500);
        const f = await c.tag(`return document.querySelector('a[href="?status=new"]')?.parentElement`, 'ft'); if (f) await hold(c, f, 4, 2500);
      } },
    { say: 'Visitors can also ask Brian, the assistant at the bottom right. Brian only knows this centre\'s classes for the current term and the next term. He answers in English, Vietnamese, Bahasa Indonesia, Thai or Simplified Chinese, and he can help a parent send an enrolment request.',
      run: async c => { await c.go(LINK); await c.sleep(2000); const f = await c.tag(`return document.querySelector('#brian-fab')`, 'fab'); await c.click(f); await c.sleep(1200); await ask(c, 'Is there a Saturday morning class with space?'); await c.sleep(1500); } },
    { say: 'When a parent wants to enrol, Brian asks for the missing details, reads them back, and sends the request only after the parent says yes. The request appears on the Enrolment Request screen with the source Brian. Brian cannot promise a place, and the visitor is told that chats are recorded.',
      run: async c => { await ask(c, 'I would like to enrol my child in the Saturday 2pm class.'); await ask(c, 'Sample Parent, sample.brian@example.com, +65 9123 4567, child Sample Child, age 8. No start date.'); await c.sleep(2500); } },
    { say: 'Only a Super Admin sees two more controls in the Public Link window. Brian chat ON or OFF switches Brian for a centre, and the page itself keeps working when Brian is off. Brian conversations opens the log of every conversation, with the spend against the 30 dollar monthly cap. Chats are recorded, so tell visitors not to type personal details unless they are sending a request.',
      run: async c => {
        await c.page.setCookie({ name: SA.name, value: SA.value, domain: 'scheduling.dev3.powerdigital.sg', path: '/', secure: true });
        await c.go('/classrooms/class-groups/availability/'); await c.sleep(2000);
        const pb = await c.tag(`return document.querySelector('#public-link-btn')`, 'plb'); await c.click(pb); await c.sleep(1200);
        const b = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian chat/.test(e.textContent))`, 'bc'); await hold(c, b, 5, 2000);
        const l = await c.tag(`return [...document.querySelectorAll('button,a')].find(e => e.offsetParent && /Brian conversations/.test(e.textContent))`, 'bl'); await hold(c, l, 5, 1500); await c.go('/classrooms/brian-conversations/'); await c.sleep(2500);
        const sp = await c.tag(`return [...document.querySelectorAll('p,div,span')].find(e => /spend/i.test(e.textContent) && e.children.length < 4)`, 'sp'); if (sp) await hold(c, sp, 4, 2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
