// backend/server.js
// SmartJobs backend — a plain Node.js HTTP server (no Express, no npm install
// required). Serves the static frontend AND a small JSON REST API from one
// port, so there's nothing to configure and no CORS to fight.
//
// Run it with:   node backend/server.js
// Then open:     http://localhost:3000

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { readDb, writeDb } = require("./lib/store");
const { hashPassword, verifyPassword, generateToken } = require("./lib/auth");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, ".."); // project root, where the HTML/CSS/JS live
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function publicUser(user) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAuthedUser(req, db) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) return null;

  return db.users.find((u) => u.id === session.userId) || null;
}

// ---------------------------------------------------------------------------
// Static file serving (frontend)
// ---------------------------------------------------------------------------

function serveStatic(req, res, pathname) {
  let relPath = pathname === "/" ? "/index.html" : pathname;
  // Never allow escaping the project root
  const filePath = path.normalize(path.join(ROOT_DIR, relPath));
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  // Don't serve backend source over HTTP
  if (filePath.startsWith(path.join(ROOT_DIR, "backend"))) {
    res.writeHead(404);
    return res.end("Not found");
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Fall back to index.html for unknown routes isn't appropriate for a
      // plain multi-page site — just 404.
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found: " + pathname);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

async function handleApi(req, res, pathname, query) {
  const db = readDb();

  // ---- POST /api/register ----
  if (pathname === "/api/register" && req.method === "POST") {
    const body = await readJsonBody(req);
    const fullName = (body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const userType = body.userType === "recruiter" ? "recruiter" : "student";

    if (!fullName) return sendJson(res, 400, { error: "Full name is required." });
    if (!isValidEmail(email)) return sendJson(res, 400, { error: "Please enter a valid email address." });
    if (password.length < 6) return sendJson(res, 400, { error: "Password must be at least 6 characters." });
    if (db.users.some((u) => u.email === email)) {
      return sendJson(res, 409, { error: "An account with that email already exists." });
    }

    const { salt, hash } = hashPassword(password);
    const user = {
      id: db.nextUserId++,
      fullName,
      email,
      passwordHash: hash,
      salt,
      userType,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);

    const token = generateToken();
    db.sessions.push({ token, userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });

    writeDb(db);
    return sendJson(res, 201, { token, user: publicUser(user) });
  }

  // ---- POST /api/login ----
  if (pathname === "/api/login" && req.method === "POST") {
    const body = await readJsonBody(req);
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    const user = db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
      return sendJson(res, 401, { error: "Invalid email or password." });
    }

    const token = generateToken();
    db.sessions.push({ token, userId: user.id, expiresAt: Date.now() + SESSION_TTL_MS });
    writeDb(db);
    return sendJson(res, 200, { token, user: publicUser(user) });
  }

  // ---- POST /api/logout ----
  if (pathname === "/api/logout" && req.method === "POST") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    db.sessions = db.sessions.filter((s) => s.token !== token);
    writeDb(db);
    return sendJson(res, 200, { ok: true });
  }

  // ---- GET /api/me ----
  if (pathname === "/api/me" && req.method === "GET") {
    const user = getAuthedUser(req, db);
    if (!user) return sendJson(res, 401, { error: "Not authenticated." });
    return sendJson(res, 200, { user: publicUser(user) });
  }

  // ---- GET /api/jobs ----
  if (pathname === "/api/jobs" && req.method === "GET") {
    let results = db.jobs.slice();

    const search = (query.search || "").trim().toLowerCase();
    if (search) {
      results = results.filter((j) =>
        [j.title, j.company, ...(j.skills || [])].join(" ").toLowerCase().includes(search)
      );
    }
    const location = (query.location || "").trim().toLowerCase();
    if (location) {
      results = results.filter((j) => j.location.toLowerCase().includes(location));
    }
    const category = (query.category || "").trim();
    if (category && category !== "All Categories") {
      results = results.filter((j) => j.category === category);
    }
    const type = (query.type || "").trim();
    if (type && type !== "All Types") {
      results = results.filter((j) => j.type === type);
    }
    const experience = (query.experience || "").trim();
    if (experience && experience !== "Any Experience") {
      results = results.filter((j) => j.experience === experience);
    }

    return sendJson(res, 200, { jobs: results, total: results.length });
  }

  // ---- GET /api/jobs/:id ----
  const jobMatch = pathname.match(/^\/api\/jobs\/(\d+)$/);
  if (jobMatch && req.method === "GET") {
    const job = db.jobs.find((j) => j.id === Number(jobMatch[1]));
    if (!job) return sendJson(res, 404, { error: "Job not found." });
    return sendJson(res, 200, { job });
  }

  // ---- POST /api/applications (auth required) ----
  if (pathname === "/api/applications" && req.method === "POST") {
    const user = getAuthedUser(req, db);
    if (!user) return sendJson(res, 401, { error: "Please log in to apply." });

    const body = await readJsonBody(req);
    const jobId = Number(body.jobId);
    const job = db.jobs.find((j) => j.id === jobId);
    if (!job) return sendJson(res, 404, { error: "Job not found." });

    const existing = db.applications.find((a) => a.userId === user.id && a.jobId === jobId);
    if (existing) return sendJson(res, 409, { error: "You already applied to this job." });

    const application = {
      id: db.nextApplicationId++,
      userId: user.id,
      jobId,
      status: "Applied",
      appliedAt: new Date().toISOString()
    };
    db.applications.push(application);
    writeDb(db);
    return sendJson(res, 201, { application });
  }

  // ---- GET /api/applications (auth required) — the current user's applications ----
  if (pathname === "/api/applications" && req.method === "GET") {
    const user = getAuthedUser(req, db);
    if (!user) return sendJson(res, 401, { error: "Please log in to view your applications." });

    const mine = db.applications
      .filter((a) => a.userId === user.id)
      .map((a) => ({ ...a, job: db.jobs.find((j) => j.id === a.jobId) || null }))
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    return sendJson(res, 200, { applications: mine });
  }

  return sendJson(res, 404, { error: "Not found." });
}

// ---------------------------------------------------------------------------
// Health & Prometheus metrics
// ---------------------------------------------------------------------------

const metrics = {
  requests: new Map(),
  duration: {
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10].map((le) => ({ le, count: 0 })),
    inf: 0,
    sum: 0,
    count: 0
  }
};

