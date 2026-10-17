// js/dashboard.js
// Logic for dashboard.html ("My Applications"): requires login, fetches the
// current user's applications, and renders them with status badges.

$(function () {
  const $list = $("#applicationsList");
  if (!$list.length) return; // not on dashboard.html

  if (!SmartJobsAPI.isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  const user = SmartJobsAPI.getUser();
  const $greeting = $("#dashboardGreeting");
  if ($greeting.length && user) {
    $greeting.text("Welcome back, " + user.fullName + "!");
  }

  loadApplications();

  async function loadApplications() {
    $list.html(
      '<div class="text-center text-secondary py-5"><div class="spinner-border text-primary" role="status"></div></div>'
    );
    try {
      const { applications } = await SmartJobsAPI.fetchMyApplications();
      renderApplications(applications);
    } catch (err) {
      $list.html(`<div class="alert alert-danger">${escapeHtml(err.message)}</div>`);
    }
  }

  const STATUS_CLASS = {
    Applied: "status-applied",
    "In Review": "status-review",
    Shortlisted: "status-shortlisted",
    Rejected: "status-rejected",
    Selected: "status-selected"
  };

  function renderApplications(applications) {
    if (!applications.length) {
      $list.html(`
        <div class="text-center py-5">
          <i class="bi bi-inbox display-4 text-secondary"></i>
          <p class="text-secondary mt-3 mb-3">You haven't applied to any jobs yet.</p>
          <a href="jobs.html" class="btn btn-primary">Browse Jobs</a>
        </div>
      `);
      return;
    }

    $list.html(
      applications
        .map((app) => {
          const job = app.job;
          const statusClass = STATUS_CLASS[app.status] || "status-applied";
          const appliedDate = new Date(app.appliedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
          });
          return `
            <div class="card p-3 mb-3">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h6 class="fw-semibold mb-1">${job ? escapeHtml(job.title) : "Job no longer available"}</h6>
                  <p class="text-secondary small mb-1">
                    ${job ? '<i class="bi bi-building me-1"></i>' + escapeHtml(job.company) : ""}
                  </p>
                  <p class="text-secondary small mb-0">Applied on ${appliedDate}</p>
                </div>
                <span class="badge ${statusClass}">${escapeHtml(app.status)}</span>
              </div>
              ${
                job
                  ? `<a href="job-details.html?id=${job.id}" class="small mt-2 d-inline-block">View job</a>`
                  : ""
              }
            </div>
          `;
        })
        .join("")
    );
  }
});
