const { makeVideo } = require('./lib');
const { reportsItem } = require('./hq');
makeVideo({
  name: 'cogmap-merge', who: 'ma', startPath: '/acp/students?center_id=132&name=sgtc27_s07',
  beats: [
    { say: 'Use Merge Score when a student\'s assessment was split over two or more sessions, to combine the scores into one round. Open Reports, and click Merge Score under CogMaps V2.',
      run: async c => { const a = await reportsItem(c, 'CogMaps V2', 'Merge Score'); await c.sleep(1800); await c.unhl(); await c.go('/acp/cog_maps_v2/merge-score?center_id=132&name=Sarah+Ng'); } },
    { say: 'Search for the student, and click Merge questions on their row.',
      run: async c => {
        const m = await c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Merge questions')`, 'mq'); await c.hl(m, 5); await c.glide(m); await c.sleep(1200); await c.click(m, { wait: true }); await c.unhl();
      } },
    { say: 'In the first column, choose the round to keep. In the next columns, choose the rounds with the replacement scores. Tick the questions whose score you want to bring across.',
      run: async c => {
        await c.sleep(1500);
        const r = await c.tag(`return document.querySelector('select.select-session')?.closest('div')`, 'rnd').catch(() => null); if (r) { await c.hl('select.select-session', 4); await c.glide(r); }
        await c.sleep(4500);
      } },
    { say: 'Save merges the scores and keeps the other sessions. Save and delete right sessions merges, and then deletes the sessions in the right-hand columns. Deleted sessions can\'t be brought back, so check the rounds first. We stop here without saving.',
      run: async c => {
        await c.unhl(); const b = await c.tag(`return document.querySelector('button.submit')`, 'sv'); await c.scrollTo(b, 300); await c.hl('button.submit', 5); await c.glide(b); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
