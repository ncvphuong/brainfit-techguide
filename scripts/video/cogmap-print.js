const { makeVideo } = require('./lib');
const { reportsItem } = require('./hq');
makeVideo({
  name: 'cogmap-print', who: 'ma', startPath: '/acp/students?center_id=132&name=sgtc27_s07',
  beats: [
    { say: 'To find any student\'s CogMAP results, even a student you don\'t have open, use Standard Score. Open Reports in the top menu and click Standard Score under CogMaps V2.',
      run: async c => { const a = await reportsItem(c, 'CogMaps V2', 'Standard Score'); await c.sleep(1800); await c.unhl(); await c.go('/acp/cog_maps_v2/standard_score?center_id=132&name=Sarah+Ng'); } },
    { say: 'Choose the centre, and the class or the round if you like, type the student\'s name and click Search. The table shows each question\'s score. Click the student\'s name to open their report.',
      run: async c => {
        const q = await c.tag(`return document.querySelector('input[name="name"]')?.closest('div')`, 'q'); await c.hl(q, 4); await c.glide(q); await c.sleep(2500); await c.unhl();
        const s = await c.tag(`return [...document.querySelectorAll('tbody a')].find(a => a.textContent.trim() === 'Sarah Ng')`, 'stu'); await c.hl(s, 5); await c.glide(s); await c.sleep(1200); await c.click(s, { wait: true }); await c.unhl();
      } },
    { say: 'Choose the round and the report language, click Show, then Print. In the print window, choose Save as PDF to keep a copy.',
      run: async c => {
        await c.sleep(1200);
        const f = await c.tag(`const s = document.querySelector('select'); return s && (s.closest('form') || s.closest('.panel-body') || s.parentElement)`, 'frm'); await c.hl(f, 4); await c.glide(f); await c.sleep(3500); await c.unhl();
        const p = await c.tag(`return [...document.querySelectorAll('a,button,input[type=submit]')].find(b => /^(Print)$/.test((b.textContent || b.value || '').trim()) && b.offsetParent)`, 'print').catch(() => null); if (p) { await c.hl(p, 5); await c.glide(p); }
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
