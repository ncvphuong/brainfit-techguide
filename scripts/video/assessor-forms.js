// CogMAP Assessor Forms: build a form (dev, power_ma_sg, training centre only). The new form is typed into but Cancelled, so nothing is saved.
const { makeVideo } = require('./lib');
const TC = 'SG BF Training Centre 2027', NAME = 'Demo CogMAP Assessor Notes';
const onlyTC = c => c.page.evaluate(tc => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes(tc) && !tr.textContent.includes('No ')) tr.style.display = 'none'; }), TC);
const setv = (c, sel, v) => c.page.evaluate((sel, v) => { const el = document.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, sel, v);
makeVideo({
  name: 'assessor-forms', who: 'ma', startPath: '/acp/cogmap-assessor-forms',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { // other centres' rows are never shown (training centre only)
      const f = () => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes('SG BF Training Centre 2027') && !tr.textContent.includes('No ')) tr.style.display = 'none'; });
      const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
    await c.go('/acp/cogmap-assessor-forms');
  },
  beats: [
    { say: 'Every Assessor Note is filled in on a form, and the Forms tab is where forms are made. The list shows each form\'s language, the centres that use it, its author, how many questions and notes it has, and whether it is On or Off. You only see the forms of your own centres.',
      run: async c => { await onlyTC(c); const t = await c.tag(`return document.querySelector('table')`, 'tbl'); await c.hl(t, 3); await c.glide(t); await c.sleep(4500); await c.unhl(); } },
    { say: 'Super Admin, Master Licensee, Master Admin and Centre Admin can create forms. Click New Form. Give it a name, choose its language, tick the centres that use it, and decide whether it is On.',
      run: async c => {
        const n = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === '+ New Form')`, 'nf'); await c.hl(n, 4); await c.glide(n); await c.sleep(900); await c.unhl(); await c.click(n, { wait: true });
        const i = await c.tag(`return document.querySelector('input[name="form[name]"]')`, 'nm'); await c.click(i); await c.page.keyboard.type('Assessor Notes (Thai)', { delay: 70 });
        const l = await c.tag(`return document.querySelector('select[name="form[language]"]')`, 'lg'); await c.hl(l, 3); await c.glide(l); await c.sleep(600);
        await c.page.evaluate(() => { const s = document.querySelector('select[name="form[language]"]'); const o = [...s.options].find(o => o.text === 'Thai'); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }); await c.sleep(1200); await c.unhl();
        const cl = await c.tag(`return [...document.querySelectorAll('.fe-centres label')].find(l => l.textContent.trim() === '${TC}')`, 'ctr'); await c.glide(cl); await c.page.evaluate(() => document.querySelector('[data-v-ctr] input').click()); await c.hl(cl, 3); await c.sleep(2500);
      } },
    { say: 'A form is made of sections, and a section can have sub-sections. Give the section a title, then add questions. Each question has a label and a type: single choice, multiple choice, short text, long text, date, or grid.',
      run: async c => {
        await c.unhl(); const s = await c.tag(`return document.querySelector('#fe_sections input[placeholder="Section title"]')`, 'sec'); await c.scrollTo(s, 200); await c.click(s); await c.page.keyboard.type('Assessment details', { delay: 60 });
        const q = await c.tag(`return document.querySelector('#fe_sections .fe-q input[placeholder="Question"]')`, 'q'); await c.click(q); await c.page.keyboard.type('Type of assessment', { delay: 60 }); await c.sleep(700);
        const ty = await c.tag(`return document.querySelector('#fe_sections .fe-q select')`, 'ty'); await c.hl(ty, 3); await c.glide(ty); await c.sleep(2000); await c.unhl();
      } },
    { say: 'For choice questions, type the options one per line, and tick Other if the assessor may type their own answer. Use the arrows to reorder, and the cross to delete. Plus Question, Plus Sub-section and Plus Section add more. Then you click Save form. Here we click Cancel, so nothing is saved.',
      run: async c => {
        const o = await c.tag(`return document.querySelector('#fe_sections .fe-q textarea')`, 'op'); await c.click(o); await c.page.keyboard.type('Initial assessment\nRe-assessment', { delay: 45 }); await c.sleep(600);
        const tl = await c.tag(`return document.querySelector('#fe_sections .fe-tools')`, 'tl'); await c.hl(tl, 3); await c.glide(tl); await c.sleep(1800); await c.unhl();
        const bs = await c.tag(`return [...document.querySelectorAll('#fe_sections button')].find(b => b.textContent.trim() === '+ Question')`, 'aq'); await c.hl(bs, 4); await c.glide(bs); await c.sleep(1500); await c.unhl();
        const cn = await c.tag(`return [...document.querySelectorAll('#fe_form a')].find(a => a.textContent.trim() === 'Cancel')`, 'cx'); await c.hl(cn, 4); await c.click(cn, { wait: true }); await c.sleep(1500);
      } },
    { say: 'Back in the list, each form has Preview, Edit and Duplicate. Preview shows the form the way assessors will see it, and nothing can be saved there.',
      run: async c => {
        await onlyTC(c); const r = await c.tag(`return [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td strong')?.textContent.trim() === '${NAME}')`, 'row'); await c.hl(r, 3); await c.glide(r); await c.sleep(1500); await c.unhl();
        const p = await c.tag(`return [...document.querySelector('[data-v-row]').querySelectorAll('a')].find(a => a.textContent.trim() === 'Preview')`, 'pv'); await c.click(p, { wait: true }); await c.sleep(3000);
      } },
    { say: 'Only the form\'s author and Super Admin can edit or delete it. Duplicate is the quickest way to make another version, for example a Thai copy of an English form. The copy starts Off, so you can translate it and pick its centres before you turn it On. Editing a form never changes notes that were already filled in.',
      run: async c => {
        await c.go('/acp/cogmap-assessor-forms'); await onlyTC(c);
        const d = await c.tag(`return [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td strong')?.textContent.trim() === '${NAME}')?.querySelectorAll('a')[2]`, 'dp'); await c.hl(d, 4); await c.glide(d); await c.sleep(4500); await c.unhl();
        const e = await c.tag(`return [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td strong')?.textContent.trim() === '${NAME}')?.querySelectorAll('a')[1]`, 'ed'); await c.hl(e, 4); await c.glide(e); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
