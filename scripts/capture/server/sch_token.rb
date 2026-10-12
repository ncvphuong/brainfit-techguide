# server12 only: an API access grant for the TechGuide capture account (what api/v6/auth/login returns), no password.
abort 'server12 only' unless Socket.gethostname == 'server12'
u = User.find_by(username: 'power_ma_sg')
g = u.access_grants.create!
data = { id: u.id, username: u.username, name: u.name, email: u.email, avatar: '', lang: u.lang, role: u.role.code, token: g.access_token, api_domain: nil }
File.write('/home/deploy/.sch_user.json', data.to_json); File.chmod(0o600, '/home/deploy/.sch_user.json')
puts "grant #{g.id} for #{u.username} role=#{u.role.code}"
