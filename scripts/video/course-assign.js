const { makeVideo } = require('./lib');
makeVideo({
  name: 'course-assign', who: 'author', startPath: '/acp/courses?title=BrainFit+Cognitive',
  beats: [
    { say: 'To give a course to people, click Assign Trainer, Assign Parent or Assign Student on the course\'s row in the list.',
      run: async c => { const a = await c.tag(`const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('BrainFit Cognitive Foundations')); return tr && tr.querySelector('a[href*="/assign?context="]')`, 'as'); await c.hl(a, 5); await c.glide(a); await c.sleep(2500); await c.unhl(); await c.go('/acp/courses/338/assign?context=student'); } },
    { say: 'Tick the centre or the classes that should get the course. The list shows the centres of the course\'s master licensee. Each class has a setup publish date to release the topics on a schedule.',
      run: async c => {
        await c.sleep(1000); const t = await c.tag(`return [...document.querySelectorAll('input[type=checkbox]')].filter(c => c.checked)[0]?.closest('label, li, div')`, 'cb').catch(() => null); if (t) { await c.hl(t, 4); await c.glide(t); } await c.sleep(4500); await c.unhl();
        const p = await c.tag(`return [...document.querySelectorAll('a,button')].find(b => /publish/i.test(b.textContent) && b.offsetParent)`, 'pub').catch(() => null); if (p) { await c.hl(p, 4); await c.glide(p); await c.sleep(2500); }
      } },
    { say: 'The buttons at the top right switch between assigning for trainers, for parents and for students.',
      run: async c => { await c.unhl(); const b = await c.tag(`return [...document.querySelectorAll('a')].filter(a => /context=(trainer|customer|student)/.test(a.getAttribute('href') || '') && a.offsetParent)[0]?.parentElement`, 'ctx').catch(() => null); if (b) { await c.hl(b, 4); await c.glide(b); } await c.sleep(2000); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
