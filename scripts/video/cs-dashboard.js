// CoachSpace: sign in and the Dashboard. Trainer sgtc27_t04, session cookie minted server-side (no password on screen).
const { show, showCss, run } = require('./cslib');
run({
  name: 'cs-dashboard',
  beats: [
    { say: 'CoachSpace is the trainer\'s workspace. Open it in your browser and sign in with your trainer username and password. You land on the Dashboard.',
      run: async c => { await c.sleep(1500); await showCss(c, 'main, body > div:nth-of-type(2)', { name: 'm', ms: 1200 }).catch(() => {}); } },
    { say: 'The menu across the top is how you move around: Signal, Students, Courses, Calendar, Tasks, Notes and Progress Meetings. Click the logo any time to come back to the Dashboard.',
      run: async c => { for (const l of ['Signal', 'Students', 'Courses', 'Calendar', 'Tasks', 'Notes']) await show(c, 'nav a, header a', '^' + l + '$', { name: 'n', ms: 700 }); await show(c, 'nav a, header a', '^P\\.Meet', { name: 'n', ms: 900 }); } },
    { say: 'The search box finds students, notes and tasks in one place. Click it and type a name, and the matches appear as you type. Start with student, note or task and a colon to search just that category.',
      run: async c => { const s = await c.tag(`return [...document.querySelectorAll('button')].find(b => b.offsetParent && /Search students, notes, tasks/.test(b.textContent))`, 's'); await c.hl(s, 5); await c.glide(s); await c.sleep(1500); await c.unhl(); await c.click(s); await c.sleep(900); await c.page.keyboard.type('Faith', { delay: 120 }); await c.sleep(3200); await c.page.keyboard.press('Escape'); await c.sleep(600); } },
    { say: 'Three cards count what is on your plate: the students in your roster, the sessions you run this month, and the CogMAP sessions this month.',
      run: async c => { await show(c, 'div', '^Students 3$', { name: 'a', ms: 1500 }); await show(c, 'div', '^Sessions this month', { name: 'b', ms: 1500 }); await show(c, 'div', '^CogMAP this month', { name: 'c', ms: 1500 }); } },
    { say: 'Below them, My Students lists your roster. Click a name to open that student. Open Tasks shows what you still have to do, and Recents remembers the students you looked at in this visit.',
      run: async c => { await show(c, 'h2, h3, div', '^My Students 3$', { name: 'ms', ms: 2000 }); await show(c, 'h2, h3, div', '^Open Tasks', { name: 'ot', ms: 2000 }); await show(c, 'h2, h3, div', '^Recents', { name: 'rc', ms: 1800 }); } },
    { say: 'On the right is a month calendar. It marks the days that have sessions, and Open full calendar takes you to the whole calendar.',
      run: async c => { await c.scrollTo('[data-v-rc]', 140); await show(c, 'a', 'Open full calendar', { name: 'cal', ms: 2200 }); } },
    { say: 'The three dots at the end of the menu open more tools: Onboarding, Settings, Mass Assign Task, Worksheets and Task Templates. Your name opens the account menu, where you sign out.',
      run: async c => { await c.page.evaluate(() => window.scrollTo(0, 0)); await c.sleep(600); const m = await c.tag(`return document.querySelector('button[aria-label="More"]')`, 'mo'); await c.hl(m, 5); await c.glide(m); await c.sleep(600); await c.unhl(); await c.click(m); await c.sleep(3200); await c.page.keyboard.press('Escape'); await c.page.mouse.click(640, 400); await c.sleep(500); const b = await c.tag(`return [...document.querySelectorAll('button')].find(e => e.offsetParent && /^Coach /.test(e.textContent.trim()))`, 'u'); await c.glide(b); await c.sleep(500); await c.page.mouse.click(...(await c.pos())); await c.sleep(2800); } },
  ],
});
