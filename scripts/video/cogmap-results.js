const { makeVideo } = require('./lib');
const { reportsItem } = require('./hq');
const reportForm = async c => { const f = await c.tag(`const s = document.querySelector('select'); return s && (s.closest('form') || s.closest('.panel-body') || s.parentElement)`, 'frm'); await c.hl(f, 4); await c.glide(f); await c.sleep(2500); await c.unhl(); const p = await c.tag(`return [...document.querySelectorAll('a,button,input[type=submit]')].find(b => /^(Print)$/.test((b.textContent || b.value || '').trim()) && b.offsetParent)`, 'print').catch(() => null); if (p) { await c.hl(p, 5); await c.glide(p); } };
makeVideo({
  name: 'cogmap-results', who: 'ma', startPath: '/acp/students/57377',
  beats: [
    { say: 'There are two ways to see a student\'s CogMAP results. The first is from the student\'s own page. The CogMAP V2 card shows how many sessions are completed, the average score, and each skill\'s score for every round: Motor, Visual, Auditory, Focus and Emotions.',
      run: async c => { await c.page.waitForSelector('#bp-sd-cogmap'); const k = await c.tag(`return document.getElementById('bp-sd-cogmap')`, 'cm'); await c.hl(k, 4); await c.glide(k); await c.sleep(3000); } },
    { say: 'Click Open on a round to see its full report.',
      run: async c => { await c.unhl(); const o = await c.tag(`return [...document.querySelectorAll('#bp-sd-cogmap a')].find(a => a.textContent.trim() === 'Open')`, 'open'); await c.hl(o, 5); await c.glide(o); await c.sleep(1200); const href = await c.page.evaluate(() => [...document.querySelectorAll('#bp-sd-cogmap a')].find(a => a.textContent.trim() === 'Open').getAttribute('href')); await c.go(href); await c.unhl(); } },
    { say: 'The report opens for that round. Change the round or the report language, then click Show. Print prints the report, or saves it as a PDF.',
      run: async c => { await c.sleep(1200); await reportForm(c); } },
    { say: 'The report includes the Cognitive Skills Summary: every skill with its score and band, from Excellent and High Average to Low Average and Poor.',
      run: async c => { await c.unhl(); const e = await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Cognitive Skills Summary')`, 'sum'); await c.scrollTo(e, 60); await c.hl(e, 6); await c.glide(e); await c.sleep(1500); } },
    { say: 'Each area then has its own page, for example Motor Skills Results, with the score, what it means and what to work on.',
      run: async c => { await c.unhl(); const e = await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Motor Skills Results')`, 'mot'); await c.scrollTo(e, 60); await c.hl(e, 6); await c.glide(e); await c.sleep(1500); } },
    { say: 'The second way is the official CogMAP list. Open Reports in the top menu, and click Standard Score under CogMaps V2. It finds any student\'s results, including students you don\'t have open.',
      run: async c => { await c.unhl(); await c.go('/acp/students?center_id=132&name=sgtc27_s07'); const a = await reportsItem(c, 'CogMaps V2', 'Standard Score'); await c.sleep(1800); await c.unhl(); await c.go('/acp/cog_maps_v2/standard_score?center_id=132&name=Sarah+Ng'); } },
    { say: 'Choose the centre, and the class or the round if you like, type the student\'s name, and click Search. The table shows each question\'s score. Click the student\'s name to open their report.',
      run: async c => {
        const q = await c.tag(`return document.querySelector('input[name="name"]')?.closest('div')`, 'q'); await c.hl(q, 4); await c.glide(q); await c.sleep(2500); await c.unhl();
        const s = await c.tag(`return [...document.querySelectorAll('tbody a')].find(a => a.textContent.trim() === 'Sarah Ng')`, 'stu'); await c.hl(s, 5); await c.glide(s); await c.sleep(1200); await c.click(s, { wait: true }); await c.unhl();
      } },
    { say: 'It opens the student\'s CogMAP report. Choose the round and the language, click Show, then Print. Scroll down to see the scores for each skill.',
      run: async c => { await c.sleep(1200); await reportForm(c); await c.unhl(); await c.page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' })); await c.sleep(2500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
