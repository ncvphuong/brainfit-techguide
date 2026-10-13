// TechGuide > BrainFit HQ > BrainFit AI (Brian): server12 (dev), as power_ma_sg. Questions are about the demo student sgtc27_s30
// (SG BF Training Centre 2027). The note is only ever Cancelled, never Confirmed: no writes.
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const STU = 'sgtc27_s30';
async function settle(page, min = 5) { let last = '', same = 0; for (let i = 0; i < 80; i++) { await sleep(1500); const t = await page.evaluate(() => document.getElementById('bcLog')?.innerText || ''); if (t === last && t.length > 60 && i > min) { if (++same >= 3) break; } else same = 0; last = t; } }
async function ask(page, q) { await page.click('#bcInput'); await page.keyboard.type(q, { delay: 15 }); await page.keyboard.press('Enter'); await settle(page); }
const tag = (page, js, n) => page.evaluate((js, n) => { const el = new Function(js)(); document.querySelectorAll('[data-tg-' + n + ']').forEach(e => e.removeAttribute('data-tg-' + n)); if (el) el.setAttribute('data-tg-' + n, '1'); return !!el; }, js, n);
(async () => {
  const FIX = () => { const f = () => document.querySelectorAll('.bc-side a').forEach(a => { if (/CogMap/.test(a.textContent)) a.textContent = a.textContent.replace(/CogMap/g, 'CogMAP'); }); const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true, characterData: true }); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b(); }; // my own earlier test chats were titled with the old spelling; the product spelling is CogMAP
  const { browser, page } = await open('ma', { width: 1440, height: 900 }); await page.evaluateOnNewDocument(FIX);
  // 1 dashboard + bubble
  await go(page, '/acp');
  await mark(page, '#bbSay', { pad: 4 }); await mark(page, '#bbFace', { pad: 4 }); await shot(page, `${OUT}/brian-1.png`); await clear(page);
  // 2 the card
  await page.click('#bbFace'); await sleep(600);
  await mark(page, '#bbCard', { pad: 4 }); await shot(page, `${OUT}/brian-2.png`); await clear(page);
  await page.click('#bbClose'); await sleep(300);
  // 3 dashboard search: Ask Brian row
  await page.click('input[aria-label="Search"]'); await page.keyboard.type(`How is ${STU} doing this month?`, { delay: 25 }); await sleep(1800);
  await tag(page, `return [...document.querySelectorAll('*')].find(e => e.children.length < 4 && e.offsetParent && /Ask Brian \\(BrainFit AI\\)/.test(e.textContent) && e.textContent.length < 120)?.closest('a,li,div[role],div')`, 'row');
  await mark(page, '[data-tg-row]', { pad: 3 }); await shot(page, `${OUT}/brian-3.png`); await clear(page);
  // 4 chat: opened by Enter, streamed answer with links
  await page.keyboard.press('Enter'); await page.waitForSelector('#bcLog', { timeout: 30000 }); await settle(page);
  await shot(page, `${OUT}/brian-4.png`);
  // 5 CogMAP rule
  await go(page, '/acp/ai_agent_chat?new=1'); await ask(page, `Show ${STU}'s CogMAP results and tell me the raw score and SD`);
  await shot(page, `${OUT}/brian-5.png`);
  // 6 another language
  await go(page, '/acp/ai_agent_chat?new=1'); await ask(page, `${STU} 这个月的训练情况怎么样？请用中文回答`);
  await shot(page, `${OUT}/brian-6.png`);
  // 7/8 note: Confirm card, then Cancel
  await go(page, '/acp/ai_agent_chat?new=1'); await ask(page, `Add a note to ${STU}: parents say she sleeps late before tests.`);
  await tag(page, `return document.querySelector('.bc-prop')`, 'prop'); await mark(page, '[data-tg-prop]', { pad: 4 }); await shot(page, `${OUT}/brian-7.png`); await clear(page);
  console.log('card buttons:', await page.evaluate(() => [...document.querySelectorAll('.bc-prop button')].map(b => b.textContent.trim())));
  await page.click('.bc-prop [data-act="cancel"]'); await sleep(2500);
  await tag(page, `return document.querySelector('.bc-prop')`, 'prop'); await mark(page, '[data-tg-prop]', { pad: 4 }); await shot(page, `${OUT}/brian-8.png`); await clear(page);
  await browser.close();
  // 9 phone view
  const m = await open('ma', { width: 390, height: 844 }); await m.page.evaluateOnNewDocument(FIX);
  await go(m.page, '/acp/ai_agent_chat?new=1'); await ask(m.page, `How is ${STU} doing this month?`);
  await shot(m.page, `${OUT}/brian-9.png`);
  await m.page.click('#bcHistory'); await sleep(800); await shot(m.page, `${OUT}/brian-10.png`);
  await m.browser.close();
})().catch(e => { console.error(e); process.exit(1); });
