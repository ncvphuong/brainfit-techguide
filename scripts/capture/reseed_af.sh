#!/bin/sh
# usage: reseed_af.sh unseed  -- removes the demo questionnaire(s) from server12
HOST=deploy@45.63.26.194; KEY=~/.ssh/ip14-alex
scp -q -i $KEY "$(dirname $0)/server/guide_assessor_public.rb" $HOST:/home/deploy/guide_assessor_public.rb
ssh -i $KEY $HOST 'cd /home/deploy/brainfitstudio 2>/dev/null || cd ~/brainfitstudio; export PATH="$HOME/.rbenv/bin:$HOME/.rbenv/shims:$PATH"; RAILS_ENV=production DISABLE_SPRING=1 bundle exec rails runner /home/deploy/guide_assessor_public.rb 2>&1 | grep -v -i warning'
