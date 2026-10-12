// Dev scheduling (server12) capture helpers: session cookie minted server-side (no password).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const HOST = 'scheduling.dev3.powerdigital.sg';
async function openSch(opts = {}) {
  const c = JSON.parse(fs.readFileSync(__dirname + '/sch_cookie.json', 'utf8'));
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'], defaultViewport: { width: opts.width || 1600, height: opts.height || 900 } });
  const page = await browser.newPage();
  await page.setCookie({ name: c.name, value: c.value, domain: HOST, path: '/', secure: true });
  await page.emulateTimezone('Asia/Singapore');
  page.on('dialog', d => d.dismiss());
  // The dev SCH pages call production ACP's API from the browser; send those calls to server12's API instead
  // (capture browser only) so the dev token is accepted.
  await page.setRequestInterception(true);
  page.on('request', async req => {
    const url = req.url();
    if (!url.startsWith('https://acp.brainfitstudio.com/api/')) return req.continue();
    const target = url.replace('https://acp.brainfitstudio.com/api/', 'https://brainfit.dev3.powerdigital.sg/api/');
    try {
      const h = { ...req.headers() }; delete h.host; delete h.origin; delete h.referer;
      const res = await fetch(target, { method: req.method(), headers: h, body: req.postData() });
      const body = Buffer.from(await res.arrayBuffer());
      req.respond({ status: res.status, contentType: res.headers.get('content-type') || 'application/json', headers: { 'access-control-allow-origin': '*' }, body });
    } catch (e) { req.continue(); }
  });
  return { browser, page };
}
async function goSch(page, path) {
  await page.goto('https://' + HOST + path, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));
}
module.exports = { openSch, goSch, HOST };