function metricKey(method, pathname, status) {
  return `${method}|${pathname}|${status}`;
}

function recordRequest(method, pathname, status, durationSeconds) {
  const key = metricKey(method, pathname, status);
  metrics.requests.set(key, (metrics.requests.get(key) || 0) + 1);

  metrics.duration.count += 1;
  metrics.duration.sum += durationSeconds;

  let placed = false;
  for (const bucket of metrics.duration.buckets) {
    if (durationSeconds <= bucket.le) {
      bucket.count += 1;
      placed = true;
    }
  }
  if (!placed) metrics.duration.inf += 1;
}

function escapePrometheusLabel(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function renderMetrics() {
  const lines = [
    "# HELP smartjobs_http_requests_total Total HTTP requests handled by SmartJobs.",
    "# TYPE smartjobs_http_requests_total counter"
  ];

  for (const [key, count] of metrics.requests.entries()) {
    const [method, pathname, status] = key.split("|");
    lines.push(
      `smartjobs_http_requests_total{method="${escapePrometheusLabel(method)}",path="${escapePrometheusLabel(pathname)}",status="${escapePrometheusLabel(status)}"} ${count}`
    );
  }

  lines.push(
    "# HELP smartjobs_http_request_duration_seconds HTTP request duration in seconds.",
    "# TYPE smartjobs_http_request_duration_seconds histogram"
  );

  for (const bucket of metrics.duration.buckets) {
    lines.push(
      `smartjobs_http_request_duration_seconds_bucket{le="${bucket.le}"} ${bucket.count}`
    );
  }
  lines.push(
    `smartjobs_http_request_duration_seconds_bucket{le="+Inf"} ${metrics.duration.count}`,
    `smartjobs_http_request_duration_seconds_sum ${metrics.duration.sum}`,
    `smartjobs_http_request_duration_seconds_count ${metrics.duration.count}`
  );

  lines.push(
    "# HELP smartjobs_uptime_seconds SmartJobs process uptime in seconds.",
    "# TYPE smartjobs_uptime_seconds gauge",
    `smartjobs_uptime_seconds ${process.uptime()}`,
    "# HELP smartjobs_process_resident_memory_bytes SmartJobs process resident memory in bytes.",
    "# TYPE smartjobs_process_resident_memory_bytes gauge",
    `smartjobs_process_resident_memory_bytes ${process.memoryUsage().rss}`
  );

  return lines.join("\n") + "\n";
}

function sendHealth(res) {
  sendJson(res, 200, { status: "ok" });
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);

  // Record the final HTTP status when the response is completed.
  const requestStartedAt = process.hrtime.bigint();
  const originalEnd = res.end;
  res.end = function (...args) {
    const durationSeconds = Number(process.hrtime.bigint() - requestStartedAt) / 1e9;
    recordRequest(req.method || "GET", pathname, res.statusCode || 200, durationSeconds);
    return originalEnd.apply(res, args);
  };

  if (pathname === "/health" && req.method === "GET") {
    return sendHealth(res);
  }

  if (pathname === "/metrics" && req.method === "GET") {
    const body = renderMetrics();
    res.writeHead(200, {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Content-Length": Buffer.byteLength(body),
      "Cache-Control": "no-store"
    });
    return res.end(body);
  }

  if (pathname.startsWith("/api/")) {
    handleApi(req, res, pathname, parsed.query).catch((err) => {
      console.error(err);
      sendJson(res, 400, { error: err.message || "Something went wrong." });
    });
    return;
  }

  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`SmartJobs server running at http://localhost:${PORT}`);
});
