# MT2 Evidence Checklist

Use this checklist before submission. Do not mark an item complete until the evidence exists.

## M5 — Containerization (6 marks)

- [ ] `Dockerfile` committed to the repository.
- [ ] `docker-compose.yml` committed to the repository.
- [ ] Docker image built successfully with `docker build`.
- [ ] Image pushed to the student's container registry.
- [ ] Registry repository URL recorded for submission evidence.

## M6 — Deployment and Monitoring (8 marks)

- [ ] Public deployment URL responds successfully.
- [ ] The live URL is written in the root `README.md`.
- [ ] `monitoring/prometheus.yml` is committed.
- [ ] Grafana dashboard is committed under `monitoring/`.
- [ ] Prometheus successfully scrapes the application `/metrics` endpoint.
- [ ] Deployment screenshot is saved as `docs/deployment-screenshot.png`.
- [ ] Screenshot is committed and visible in GitHub.

## Final GitHub verification

Open the GitHub repository in a browser and confirm these paths are visible:

```text
Dockerfile
docker-compose.yml
monitoring/prometheus.yml
monitoring/grafana/dashboard.json
docs/deployment-screenshot.png
README.md
```

The live URL and registry image must be real; do not use placeholders in the final submission.
