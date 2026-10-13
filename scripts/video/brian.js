// BrainFit AI (Brian) walkthrough on dev (server12) as power_ma_sg. Demo student sgtc27_s30 only. The note is cancelled, never confirmed.
const { makeVideo } = require('./lib');
const STU = 'sgtc27_s30';
const settle = async (c, min = 4000, max = 45000) => { const t0 = Date.now(); let last = '', same = 0; await c.sleep(min); while (Date.now() - t0 < max) { const t = await c.page.evaluate(() => document.getElementById('bcLog')?.innerText || ''); if (t === last && t.length > 60) { if (++same >= 2) break; } else same = 0; last = t; await c.sleep(1200); } };
const ask = async (c, q) => { const i = await c.tag(`return document.getElementById('bcInput')`, 'in'); await c.click(i); await c.page.keyboard.type(q, { delay: 45 }); await c.sleep(400); await c.page.keyboard.press('Enter'); };
const fresh = async c => { await c.go('/acp/ai_agent_chat?new=1'); };
makeVideo({
  name: 'brian', who: 'ma', startPath: '/acp',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => { // my own earlier test chats carry the old spelling in their titles; the product spelling is CogMAP
      const f = () => document.querySelectorAll('.bc-side a').forEach(a => { if (/CogMap/.test(a.textContent)) a.textContent = a.textContent.replace(/CogMap/g, 'CogMAP'); });
      const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true, characterData: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
  },
  beats: [
    { say: 'Meet Brian, the BrainFit AI assistant. He is the round picture at the bottom right of every Brain HQ page, and on the dashboard he says, Ask me. Click him to open the card.',
      run: async c => { const s = await c.tag(`return document.getElementById('bbSay')`, 'say'); await c.hl(s, 5); await c.glide(s); await c.sleep(1500); await c.unhl(); const f = await c.tag(`return document.getElementById('bbFace')`, 'face'); await c.click(f); await c.sleep(1200); } },
    { say: 'The card has an ask box, a few example questions, and short tips. Brian only sees what you can already see in Brain HQ. He can answer about students, classes, CogMAP results and schedules, and he gives you links to the real pages.',
      run: async c => { const k = await c.tag(`return document.getElementById('bbCard')`, 'card'); await c.hl(k, 4); await c.glide(k); await c.sleep(2500); await c.unhl(); const x = await c.tag(`return document.getElementById('bbClose')`, 'x'); await c.click(x); await c.sleep(600); } },
    { say: 'You can also ask from the dashboard search box. When your words look like a question, an Ask Brian row appears at the top. Press Enter, and the chat opens.',
      run: async c => {
        const s = await c.tag(`return document.querySelector('input[aria-label="Search"]')`, 'srch'); await c.click(s); await c.page.keyboard.type(`How is ${STU} doing this month?`, { delay: 55 }); await c.sleep(1800);
        await c.tag(`return [...document.querySelectorAll('*')].find(e => e.children.length < 4 && e.offsetParent && /Ask Brian \\(BrainFit AI\\)/.test(e.textContent) && e.textContent.length < 120)?.closest('a,li,div[role],div')`, 'row').then(r => c.hl(r, 3)).catch(() => {});
        await c.sleep(2500); await c.unhl(); await c.page.keyboard.press('Enter'); await c.page.waitForSelector('#bcLog', { timeout: 90000 }); await settle(c, 6000);
      } },
    { say: 'Brian answers word by word. Your question is on the right and his answer is on the left, with the figures and the links to the student profile and the progress report. Recent chats are listed on the left, and New chat starts a fresh one.',
      run: async c => {
        const side = await c.tag(`return document.getElementById('bcSide')`, 'side'); await c.hl(side, 3); await c.glide(side); await c.sleep(2500); await c.unhl();
        const a = await c.tag(`return [...document.querySelectorAll('#bcLog a')].find(a => /profile|report/i.test(a.textContent))`, 'lnk').catch(() => null); if (a) { await c.hl(a, 4); await c.glide(a); await c.sleep(2500); await c.unhl(); }
      } },
    { say: 'For CogMAP, Brian always gives the standard score and what it means: the band, the description, and what to work on. He never gives the raw score, SD or mean, even if you ask. He tells you so, and uses the standard score instead. If two students share a name, use the username, like here.',
      run: async c => {
        await fresh(c); await ask(c, `Show ${STU}'s CogMAP results and what to work on. What are the raw score and SD?`); await settle(c, 6000);
        await c.page.evaluate(() => { document.getElementById('bcLog').scrollTop = 0; }); await c.sleep(2500);
        await c.page.evaluate(() => document.getElementById('bcLog').scrollTo({ top: 400, behavior: 'smooth' })); await c.sleep(5000);
        await c.page.evaluate(() => document.getElementById('bcLog').scrollTo({ top: 99999, behavior: 'smooth' })); await c.sleep(3000);
      } },
    { say: 'Ask in English, Chinese, Bahasa Indonesia or Turkish, and Brian replies in the same language.',
      run: async c => { await c.unhl(); await fresh(c); await ask(c, `${STU} 这个月的训练情况怎么样？请用中文回答`); await settle(c, 5000); await c.sleep(1500); } },
    { say: 'Brian can prepare a note or a reminder for you. He shows a Confirm card with exactly what he will save, and nothing is saved until you click Confirm. Here we click Cancel, so nothing changes. Brian cannot reset progress, remove students or delete anything.',
      run: async c => {
        await fresh(c); await ask(c, `Add a note to ${STU}: parents say she sleeps late before tests.`); await settle(c, 5000);
        const p = await c.tag(`return document.querySelector('.bc-prop')`, 'prop'); await c.hl(p, 4); await c.glide(p); await c.sleep(3500); await c.unhl();
        const x = await c.tag(`return document.querySelector('.bc-prop [data-act="cancel"]')`, 'cancel'); await c.hl(x, 5); await c.click(x); await c.sleep(2500);
      } },
    { say: 'That is Brian. Ask him in plain words, open the links to check the real pages, and always confirm before anything is saved.',
      run: async c => { await c.unhl(); await c.sleep(500); } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
