// SCH guide: attendance window with date of birth (dev group 1320, centre 132) and the Brian contact requests list with names masked.
const { openSch, goSch } = require('./schlib');
const { mark, clear } = require('./lib');
const OUT = process.argv[2] || 'out/sp';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const maskNames = (page, map) => page.evaluate(map => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let t = n.nodeValue; for (const k of Object.keys(map)) t = t.split(k).join(map[k]); if (t !== n.nodeValue) n.nodeValue = t; } document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.removeAttribute('href')); }, map);
(async () => {
  const { browser, page } = await openSch({ width: 1440, height: 900 });
  await goSch(page, '/classrooms/class-group/1320/'); await sleep(2000);
  await page.mouse.click(653, 660);
  await sleep(2000);
  await maskNames(page, { 'Elena Hassan': 'Student A', 'Rohan Chen': 'Student B', 'Darren Koh': 'Student C', 'Arjun Yeo': 'Student D' });
  console.log((await page.evaluate(() => document.body.innerText)).slice(0, 700));
  await page.screenshot({ path: `${OUT}/pc-6.png` });
  await page.evaluate(() => { const e = [...document.querySelectorAll('*')].find(x => x.children.length === 0 && /^DOB/.test(x.textContent.trim()) && x.offsetParent); if (e) e.setAttribute('data-tg', '1'); });
  await mark(page, '[data-tg]', { pad: 5 }); await page.screenshot({ path: `${OUT}/pc-7.png` }); await clear(page);
  await goSch(page, '/classrooms/public-waitlist-requests/'); await sleep(1500);
  await maskNames(page, { 'DEV Check': 'Sample Parent A', 'dev.check@example.com': 'parent.a@example.com', 'Linh Nguyen': 'Sample Parent B', 'linh.qa@example.com': 'parent.b@example.com', 'QA Parent': 'Sample Parent C', 'qa.parent@example.com': 'parent.c@example.com', 'DEV Child': 'Child A', 'Minh': 'Child B', 'QA Child': 'Child C', '+84987654321': '+6590000002', '+6591234567': '+6590000001', 'Linh Pham': 'Sample Parent D', 'linh.fd.qa@example.com': 'parent.d@example.com' });
  await page.screenshot({ path: `${OUT}/pc-4.png` });
  await page.evaluate(() => { const h = [...document.querySelectorAll('h2,h3,h4')].find(e => /Contact requests from Brian/i.test(e.textContent)); h.scrollIntoView({ block: 'start' }); h.setAttribute('data-tg', '1'); window.scrollBy(0, -20); });
  await sleep(400); await mark(page, '[data-tg]', { pad: 6 }); await page.screenshot({ path: `${OUT}/pc-5.png` }); await clear(page);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
