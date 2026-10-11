abort 'server12 only' unless Socket.gethostname == 'server12'
ms = Medium.unscoped.joins(:topic).where(topics: { article_id: 338 }, title: 'media title').where('media.created_at > ?', 2.hours.ago)
n = ms.count; ms.each(&:destroy); puts "removed #{n} placeholder(s)"
