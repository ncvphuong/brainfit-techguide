const { makeVideo } = require('./lib');
const { menu } = require('./hq');
makeVideo({
  name: 'course-list', who: 'author', startPath: '/acp/courses?title=BrainFit+Cognitive',
  beats: [
    { say: 'Open Course in the top menu. The list shows each course\'s status, publish date, author, master licensees and categories. Click Add at the top right to create a new course.',
      run: async c => { const m = await menu(c, 'Course'); await c.hl(m); await c.glide(m); await c.sleep(1200); await c.unhl(); const a = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Add' && a.offsetParent)`, 'add'); await c.hl(a, 5); await c.glide(a); await c.sleep(1500); } },
    { say: 'Each row has its actions: Assign Trainer, Parent or Student, Edit with the pencil, Delete, and Duplicate to clone the course.',
      run: async c => { await c.unhl(); const t = await c.tag(`const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('BrainFit Cognitive Foundations')); return tr && tr.querySelector('td:last-child')`, 'act'); await c.hl(t, 3); await c.glide(t); await c.sleep(2500); } },
    { say: 'In the new course form, choose the master licensee, who can see the course and assign it, and the author, who can edit its content. Then choose the categories, the title, the status and the publish date, and add the content, description, image and banner. Click Save. Topics and resources are added after the course is saved, on its edit page.',
      run: async c => {
        await c.unhl(); await c.go('/acp/courses/new');
        const f = await c.tag(`return document.querySelector('form')`, 'frm'); await c.hl(f, 3); await c.glide(f); await c.sleep(4000); await c.unhl();
        const b = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Save' && b.offsetParent)`, 'save'); await c.scrollTo(b, 400); await c.hl(b, 5); await c.glide(b); await c.sleep(1500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
