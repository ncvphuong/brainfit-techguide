const { makeVideo } = require('./lib');
const { cmV2 } = require('./hq');
makeVideo({
  name: 'cogmap-student', who: 'ma', startPath: '/acp/students/57377/show_game',
  beats: [
    { say: 'Use this when one student needs a different CogMAP setup from the rest of the class. Open the student\'s Game config page by clicking the gamepad icon on the student in the Students list.',
      run: async c => { await c.sleep(600); } },
    { say: 'The CogMap V2 Questions box and the question ticks work the same way as for a class, but only for this student.',
      run: async c => { await cmV2(c); await c.scrollTo('[data-v-v2head]', 120); await c.hl('[data-v-v2]', 4); await c.glide('[data-v-v2]'); await c.sleep(2200); await c.unhl(); await c.hl('[data-v-grid]', 4); await c.glide('[data-v-grid]'); } },
    { say: 'CogMap version 2 control shows whether the student\'s CogMAP is completed or uncompleted, and starts or pauses it.',
      run: async c => { await c.unhl(); await c.hl('[data-v-ctl]', 4); await c.glide('[data-v-ctl]'); } },
    { say: 'A student starts with their class\'s setting. Changing it here only affects this student.',
      run: async c => { await c.sleep(300); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
