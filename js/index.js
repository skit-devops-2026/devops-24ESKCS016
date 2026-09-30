// js/index.js
// Logic for index.html: loads a handful of jobs from the API for the
// "Featured Opportunities" section, and wires the hero search box to
// jobs.html with the entered keyword/location as query params.

$(function () {
  const $container = $("#featuredJobsContainer");
  if ($container.length) loadFeaturedJobs();

  $("#heroSearchForm").on("submit", function (e) {
    e.preventDefault();
    const keyword = $("#searchKeyword").val().trim();
    const location = $("#searchLocation").val().trim();
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (location) params.set("location", location);
    window.location.href = "jobs.html" + (params.toString() ? "?" + params.toString() : "");
  });

  async function loadFeaturedJobs() {
    try {
      const { jobs } = await SmartJobsAPI.fetchJobs();
      renderFeatured(jobs.slice(0, 6));
    } catch (err) {
      $container.html(`<div class="col-12"><div class="alert alert-danger">${escapeHtml(err.message)}</div></div>`);
    }
  }

  function renderFeatured(jobs) {
    $container.html(
      jobs
        .map((job) => {
          const skills = (job.skills || [])
            .map((s) => `<span class="badge skill-badge">${escapeHtml(s)}</span>`)
            .join("");
          return `
            <div class="col-md-6 col-lg-4">
              <div class="card job-card p-3 h-100">
                <div class="d-flex justify-content-between align-items-start">
                  <h5 class="fw-semibold mb-1">${escapeHtml(job.title)}</h5>
                  <span class="badge type-badge">${escapeHtml(job.type)}</span>
                </div>
                <p class="text-secondary mb-2"><i class="bi bi-building me-1"></i>${escapeHtml(job.company)}</p>
                <p class="mb-2 small text-secondary">
                  <i class="bi bi-geo-alt me-1"></i>${escapeHtml(job.location)} &nbsp;|&nbsp;
                  <i class="bi bi-cash-coin me-1"></i>${escapeHtml(job.salary)}
                </p>
                <div class="mb-3">${skills}</div>
                <a href="job-details.html?id=${job.id}" class="btn btn-outline-primary btn-sm mt-auto">View Details</a>
              </div>
            </div>
          `;
        })
        .join("")
    );
  }
});
