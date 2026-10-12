# Screenshot capture for the BrainFit HQ guides

Re-takes the screenshots in `docs/BrainFit HQ/` against **server12 (dev) only**, inside the practice training centre (#132, "SG BF Training Centre 2027") and test courses 338 / 68.

1. `npm i puppeteer-core@23` in this folder (uses the installed Google Chrome).
2. Session cookies (no password typed anywhere): copy `server/mint.rb` to server12 and run it with `rails runner`. It writes `/home/deploy/cap_cookies.json` for `ca` (sgtc27_ca01), `ma` (power_ma_sg), `ml` (sggroupml) and `author` (power_ml, course 338's author). Copy that file here as `cookies.json` (git-ignored), then delete it from the server.
3. `server/guide_student.rb` and `server/m338.rb` must also be on server12 (`/home/deploy/`). They create and remove the temporary example student, snapshot / restore class 1407's games, and remove the empty resource "+" creates on course 338.
4. Run a section: `node student.js out/student`, `class.js`, `cogmap.js`, `course.js` (+ `addres.js`), `intro.js`. Check with `python3 sheet.py out/<section> sheet.png`, then copy the PNGs into the section's `img/` folder.

Things learnt the hard way:
- Class **Add Games** replaces the class's whole game list: restore the full set (game + subgames), not row ids.
- Course **Add resource (+)** creates an empty "media title" resource on the GET; always remove it after.
- Headless Chrome pauses CSS animations; `lib.js` turns them off so dropdowns aren't caught half-faded.
- The Reset CogMAP link only shows for SA / ML, so that one shot uses `ml`.

Scheduling (dev, scheduling.dev3.powerdigital.sg): `server/sch_token.rb` (rails runner on server12) mints an API access grant for power_ma_sg; `server/sch_session.py` (manage.py shell in /home/deploy/brainfit-scheduling-dev) turns it into a Django session; save its cookie as `sch_cookie.json` (git-ignored). Set `user_timezone` to Asia/Singapore in that session. `schlib.js` redirects the dev pages' hardcoded production-API call to server12 (dev bug, reported). Then `node sch.js out/sch` and `node tc.js out/tc`.
