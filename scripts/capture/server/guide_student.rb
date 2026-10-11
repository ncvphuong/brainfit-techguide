# server12 only: create / remove the example student used in the TechGuide "Create a student" screenshots.
abort 'server12 only' unless Socket.gethostname == 'server12'
require 'warden/test/helpers'
Warden.test_mode!
mode = ENV['MODE']
if mode == 'create'
  ma = User.find_by(username: 'power_ma_sg')
  parent = User.find_by(username: 'sgtc27.p01@demo.brainfitstudio.invalid') || User.find_by(email: 'sgtc27.p01@demo.brainfitstudio.invalid')
  klass = ENV['NOCLASS'] ? nil : ClassRoom.find_by(center_id: 132, name: 'Junior EQ: N2', deleted: false)
  s = ActionDispatch::Integration::Session.new(Rails.application); s.host = 'brainfit.dev3.powerdigital.sg'; s.https!
  s.extend Warden::Test::Helpers; s.login_as(ma, scope: :user, run_callbacks: false)
  s.get('/acp/students/new'); tok = s.response.body[/name="csrf-token" content="([^"]+)"/, 1]
  pw = "Tg#{SecureRandom.hex(6)}!A1"
  s.post('/acp/students', params: { data: { customer_id: parent.id, class_room_id: klass&.id, username: 'sgtc27_guide01', name: 'Chloe Tan', email: '', password: pw, password_confirmation: pw,
                                            dob: '2019/03/14', gender: 'false', password_reset_status: 'passed' } }, headers: { 'X-CSRF-Token' => tok })
  u = User.find_by(username: 'sgtc27_guide01')
  puts "create -> #{s.response.status} #{s.response.location} id=#{u&.id} class=#{u&.class_room&.name} parent=#{u&.customers&.first&.name}"
elsif mode == 'class_games'
  # Snapshot / restore the class's whole game setup (game + subgames). Class "Add Games" replaces every row,
  # so restoring by row id is wrong; restore the exact set instead.
  cr = ClassRoom.find_by(center_id: 132, name: 'Scholar T1: SmartFit Lower Pri', deleted: false)
  f = '/home/deploy/guide_class_games.json'
  if ENV['STEP'] == 'save'
    snap = cr.game_class_room_associations.map { |a| [a.game_id, a.game_class_subgames.pluck(:subgame_id).sort] }
    File.write(f, snap.to_json); puts "saved #{cr.id}: #{snap.inspect}"
  else
    snap = JSON.parse(File.read(f))
    cr.game_class_room_associations.each { |a| a.game_class_subgames.destroy_all; a.destroy }
    snap.each { |gid, subs| a = cr.game_class_room_associations.create!(game_id: gid); subs.each { |sid| a.game_class_subgames.create!(subgame_id: sid) } }
    puts "restored class #{cr.id}: #{cr.game_class_room_associations.reload.map { |x| [x.game_id, x.game_class_subgames.pluck(:subgame_id).sort] }.inspect}"; File.delete(f)
  end
elsif mode == 'fix_1407'
  cr = ClassRoom.find(1407); ref = ClassRoom.find(253)
  raise 'expected empty' if cr.game_class_room_associations.exists?
  ref.game_class_room_associations.each { |r| a = cr.game_class_room_associations.create!(game_id: r.game_id); r.game_class_subgames.each { |s| a.game_class_subgames.create!(subgame_id: s.subgame_id) } }
  puts "1407 now: #{cr.game_class_room_associations.reload.map { |x| [x.game_id, x.game_class_subgames.pluck(:subgame_id).sort] }.inspect}"
elsif mode == 'remove'
  u = User.unscoped.find_by(username: 'sgtc27_guide01')
  if u
    u.games.clear rescue nil
    u.update_columns(deleted: true, username: "sgtc27_guide01_removed_#{Time.now.to_i}", email: "removed_#{Time.now.to_i}_#{u.email}")
    puts "removed #{u.id}"
  else
    puts 'nothing to remove'
  end
end
