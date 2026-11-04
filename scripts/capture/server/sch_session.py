# Dev SCH (server12): Django session for the capture account, from the token minted on server12 Rails.
import json, socket, time
assert socket.gethostname() == 'server12'
from django.contrib.sessions.backends.db import SessionStore
from django.conf import settings
d = json.load(open('/home/deploy/.sch_user.json'))
s = SessionStore()
s['brainfit_token'] = d['token']; s['brainfit_verified_at'] = time.time(); s['brainfit_user'] = d; s['current_center_id'] = 132; s['user_timezone'] = 'Asia/Singapore'
s.create()
import os
open(os.environ.get('SCH_COOKIE_OUT', '/home/deploy/.sch_cookie'), 'w').write(json.dumps({'name': settings.SESSION_COOKIE_NAME, 'value': s.session_key}))
print('session ok', settings.SESSION_COOKIE_NAME, settings.SESSION_ENGINE)
