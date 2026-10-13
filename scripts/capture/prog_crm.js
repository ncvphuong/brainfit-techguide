// Course Progression guide, step 7: the public CRM demo certificate page (GET only, no login).
const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars', '--force-device-scale-factor=1'], defaultViewport: { width: 1400, height: 900 } });
  const page = await browser.newPage();
  await page.goto(process.argv[3], { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: process.argv[2], fullPage: true });
  console.log(await page.evaluate(() => document.body.innerText.slice(0, 400)));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
