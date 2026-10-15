// CoachSpace: Settings (programs). Nothing is saved in this video.
const { show, showCss, nav, run } = require('./cslib');
run({
  name: 'cs-settings', startPath: '/coachspace',
  beats: [
    { say: 'Settings is under the three dots at the end of the menu. Click the dots, and then Settings.',
      run: async c => { const m = await c.tag(`return document.querySelector('button[aria-label="More"]')`, 'mo'); await c.hl(m, 5); await c.glide(m); await c.sleep(700); await c.unhl(); await c.click(m); await c.sleep(1500); const s = await c.tag(`return [...document.querySelectorAll('a')].find(e => e.offsetParent && /^Settings$/.test(e.textContent.trim()))`, 'st'); await c.hl(s, 5); await c.glide(s); await c.sleep(1000); await c.unhl(); await c.click(s, { wait: true }); await c.sleep(1200); } },
    { say: 'Here you choose which curriculum programs you work with. This tailors CoachSpace to your focus, for example the templates and students it suggests.',
      run: async c => { await show(c, 'h1, h2', '^Settings', { name: 'h', ms: 1200 }); await show(c, 'p, div', '^Which curriculum programs', { name: 'q', ms: 2800 }); } },
    { say: 'Under My programs, tick each program you work with, for example Scholar, Junior or Baby. Untick the ones you do not.',
      run: async c => { const l = await c.tag(`return [...document.querySelectorAll('label')].find(e => e.offsetParent && /SG BF Scholar/.test(e.textContent))`, 'sc'); await c.hl(l, 5); await c.glide(l); await c.sleep(2600); await c.unhl(); const j = await c.tag(`return [...document.querySelectorAll('label')].find(e => e.offsetParent && /SG BF Junior/.test(e.textContent))`, 'jn'); await c.hl(j, 5); await c.glide(j); await c.sleep(2400); await c.unhl(); } },
    { say: 'Click Save to keep your choice. It applies the next time you open CoachSpace. We are not saving anything in this video.',
      run: async c => { const s = await c.tag(`return [...document.querySelectorAll('button, input[type=submit]')].find(b => b.offsetParent && /^Save$/.test((b.value || b.textContent).trim()))`, 'sv'); await c.hl(s, 5); await c.glide(s); await c.sleep(3000); } },
  ],
});
