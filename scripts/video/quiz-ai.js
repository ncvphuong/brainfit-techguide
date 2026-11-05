// Quiz AI: create with AI Assistant (PDF lesson) and import from a Google Form link (dev, master admin). The demo quiz is deleted afterwards by hand.
const { makeVideo, sleep } = require('./lib');
const PDF = '/Volumes/Transcend/development/tmp/qa_guide/sleep-lesson.pdf';
const LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSfm47SGCix--W-jjMN4gt4VQVNrbuoh6VMdlX7-acBDbTyQYA/viewform';
const hold = async (c, sel, pad = 4, ms = 1500) => { await c.hl(sel, pad); await c.glide(sel); await c.sleep(ms); await c.unhl(); };
const T = (c, js, n) => c.tag(js, n);
const openAdd = async c => { const a = await T(c, `return document.querySelector('[data-qa-open]')`, 'add'); await c.hl(a, 4); await c.glide(a); await c.sleep(600); await c.unhl(); await c.click(a); await c.sleep(900); };
const card = async (c, text) => { const b = await T(c, `return [...document.querySelectorAll('.qa-card')].find(b => b.textContent.includes(${JSON.stringify(text)}))`, 'card'); await hold(c, b, 4, 900); await c.click(b); await c.sleep(700); };
const waitPreview = (c, ms = 240000) => c.page.waitForFunction(() => !document.getElementById('qaStepPreview').hidden || !document.getElementById('qaError').hidden, { timeout: ms });
makeVideo({
  name: 'quiz-ai', who: 'ma', startPath: '/acp/quizzes',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { window.confirm = () => true; });
    await c.page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  },
  beats: [
    { say: 'There are three ways to add a quiz. In Course, Quiz, click Add. You can add a quiz manually, create one with the AI assistant from a PDF lesson, or import a quiz you already have.',
      run: async c => { await openAdd(c); const g = await T(c, `return document.querySelector('#qaStepChoose')`, 'ch'); await hold(c, g, 4, 2500); } },
    { say: 'To create a quiz with the AI assistant, choose it, pick the PDF lesson, say how many questions you want, and choose Single answer or Multiple choice. Click Generate and wait up to a minute.',
      run: async c => {
        await card(c, 'Create quiz with AI Assistant');
        await (await c.page.$('#qaGenFile')).uploadFile(PDF); await c.sleep(700);
        const f = await T(c, `return document.querySelector('#qaStepGenerate')`, 'gf'); await hold(c, f, 4, 1500);
        const g = await T(c, `return document.getElementById('qaGenBtn')`, 'gb'); await c.hl(g, 4); await c.glide(g); await c.sleep(500); await c.unhl(); await c.click(g);
        await c.sleep(1500); await waitPreview(c); await c.sleep(800);
      } },
    { say: 'Nothing is saved yet. This is the review screen. The assistant has written the title, the description, and the questions, with the answer it thinks is correct already chosen. Read every question and fix anything that is wrong.',
      run: async c => {
        const q = await T(c, `return document.querySelector('.qa-q')`, 'q1'); await hold(c, q, 4, 3000);
        await c.page.evaluate(() => document.getElementById('qaQuestions').scrollIntoView({ behavior: 'smooth', block: 'start' })); await c.sleep(1500);
        const s = await T(c, `return document.querySelector('.qa-q select[data-f=context]')`, 'ty'); await hold(c, s, 4, 2000);
      } },
    { say: 'A multiple choice question needs at least two correct answers. A single answer question has exactly one. When you are happy, click Save quiz. To start again, click Discard.',
      run: async c => { const f = await T(c, `return document.getElementById('qaFoot')`, 'ft'); await hold(c, f, 4, 3000); await c.go('/acp/quizzes'); } },
    { say: 'To import a quiz you already have, choose Import an existing quiz. The best way for a Google Form is to paste its link. The form must be open to anyone with the link. Click Import.',
      run: async c => {
        await openAdd(c); await card(c, 'Import an existing quiz');
        await c.type('#qaImpLink', LINK); await c.sleep(600);
        const i = await T(c, `return document.getElementById('qaImpLink')`, 'il'); await hold(c, i, 4, 1500);
        const b = await T(c, `return document.getElementById('qaImpBtn')`, 'ib'); await c.hl(b, 4); await c.glide(b); await c.sleep(500); await c.unhl(); await c.click(b);
        await c.sleep(6000);
      } },
    { say: 'A progress window shows what is happening. Reading a form takes about half a minute. You can also upload a PDF, or screenshots of the quiz, and the AI reads them instead. That takes about a minute.',
      run: async c => { await waitPreview(c); await c.sleep(2500); } },
    { say: 'The review screen has the form\'s questions with the exact words and the original pictures. Headings and information blocks that are not questions are listed under Skipped, so you can see nothing was lost.',
      run: async c => {
        const t = await T(c, `return document.getElementById('qaQuizTitle')`, 'qt'); await hold(c, t, 4, 1500);
        await c.page.evaluate(() => { document.getElementById('qaSkipped').open = true; });
        const k = await T(c, `return document.getElementById('qaSkipped')`, 'sk'); await hold(c, k, 4, 3000);
        await c.page.evaluate(() => { document.getElementById('qaSkipped').open = false; });
        const q = await T(c, `return document.querySelector('.qa-q')`, 'q1'); await hold(c, q, 4, 2500);
      } },
    { say: 'A Google Form never shares its answers, so every question says needs answer, and Save quiz stays locked. Tick the correct answer for each question. Next missing answer takes you to the next one. You can change the question type, add or remove options, or replace a picture.',
      run: async c => {
        const n = await T(c, `return document.getElementById('qaNextMissing')`, 'nm'); await hold(c, n, 4, 1200);
        await c.click(n); await c.sleep(1500);
        // for this demo keep three questions that have options
        for (;;) {
          const removed = await c.page.evaluate(() => { const qs = [...document.querySelectorAll('.qa-q')]; let keep = 0; for (const q of qs) { if (q.querySelectorAll('.qa-opt').length >= 2 && keep < 3) { keep++; continue; } q.querySelector('[data-act="remove-q"]').click(); return true; } return false; });
          if (!removed) break; await sleep(40);
        }
        await c.page.evaluate(() => document.getElementById('qaQuestions').scrollIntoView({ block: 'start' })); await c.sleep(1000);
        const radios = await c.page.$$('.qa-q [data-f="is_answer"]');
        for (let i = 0; i < 3; i++) { const q = await c.page.evaluate(i => { const e = document.querySelectorAll('.qa-q')[i]; const r = e.querySelector('[data-f="is_answer"]'); r.setAttribute('data-pick', i); return '[data-pick="' + i + '"]'; }, i); await c.hl(q, 5); await c.glide(q); await c.sleep(500); await c.click(q); await c.sleep(700); await c.unhl(); }
      } },
    { say: 'When every question has an answer, the summary says all answered and Save quiz unlocks. Give the quiz a clear title and click Save quiz. The quiz is created, and you can add it to a course like any other quiz.',
      run: async c => {
        await c.page.evaluate(() => { const t = document.getElementById('qaQuizTitle'); t.scrollIntoView({ block: 'center' }); t.value = 'Scholar PT coordination check (demo)'; t.dispatchEvent(new Event('input', { bubbles: true })); }); await c.sleep(800);
        const f = await T(c, `return document.getElementById('qaFoot')`, 'ft'); await hold(c, f, 4, 2500);
        const s = await T(c, `return document.getElementById('qaSave')`, 'sv'); await c.click(s); await c.sleep(4000);
        await c.go('/acp/quizzes'); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
