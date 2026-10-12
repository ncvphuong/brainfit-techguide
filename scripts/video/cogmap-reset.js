const { makeVideo } = require('./lib');
makeVideo({
  name: 'cogmap-reset', who: 'ml', startPath: '/acp/students/57377/show_game',
  beats: [
    { say: 'Resetting a student\'s CogMAP sessions is a permanent delete. The data can\'t be restored. Only super admins and master licensees can do it. We only look at the screens here, and nothing is deleted.',
      run: async c => { await c.sleep(600); } },
    { say: 'Open the student\'s Game config page, and find Reset CogMap Progress. The Reset link is next to it.',
      run: async c => { const a = await c.tag(`const a = [...document.querySelectorAll('a')].find(a => /reset_cog_map$/.test(a.getAttribute('href') || '')); return a && (a.closest('.form-group') || a)`, 'rs'); await c.scrollTo(a, 200); await c.hl(a, 5); await c.glide(a); await c.sleep(1500); } },
    { say: 'The next page lists the student\'s CogMAP sessions. Reset on one session deletes just that session. Reset All CogMap Progress deletes all of them, and switches the student\'s CogMAP setup off at the same time, so set it up again if they need to retake it.',
      run: async c => {
        await c.unhl(); await c.go('/acp/students/57377/reset_cog_map');
        const bs = await c.page.evaluate(() => { const b = [...document.querySelectorAll('a,button')].filter(b => /^Reset( All CogMap Progress)?$/.test(b.textContent.trim())); b.forEach(x => x.setAttribute('data-v-rsb', '1')); return b.length; });
        await c.hl('[data-v-rsb]', 4); if (bs) await c.glide('[data-v-rsb]'); await c.sleep(3000);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
