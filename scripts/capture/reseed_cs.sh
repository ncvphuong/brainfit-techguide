#!/bin/bash
# re-seed the Demo CogMAP data on server12 and fetch the ids (MODE=seed|unseed)
K=~/.ssh/ip14-alex; H=deploy@45.63.26.194; D="$(cd "$(dirname "$0")" && pwd)"
scp -q -i $K "$D/server/guide_cogmap_start.rb" $H:/home/deploy/
ssh -i $K $H "export PATH=\"\$HOME/.rbenv/bin:\$PATH\"; eval \"\$(rbenv init -)\"; cd /home/deploy/brainfitstudio && MODE=${1:-seed} RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_cogmap_start.rb 2>&1 | grep -E '^(removed|skip|[0-9]+ sgtc|classes|.*Error)' | cut -c1-200"
[ "${1:-seed}" = seed ] && scp -q -i $K $H:/home/deploy/cs_ids.json "$D/cs_ids.json" && cat "$D/cs_ids.json" && echo
