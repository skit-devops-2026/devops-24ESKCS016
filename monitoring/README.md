# Smart Job Portal Monitoring

This directory contains the Prometheus configuration and Grafana dashboard used
for MT2 Module 6.

## Local monitoring

Start the complete stack:

```bash
docker compose up --build -d
```

Services:

- Application: http://localhost:3000
- Health check: http://localhost:3000/health
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Grafana login: `admin` / `admin`

The application exposes Prometheus metrics at `/metrics`.

## Dashboard

`grafana/dashboard.json` is provisioned automatically into Grafana. It shows:

- Application uptime
- HTTP request rate
- Total HTTP requests
- Process memory usage

The dashboard JSON is committed to the repository so the monitoring setup is
reproducible and can be checked by the MT2 submission scanner.
