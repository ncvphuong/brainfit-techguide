const { makeVideo } = require('./lib');
makeVideo({
  name: 'course-edit', who: 'author', startPath: '/acp/courses/338/edit',
  beats: [
    { say: 'Open the course from the list with the pencil. The top row has Back to courses, the Published or Draft status, Progression when it is turned on, and Clone Course. The course details are on the left, and the topics on the right.',
      run: async c => { await c.page.waitForSelector('.bp-ce-bar'); const b = await c.tag(`return document.querySelector('.bp-ce-bar')`, 'bar'); await c.hl(b, 4); await c.glide(b); await c.sleep(3500); } },
    { say: 'In Topic, the yellow button sorts the topics, and the pencil renames a topic. Drag the handle to reorder resources, or to move them to another topic. Click a resource\'s pencil to edit it, or the red button to remove it. Images and PDFs open in a preview, and Play Video plays a video.',
      run: async c => {
        await c.unhl(); const h = await c.tag(`return [...document.querySelectorAll('h2')].find(h => h.textContent.trim() === 'Topic')`, 'top'); await c.scrollTo(h, 100);
        const s = await c.tag(`return document.querySelector('a.sort')`, 'sort').catch(() => null); if (s) { await c.hl(s, 5); await c.glide(s); await c.sleep(1800); await c.unhl(); }
        const p = await c.tag(`return document.querySelector('.topic i.fa-pencil, a[href*="/topics/"] i.fa-pencil')?.closest('a,button')`, 'tp').catch(() => null); if (p) { await c.hl(p, 5); await c.glide(p); await c.sleep(1500); }
      } },
    { say: 'To add a resource, click the plus on the Add resource row of the topic. A pop-up opens: fill in the title, choose the type, which is video, image, document, link or quiz, upload the file or paste the link, then click Save. We only point at the plus here, because it creates the new resource straight away.',
      run: async c => {
        await c.unhl(); const a = await c.tag(`return document.querySelector('a[href*="/acp/media/topic/"]')`, 'plus'); await c.scrollTo(a, 300); await c.hl(a, 5); await c.glide(a); await c.sleep(3500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
