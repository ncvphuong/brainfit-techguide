# Mints real session cookies for capture on server12 (dev) only.
abort 'server12 only' unless Socket.gethostname == 'server12'
require 'warden/test/helpers'
Warden.test_mode!
out = {}
{ 'ca' => User.find_by(username: 'sgtc27_ca01'), 'ma' => User.find_by(username: 'power_ma_sg'), 'ml' => User.find_by(username: 'sggroupml'), 'author' => User.find_by(username: 'power_ml') }.each do |k, u|
  s = ActionDispatch::Integration::Session.new(Rails.application); s.host = 'brainfit.dev3.powerdigital.sg'; s.https!
  s.extend Warden::Test::Helpers; s.login_as(u, scope: :user, run_callbacks: false)
  s.get('/acp?acp_theme=brainpal'); s.get('/acp')
  out[k] = s.cookies.to_hash.merge('_user' => "#{u.id} #{u.username} role=#{u.role_id}")
end
File.write('/home/deploy/cap_cookies.json', out.to_json); File.chmod(0o600, '/home/deploy/cap_cookies.json')
puts out.transform_values { |h| h.keys }.inspect
ma = User.find_by(username: 'power_ma_sg')
puts "MA #{ma.id} role=#{ma.role_id} ML=#{ma.master_licensee&.username rescue '?'} sees132=#{ma.list_centers.where(id: 132).exists? rescue '?'} centres=#{(ma.list_centers.count rescue '?')}"
