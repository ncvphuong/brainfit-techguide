const { makeVideo } = require('./lib');
const { byText } = require('./schh');
makeVideo({
  name: 'sch-holiday', site: 'sch', startPath: '/classrooms/config/holiday-templates/',
  beats: [
    { say: 'A holiday template is the list of public holidays and term breaks for a country and year. Sessions are never created on those dates, and every centre that uses the template follows it. In BrainFit Scheduling, open the three dots menu, then Holiday Templates.',
      run: async c => { const m = await c.tag(`return document.querySelector('nav button[aria-label*="more" i], nav .fa-ellipsis-v, nav i[class*="ellipsis"]')?.closest('button,a')`, 'more').catch(() => null); if (m) { await c.hl(m, 5); await c.glide(m); } await c.sleep(2500); await c.unhl(); } },
    { say: 'Each card shows a template, how many holidays it has and how many centres use it. Click Create Template for a new one, or Edit and Manage Dates to change one.',
      run: async c => { const n = await byText(c, 'a,button', /Create Template/, 'new'); await c.hl(n, 5); await c.glide(n); await c.sleep(1800); await c.unhl(); const e = await c.tag(`return document.querySelector('a[href="/classrooms/config/holiday-templates/11/edit/"]')`, 'ed'); await c.scrollTo(e, 300); await c.hl(e, 5); await c.glide(e); await c.sleep(1500); } },
    { say: 'For a new template, enter the name, for example Singapore Public Holidays 2028, the year, the country and a description, then click Create Template.',
      run: async c => { await c.unhl(); await c.go('/classrooms/config/holiday-templates/create/'); const f = await c.tag(`return document.querySelector('form')`, 'frm'); await c.hl(f, 4); await c.glide(f); await c.sleep(3500); } },
    { say: 'The template page lists its dates: public holidays with no class, and term breaks as a date range. Click Add Holiday to add one. The pencil and the bin edit or remove a date. We open the form here, but add nothing.',
      run: async c => { await c.unhl(); await c.go('/classrooms/config/holiday-templates/11/edit/'); await c.sleep(1500); const a = await byText(c, 'a,button', /Add Holiday/, 'add'); await c.scrollTo(a, 200); await c.hl(a, 5); await c.glide(a); await c.sleep(1500); await c.page.evaluate(() => document.querySelector('[data-v-add]').click()); await c.sleep(3500); } },
    { say: 'Enter the holiday\'s name, its type, such as public holiday, replacement class or term break, and its date. Tick Recurring for a fixed date every year, then click Add Holiday. Adding a date to a template affects every centre that uses it, so practise only on a template made for practice.',
      run: async c => { await c.sleep(6000); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
