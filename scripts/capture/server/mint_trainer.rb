# Dev only (server12): one trainer session cookie (sgtc27_t04, training centre) for the timed-quiz guide's CoachSpace shots. No password involved.
abort 'server12 only' unless Socket.gethostname == 'server12'
require 'warden/test/helpers'
Warden.test_mode!
u = User.find_by(username: 'sgtc27_t04')
s = ActionDispatch::Integration::Session.new(Rails.application); s.host = 'brainfit.dev3.powerdigital.sg'; s.https!
s.extend Warden::Test::Helpers; s.login_as(u, scope: :user, run_callbacks: false)
s.get('/acp?acp_theme=brainpal'); s.get('/acp')
File.write('/home/deploy/cap_cookies_t.json', { 'cs' => s.cookies.to_hash.merge('_user' => "#{u.id} #{u.username} role=#{u.role_id}") }.to_json); File.chmod(0o600, '/home/deploy/cap_cookies_t.json')
puts 'ok'
