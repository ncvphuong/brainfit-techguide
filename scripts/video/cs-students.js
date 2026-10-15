// CoachSpace: My Students and a student page. Read-only: no touch level change, no watchlist change, no password reveal, no chat message.
const { show, showCss, nav, run } = require('./cslib');
run({
  name: 'cs-students', startPath: '/coachspace/students',
  beats: [
    { say: 'Students shows everyone in your classes. Use the class menu to pick one class, the sort menu to order the list, and the search box to find a name. The two buttons on the right switch between a list and a grid of cards.',
      run: async c => { await c.sleep(1200); await c.hl('select[name=class_room_id]', 4); await c.glide('select[name=class_room_id]'); await c.sleep(1800); await c.unhl(); await c.hl('select[name=sort]', 4); await c.glide('select[name=sort]'); await c.sleep(1800); await c.unhl(); await showCss(c, 'input[name=q]', { name: 'q', ms: 1600 }); await show(c, 'a', 'view=grid', { name: 'g', ms: 1200 }).catch(async () => { const t = await c.tag(`return document.querySelector('a[href*="view=grid"]')`, 'g'); await c.hl(t, 5); await c.glide(t); await c.sleep(1400); await c.unhl(); }); } },
    { say: 'The three boxes at the top count the tasks due today, due this week, and still outstanding, across all your students.',
      run: async c => { for (const l of ['Today Tasks', 'This Week Tasks', 'Outstanding Tasks']) await show(c, 'div', '^' + l + ' \\d', { name: 'tk', ms: 1500, idx: 0 }); } },
    { say: 'My Watchlist is for students outside your classes whom you want to keep an eye on. Search for a student in your centre and add them, and they get the same access as your class students. Main Students are the ones who have you as their registered trainer.',
      run: async c => { await show(c, 'div', '^My Watchlist', { name: 'w', ms: 2800 }); await show(c, 'div', '^Main Students', { name: 'mn', ms: 2800 }); } },
    { say: 'Students who are not in a class group this term sit under Inactive. Open it to see them. Click a student\'s name to open their page.',
      run: async c => { const s = await c.tag(`return [...document.querySelectorAll('summary')].find(e => /Inactive/.test(e.textContent))`, 'in'); await c.hl(s, 5); await c.glide(s); await c.sleep(900); await c.unhl(); await c.click(s); await c.sleep(1500); const f = await c.tag(`return [...document.querySelectorAll('a')].find(e => e.offsetParent && e.textContent.trim() === 'Faith Ng' && /students\\/\\d+$/.test(e.getAttribute('href')))`, 'f'); await c.hl(f, 5); await c.glide(f); await c.sleep(1200); await c.unhl(); await c.page.mouse.click(...(await c.pos())); await c.page.waitForFunction(() => /students\/\d+$/.test(location.pathname), { timeout: 20000 }).catch(() => {}); await c.sleep(1800); } },
    { say: 'The top of the page shows the student\'s name, whether they are active, their centre, and a star to add them to your watchlist. Under it, the Profile card lists their date of birth, username and email, when they joined, and their student type.',
      run: async c => { await show(c, 'h1, h2', '^Faith Ng', { name: 'h', ms: 1800, pad: 6 }); await show(c, 'button, a', 'Add to watchlist', { name: 'wl', ms: 1600 }); await show(c, 'div', '^PROFILE', { name: 'p', ms: 2800, idx: 0 }); } },
    { say: 'The Touch Level menu records how much attention a student needs: High, Medium or Standard. Change it any time, and the change is written to the Activity log at the bottom. The password stays hidden unless you click Reveal.',
      run: async c => { await showCss(c, 'select[name=touch_level]', { name: 'tl', ms: 2400 }); await show(c, 'button', '^Reveal$', { name: 'rv', ms: 1800 }); } },
    { say: 'On the right is the parent or guardian, with their email and phone, and the onboarding card, where you start the set-up steps for a new student.',
      run: async c => { await show(c, 'div', '^PARENT / GUARDIAN', { name: 'pg', ms: 2800 }); await show(c, 'div', '^ONBOARDING', { name: 'ob', ms: 2400 }); } },
    { say: 'The Chat card opens the conversation with this student\'s family. We are not sending anything here. It is only a look at where the chat lives, and Open in chat opens it in the full chat app.',
      run: async c => { await show(c, 'div', '^CHAT', { name: 'ch', ms: 2800 }); await show(c, 'a', 'Open in chat', { name: 'oc', ms: 1600 }); } },
    { say: 'Notes, Tasks and Meetings each have a card for this student, with a link to all of them. We cover each of these in their own guide.',
      run: async c => { await show(c, 'div', '^NOTES \\(', { name: 'n', ms: 2000 }); await show(c, 'div', '^TASKS \\(', { name: 't', ms: 2000 }); await show(c, 'div', '^MEETINGS \\(', { name: 'm', ms: 2000 }); } },
    { say: 'Further down, Sessions lists the classes this student is booked into, with the date, time and attendance. Show all opens the full list.',
      run: async c => { await c.scrollTo('[data-v-n]', 80); await show(c, 'div', '^SESSIONS \\(', { name: 'ss', ms: 2200 }); await show(c, 'summary', 'Show all', { name: 'sa', ms: 1000, keep: true }); await c.click('[data-v-sa]'); await c.sleep(2400); await c.unhl(); } },
    { say: 'Progress shows the games this student played, with sessions, score and percentage. Use the menu to change the period, from the last seven days to the last year. The Activity card at the very bottom keeps the history of touch level changes.',
      run: async c => { await show(c, 'div', '^PROGRESS', { name: 'pr', ms: 1800 }); const t = await c.tag(`return document.querySelector('select[name=days]')`, 'dy'); await c.hl(t, 5); await c.glide(t); await c.sleep(2200); await c.unhl(); await c.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })); await c.sleep(2600); } },
  ],
});
