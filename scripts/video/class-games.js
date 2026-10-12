const { makeVideo } = require('./lib');
const { guide, classRow, menu, CLASS_LIST } = require('./hq');
const restore = async () => console.log('restore games:', await guide('MODE=class_games STEP=restore').catch(e => 'FAILED ' + e.message));
makeVideo({
  name: 'class-games', who: 'ma', startPath: CLASS_LIST,
  before: async () => console.log('snapshot games:', await guide('MODE=class_games STEP=save')),
  after: restore,
  beats: [
    { say: 'To assign games to a class, click the gamepad icon on the class\'s row in the Class list. The gamepad on the class page does the same. Games assigned to a class go to every student in that class.',
      run: async c => { const m = await menu(c, 'Class'); await c.hl(m); await c.glide(m); await c.sleep(700); await c.unhl(); const g = await classRow(c, 'gamepad'); await c.hl(g, 5); await c.glide(g); await c.sleep(1200); await c.click(g, { wait: true }); await c.unhl(); } },
    { say: 'On the class\'s Game config page, scroll to the Game List and click Add Games.',
      run: async c => { const b = await c.tag(`return [...document.querySelectorAll('button,a')].find(b => b.textContent.trim() === 'Add Games' && b.offsetParent)`, 'add'); await c.scrollTo(b, 300); await c.hl(b, 5); await c.glide(b); await c.sleep(1200); await c.click(b); await c.sleep(1500); await c.unhl(); } },
    { say: 'The form shows all of the class\'s games. Keep the ones already there, and add the new ones with their subgames. Then click Submit. Be careful: Add Games saves the whole list, so a game you remove from the form is taken off the class and its students.',
      run: async c => {
        const sel = await c.tag(`return document.querySelector('#modalGame select[name="game_ids[]"]').closest('.form-group, .row')`, 'gs'); await c.hl(sel, 4); await c.glide(sel); await c.sleep(4500); await c.unhl();
        const b = await c.tag(`return document.querySelector('#modalGame #btnRedeem')`, 'sub'); await c.hl(b, 6); await c.glide(b); await c.sleep(1500);
      } },
    { say: 'Once the game is added, it appears in the list. For each game, choose the game class and the start level for the class.',
      run: async c => {
        await c.unhl(); const x = await c.tag(`return document.querySelector('#modalGame button.close')`, 'x'); await c.hl(x, 4); await c.click(x); await c.sleep(1200); await c.unhl();
        const h = await c.tag(`return [...document.querySelectorAll('h1,h2,h3,h4,h5,label,div,span,p')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Smart Moves')[0]`, 'sm'); await c.scrollTo(h, 120);
        const t = await c.tag(`const l = [...document.querySelectorAll('h1,h2,h3,h4,h5,label,div,span,p')].filter(e => e.children.length === 0 && e.textContent.trim() === 'Smart Moves')[0]; return l.nextElementSibling?.matches('table, div') ? l.nextElementSibling : l.parentElement`, 'glt'); await c.hl(t, 4); await c.glide(t); await c.sleep(2500);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(async e => { console.error(e.message); await restore(); process.exit(1); });
