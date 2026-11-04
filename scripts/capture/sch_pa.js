// SCH public availability guide, screenshots (dev, centre 132 only; Brian asked two questions). Super Admin screens are in sch_pa_sa.js.
const puppeteer = require('puppeteer-core');
const { openSch, goSch } = require('./schlib');
const { mark, clear } = require('./lib');
const L = process.env.PA_LINK, OUT = process.argv[2] || 'out/af';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  // staff side as Master Admin
  const { browser: sb, page } = await openSch({ width: 1440, height: 900 });
  await goSch(page, '/classrooms/class-groups/availability/'); await sleep(2500);
  await mark(page, '#public-link-btn', { pad: 5 }); await page.screenshot({ path: `${OUT}/pa-1.png` }); await clear(page);
  await page.click('#public-link-btn'); await sleep(1000);
  await page.evaluate(() => document.querySelectorAll('input').forEach(i => { if (/public\/availability/.test(i.value)) i.value = 'https://scheduling.brainfitstudio.com/public/availability/••••••••••••••••/'; })); // never show the secret code
  await page.screenshot({ path: `${OUT}/pa-10.png` }); // the Public link window
  await sb.close();
  // visitor side, no session
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
  const shotPhone = async (file) => { const p = await (await browser.createBrowserContext()).newPage(); await p.setViewport({ width: 390, height: 780, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await p.emulateTimezone('Asia/Singapore'); await p.goto(L, { waitUntil: 'networkidle2' }); await sleep(1200); await p.screenshot({ path: file }); await p.close(); };
  await shotPhone(`${OUT}/pa-3.png`);
  const p = await (await browser.createBrowserContext()).newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]); await p.emulateTimezone('Asia/Singapore');
  await p.goto(L, { waitUntil: 'networkidle2' }); await sleep(1200);
  await p.screenshot({ path: `${OUT}/pa-2.png` });
  await p.click('#brian-fab'); await sleep(1200);
  await p.screenshot({ path: `${OUT}/pa-4.png` });
  const ask = async q => { await p.type('#bin', q, { delay: 25 }); const before = await p.evaluate(() => document.querySelector('#brian-panel').innerText.length); await p.click('#bsend'); let last = -1, same = 0; for (let i = 0; i < 40 && same < 4; i++) { await sleep(1000); const n = await p.evaluate(() => document.querySelector('#brian-panel').innerText.length); if (n > before && n === last) same++; else same = 0; last = n; } };
  await ask('Is there a Saturday morning class with space?'); await sleep(500); await p.screenshot({ path: `${OUT}/pa-5.png` });
  await ask('Có lớp nào vào thứ Năm còn chỗ không?'); await sleep(500); await p.screenshot({ path: `${OUT}/pa-6.png` });
  console.log((await p.evaluate(() => document.querySelector('#brian-panel').innerText)).slice(0, 1500));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
