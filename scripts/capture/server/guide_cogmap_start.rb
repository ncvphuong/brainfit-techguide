# Demo data for the TechGuide "Student CogMAP" / "Class Start CogMAP" guides + videos. server12 (dev) ONLY, centre #132 only.
#   MODE=seed    two throw-away classes "Demo CogMAP Class A/B" with sgtc27_cs01..06 students in these states:
#                cs01 mid-round (active, setup, open round) | cs02 active, no round | cs03..cs06 not active, no setup
#   MODE=unseed  removes the classes and students (every row keyed to them).
abort 'server12 only' unless Socket.gethostname == 'server12'
abort 'centre 132 only' unless Center.find(132).name.include?('Training Centre 2027')
PREFIX = 'sgtc27_cs'.freeze
CENTRE = 132
NAMES = ['Demo CogMAP Class A', 'Demo CogMAP Class B'].freeze

def remove_demo!
  ids = User.unscoped.where("username LIKE '#{PREFIX}%'").ids
  cn = ActiveRecord::Base.connection
  if ids.any?
    Audited::Audit.where(auditable_type: 'User', auditable_id: ids).delete_all
    StudentCustomerAssociation.where(student_id: ids).delete_all
    GameStatistic.where(user_id: ids).find_each(&:destroy)
    cn.select_rows("select table_name, column_name from information_schema.columns where table_schema='public' and column_name in ('user_id','student_id') and table_name not in ('users','audits','student_customer_associations')").each do |t, c|
      cn.execute("delete from #{cn.quote_table_name(t)} where #{cn.quote_column_name(c)} in (#{ids.join(',')})")
    rescue ActiveRecord::StatementInvalid => e
      puts "skip #{t}.#{c}: #{e.message[0, 80]}"
    end
    User.unscoped.where(id: ids).each(&:delete)
  end
  ClassRoom.where(center_id: CENTRE, name: NAMES).each do |c|
    Audited::Audit.where(auditable_type: 'ClassRoom', auditable_id: c.id).delete_all
    cn.select_rows("select table_name from information_schema.columns where table_schema='public' and column_name='class_room_id' and table_name <> 'users'").each do |(t)|
      cn.execute("delete from #{cn.quote_table_name(t)} where class_room_id = #{c.id}")
    rescue ActiveRecord::StatementInvalid => e
      puts "skip #{t}: #{e.message[0, 80]}"
    end
    c.delete
  end
  puts "removed #{ids.size} demo students"
end

remove_demo!
exit if ENV['MODE'] == 'unseed'

classes = NAMES.map { |n| ClassRoom.create!(center_id: CENTRE, name: n, status: true, deleted: false) }
parents = StudentCustomerAssociation.where(student_id: User.where(class_room_id: ClassRoom.where(center_id: CENTRE).select(:id)).unscope(:order).select(:id)).distinct.pluck(:customer_id).first(6)
pw = SecureRandom.hex(12)
6.times do |i|
  n = format('%02d', i + 1)
  u = User.new(role_id: Role::STUDENT.ID, username: "#{PREFIX}#{n}", name: "Demo CogMAP #{n}", password: pw, password_confirmation: pw,
               email: "#{PREFIX}#{n}@demo.brainfitstudio.invalid", dob: Date.new(2017, 1, 10), gender: false, password_reset_status: 'passed',
               class_room_id: classes[i < 3 ? 0 : 1].id, status: true, deleted: false, student_type: 'enrolled')
  u.configs = (u.configs || {}).merge('exam_v2_completed' => true)
  u.save!(validate: false)
  StudentCustomerAssociation.create!(student_id: u.id, customer_id: parents[i % parents.size]) if parents.any?
end
# cs01 mid-round, cs02 active without a round: both with Custom Basic, questions 1-3
%w[01 02].each do |n|
  s = User.find_by(username: "#{PREFIX}#{n}")
  # the demo students are saved without validation, so write configs/levels directly instead of through the validated User#save
  s.update_columns(configs: (s.configs || {}).merge('cog_map_v2_preset' => 'basic_custom', 'cog_map_v2_course' => 'basic', 'exam_v2_completed' => false))
  (1..28).each { |q| s.user_cog_map_v2_levels.create!(level: q, activated: [1, 2, 3].include?(q)) }
  CogMapV2Session.create!(user_id: s.id, course: 'basic', completed: false, status: false) if n == '01'
end
User.where("username LIKE '#{PREFIX}%'").order(:username).each { |s| c = CogMapV2Control.new(s); puts "#{s.id} #{s.username} class=#{s.class_room_id} #{c.status} set_up=#{c.set_up?}" }
puts "classes: #{classes.map(&:id).inspect}"
st = User.where("username LIKE '#{PREFIX}%'").order(:username).pluck(:username, :id).to_h
File.write('/home/deploy/cs_ids.json', { classA: classes[0].id, classB: classes[1].id, mid: st["#{PREFIX}01"], active: st["#{PREFIX}02"], nosetup: st["#{PREFIX}03"] }.to_json)
