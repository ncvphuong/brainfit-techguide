// Helpers for the dev Scheduling (SCH) videos. Only the training centre's rows may be on screen.
const btn = (c, re) => c.page.evaluate(src => { const r = new RegExp(src); const b = [...document.querySelectorAll('button')].find(b => b.offsetParent && r.test(b.textContent.trim().replace(/\s+/g, ' '))); b && b.click(); return !!b; }, re.source);
// Hide result cards that belong to any other centre (same rule as the screenshot capture).
const onlyTraining = c => c.page.evaluate(() => [...document.querySelectorAll('button, [onclick], tr, li, div')].forEach(e => {
  const t = e.textContent; if (t.length > 600 || !/(SG|MY|ID|PH|TH|VN|CN|TR|AU) (BrainFit|BF) /.test(t) || /Training Centre 2027/.test(t)) return;
  if (e.children.length && [...e.children].some(x => /Training Centre 2027/.test(x.textContent))) return;
  e.style.display = 'none'; }));
const byText = (c, sel, re, name = 'a', last = false) => c.tag(`const r = new RegExp(${JSON.stringify(re.source)}); const els = [...document.querySelectorAll(${JSON.stringify(sel)})].filter(e => e.offsetParent && r.test(e.textContent.trim().replace(/\\s+/g, ' '))); return ${last ? 'els[els.length - 1]' : 'els[0]'}`, name);
module.exports = { btn, onlyTraining, byText };
