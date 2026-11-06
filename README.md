---
title: AB Motors
emoji: 🚙
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 8080
pinned: false
---

# AB Motors: Cars for Sale in Achimota, Accra (Docker, Free Hosting)

AB Motors' professional car sales website with real photos, served by **Nginx** inside a **Docker** container.

**Features:** car listings with real photos and photo counts; a detail window for each car with a swipeable photo gallery, full specs, highlights, "Enquire on WhatsApp", "Book inspection" and "Call us"; a shareable link for each car (e.g. `/#car=kia-morning-2016`); filters (Cars / SUVs / Trucks) and sorting; a floating WhatsApp button; a spare parts section (request form until parts are added); a sell-your-car form; contact details with a Google Maps link.

## ⭐ How to edit (everything is in `site/data.js`)

- **Business details:** WhatsApp number, phone, location, opening hours (`BUSINESS`)
- **Add a car:** copy the photos into `site/images/`, then copy one car block in `CARS` and change the details. The first photo in `images` is the main photo.
- **Mark a car as sold:** delete its block, or change the price line.
- **Add spare parts:** fill the `PARTS` list (examples are in the file). The parts grid appears automatically.

After editing: run `docker compose up -d --build` locally, or commit the change on GitHub and Render redeploys automatically.

`site/images/kia-bongo-interior-check.jpg` is not used on the site. Add it to the Bongo's `images` list only if it's really the interior of that truck.

## 1. Project structure

```
ab-motors-website/
├── Dockerfile                  # How the image is built
├── docker-entrypoint.sh        # Start-up script (sets port, writes info, starts Nginx)
├── docker-compose.yml          # One-command local run
├── nginx/nginx.conf.template   # Hardened Nginx config
├── render.yaml                 # Render auto-setup (Blueprint)
├── .github/workflows/docker.yml# CI/CD: build + push image to GHCR
└── site/                       # The website
    ├── data.js        # ← business details, cars, parts (EDIT THIS)
    ├── app.js         # listings, photo gallery, WhatsApp links
    ├── images/        # car photos
    ├── index.html
    ├── style.css
    ├── 404.html
    └── favicon.svg
```

---

## 2. Run it on your own computer

**Install Docker Desktop** (free): https://www.docker.com/products/docker-desktop

```bash
cd ab-motors-website

# Option 1: Docker commands
docker build -t ab-motors .
docker run -d --name ab-motors -p 8080:8080 ab-motors

# Option 2: Docker Compose
docker compose up -d --build
```

Open **http://localhost:8080**. The footer shows which Docker container served the page.

Useful admin commands:

```bash
docker ps                         # running containers (shows "healthy")
docker logs -f ab-motors        # live Nginx access logs
docker exec -it ab-motors sh    # open a shell inside the container
docker stats ab-motors          # CPU / memory usage
curl http://localhost:8080/health # health endpoint -> "ok"
docker stop ab-motors && docker rm ab-motors
```

---

## 3. Put the code on GitHub (free)

1. Create a free account at https://github.com and a **new public repository**, e.g. `ab-motors-website`.
2. Upload the project:

```bash
cd ab-motors-website
git init
git add .
git commit -m "Dockerized website"
git branch -M main
git remote add origin https://github.com/<your-username>/ab-motors-website.git
git push -u origin main
```

(Or use **Add file → Upload files** on GitHub and drag the folder contents in.)

The GitHub Action in `.github/workflows/docker.yml` now builds the image automatically and publishes it free to
`ghcr.io/<your-username>/ab-motors-website`. Check progress in the repo's **Actions** tab.

---

## 4. Host it for free: choose one

### Option A: Render (recommended, no credit card)

1. Sign up at https://render.com with your GitHub account.
2. Click **New → Web Service** and choose your repository.
3. Render detects the `Dockerfile`. Set:
   - **Language/Runtime:** Docker
   - **Instance type:** **Free**
   - **Health check path:** `/health`
4. Click **Create Web Service**. After the build, your site is live at
   `https://ab-motors-website.onrender.com` (the name you chose).

*Alternative:* **New → Blueprint** and pick the repo; `render.yaml` sets everything up for you.

Notes: the free instance **sleeps after 15 minutes without visitors** and takes about a minute to wake on the next visit. Every `git push` redeploys automatically.

### Option B: Hugging Face Spaces (free, does not sleep as quickly)

1. Sign up at https://huggingface.co.
2. Go to https://huggingface.co/new-space, enter a name, choose **SDK: Docker → Blank**, hardware **CPU basic (Free)**, visibility **Public**.
3. Upload all project files (Files tab → **Add file → Upload files**), keeping `README.md` with its top block.
   The `app_port: 8080` line tells Spaces to send visitors to the container's port 8080.
4. The Space builds the image and the site appears at
   `https://huggingface.co/spaces/<username>/<space-name>`.

### Option C: Koyeb (free, runs a pre-built image)

1. Sign up at https://www.koyeb.com.
2. **Create Service → Docker image**, enter `ghcr.io/<your-username>/ab-motors-website:latest`
   (in GitHub, set the package to **Public** under *Packages → Package settings*).
3. Choose the **Free** instance. Under **Environment variables** add `PORT = 8080`, under **Ports** set **8080**, health check path `/health`, then deploy.

---

## 5. What the project demonstrates (for the report/presentation)

| Concept | Where |
|---|---|
| Containerization | `Dockerfile`: `nginx:alpine` base, copy site, expose port |
| Least privilege | Container runs as user `app` (UID 1000), not root |
| Server hardening | `server_tokens off`, security headers, gzip, cache rules |
| Health monitoring | `HEALTHCHECK` in Dockerfile + `/health` endpoint |
| Port mapping / networking | `-p 8080:8080`, `$PORT` set by the platform |
| Logging | Access/error logs to stdout/stderr → `docker logs` / platform logs |
| Orchestration | `docker-compose.yml` with restart policy |
| CI/CD | GitHub Actions builds and pushes to GHCR on every push |
| Free hosting | Render / Hugging Face Spaces / Koyeb free tiers |

## 6. Editing the website

Change files in `site/`, then rebuild:

```bash
docker compose up -d --build
```

Push to GitHub and the hosted site updates itself.

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `port is already allocated` | Use another host port: `-p 9090:8080` |
| Render site slow at first | Free tier was asleep; wait about 1 minute |
| Hugging Face stuck on "Starting" | Make sure README still starts with the block containing `app_port: 8080` |
| Changes not showing | Rebuild with `--build`, hard-refresh the browser (Ctrl+F5) |
| Live status says "Not running in Docker" | You opened `index.html` directly; open it through the container URL |
