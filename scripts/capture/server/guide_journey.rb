# Demo Student Journey data for the TechGuide guide + video. server12 (dev) ONLY, centre #132 "SG BF Training Centre 2027" only.
#   MODE=seed   creates 26 "Demo Journey NN" students (usernames sgtc27_dj01..), starts them as Trial / CogMAP, converts some to
#               Enrolled through the normal model hook (so the Activity Log lines are real), then back-dates the journey events
#               so the By-month chart has several months. Idempotent: it removes any earlier set first.
#   MODE=unseed removes the demo students and their journey events / audits / parent links.
abort 'server12 only' unless Socket.gethostname == 'server12'
abort 'centre 132 only' unless Center.find(132).name.include?('Training Centre 2027')
mode = ENV['MODE'] || 'seed'
PREFIX = 'sgtc27_dj'.freeze
CENTRE = 132

def remove_demo!
  ids = User.unscoped.where("username LIKE '#{PREFIX}%'").ids
  return puts('nothing to remove') if ids.empty?

  StudentTypeEvent.where(student_id: ids).delete_all
  Audited::Audit.where(auditable_type: 'User', auditable_id: ids).delete_all
  StudentCustomerAssociation.where(student_id: ids).delete_all
  GameStatistic.where(user_id: ids).find_each(&:destroy)
  Coachspace::Onboarding.where(student_id: ids).delete_all if defined?(Coachspace::Onboarding)
  User.unscoped.where(id: ids).each(&:delete)
  puts "removed #{ids.size} demo students"
end

remove_demo!
exit if mode == 'unseed'

klass = ClassRoom.find(1404) # Junior EQ: N2, a class of the training centre
parents = StudentCustomerAssociation.where(student_id: User.where(class_room_id: ClassRoom.where(center_id: CENTRE).select(:id)).unscope(:order).select(:id))
                                    .distinct.pluck(:customer_id).first(20)
abort 'no parents found in centre 132' if parents.empty?

# plan: [start type, route, start days ago, days until enrolment]
plan = []
plan += [['trial_class', :cogmap_enrolled, 150, 40], ['trial_class', :cogmap_enrolled, 120, 35], ['trial_class', :enrolled, 100, 21],
         ['trial_class', :enrolled, 70, 14], ['trial_class', :waiting, 75, nil], ['trial_class', :waiting, 20, nil],
         ['trial_class', :waiting, 6, nil], ['trial_class', :cogmap_waiting, 55, nil]]
plan += [['cogmap', :enrolled, 170, 30], ['cogmap', :enrolled, 150, 18], ['cogmap', :enrolled, 130, 25], ['cogmap', :enrolled, 110, 12],
         ['cogmap', :enrolled, 95, 20], ['cogmap', :enrolled, 80, 9], ['cogmap', :enrolled, 60, 15], ['cogmap', :enrolled, 45, 10],
         ['cogmap', :enrolled, 30, 7], ['cogmap', :waiting, 90, nil], ['cogmap', :waiting, 62, nil], ['cogmap', :waiting, 33, nil],
         ['cogmap', :waiting, 12, nil], ['cogmap', :waiting, 5, nil], ['cogmap', :waiting, 2, nil], ['cogmap', :enrolled, 25, 5],
         ['cogmap', :enrolled, 16, 4], ['cogmap', :waiting, 9, nil]]

pw = SecureRandom.hex(12)
now = Time.current
plan.each_with_index do |(start_type, route, ago, days), i|
  n = format('%02d', i + 1)
  u = User.new(role_id: Role::STUDENT.ID, username: "#{PREFIX}#{n}", name: "Demo Journey #{n}", password: pw, password_confirmation: pw,
               class_room_id: klass.id, status: true, deleted: false, student_type: start_type)
  u.save!(validate: false)
  StudentCustomerAssociation.create!(student_id: u.id, customer_id: parents[i % parents.size])
  case route
  when :cogmap_enrolled then u.update_attribute(:student_type, 'cogmap'); u.reload.update_attribute(:student_type, 'enrolled')
  when :cogmap_waiting then u.update_attribute(:student_type, 'cogmap')
  when :enrolled then u.update_attribute(:student_type, 'enrolled')
  end
  # back-date: created event at `ago` days, any change events spread up to the enrolment day
  evs = StudentTypeEvent.where(student_id: u.id).order(:id).to_a
  start = now - ago.days
  evs.each_with_index do |e, k|
    at = if e.source == 'created' then start
         elsif days.nil? then start + [ago / 2, 1].max.days
         else start + (days * (k.to_f / [evs.size - 1, 1].max)).days
         end
    e.update_columns(occurred_at: at, started_at: (e.source == 'created' ? at : e.started_at))
  end
  puts "#{u.username} #{start_type} -> #{u.reload.student_type} (#{route})"
end
puts "events: #{StudentTypeEvent.where(student_id: User.where("username LIKE '#{PREFIX}%'").ids).group(:source, :to_type).count.inspect}"
puts "report: #{StudentJourneyReport.new(center_ids: [CENTRE], from: 1.year.ago.to_date, to: Date.today).kpis.inspect}"
