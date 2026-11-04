// Assessor forms as questionnaires + public link (dev, ML sggroupml, training centre only). Builds a demo form, opens it as a visitor, finds the response, closes the link.
// The form and its response are removed afterwards by capture/reseed_af.sh unseed.
const path = require('path'), { execFileSync } = require('child_process');
const { makeVideo, sleep } = require('./lib');
const SEED = path.join(__dirname, '../capture/reseed_af.sh');
const EMAIL = 'sample.visitor@example.com';
let LINK = '', FORM_ID = '';
const hold = async (c, sel, pad = 4, ms = 1500) => { await c.hl(sel, pad); await c.glide(sel); await c.sleep(ms); await c.unhl(); };
execFileSync(SEED, ['unseed'], { stdio: 'inherit' });
makeVideo({
  name: 'assessor-public', who: 'ml', startPath: '/acp/cogmap-assessor-forms',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { // on the Forms list only the training centre's rows are shown
      if (!location.pathname.includes('cogmap-assessor-forms')) return;
      const f = () => document.querySelectorAll('tbody tr').forEach(tr => { if (!tr.textContent.includes('SG BF Training Centre 2027') && !tr.textContent.includes('No ')) tr.style.display = 'none'; });
      const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
    await c.page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  },
  beats: [
    { say: 'The form builder is not only for CogMAP assessor notes. You can also use it to make a general questionnaire, and even share it with people who have no BrainFit account. Start in Accounts, Assessor Notes, Forms, and click New Form.',
      run: async c => {
        const t = await c.tag(`return document.querySelector('table')`, 'tbl'); await hold(c, t, 3, 1500);
        const n = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === '+ New Form')`, 'nf'); await c.hl(n, 4); await c.glide(n); await c.sleep(700); await c.unhl(); await c.click(n, { wait: true }); await c.sleep(2000);
      } },
    { say: 'Give the form a name, a section title, and your questions. Here we ask how the visit was, what the visitor enjoyed most, and for any other comments.',
      run: async c => {
        await c.type('.afe-title-input', 'Training Centre feedback (demo)');
        await c.type('.afe-sec-title', 'Your visit');
        await c.type('.afe-q-label', 'How was your visit?');
        await c.page.evaluate(() => document.querySelector('.afe-opt-input').select()); await c.page.keyboard.type('Great', { delay: 70 });
        await c.page.evaluate(() => [...document.querySelectorAll('.afe-opt-add button')].find(b => b.textContent.trim() === 'Add option').click()); await c.sleep(300);
        await c.page.evaluate(() => [...document.querySelectorAll('.afe-opt-input')].pop().select()); await c.page.keyboard.type('Could be better', { delay: 70 });
        for (const [label, type] of [['What did you enjoy most?', 'text'], ['Any other comments?', 'textarea']]) {
          const b = await c.tag(`return [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.textContent.trim() === 'Question').pop()`, 'aq'); await c.click(b); await c.sleep(600);
          await c.type('.afe-q-label', label); await c.page.select('select[aria-label="Question type"]', type); await c.sleep(500);
        }
      } },
    { say: 'Untick About a student, because this questionnaire is not about a child. Then choose who can fill it in. BrainFit login is the default. Only a Super Admin, or a Master Licensee who is the form\'s author, can choose Public link. Add the centre that will see the answers.',
      run: async c => {
        await c.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await c.sleep(900);
        const cb = await c.tag(`const c = [...document.querySelectorAll('input[type=checkbox]')].find(c => (c.closest('label,div') || {}).textContent?.includes('About a student')); return c`, 'ab'); await c.click(cb); await c.sleep(600);
        const s = await c.tag(`return document.querySelector('select[aria-label="Who can fill it in"]')`, 'vis'); await c.hl(s, 4); await c.glide(s); await c.sleep(700);
        await c.page.select('select[aria-label="Who can fill it in"]', 'public'); await c.sleep(1800); await c.unhl();
        await c.type('.afe-center-search', 'Training Centre 2027'); await c.sleep(700);
        const r = await c.tag(`const els = [...document.querySelectorAll('body *')].filter(e => e.offsetParent && e.textContent.trim() === 'SG BF Training Centre 2027'); return els[els.length - 1]`, 'ctr'); await c.click(r); await c.sleep(900);
        await c.page.evaluate(() => { const s = document.querySelector('.afe-center-search'); s.value = ''; s.dispatchEvent(new Event('input', { bubbles: true })); });
      } },
    { say: 'Switch Published on and click Save. The link appears. It only works while the form is Published. Copy gives you the link to send, and New link makes a new one and stops the old one working.',
      run: async c => {
        const p = await c.tag(`return [...document.querySelectorAll('.afe-switch-input')].pop()`, 'pub'); await c.click(p); await c.sleep(500);
        const sv = await c.tag(`return document.querySelector('.afe-btn-primary')`, 'sv'); await c.click(sv); await c.sleep(2500);
        FORM_ID = (c.page.url().match(/forms\/(\d+)/) || [])[1];
        await c.go(`/acp/cogmap-assessor-forms/${FORM_ID}/edit`); await c.sleep(1500);
        LINK = await c.page.evaluate(() => document.querySelector('input[aria-label="Public link"]').value);
        await c.page.evaluate(() => { const i = document.querySelector('input[aria-label="Public link"]'); i.setAttribute('data-real', i.value); }); // the dev address is only shown as hq.brainfitstudio.com
        await c.page.evaluate(() => { const i = document.querySelector('input[aria-label="Public link"]'); i.value = i.value.replace(/^https:\/\/[^/]+/, 'https://hq.brainfitstudio.com'); });
        await c.page.evaluate(() => window.scrollTo({ top: 0 })); await c.sleep(400);
        const l = await c.tag(`return document.querySelector('input[aria-label="Public link"]').parentElement`, 'lnk'); await hold(c, l, 5, 2200);
      } },
    { say: 'Anyone with the link can open it in any browser, on a phone or a computer, without logging in. They give their name and email, answer the questions, and click Submit. Then they see a thank you message.',
      run: async c => {
        await c.go(LINK); await c.sleep(1200);
        await c.type('#pf_name', 'Sample Visitor'); await c.type('#pf_email', EMAIL);
        const r = await c.tag(`return [...document.querySelectorAll('label')].find(l => l.textContent.trim() === 'Great')`, 'gr'); await c.click(r);
        await c.type('input[name^="answers"][type=text]', 'The games'); await c.type('textarea', 'Thank you!');
        const sb = await c.tag(`return document.querySelector('button[type=submit]')`, 'sb'); await c.click(sb, { wait: true }); await c.sleep(2500);
      } },
    { say: 'Back in Brain HQ, open Assessor Notes. A public response shows the person\'s name and email with a Public tag. Use the Source filter to see only public responses, or search by name or email to find one person. People who can see responses without a student are the form\'s author, Super Admin, and staff of the centres the form is assigned to.',
      run: async c => {
        await c.go(`/acp/cogmap-assessor-notes?source=public&q=${encodeURIComponent(EMAIL)}`); await c.sleep(1200);
        const q = await c.tag(`return document.querySelector('input[name=q]')`, 'q'); await hold(c, q, 4, 1500);
        const s = await c.tag(`return document.querySelector('select[name=source]')`, 'src'); await hold(c, s, 4, 1500);
        const row = await c.tag(`return document.querySelector('tbody tr')`, 'row'); await hold(c, row, 3, 2500);
      } },
    { say: 'To stop collecting answers, switch Published off and save. The link then says This form is closed. Staff can still fill in general forms from New Assessor Note, Or fill in a general form.',
      run: async c => {
        await c.go(`/acp/cogmap-assessor-forms/${FORM_ID}/edit`); await c.sleep(1500);
        const p = await c.tag(`return [...document.querySelectorAll('.afe-switch-input')].pop()`, 'pub'); await c.click(p); await c.sleep(500);
        const sv = await c.tag(`return document.querySelector('.afe-btn-primary')`, 'sv'); await c.click(sv); await c.sleep(2500);
        await c.go(LINK); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); })
  .finally(() => { try { execFileSync(SEED, ['unseed'], { stdio: 'inherit' }); } catch (e) {} });
