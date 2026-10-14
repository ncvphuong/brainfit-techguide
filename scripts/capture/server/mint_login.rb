# Mints three throw-away session cookies for the Brain HQ login screens (dev, server12 only): 2FA code step, temporary-password step,
# set-new-password step. Only session cookies; no password typed, no email sent, nothing written to the database.
abort 'server12 only' unless Socket.gethostname == 'server12'
HOST = 'brainfit-hq.dev3.powerdigital.sg'
u = User.find_by(username: 'sgtc27_ca01')
def mint(host, data)
  inner = ->(env) { data.each { |k, v| env['rack.session'][k] = v }; [200, { 'Content-Type' => 'text/plain' }, ['ok']] }
  stack = ActionDispatch::Cookies.new(ActionDispatch::Session::CookieStore.new(inner, Rails.application.config.session_options))
  env = Rack::MockRequest.env_for("https://#{host}/", Rails.application.env_config)
  _s, headers, _b = stack.call(env)
  c = Array(headers['Set-Cookie']).join("\n").split("\n").first.to_s.split(';').first.to_s
  k, v = c.split('=', 2); { 'name' => k, 'value' => v }
end
out = {
  'otp' => mint(HOST, 'pending_2fa_user_id' => u.id, 'pending_2fa_step' => 'verify_otp'),
  'temp' => mint(HOST, 'reset_email' => u.email),
  'newpw' => mint(HOST, 'temp_user_id' => u.id, 'temp_password_verified' => true),
}
File.write('/home/deploy/cap_login_cookies.json', out.to_json); File.chmod(0o600, '/home/deploy/cap_login_cookies.json')
puts out.transform_values { |h| h['name'] + ' len=' + h['value'].to_s.size.to_s }.inspect
puts "user #{u.id} #{u.username} role=#{u.role_id}"
