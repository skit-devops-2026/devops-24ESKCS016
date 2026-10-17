# Deployment & MT2 Evidence

## Deployment target

The project is containerized and can be deployed on a platform that supports Docker, such as Render, Railway, Fly.io, or a VM.

Use the repository `Dockerfile` as the source of the deployed application. Keep the platform's externally assigned `PORT` in mind; the server already reads `process.env.PORT` and falls back to `3000`.

## Required evidence

After the application is deployed:

1. Open the real public application URL.
2. Confirm the home page loads.
3. Open `<PUBLIC_URL>/health` and confirm it returns HTTP 200 with `{"status":"ok"}`.
4. Take a screenshot showing the public URL and the working application.
5. Save the screenshot as:

```text
docs/deployment-screenshot.png
```

6. Put the real public URL in the root `README.md`.
7. Commit and push the screenshot and README change.

Do not create a fake screenshot or placeholder deployment URL.

## Render deployment notes

Create a new **Web Service** from the GitHub repository and select the repository's Docker deployment option so Render builds the `Dockerfile`.

After deployment, verify the assigned public URL and the `/health` endpoint. Use the platform's documented port configuration if it asks for a service port; the Node server accepts `PORT` from the environment.
