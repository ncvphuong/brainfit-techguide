// Teacher Tools (production, tt.brainfitstudio.com) capture: token login with an API grant minted server-side
// for power_ma_sg (no password typed). Training centre only. Chrome profile on the Transcend SSD.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const BASE = 'https://tt.brainfitstudio.com';
async function openTT(opts = {}) {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new',
    userDataDir: '/Volumes/Transcend/development/tmp/bf-ruby-dev/chrome/tt', args: ['--hide-scrollbars'],
    defaultViewport: { width: opts.width || 430, height: opts.height || 932, deviceScaleFactor: 2, isMobile: !!opts.mobile, hasTouch: !!opts.mobile } });
  const page = await browser.newPage();
  await page.emulateTimezone('Asia/Singapore');
  page.on('dialog', d => d.dismiss());
  return { browser, page };
}
async function goTT(page, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));
}
async function loginTT(page) {
  const token = fs.readFileSync(__dirname + '/tt_token', 'utf8').trim();
  // The login form sets Django's csrftoken cookie; token login alone never does, and the centre switch needs it.
  await page.goto(`${BASE}/logout/`, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
  await page.goto(`${BASE}/login/`, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.goto(`${BASE}/login/token/?token=${encodeURIComponent(token)}`, { waitUntil: 'networkidle2', timeout: 90000 });
}
module.exports = { openTT, goTT, loginTT, BASE };
// Switch to the training centre and refuse to continue (no screenshots) if any other centre is still showing.
async function useTrainingCentre(page) {
  // selectCenter() needs Django's csrftoken cookie, which only a page with a form sets.
  if (!(await page.cookies()).some(c => c.name === 'csrftoken')) await page.goto(BASE + '/login/', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.goto(BASE + '/dashboard/', { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => { const b = document.querySelector('button[onclick^="selectCenter(127,"]'); b && b.click(); });
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {}); await new Promise(r => setTimeout(r, 1500));
  await page.goto(BASE + '/dashboard/', { waitUntil: 'networkidle2', timeout: 90000 });
  const label = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.textContent.trim()).find(t => /^SG /.test(t)));
  if (label !== 'SG BF Training Centre 2027') throw new Error('centre is ' + label + ' - stopping, nothing captured');
  return label;
}
module.exports.useTrainingCentre = useTrainingCentre;
