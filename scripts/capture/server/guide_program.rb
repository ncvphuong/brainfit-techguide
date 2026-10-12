# server12 only: removes the temporary "SG BF Training Demo" program used by program.js (and the
# enrollments its Add Class created). Prints class 1407's programs so the class-edit shot is predictable.
abort 'server12 only' unless Socket.gethostname == 'server12'
Program.where(name: 'SG BF Training Demo').each do |p|
  StudentProgramEnrollment.where(program_id: p.id).delete_all
  ClassRoomProgram.where(program_id: p.id).delete_all
  Subprogram.where(program_id: p.id).delete_all
  p.delete
  puts "removed program #{p.id}"
end
puts "class 1407 programs: #{ClassRoom.find(1407).programs.pluck(:name).inspect}"
