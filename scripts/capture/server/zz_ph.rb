abort 'server12 only' unless Socket.gethostname == 'server12'
ms = Medium.unscoped.joins(:topic).where(topics: { article_id: 338 }, title: 'media title')
if ENV['DEL'].to_s != ''
  ENV['DEL'].split(',').map(&:to_i).each { |i| m = ms.find_by(id: i); puts(m ? "destroyed #{m.destroy.id}" : "no #{i}") }
else
  puts "placeholders: #{ms.pluck(:id, :created_at).inspect}"
end
