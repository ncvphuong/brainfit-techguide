# BrainFit TechGuide

Internal documentation site for the BrainFit platform — staff guides, admin how-tos, and system references.

- **Live:** https://techguide.brainfitstudio.com
- **Stack:** Docusaurus 3.7.0 (static site)
- **Migrated from:** https://git.primetechnology.vn/prime-nodejs/tech-guide-brainfit (GitLab)

---

## Local Dev

```bash
npm install   # first time only
npm start     # http://localhost:3000, hot reload
```

## Deploy

```bash
npm run build
rsync -avz --delete -e "ssh -i ~/.ssh/ip14-alex" build/ ubuntu@45.77.244.219:/home/ubuntu/brainfit-techguide/
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full setup details.

## Adding Docs

- Write `.md` files under `docs/` — folder structure = sidebar
- Images go in an `img/` subfolder next to the `.md` file, referenced as `![alt](./img/filename.png)`
- Commit + push to `master`, then redeploy with the two commands above
