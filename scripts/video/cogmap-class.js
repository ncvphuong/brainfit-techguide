const { makeVideo } = require('./lib');
const { cmV2 } = require('./hq');
makeVideo({
  name: 'cogmap-class', who: 'ma', startPath: '/acp/class_rooms/1407/show_game',
  beats: [
    { say: 'On the class\'s Game config page, find CogMap V2 Questions. The box shows the class\'s preset, and the ticks below show the questions in use.',
      run: async c => { await cmV2(c); await c.scrollTo('[data-v-v2head]', 120); await c.hl('[data-v-v2]', 4); await c.glide('[data-v-v2]'); await c.sleep(2200); await c.unhl(); await c.hl('[data-v-grid]', 4); await c.glide('[data-v-grid]'); } },
    { say: 'CogMap version 2 control starts or pauses CogMAP for the whole class.',
      run: async c => { await c.unhl(); await c.hl('[data-v-ctl]', 4); await c.glide('[data-v-ctl]'); } },
    { say: 'To change the preset, open the box and pick the one for the class\'s age group, for example Basic, four to six, Foundation, or Intermediate, seven to eight, Foundation. The question ticks then update, and you can tick or untick single questions. Here we only look at the list.',
      run: async c => { await c.unhl(); await c.scrollTo('[data-v-v2head]', 120); await c.click('[data-v-v2]'); await c.page.evaluate(() => $('[data-v-v2sel]').select2('open')); await c.sleep(4500); await c.page.keyboard.press('Escape'); await c.sleep(500); } },
    { say: 'A change here applies to every student of the class. To change one student only, use the same box on the student\'s own Game config page. The CogMap Questions section above is the old version one.',
      run: async c => { await c.sleep(300); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
