const { makeVideo } = require('./lib');
makeVideo({
  name: 'cogmap-results', who: 'ma', startPath: '/acp/students/57377',
  beats: [
    { say: 'To see a student\'s CogMAP results, open the student\'s page. The CogMAP V2 card shows how many sessions are completed, the average score, and each skill\'s score for every round: Motor, Visual, Auditory, Focus and Emotions.',
      run: async c => { await c.page.waitForSelector('#bp-sd-cogmap'); const k = await c.tag(`return document.getElementById('bp-sd-cogmap')`, 'cm'); await c.hl(k, 4); await c.glide(k); await c.sleep(3000); } },
    { say: 'Click Open on a round to see its full report.',
      run: async c => { await c.unhl(); const o = await c.tag(`return [...document.querySelectorAll('#bp-sd-cogmap a')].find(a => a.textContent.trim() === 'Open')`, 'open'); await c.hl(o, 5); await c.glide(o); await c.sleep(1200); const href = await c.page.evaluate(() => [...document.querySelectorAll('#bp-sd-cogmap a')].find(a => a.textContent.trim() === 'Open').getAttribute('href')); await c.page.mouse.down(); await c.page.mouse.up(); await c.go(href); await c.unhl(); } },
    { say: 'The report opens for that round. Change the round or the report language, then click Show. Print prints the report, or saves it as a PDF.',
      run: async c => {
        await c.sleep(1200);
        const f = await c.tag(`const s = document.querySelector('select'); return s && (s.closest('form') || s.closest('.panel-body') || s.parentElement)`, 'frm'); await c.hl(f, 4); await c.glide(f); await c.sleep(2500); await c.unhl();
        const p = await c.tag(`return [...document.querySelectorAll('a,button,input[type=submit]')].find(b => /^(Print)$/.test((b.textContent || b.value || '').trim()) && b.offsetParent)`, 'print').catch(() => null); if (p) { await c.hl(p, 5); await c.glide(p); }
      } },
    { say: 'The report includes the Cognitive Skills Summary: every skill with its score and band, from Excellent and High Average to Low Average and Poor.',
      run: async c => { await c.unhl(); const e = await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Cognitive Skills Summary')`, 'sum'); await c.scrollTo(e, 60); await c.hl(e, 6); await c.glide(e); await c.sleep(1500); } },
    { say: 'Each area then has its own page, for example Motor Skills Results, with the score, what it means and what to work on.',
      run: async c => { await c.unhl(); const e = await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === 'Motor Skills Results')`, 'mot'); await c.scrollTo(e, 60); await c.hl(e, 6); await c.glide(e); await c.sleep(1500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
