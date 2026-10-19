// Student Journey walkthrough (server12 / training centre #132, as the centre admin sgtc27_ca01). Read-only: the filter form is
// a GET. Demo journeys come from ../capture/server/guide_journey.rb (MODE=seed) and are removed afterwards (MODE=unseed).
const { makeVideo } = require('./lib');
const FORM = 'form[action$="/students/journey"]';
const card = (c, n, name) => c.tag(`return document.querySelectorAll('.sj-card')[${n}]`, name);
makeVideo({
  name: 'student-journey', who: 'ca', startPath: '/acp',
  beats: [
    { say: 'Student Journey shows what happens to students who start as Trial or CogMAP: how many enrol, how long it takes, and who is still waiting. Open the Students menu, and click Student Journey.',
      run: async c => {
        const m = await c.tag(`return [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(b => b.textContent.trim().startsWith('Students'))`, 'stu');
        await c.hl(m, 4); await c.glide(m); await c.sleep(500); await c.click(m); await c.sleep(900); await c.unhl();
        const a = await c.tag(`return [...document.querySelectorAll('.bp-dd.is-open a')].find(a => a.textContent.trim() === 'Student Journey')`, 'sj');
        await c.hl(a, 4); await c.glide(a); await c.sleep(1200); await c.click(a, { wait: true }); await c.sleep(2500); await c.unhl();
      } },
    { say: 'At the top are the filters. Choose the dates when the students started, and whether to look at Trial, CogMAP or both, then click Show. You only see your own centres: a centre admin or trainer sees their own centre, and a Master Licensee can choose between the centres they own.',
      run: async c => { await c.hl(FORM, 6); await c.glide(`${FORM} input[name="from"]`); await c.sleep(5500); } },
    { say: 'Six numbers sum it up: how many students started, how many enrolled, the conversion percentage, the median number of days it took to enrol, and how many are still waiting, including those waiting more than thirty days.',
      run: async c => { await c.unhl(); await c.hl('.sj-kpis', 6); await c.glide('.sj-kpis'); await c.sleep(6500); } },
    { say: 'The flow chart shows the paths. The width of each band is the number of students. Trial and CogMAP students flow on to Enrolled, or to Still waiting. Move over a band to see how many students it holds, and their share.',
      run: async c => {
        await c.unhl(); const f = await card(c, 0, 'flow'); await c.scrollTo(f, 90); await c.sleep(800);
        const r = await c.page.evaluate(() => { const b = document.querySelectorAll('.sj-card')[0].getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; });
        await c.hl(f, 4);
        await c.page.mouse.move(r[0] + r[2] * 0.3, r[1] + r[3] * 0.3, { steps: 25 }); await c.sleep(2500);
        await c.page.mouse.move(r[0] + r[2] * 0.55, r[1] + r[3] * 0.62, { steps: 25 }); await c.sleep(2500);
      } },
    { say: 'The by-month chart shows how many students started, and how many enrolled, in each month.',
      run: async c => {
        await c.unhl(); const m = await card(c, 1, 'mon'); await c.scrollTo(m, 90); await c.sleep(800); await c.hl(m, 4);
        const r = await c.page.evaluate(() => { const b = document.querySelectorAll('.sj-card')[1].getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; });
        await c.page.mouse.move(r[0] + r[2] * 0.68, r[1] + r[3] * 0.55, { steps: 25 }); await c.sleep(2500);
      } },
    { say: 'Still waiting lists the students who have not enrolled yet, longest first, with their type and the number of days they have waited. These are the students to follow up.',
      run: async c => { await c.unhl(); const l = await card(c, 2, 'wait'); await c.scrollTo(l, 90); await c.sleep(800); await c.hl(l, 4); await c.sleep(2500); } },
    { say: 'Recently enrolled shows who enrolled and by which route: Trial to Enrolled, CogMAP to Enrolled, or an account merge. Click a name to open the student.',
      run: async c => { await c.unhl(); const l = await card(c, 3, 'rec'); await c.hl(l, 4); await c.glide(l); await c.sleep(3500); } },
    { say: 'To look at one group, choose a starting type, for example Trial, and click Show. The numbers and charts update to match.',
      run: async c => {
        await c.unhl(); await c.page.evaluate(() => scrollTo({ top: 0 })); await c.sleep(900);
        await c.hl(`${FORM} select[name="start_type"]`, 4); await c.glide(`${FORM} select[name="start_type"]`); await c.sleep(800);
        await c.page.select(`${FORM} select[name="start_type"]`, 'trial_class'); await c.sleep(900);
        const b = await c.tag(`return [...document.querySelectorAll('form[action$="/students/journey"] button, form[action$="/students/journey"] input[type=submit]')].find(x => /Show/.test(x.textContent + x.value))`, 'show');
        await c.unhl(); await c.hl(b, 4); await c.click(b, { wait: true }); await c.sleep(3000); await c.unhl();
      } },
    { say: 'Every journey comes from the student\'s own history. On a student\'s page, the Activity Log shows each change of student type, for example CogMAP to Enrolled, and how the account was first created.',
      run: async c => {
        const a = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Demo Journey 02')`, 'stud');
        await c.scrollTo(a, 200); await c.hl(a, 3); await c.click(a, { wait: true }); await c.unhl(); await c.sleep(600);
        const h = await c.tag(`return [...document.querySelectorAll('.panel-title, h1, h2, h3, h4')].find(e => e.textContent.trim() === 'Activity Log')`, 'log');
        const t = await c.tag(`const h = [...document.querySelectorAll('.panel-title, h1, h2, h3, h4')].find(e => e.textContent.trim() === 'Activity Log'); const top = h.getBoundingClientRect().top; return [...document.querySelectorAll('table')].find(t => t.getBoundingClientRect().width > 0 && t.getBoundingClientRect().top > top)`, 'logt');
        await c.scrollTo(h, 70); await c.sleep(700); await c.hl(t, 4); await c.sleep(5500);
      } },
    { say: 'Use Student Journey to see how many Trial and CogMAP students enrol, and to follow up the ones who are still waiting.',
      run: async c => { await c.hl('[data-v-logt]', 4); await c.sleep(3500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
