// CoachSpace: CogMAP results for a student, and Signal. Read-only. Demo student Sarah Ng has two completed CogMAP sessions.
const { show, showCss, nav, run } = require('./cslib');
run({
  name: 'cs-cogmap-signal', startPath: '/coachspace/students/57377',
  beats: [
    { say: 'A student\'s page has a CogMAP card. It shows how many CogMAP sessions the student has completed, and their average score. The page also lists the date of the latest CogMAP and when the next one is due, so you know when to book it.',
      run: async c => { await c.sleep(1200); await show(c, 'div', '^CogMAP Rounds', { name: 'cr', ms: 1600 }); await show(c, 'div', '^Latest CogMAP', { name: 'lc', ms: 1600 }); await show(c, 'div, span', '^Next CogMAP(?! Booked)', { name: 'nc', ms: 1600 }); const k = await c.tag(`const h = [...document.querySelectorAll('div,h2,h3')].find(d => d.offsetParent && /^COGMAP$/i.test(d.textContent.trim())); return h && h.closest('div.rounded-xl, div.rounded-lg, section') || h.parentElement.parentElement`, 'ck'); await c.scrollTo('[data-v-ck]', 160); await c.hl(k, 6); await c.glide(k); await c.sleep(3200); await c.unhl(); } },
    { say: 'For the full list, open the CogMAP page for the student. Each completed session is a row, with the date, the course and level, the score, and whether it was completed.',
      run: async c => { await c.go('/coachspace/cog_maps?student_id=57377'); await c.sleep(1000); await show(c, 'div', '^Sessions completed', { name: 'sc', ms: 2000 }); await show(c, 'table', '', { name: 'tb', ms: 1 }).catch(() => {}); const t = await c.tag(`return document.querySelector('table')`, 'tbl'); await c.hl(t, 6); await c.glide(t); await c.sleep(3500); await c.unhl(); } },
    { say: 'The Standard score link on each row opens that session\'s full result in BrainFit HQ, with the standard score for every skill. Open full CogMAP tools takes you to the student\'s CogMAP tools.',
      run: async c => { await show(c, 'a', 'Standard score', { name: 'ss', ms: 2600 }); await show(c, 'a', 'Open full CogMAP tools', { name: 'of', ms: 2600 }); } },
    { say: 'Signal is the place to spot students who need attention. It looks for students who are running low on questions, whose activity is dropping off, or who score worse than they did last week.',
      run: async c => { await nav(c, 'Signal'); await c.sleep(1000); await show(c, 'p, div', '^Students worth a closer look', { name: 'sw', ms: 3000 }); } },
    { say: 'The AceyBrain tab is live. Smart Workout and Progress Eval are marked Soon, because those checks are still on the way. Students who need a look appear in a list on the AceyBrain tab. When none of your students have AceyBrain activity this term, as here, it simply says so.',
      run: async c => { await show(c, 'button, a, div, span', '^AceyBrain', { name: 'ab', ms: 2000 }); await show(c, 'button, a, div, span', '^Smart Workout', { name: 'sw2', ms: 1800 }); await show(c, 'button, a, div, span', '^Progress Eval', { name: 'pe', ms: 1800 }); await show(c, 'div, p', '^No students with any AceyBrain', { name: 'no', ms: 2800 }); } },
  ],
});
