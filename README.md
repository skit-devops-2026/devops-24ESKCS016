# Smart Job Portal

An intuitive, responsive web-based job and internship portal developed as a Full Stack Development (FSD) and DevOps practice project at Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur.

---

## Student & Course Details

- **Author / Student:** Abhishek Baberwal
- **Student ID:** 24ESKCS016
- **Branch & Semester:** B.Tech CSE, Semester V (Session 2026)
- **Course:** DevOps Lab & Full Stack Development
- **Organization / Repository:** [skit-devops-2026 / devops-24ESKCS016](https://github.com/skit-devops-2026/devops-24ESKCS016)

---

## Live Deployment & Production Endpoints

- **Live Application URL:** `https://smart-job-portal-24eskcs016.onrender.com`
- **Application Health Check:** `https://smart-job-portal-24eskcs016.onrender.com/health`
- **Prometheus Metrics Endpoint:** `https://smart-job-portal-24eskcs016.onrender.com/metrics`
- **Container Registry Image (GHCR):** `ghcr.io/skit-devops-2026/devops-24eskcs016:latest`

---

## Project Overview

Smart Job Portal (SmartJobs) is a full-stack platform built for students and freshers to browse verified job and internship openings, filter by role/location/category, authenticate with secure hashed credentials, and track application statuses on a personalized dashboard.

The project features a lightweight Node.js HTTP backend (zero runtime npm dependencies required), persistent local database storage, automated testing, containerization via Docker & Docker Compose, metrics collection via Prometheus, visualization dashboards in Grafana, and deployment orchestration via Kubernetes.

---

## Features

- **Home Page (`index.html`):** Hero search banner, category explorer, platform stats, and featured job listings.
- **Job Listings (`jobs.html`):** Dynamic multi-criteria search and filtering (title, category, location, job type, experience).
- **Job Details (`job-details.html`):** Detailed job descriptions, company profiles, qualification requirements, and interactive 1-click application modal.
- **User Authentication:**
  - **Login (`login.html`):** Secure login powered by Node.js cryptographic hashing (`scrypt`).
  - **Registration (`register.html`):** Client-side and server-side validated user registration.
- **Applications Dashboard (`dashboard.html`):** Real-time tracking of submitted applications with status badges (`Applied`, `In Review`, `Shortlisted`, `Selected`, `Rejected`).
- **Informational Pages (`about.html`, `contact.html`):** Platform mission, team info, and contact inquiry forms.
- **Observability:** Built-in Prometheus metrics exporter at `/metrics` tracking HTTP request counts, response latency histograms, and server uptime.

---

## Project Structure

```text
mileStone2/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD workflow (test, build & GHCR push)
├── backend/
│   ├── data/
│   │   └── db.json                # JSON database store with pre-seeded jobs
│   ├── lib/
│   │   ├── auth.js                # Password hashing (scrypt) & session token generation
│   │   └── store.js               # Data access layer for users, jobs & applications
│   └── server.js                  # Pure Node.js HTTP server & Prometheus metrics provider
├── css/
│   ├── style.css                  # Primary stylesheet
│   └── responsive.css             # Mobile & tablet responsiveness
├── docs/
│   ├── DEPLOYMENT.md              # Live deployment documentation and Render guide
│   ├── MT2_EVIDENCE_CHECKLIST.md  # MT2 submission evidence verification checklist
│   ├── deployment-screenshot.png  # Live deployed application screenshot
│   └── k8s-pods-screenshot.png    # Kubernetes cluster verification screenshot
├── js/
│   ├── api.js                     # Frontend API fetch helpers
│   ├── dashboard.js               # Application dashboard logic
│   ├── index.js                   # Homepage rendering
│   ├── job-details.js             # Job details & application submission
│   ├── jobs.js                    # Search and filter handling
│   ├── main.js                    # Global navigation & theme scripts
│   └── validation.js              # Client-side input validation
├── k8s/
│   ├── deployment.yaml            # Kubernetes Deployment manifest (2 replicas, health probes)
│   └── service.yaml               # Kubernetes NodePort Service manifest (port 3000 -> 30080)
├── monitoring/
│   ├── grafana/
│   │   ├── dashboard.json         # Grafana dashboard panels for SmartJobs metrics
│   │   └── provisioning/          # Automated dashboard and Prometheus datasource configs
│   ├── prometheus.yml             # Prometheus scraping configuration for SmartJobs (/metrics)
│   └── README.md                  # Monitoring stack setup instructions
├── tests/
│   ├── auth.test.js               # Jest authentication tests
│   ├── jobs-seed.test.js          # Jest database seed validation
│   └── smart-job-portal.test.js   # Jest DOM & page tests
├── .dockerignore                  # Docker build exclusions
├── .gitignore                     # Git tracking exclusions
├── Dockerfile                     # Multi-stage production container image (Node 20 Alpine)
├── docker-compose.yml             # Full-stack composition: App + Prometheus + Grafana
├── Jenkinsfile                    # Jenkins declarative pipeline definition
├── package.json                   # Project manifest & test runner configuration
├── package-lock.json              # Dependency lockfile
├── README.md                      # Comprehensive project documentation
└── test_project.py                # Python automated test suite (23 validation tests)
```

---

## Getting Started

### 1. Running Locally (Native Node.js)

The application runs directly with standard Node.js without needing any external runtime libraries installed:

```bash
# Start the server
node backend/server.js
```
Open **http://localhost:3000** in your browser. The server serves both static frontend pages and backend REST APIs on the same port.

### 2. Running with Docker

Build and run the container locally:

```bash
docker build -t smart-job-portal .
docker run -p 3000:3000 --name smartjobs-app smart-job-portal
```

### 3. Running Full Stack with Docker Compose (App + Prometheus + Grafana)

Bring up the complete observability stack in one command:

```bash
docker-compose up -d
```

- **Smart Job Portal:** http://localhost:3000
- **Prometheus UI:** http://localhost:9090
- **Grafana Dashboard:** http://localhost:3001 (User: `admin`, Password: `admin`)

---

## Automated Testing

Execute the comprehensive automated test suite locally:

```bash
python -m unittest discover -v
```

The suite validates:
- Presence of all required frontend views and HTML structure.
- Existence of styling sheets and client scripts.
- Integrity of backend controllers, cryptographic authentication modules, and data stores.
- Presence and syntax of deployment artifacts (`Dockerfile`, `docker-compose.yml`, `Jenkinsfile`).
- Observability and orchestration manifests (`monitoring/prometheus.yml`, `k8s/deployment.yaml`, `k8s/service.yaml`).

---

## Continuous Integration & DevOps Overview

### Milestone 1 · Repository Management
- Clean root structure, `.gitignore` configured to exclude `node_modules/`, `dist/`, logs, and cache.
- Version control history with commits spread across multiple calendar days.

### Milestone 2 · Branching Strategy & Pull Requests
- Managed branching workflow (`main`, `feature/jobs-page`, `feature/login-page`, `feature/navbar-improvement`, `feature/registration-page`, `mt2-final`).
- All merged pull requests have comprehensive descriptions detailing changes.

### Milestone 3 · GitHub Actions Automated CI Pipeline (`.github/workflows/ci.yml`)
- Triggers on every push and PR to `main`.
- Runs full test suite via `python -m unittest discover -v`.
- Builds Docker image and verifies `/health` and `/metrics` response.
- Automatically tags and publishes images to GitHub Container Registry (GHCR).

### Milestone 4 · Jenkins Pipeline (`Jenkinsfile`)
- Declarative multi-stage pipeline (`Checkout` -> `Run Tests` -> `Post Actions`).

### Milestone 5 · Containerization
- Production-grade `Dockerfile` using `node:20-alpine` with native healthchecks.
- Multi-container `docker-compose.yml` linking application, Prometheus, and Grafana.

### Milestone 6 · Monitoring & Deployment
- Prometheus metric scraping configured in `monitoring/prometheus.yml`.
- Custom Grafana dashboard committed in `monitoring/grafana/dashboard.json`.
- Live deployment evidence and screenshots committed under `docs/`.

### Milestone 7 · Kubernetes Orchestration
- Declarative Deployment manifest (`k8s/deployment.yaml`) with 2 replicas, resource limits, and readiness/liveness probes.
- NodePort Service manifest (`k8s/service.yaml`) exposing port 3000 through cluster port 30080.
