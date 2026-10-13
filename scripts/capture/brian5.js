// Re-capture of the CogMAP answer shot (brian-5) now that the demo student has a CogMAP V2 result on dev.
const { open, go, shot } = require('./lib');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 1150 });
  await page.evaluateOnNewDocument(() => { const f = () => document.querySelectorAll('.bc-side a').forEach(a => { if (/CogMap/.test(a.textContent)) a.textContent = a.textContent.replace(/CogMap/g, 'CogMAP'); }); const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true, characterData: true }); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b(); });
  await go(page, '/acp/ai_agent_chat?new=1');
  await page.click('#bcInput'); await page.keyboard.type(process.argv[3], { delay: 15 }); await page.keyboard.press('Enter');
  let last = '', same = 0; for (let i = 0; i < 80; i++) { await sleep(1500); const t = await page.evaluate(() => document.getElementById('bcLog').innerText); if (t === last && t.length > 60 && i > 5) { if (++same >= 3) break; } else same = 0; last = t; }
  console.log(last.length); await page.evaluate(() => { document.getElementById('bcLog').scrollTop = 0; }); await sleep(400); await shot(page, process.argv[2]); await browser.close();
})();
