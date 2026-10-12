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

## Training videos (narrated)

`scripts/video/` records the Student create / edit / view walkthroughs against server12 and mixes an ElevenLabs voice-over: `node student-create.js` (then `student-edit.js`, `student-view.js`) from `scripts/video/`, same cookies as above. The key comes from `ELEVENLABS_API_KEY` in the file named by `ELEVEN_ENV_FILE` (default: the user's `motion_graphic/.env`); voice via `VOICE_NAME` (default "Alice"). Narration clips are cached by text in `scripts/video/out/tts-cache`, so re-recording only re-bills lines you changed. Output: `scripts/video/out/<name>.mp4`; copy into `static/video/hq/`.
Plan and notes: brainfit-ruby `doc/hq/training_center/plan_training_videos_2026-10-12.html`.
Scheduling (dev, scheduling.dev3.powerdigital.sg): `server/sch_token.rb` (rails runner on server12) mints an API access grant for power_ma_sg; `server/sch_session.py` (manage.py shell in /home/deploy/brainfit-scheduling-dev) turns it into a Django session; save its cookie as `sch_cookie.json` (git-ignored). Set `user_timezone` to Asia/Singapore in that session. `schlib.js` redirects the dev pages' hardcoded production-API call to server12 (dev bug, reported). Then `node sch.js out/sch` and `node tc.js out/tc`.

## Teacher Tools (`docs/Teacher Tools/`)

Teacher Tools has no dev server, so `tt.js` runs against **production** (tt.brainfitstudio.com), read-only, as the MA account `power_ma_sg` in the practice training centre (#127 on production). Login is a token from an API access grant minted server-side, saved in `tt_token` next to the script (not committed); no password is typed. `useTrainingCentre()` stops before any screenshot if another centre is showing, and the script exits if the page sends any write request.

    node tt.js "../../docs/Teacher Tools/img"

TT bug worked around in `ttlib.js`: token login never sets Django's `csrftoken` cookie, so the centre switch 403s until a page with a form (`/login/`) has been opened.
