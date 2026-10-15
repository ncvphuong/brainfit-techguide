// Shared helpers for the CoachSpace videos (dev, trainer sgtc27_t04 of the training centre; cookie 'cs' in capture/cookies.json, git-ignored).
const { makeVideo } = require('./lib');
const esc = s => s.replace(/[\\']/g, '\\$&');
// Find an element by visible text (regex source) among the selectors, tag it, highlight it, move the cursor there and rest; returns the selector.
async function show(c, sel, re, { name = 'x', pad = 5, ms = 1800, keep = false, idx = 0 } = {}) {
  const t = await c.tag(`return [...document.querySelectorAll('${esc(sel)}')].filter(e => e.offsetParent && /${re.replace(/\//g, '\\/')}/i.test(e.textContent.trim().replace(/\\s+/g, ' ')))[${idx}]`, name);
  await c.hl(t, pad); await c.glide(t); await c.sleep(ms); if (!keep) await c.unhl(); return t;
}
async function showCss(c, css, { name = 'x', pad = 5, ms = 1800, keep = false } = {}) {
  const t = await c.tag(`return document.querySelector('${esc(css)}')`, name);
  await c.hl(t, pad); await c.glide(t); await c.sleep(ms); if (!keep) await c.unhl(); return t;
}
const nav = async (c, label, { ms = 900 } = {}) => { const t = await c.tag(`return [...document.querySelectorAll('nav a, header a')].find(e => e.offsetParent && e.textContent.trim().replace(/\\s+/g, ' ') === '${label}')`, 'nv'); await c.glide(t); await c.sleep(250); await Promise.all([c.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }), c.page.mouse.click(...(await c.pos()))]); await c.sleep(ms); };
const run = (opts) => makeVideo({ who: 'cs', startPath: '/coachspace', ...opts }).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
module.exports = { show, showCss, nav, run };
