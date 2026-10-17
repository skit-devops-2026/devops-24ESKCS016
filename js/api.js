// js/api.js
// Thin wrapper around fetch() for talking to the SmartJobs backend,
// plus helpers for reading/writing the logged-in session in localStorage.
// Loaded on every page, before main.js.

const SmartJobsAPI = (function () {
  const BASE = "/api";

  function getToken() {
    return localStorage.getItem("sj_token");
  }

  function getUser() {
    const raw = localStorage.getItem("sj_user");
    return raw ? JSON.parse(raw) : null;
  }

  function setSession(token, user) {
    localStorage.setItem("sj_token", token);
    localStorage.setItem("sj_user", JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem("sj_token");
    localStorage.removeItem("sj_user");
  }

  async function request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      const token = getToken();
      if (token) headers["Authorization"] = "Bearer " + token;
    }
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      /* empty body */
    }
    if (!res.ok) {
      throw new Error(data.error || "Request failed (" + res.status + ")");
    }
    return data;
  }

  return {
    getToken,
    getUser,
    setSession,
    clearSession,
    isLoggedIn: () => !!getToken(),

    register: (fullName, email, password, userType) =>
      request("/register", { method: "POST", body: { fullName, email, password, userType } }),

    login: (email, password) => request("/login", { method: "POST", body: { email, password } }),

    logout: () => request("/logout", { method: "POST", auth: true }).catch(() => {}),

    fetchJobs: (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const qs = params.toString();
      return request("/jobs" + (qs ? "?" + qs : ""));
    },

    fetchJob: (id) => request("/jobs/" + id),

    applyToJob: (jobId) => request("/applications", { method: "POST", body: { jobId }, auth: true }),

    fetchMyApplications: () => request("/applications", { auth: true })
  };
})();
