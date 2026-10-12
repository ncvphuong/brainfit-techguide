const { makeVideo } = require('./lib');
makeVideo({
  name: 'course-progression', who: 'author', startPath: '/acp/courses/68/edit',
  beats: [
    { say: 'Course Progression decides when someone graduates from a course and gets a certificate, based on the quizzes in the course. On the course\'s edit page, find Course Progression in the left column.',
      run: async c => { await c.page.waitForSelector('.bp-ce-prog'); const p = await c.tag(`return document.querySelector('.bp-ce-prog')`, 'prog'); await c.scrollTo(p, 120); await c.hl(p, 4); await c.glide(p); await c.sleep(1500); } },
    { say: 'Tick Activate, then add one or more exam components: a name, the quiz it uses, and its weight. The weights must add up to one hundred percent, and the total shows on the right. Set the pass mark and which attempt counts, then save the course. Here we only switch it on in the form and do not save.',
      run: async c => {
        await c.page.evaluate(() => { const t = document.getElementById('bpCeProgEnabled'); if (t && !t.checked) t.click(); });
        await c.sleep(2500); await c.page.evaluate(() => { const sel = document.querySelector('#bpCeProgList select'); if (sel && sel.options.length > 1) { sel.selectedIndex = 1; sel.dispatchEvent(new Event('change', { bubbles: true })); } });
        await c.sleep(4000);
      } },
    { say: 'Click Progression at the top of the course to open the dashboard. It shows the pass mark, the components, and each person\'s score per component, overall score, graduation date and certificate link.',
      run: async c => { await c.unhl(); await c.go('/acp/courses/68/progression'); const e = await c.tag(`return document.querySelector('.bp-content')`, 'pg'); await c.hl(e, 3); await c.glide(e); await c.sleep(3500); } },
    { say: 'Only quizzes already added to the course\'s topics can be picked. If the weights don\'t add up to one hundred percent, the course isn\'t saved, and the form shows the error.',
      run: async c => { await c.sleep(300); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
