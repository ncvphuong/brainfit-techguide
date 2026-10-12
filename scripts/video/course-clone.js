const { makeVideo } = require('./lib');
makeVideo({
  name: 'course-clone', who: 'author', startPath: '/acp/courses?title=BrainFit+Cognitive',
  beats: [
    { say: 'To clone a course, click Duplicate on the course\'s row in the list. The Clone Course button at the top of the course\'s edit page does the same.',
      run: async c => { const d = await c.tag(`const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes('BrainFit Cognitive Foundations')); return tr && tr.querySelector('a[data-body-source*="clone_course_preview"]')`, 'dup'); await c.hl(d, 5); await c.glide(d); await c.sleep(1800); await c.page.evaluate(() => document.querySelector('[data-v-dup]').click()); await c.sleep(2500); await c.unhl(); } },
    { say: 'The pop-up shows what will be copied, the topics and files, and the extra storage it needs. Click Confirm and Clone. The copy is created as the course name followed by Copy, with its own copy of every file. We close the pop-up here without cloning.',
      run: async c => { await c.sleep(5500); await c.page.keyboard.press('Escape'); await c.sleep(800); } },
    { say: 'Videos and quizzes in the copy still point to the same video and quiz as the original. Super admins can see the clone history at the bottom of the course\'s edit page.',
      run: async c => { await c.sleep(300); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
