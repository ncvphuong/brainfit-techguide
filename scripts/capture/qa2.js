// Quiz AI guide, part 2: Import an existing quiz from a Google Form link, as master admin on server12 (dev).
const { open, go, mark, clear, shot, clickText } = require('./lib');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qa';
const LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSfm47SGCix--W-jjMN4gt4VQVNrbuoh6VMdlX7-acBDbTyQYA/viewform';
(async () => {
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes');
  await clickText(page, 'a,button', 'Add'); await sleep(500);
  await clickText(page, 'button', 'Import an existing quiz'); await sleep(500);
  await page.type('#qaImpLink', LINK, { delay: 3 }); await sleep(300);
  await shot(page, `${OUT}/qi-1.png`);
  await page.click('#qaImpBtn'); await sleep(4000);
  await shot(page, `${OUT}/qi-2.png`);
  await page.waitForFunction(() => !document.getElementById('qaStepPreview').hidden || !document.getElementById('qaError').hidden, { timeout: 240000 });
  console.log('err', await page.evaluate(() => document.getElementById('qaError').textContent));
  await sleep(2500);
  await shot(page, `${OUT}/qi-3.png`);
  fs.writeFileSync('qi_prev.txt', await page.evaluate(() => document.getElementById('qaPrevIntro').innerText + '\n' + document.getElementById('qaSummary').innerText + '\n' + document.getElementById('qaSkippedList').innerText + '\n' + document.getElementById('qaQuizTitle').value + '\n' + [...document.querySelectorAll('.qa-q')].slice(0,4).map(q=>q.innerText.slice(0,300)).join('\n--\n')));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
