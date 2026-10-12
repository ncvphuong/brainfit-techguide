// Shared bits for the BrainFit HQ student videos (server12 / demo centre #132 only).
const { execFile } = require('child_process');
const REMOTE = `ssh -i ~/.ssh/ip14-alex deploy@45.63.26.194 'export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; cd /home/deploy/brainfitstudio && MODE=%MODE% RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_student.rb 2>&1 | grep -v "warning:\\|Bundler\\|^\\s*from"'`;
// Runs the example-student helper (create / remove) on server12; returns a promise so a beat can start it and finish later.
const student = mode => new Promise((res, rej) => execFile('bash', ['-c', REMOTE.replace('%MODE%', mode)], (e, out) => e ? rej(e) : res(String(out).trim())));
const menu = (c, label) => c.tag(`return [...document.querySelectorAll('.bp-nav a, .bp-nav button')].find(a => a.textContent.trim().startsWith(${JSON.stringify(label)}))`, 'menu');
const addTab = c => c.tag(`return [...document.querySelectorAll('a')].find(a => a.textContent.trim() === 'Add' && a.offsetParent)`, 'add');
const rowIcon = (c, user, icon) => c.tag(`const tr = [...document.querySelectorAll('tbody tr')].find(t => t.textContent.includes(${JSON.stringify(user)})); return tr && tr.querySelector('i.fa-${icon}')?.closest('a,button')`, 'row');
const SEARCH_NAME = 'input[name="name"]';
module.exports = { student, menu, addTab, rowIcon, SEARCH_NAME };

// Generic helper-script runner: guide('MODE=create NOCLASS=1'), guide('MODE=class_games STEP=save'), guide('MODE=remove')
const guide = env => new Promise((res, rej) => execFile('bash', ['-c', REMOTE.replace('MODE=%MODE%', env)], (e, out) => e ? rej(e) : res(String(out).trim().split('\n').filter(l => !/cipher|=====/.test(l)).join('\n'))));
const CLASS_LIST = '/acp/class_rooms?center_id=132&name=T1%3A+SmartFit+Lower';
const classRow = (c, icon) => c.tag(`const tr = [...document.querySelectorAll('tbody tr')].find(t => t.querySelector('td')?.textContent.trim() === 'Scholar T1: SmartFit Lower Pri'); return tr && ${icon ? `tr.querySelector('i.fa-${icon}')?.closest('a,button')` : `tr.querySelector('td a')`}`, 'crow');
const group = (c, label) => c.tag(`const l = [...document.querySelectorAll('.bp-content label')].find(l => l.textContent.trim().startsWith(${JSON.stringify(label)})); return l && (l.closest('.form-group') || l.parentElement)`, 'grp');
Object.assign(module.exports, { guide, CLASS_LIST, classRow, group });
