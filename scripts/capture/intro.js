// TechGuide > BrainFit HQ landing page: what changed + how to turn Brain HQ on (as power_ma_sg, server12).
const { open, go, mark, clear, shot } = require('./lib');
const OUT = process.argv[2]; require('fs').mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const { browser, page } = await open('ma', { width: 1600, height: 900 });
  // Before / after
  await go(page, '/acp/students?center_id=132&acp_theme=classic'); await go(page, '/acp/students?center_id=132');
  await shot(page, `${OUT}/brainhq-classic.png`);
  // How to turn it on: Classic profile menu
  await page.evaluate(() => { const t = [...document.querySelectorAll('.profile-dropdown-toggle')].find(e => e.offsetParent); t.setAttribute('data-tg-av', '1'); $(t).dropdown('toggle'); }); await sleep(700);
  await page.evaluate(() => { const a = [...document.querySelectorAll('.profile-dropdown a')].find(a => a.offsetParent && /Brain HQ/.test(a.textContent)); a && a.setAttribute('data-tg-on', '1'); });
  await mark(page, '[data-tg-av]', { pad: 4 }); await mark(page, '[data-tg-on]', { pad: 3 });
  await shot(page, `${OUT}/brainhq-turn-on.png`, { clip: { x: 900, y: 0, width: 700, height: 340 } }); await clear(page);
  // After
  await go(page, '/acp/students?center_id=132&acp_theme=brainpal'); await go(page, '/acp/students?center_id=132');
  await shot(page, `${OUT}/brainhq-new.png`);
  // Horizontal menu
  await mark(page, '.bp-nav', { pad: 4 }); await shot(page, `${OUT}/brainhq-menu.png`, { clip: { x: 0, y: 0, width: 1600, height: 110 } }); await clear(page);
  // Merged menus
  for (const [label, file] of [['Reports', 'brainhq-reports'], ['Accounts', 'brainhq-accounts']]) {
    await page.evaluate(l => { const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith(l)); b && b.click(); }, label); await sleep(1500);
    await page.evaluate(l => { const b = [...document.querySelectorAll('.bp-nav > .bp-dd > button')].find(x => x.textContent.trim().startsWith(l)); b?.parentElement.querySelector('.bp-dd-panel, .bp-dd-cols')?.setAttribute('data-tg-panel', '1'); b?.setAttribute('data-tg-btn', '1'); }, label);
    await mark(page, '[data-tg-btn]', { pad: 3 }); await mark(page, '[data-tg-panel]', { pad: 3 });
    await shot(page, `${OUT}/${file}.png`, { clip: { x: 0, y: 0, width: 1600, height: 520 } }); await clear(page);
    await page.evaluate(() => document.querySelectorAll('[data-tg-panel],[data-tg-btn]').forEach(e => { e.removeAttribute('data-tg-panel'); e.removeAttribute('data-tg-btn'); }));
    await page.keyboard.press('Escape'); await page.mouse.click(1500, 800); await sleep(400);
  }
  // Three-dot menu
  await page.click('.bp-more > button'); await sleep(600);
  await mark(page, '.bp-more > button', { pad: 3 }); await page.evaluate(() => document.querySelector('.bp-more .bp-dd-panel, .bp-more [class*=panel]')?.setAttribute('data-tg-more', '1')); await mark(page, '[data-tg-more]', { pad: 3 });
  await shot(page, `${OUT}/brainhq-more.png`); await clear(page); await page.mouse.click(1500, 800); await sleep(400);
  // Profile menu: dark mode + switch back
  await page.click('.bp-user'); await sleep(600);
  await mark(page, '[data-bp-mode-toggle]', { pad: 3 }); await mark(page, '.bp-dd-switch', { pad: 3 });
  await shot(page, `${OUT}/brainhq-profile-menu.png`, { clip: { x: 1000, y: 0, width: 600, height: 300 } }); await clear(page);
  await page.mouse.click(800, 800);
  // Dashboard
  await go(page, '/acp'); await shot(page, `${OUT}/brainhq-dashboard.png`);
  // Dark mode
  await go(page, '/acp/students?center_id=132'); await page.evaluate(() => document.documentElement.setAttribute('data-bp-mode', 'dark')); await sleep(800);
  await shot(page, `${OUT}/brainhq-dark.png`);
  await page.evaluate(() => { localStorage.setItem('bp-mode', 'light'); });
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
