# Deployment Guide — BrainFit TechGuide

**Live URL:** https://techguide.brainfitstudio.com  
**Server:** server02 — `ubuntu@45.77.244.219` (SSH key: `~/.ssh/ip14-alex`)  
**Serve path:** `/home/ubuntu/brainfit-techguide/`  
**Stack:** Docusaurus 3.7.0 → static build → nginx

---

## Every Deploy (2 steps)

```bash
# 1. Build
cd /Volumes/Transcend/development/proof_of_concept/brainfit-techguide
npm run build

# 2. Push to server
rsync -avz --delete -e "ssh -i ~/.ssh/ip14-alex" \
  build/ ubuntu@45.77.244.219:/home/ubuntu/brainfit-techguide/
```

`--delete` removes stale files from previous builds. No server restart needed — nginx serves static files directly.

---

## First-Time Setup (already done — do not repeat)

### Nginx config
Created at `/etc/nginx/sites-available/techguide.brainfitstudio.com` on server02:

```nginx
server {
    server_name techguide.brainfitstudio.com;
    root /home/ubuntu/brainfit-techguide;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### SSL
```bash
sudo certbot --nginx -d techguide.brainfitstudio.com
```

---

## Repo

- **GitHub:** https://github.com/ncvphuong/brainfit-techguide
- **Migrated from:** https://git.primetechnology.vn/prime-nodejs/tech-guide-brainfit (GitLab — legacy)
- **Branches:** `master` (main), `chau-branch`

```bash
# Pull latest before editing
git pull origin master

# After editing docs/images, commit and push, then redeploy
git add . && git commit -m "update docs" && git push origin master
npm run build
rsync -avz --delete -e "ssh -i ~/.ssh/ip14-alex" build/ ubuntu@45.77.244.219:/home/ubuntu/brainfit-techguide/
```

---

## Adding Content

- **Docs:** `docs/` — markdown files organised by folder = sidebar sections
- **Images:** place in an `img/` folder next to the `.md` file, reference as `![alt](./img/filename.png)`
- **Sidebar:** auto-generated from folder structure + `_category_.json` files

## Local Dev

```bash
npm install   # first time only
npm start     # http://localhost:3000 with hot reload
```
