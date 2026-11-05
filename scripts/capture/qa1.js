// Quiz AI guide, part 1: Add dialog + Create quiz with AI Assistant (PDF lesson), as master admin on server12 (dev).
const { open, go, mark, clear, shot, clickText } = require('./lib');
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const OUT = process.argv[2] || 'out/qa';
const PDF = '/Volumes/Transcend/development/tmp/qa_guide/sleep-lesson.pdf';
const modalShot = async (page, file) => { const c = await page.$('.qa-box, #qaModal > div'); await shot(page, file); };
(async () => {
  fs.mkdirSync('/Volumes/Transcend/development/tmp/qa_guide', { recursive: true });
  if (!fs.existsSync(PDF)) {
    const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
    const p = await b.newPage();
    await p.setContent(`<body style="font:16px/1.6 Georgia;margin:40px"><h1>Lesson 3: Sleep and Learning</h1>
<p>Sleep is when the brain sorts what it learned during the day. During deep sleep the brain replays new facts and moves them from short-term to long-term memory.</p>
<p>Children aged 6 to 12 need 9 to 12 hours of sleep each night. Children who sleep less than this find it harder to pay attention, remember new words and solve problems.</p>
<h2>What helps a child sleep well</h2><ul><li>Going to bed and waking up at the same time every day.</li><li>Turning off screens at least one hour before bed.</li><li>A quiet, dark and cool bedroom.</li><li>Avoiding sugary drinks and heavy meals in the evening.</li></ul>
<h2>Why naps matter</h2><p>A short nap of 20 to 30 minutes after lunch can improve alertness for younger children. Naps longer than 90 minutes can make it harder to fall asleep at night.</p>
<h2>Signs of too little sleep</h2><p>Tiredness in the morning, bad mood, trouble concentrating, and falling asleep in class are the most common signs.</p></body>`);
    await p.pdf({ path: PDF, format: 'A4' }); await b.close();
  }
  const { browser, page } = await open('ma', { width: 1440, height: 900 });
  await go(page, '/acp/quizzes');
  await mark(page, '[data-qa-open]', { pad: 4 }); await shot(page, `${OUT}/qa-1.png`); await clear(page);
  await clickText(page, 'a,button', 'Add'); await sleep(700);
  await shot(page, `${OUT}/qa-2.png`);
  await clickText(page, 'button', 'Create quiz with AI Assistant'); await sleep(500);
  const f = await page.$('#qaGenFile'); await f.uploadFile(PDF);
  await page.select('#qaGenType', 'single_answer'); await sleep(300);
  await shot(page, `${OUT}/qa-3.png`);
  await page.click('#qaGenBtn'); await sleep(2500);
  await shot(page, `${OUT}/qa-4.png`);
  await page.waitForFunction(() => !document.getElementById('qaStepPreview').hidden || !document.getElementById('qaError').hidden, { timeout: 120000 });
  console.log('err', await page.evaluate(() => document.getElementById('qaError').textContent));
  await sleep(800);
  await shot(page, `${OUT}/qa-5.png`);
  fs.writeFileSync('qa_prev.txt', await page.evaluate(() => document.getElementById('qaStepPreview').innerText));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
