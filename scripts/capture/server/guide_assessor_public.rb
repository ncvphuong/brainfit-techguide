# Removes the demo questionnaire(s) the assessor-forms public-link guide creates, with their responses (server12 only).
abort 'server12 only' unless Socket.gethostname == 'server12'
NAME = 'Training Centre feedback (demo)'
forms = CogMapAssessorForm.where(name: NAME)
puts "forms: #{forms.pluck(:id).inspect}"
forms.each do |f|
  n = CogMapAssessorNote.where(cog_map_assessor_form_id: f.id)
  puts "form #{f.id}: #{n.count} notes, centres #{f.centers.pluck(:id).inspect}"
  n.delete_all
  f.destroy
end
puts "left: #{CogMapAssessorForm.where(name: NAME).count} forms"
