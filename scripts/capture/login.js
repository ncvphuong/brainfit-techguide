// TechGuide home page > How to log in to BrainFit HQ (server12 dev host brainfit-hq.dev3.powerdigital.sg). No password is typed and no email sent:
// the 2FA / temporary-password / new-password screens are reached with throw-away session cookies minted by server/mint_login.rb (login_cookies.json, git-ignored).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const HOST = 'brainfit-hq.dev3.powerdigital.sg', BASE = 'https://' + HOST;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const jar = JSON.parse(fs.readFileSync(__dirname + '/login_cookies.json', 'utf8'));
async function shot(browser, w, h, path, file, cookie, after) {
  const page = await browser.newPage(); await page.setViewport({ width: w, height: h });
  const ctx = browser.defaultBrowserContext();
  if (cookie) await page.setCookie({ name: cookie.name, value: cookie.value, domain: HOST, path: '/', secure: true, httpOnly: true });
  await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' }).catch(() => {});
  // the demo account's e-mail address is never shown: replace any address on the page
  await page.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) n.nodeValue = n.nodeValue.replace(/[\w.+-]+@[\w.-]+\.\w+/g, 'you@example.com'); });
  if (after) await after(page);
  await sleep(2500); console.log(page.url(), '->', file); await page.screenshot({ path: `${OUT}/${file}` });
  console.log((await page.evaluate(() => document.body.innerText.slice(0, 260))).replace(/\n+/g, ' | ')); await page.close();
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars', '--force-device-scale-factor=1'] });
  await shot(browser, 1440, 900, '/users/sign_in', 'login-1.png');
  await shot(browser, 1440, 900, '/users/forgot_password', 'login-2.png');
  await shot(browser, 1440, 900, '/users/two_factor_verification', 'login-3.png', jar.otp);
  await shot(browser, 1440, 900, '/users/temp_password_verification', 'login-4.png', jar.temp);
  await shot(browser, 1440, 900, '/users/password_update', 'login-5.png', jar.newpw);
  await shot(browser, 390, 844, '/users/sign_in', 'login-phone.png');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
