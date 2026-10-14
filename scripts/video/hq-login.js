// How to log in to BrainFit HQ (dev host brainfit-hq.dev3.powerdigital.sg). No password is typed and no email is sent: the code / temporary-password / new-password
// screens are opened with throw-away session cookies minted by capture/server/mint_login.rb (capture/login_cookies.json, git-ignored). Email addresses are masked on every page.
const { makeVideo } = require('./lib');
const fs = require('fs'), path = require('path');
const HQ = 'https://brainfit-hq.dev3.powerdigital.sg', HOST = 'brainfit-hq.dev3.powerdigital.sg';
const jar = JSON.parse(fs.readFileSync(path.join(__dirname, '../capture/login_cookies.json'), 'utf8'));
const use = async (c, k) => { const old = await c.page.cookies(HQ); if (old.length) await c.page.deleteCookie(...old.map(o => ({ name: o.name, domain: o.domain, path: o.path }))); await c.page.setCookie({ name: jar[k].name, value: jar[k].value, domain: HOST, path: '/', secure: true, httpOnly: true }); };
makeVideo({
  name: 'hq-login', who: 'ma', startPath: HQ + '/users/sign_in',
  before: async c => {
    await c.page.evaluateOnNewDocument(() => {
      const f = () => { const w = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const r = n.nodeValue.replace(/[\w.+-]+@[\w.-]+\.\w+/g, 'you@example.com'); if (r !== n.nodeValue) n.nodeValue = r; } };
      const b = () => { f(); new MutationObserver(f).observe(document.documentElement, { subtree: true, childList: true, characterData: true }); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', b); else b();
    });
  },
  beats: [
    { say: 'BrainFit HQ has its own address: hq dot brainfit studio dot com. It always opens the new Brain HQ look. The older address, acp dot brainfit studio dot com, still works exactly as before. Type your username and password, and click Sign in. The eye icon shows or hides what you type.',
      run: async c => {
        const u = await c.tag(`return document.querySelector('input[name="user[username]"]')`, 'u'); await c.hl(u, 4); await c.glide(u); await c.sleep(1800); await c.unhl();
        const e = await c.tag(`return document.querySelector('input[name="user[password]"]')`, 'p'); await c.hl(e, 4); await c.glide(e); await c.sleep(1500); await c.unhl();
        const eye = await c.tag(`const i = document.querySelector('input[name="user[password]"]'); return i.parentElement.querySelector('button')`, 'eye'); await c.hl(eye, 5); await c.glide(eye); await c.sleep(1800); await c.unhl();
        const s = await c.tag(`return document.querySelector('button[name="commit"]')`, 'si'); await c.hl(s, 4); await c.glide(s); await c.sleep(1800); await c.unhl();
      } },
    { say: 'The first time you use hq, log in once: signing in on acp does not carry over to hq.',
      run: async c => { const l = await c.tag(`return document.querySelector('form')`, 'frm'); await c.hl(l, 6); await c.glide(l); await c.sleep(2500); await c.unhl(); } },
    { say: 'If your account uses two-factor sign-in, we email you a six-digit code. Type it in, and it submits by itself. The code lasts ten minutes, and Resend code sends a new one.',
      run: async c => {
        await use(c, 'otp'); await c.go(HQ + '/users/two_factor_verification'); await c.sleep(800);
        const i = await c.tag(`return document.getElementById('otp_code')`, 'otp'); await c.hl(i, 4); await c.glide(i); await c.sleep(1500); await c.unhl();
        const t = await c.tag(`return document.getElementById('ba-countdown')`, 'cd'); await c.hl(t, 5); await c.glide(t); await c.sleep(1800); await c.unhl();
        const r = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Resend code/.test(b.textContent))`, 'rs'); await c.hl(r, 4); await c.glide(r); await c.sleep(1800);
      } },
    { say: 'If you forgot your password, click Lost your password on the sign in page, enter your email address, and click Send temporary password.',
      run: async c => {
        await c.unhl(); await c.go(HQ + '/users/sign_in'); await c.sleep(600);
        const l = await c.tag(`return [...document.querySelectorAll('a')].find(a => /Lost your password/.test(a.textContent))`, 'lost'); await c.hl(l, 4); await c.glide(l); await c.sleep(1200); await c.unhl(); await c.click(l, { wait: true }); await c.sleep(800);
        const m = await c.tag(`return document.querySelector('input[type=email], input[name*=email]')`, 'em'); await c.hl(m, 4); await c.glide(m); await c.sleep(1500); await c.unhl();
        const b = await c.tag(`return document.querySelector('button[type=submit], input[type=submit]')`, 'sb'); await c.hl(b, 4); await c.glide(b); await c.sleep(1800);
      } },
    { say: 'Copy the temporary password from the email and enter it. It is valid for twenty four hours, and if it has expired, click Send a new one.',
      run: async c => {
        await c.unhl(); await use(c, 'temp'); await c.go(HQ + '/users/temp_password_verification'); await c.sleep(800);
        const i = await c.tag(`return document.querySelector('input[type=password], input[type=text]')`, 'tp'); await c.hl(i, 4); await c.glide(i); await c.sleep(1500); await c.unhl();
        const n = await c.tag(`return [...document.querySelectorAll('a,button')].find(a => /Send a new one/.test(a.textContent))`, 'new'); await c.hl(n, 4); await c.glide(n); await c.sleep(1800);
      } },
    { say: 'Then choose a new password. The list shows what it needs, and the strength meter updates as you type. Type it again to confirm, and click Update password. Then you are in.',
      run: async c => {
        await c.unhl(); await use(c, 'newpw'); await c.go(HQ + '/users/password_update'); await c.sleep(800);
        const r = await c.tag(`return [...document.querySelectorAll('li, div, ul')].find(e => /At least 8 characters/.test(e.textContent) && e.textContent.length < 300 && !e.querySelector('input'))`, 'req').catch(() => null); if (r) { await c.hl(r, 4); await c.glide(r); } await c.sleep(2800); await c.unhl();
        const u = await c.tag(`return [...document.querySelectorAll('button')].find(b => /Update password/.test(b.textContent))`, 'up'); await c.hl(u, 4); await c.glide(u); await c.sleep(2000);
      } },
  ],
}).then(r => console.log(JSON.stringify(r.starts.map(x => +x.toFixed(1))))).catch(e => { console.error(e.message); process.exit(1); });
