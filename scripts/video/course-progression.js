// Course Progression walkthrough on dev course 338 (author power_ml). Nothing is saved or clicked that writes; the certificate pages are GET only.
// The dev certificate page prints the full token in its "Verify at" line: masked on every page load before anything is filmed.
const { makeVideo } = require('./lib');
const CERT_CRM = 'https://crm.brainfitstudio.com/certificate/A7Dv7o45ynYCmvF2My5Kv0Ct/';
const btn = (c, label, name) => c.tag(`return [...document.querySelectorAll('a,button')].find(e => e.offsetParent && e.textContent.trim().replace(/\\s+/g,' ').includes(${JSON.stringify(label)}))`, name);
makeVideo({
  name: 'course-progression', who: 'author', startPath: '/acp/courses/338/edit',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => {
      const mask = () => { const w = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (/\/certificates\/\w{12,}/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(\/certificates\/)\w{12,}/g, '$1••••••••'); };
      const boot = () => { mask(); new MutationObserver(mask).observe(document.documentElement, { subtree: true, childList: true, characterData: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    });
  },
  beats: [
    { say: 'Course Progression decides when someone graduates from a course and gets a certificate, based on their quiz scores. First, the course needs quizzes. Each exam is a Quiz resource inside a topic: click the plus on a topic, set the type to Quiz, and choose the quiz.',
      run: async c => {
        await c.page.waitForSelector('.bp-ce-bar');
        const p = await c.tag(`const a = [...document.querySelectorAll('a[href*="/acp/media/topic/"]')]; return a[a.length - 1]`, 'plus');
        await c.scrollTo(p, 520); await c.sleep(600);
        await c.page.evaluate(() => { [...document.querySelectorAll('*')].filter(e => e.offsetParent && e.children.length === 0 && /(Knowledge Check|Final Exam) \(30 questions\)/.test(e.textContent) && !/^\[QA DEMO\] BrainFit Cognitive Foundations: [A-Za-z ]+ \(30 questions\)$/.test('') ).forEach(e => { const r = e.closest('.dd3-item, .dd-item, li, tr'); if (r && !r.matches('.dd-list, ol')) r.setAttribute('data-v-q', '1'); }); });
        await c.hl('[data-v-q]', 3); await c.sleep(2200); await c.glide(p); await c.hl(p, 6); await c.sleep(2200);
      } },
    { say: 'Then open the Course Progression box in the left column and tick Activate. Only Super Admin and the course author see this box.',
      run: async c => { await c.unhl(); const p = await c.tag(`return document.querySelector('.bp-ce-prog')`, 'prog'); await c.scrollTo(p, 110); await c.hl(p, 4); const a = await c.tag(`return document.getElementById('bpCeProgEnabled').closest('label')`, 'act'); await c.glide(a); await c.sleep(2500); } },
    { say: 'Click Add exam component for each exam. Give it a label, pick the quiz, and set its weight. Here, Knowledge Check counts for forty percent and the Final Exam for sixty. The weights must add up to exactly one hundred percent: the total turns green, and the course cannot be saved otherwise.',
      run: async c => { await c.unhl(); const l = await c.tag(`return document.getElementById('bpCeProgList')`, 'list'); await c.hl(l, 4); await c.glide(l); await c.sleep(2500); const t = await c.tag(`return document.getElementById('bpCeProgTotal')`, 'tot'); await c.hl(t, 5); await c.glide(t); await c.sleep(2500); } },
    { say: 'Set the pass mark, here seventy percent. Then choose which attempt counts: the best score ever, the most recent attempt, or the first attempt only. Click Save at the bottom of the course page when you are done. We do not save here.',
      run: async c => {
        await c.unhl(); const r = await c.tag(`return document.querySelector('.bp-ce-prog-row2')`, 'row2'); await c.hl(r, 4); await c.glide(r); await c.sleep(3500);
        await c.unhl(); const s = await btn(c, 'Save', 'save').catch(() => null); if (s) { await c.hl(s, 5); await c.glide(s); await c.sleep(1500); }
      } },
    { say: 'People take the quizzes in the app, and their scores reach the dashboard within about a minute. The overall score is the weighted blend of all the exams, every exam is required, and an overall score at or above the pass mark means they have graduated. If an answer is changed before submitting, the last answer counts.',
      run: async c => { await c.unhl(); await c.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await c.sleep(900); const b = await btn(c, 'Progression', 'pbtn'); await c.hl(b, 5); await c.glide(b); await c.sleep(2500); } },
    { say: 'Click Progression at the top of the course to open the dashboard. It lists each person with their role, one line per exam with its score or Not yet, the overall score, the graduation date, and the certificate.',
      run: async c => {
        await c.unhl(); const b = await btn(c, 'Progression', 'pbtn'); await c.click(b, { wait: true });
        const t = await c.tag(`return document.querySelector('.table-responsive table')`, 'tbl'); await c.hl(t, 3); await c.glide(t); await c.sleep(3500);
      } },
    { say: 'Once someone has graduated, click View to open their certificate.',
      run: async c => {
        await c.unhl(); const v = await c.tag(`const a = [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'View'); a.removeAttribute('target'); return a`, 'view');
        await c.hl(v, 5); await c.glide(v); await c.sleep(1500); await c.unhl();
        await c.click(v, { wait: true }); await c.sleep(1500);
      } },
    { say: 'The certificate shows the BrainFit logo, the course, the average exam mark, a seal, and a verification code. Anyone with the link can view it. From here you can print it or copy the link.',
      run: async c => {
        const card = await c.tag(`return document.querySelector('.cert, .certificate, main > div') || document.body.children[1]`, 'card').catch(() => null);
        if (card) { await c.hl(card, 3); await c.glide(card); await c.sleep(3000); await c.unhl(); }
        for (const l of ['Print', 'Copy link']) { const b = await btn(c, l, 'pl').catch(() => null); if (b) { await c.hl(b, 5); await c.glide(b); await c.sleep(1300); await c.unhl(); } }
      } },
    { say: 'Download PDF opens the BrainFit certificate copy, where you can download or print it. It is issued only when someone clicks, so nothing is created automatically. This is how it looks.',
      run: async c => {
        const d = await btn(c, 'Download PDF', 'dl'); await c.hl(d, 5); await c.glide(d); await c.sleep(2500); await c.unhl();
        await c.page.goto(CERT_CRM, { waitUntil: 'networkidle2', timeout: 60000 }); await c.sleep(1500); await c.caption('Download PDF opens the BrainFit certificate copy, where you can download or print it. It is issued only when someone clicks, so nothing is created automatically. This is how it looks.');
        const d2 = await btn(c, 'Download PDF', 'dl2'); await c.hl(d2, 5); await c.glide(d2); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
