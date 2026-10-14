// CogMAP Assessor Notes: fill in a note (dev, power_ma_sg, demo student sgtc27_s30 in the training centre). Nothing is saved: the form is filled in, Save is only pointed at.
const { makeVideo } = require('./lib');
const STU = 'sgtc27_s30', TC = 'SG BF Training Centre 2027';
const onlyTC = c => c.page.evaluate(tc => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes(tc) && !tr.textContent.includes('No ')) tr.style.display = 'none'; }), TC);
makeVideo({
  name: 'assessor-notes', who: 'ma', startPath: '/acp',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { // other centres' rows are never shown (training centre only)
      const f = () => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes('SG BF Training Centre 2027') && !tr.textContent.includes('No ')) tr.style.display = 'none'; });
      const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
  },
  beats: [
    { say: 'Assessor Notes is where the assessor records what they saw during a student\'s CogMAP assessment. Open the Accounts menu and click Assessor Notes, right under Notes.',
      run: async c => {
        const b = await c.tag(`return [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith('Accounts'))`, 'acc'); await c.hl(b, 3); await c.glide(b); await c.sleep(900);
        if (!(await c.page.evaluate(() => !!document.querySelector('.bp-dd.is-open')))) await c.page.mouse.click(...(await c.pos()));
        await c.sleep(800); const a = await c.tag(`return [...document.querySelectorAll('.bp-dd.is-open a')].find(a => a.textContent.trim() === 'Assessor Notes')`, 'an'); await c.hl(a, 4); await c.glide(a); await c.sleep(1500); await c.unhl();
        await c.click(a, { wait: true });
      } },
    { say: 'The Notes tab lists the notes already written. You only see students and notes from your own centres. Use the filters to narrow the list by student, centre, form or date, and click View to read a note.',
      run: async c => {
        await onlyTC(c); const f = await c.tag(`return document.querySelector('.an-filters')`, 'fil'); await c.hl(f, 4); await c.glide(f); await c.sleep(2500); await c.unhl();
        const v = await c.tag(`return [...document.querySelectorAll('tbody a')].find(a => a.textContent.trim() === 'View')`, 'view').catch(() => null); if (v) { await c.hl(v, 4); await c.glide(v); await c.sleep(1800); await c.unhl(); }
      } },
    { say: 'To write a new note, click New Assessor Note, and search for the student by name or username. Click the student in the results.',
      run: async c => {
        const n = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === '+ New Assessor Note')`, 'nn'); await c.hl(n, 4); await c.glide(n); await c.sleep(900); await c.unhl(); await c.click(n, { wait: true });
        const s = await c.tag(`return document.getElementById('an_student_search')`, 'srch'); await c.click(s); await c.page.keyboard.type(STU, { delay: 80 }); await c.sleep(2200);
        const r = await c.tag(`return document.querySelector('#an_student_results button')`, 'res'); await c.hl(r, 3); await c.glide(r); await c.sleep(1200); await c.unhl();
        await c.page.evaluate(() => document.querySelector('#an_student_results button').click()); await c.sleep(3500);
      } },
    { say: 'Each centre has its own forms. If the centre has more than one, for example one in English and one in Thai, you pick the one you need. If it has only one, it opens straight away, like here.',
      run: async c => { const p = await c.tag(`return document.querySelector('form[action*="cogmap-assessor-notes"]')?.previousElementSibling || document.querySelector('.an-section')`, 'form'); await c.hl(p, 4); await c.glide(p); await c.sleep(4500); await c.unhl(); } },
    { say: 'Fill in the questions. They can be single choice, multiple choice, short or long text, a date, or a grid.',
      run: async c => {
        const r = await c.tag(`return document.querySelector('form[action*="cogmap-assessor-notes"] input[type=radio]')`, 'rad'); await c.click(r); await c.sleep(600);
        const t = await c.tag(`return document.querySelector('form[action*="cogmap-assessor-notes"] input[type=text]')`, 'txt'); await c.click(t); await c.page.keyboard.type('Coach Raymond', { delay: 60 }); await c.sleep(500);
        const cb = await c.tag(`return document.querySelector('form[action*="cogmap-assessor-notes"] input[type=checkbox]')`, 'cb'); await c.click(cb); await c.sleep(600);
        const ta = await c.tag(`return document.querySelector('form[action*="cogmap-assessor-notes"] textarea')`, 'ta'); await c.click(ta); await c.page.keyboard.type('Settled quickly and stayed calm.', { delay: 50 }); await c.sleep(1200);
      } },
    { say: 'Then click Save Assessor Note. We stop here, so nothing is saved. The saved note opens in a read view, and it keeps a copy of the form as it was when you filled it in, so editing the form later never changes old notes.',
      run: async c => { const s = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save Assessor Note')`, 'sv'); await c.hl(s, 5); await c.glide(s); await c.sleep(3500); await c.unhl(); } },
    { say: 'Here is a saved note, in the read view.',
      run: async c => { await c.go('/acp/cogmap-assessor-notes'); const v = await c.tag(`return [...document.querySelectorAll('tbody a')].find(a => a.textContent.trim() === 'View')`, 'view2'); await c.click(v, { wait: true }); await c.sleep(2500); const h = await c.tag(`return document.querySelector('.an-section, .card-block')`, 'rd'); await c.hl(h, 3); await c.glide(h); await c.sleep(2000); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
