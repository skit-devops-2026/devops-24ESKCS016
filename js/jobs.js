// js/jobs.js
// Logic for jobs.html: loads jobs from the API, renders job cards, and wires
// up the filter sidebar (search, location, category, type, experience).

$(function () {
  const $container = $("#jobsContainer");
  const $resultCount = $("#resultCount");
  const $emptyState = $("#emptyState");

  if (!$container.length) return; // not on jobs.html

  loadJobs();

  $("#filterForm").on("submit", function (e) {
    e.preventDefault();
    loadJobs();
  });

  $("#resetFilters").on("click", function () {
    document.getElementById("filterForm").reset();
    loadJobs();
  });

  async function loadJobs() {
    $container.html(
      '<div class="col-12 text-center text-secondary py-5"><div class="spinner-border text-primary" role="status"></div></div>'
    );

    const filters = {
      search: $("#filterSearch").val(),
      location: $("#filterLocation").val(),
      category: $("#filterCategory").val(),
      type: $("#filterType").val(),
      experience: $("#filterExperience").val()
    };

    try {
      const { jobs, total } = await SmartJobsAPI.fetchJobs(filters);
      $resultCount.text(total);
      renderJobs(jobs);
    } catch (err) {
      $container.html(
        '<div class="col-12"><div class="alert alert-danger">Could not load jobs: ' +
          escapeHtml(err.message) +
          "</div></div>"
      );
    }
  }

  function renderJobs(jobs) {
    if (!jobs.length) {
      $container.empty();
      $emptyState.removeClass("d-none");
      return;
    }
    $emptyState.addClass("d-none");
    $container.html(jobs.map(jobCardHtml).join(""));
  }

  function jobCardHtml(job) {
    const skills = (job.skills || [])
      .map((s) => `<span class="badge skill-badge">${escapeHtml(s)}</span>`)
      .join("");
    return `
      <div class="col-md-6">
        <div class="card job-card p-3 h-100">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="fw-semibold mb-1">${escapeHtml(job.title)}</h5>
            <span class="badge type-badge">${escapeHtml(job.type)}</span>
          </div>
          <p class="text-secondary mb-2"><i class="bi bi-building me-1"></i>${escapeHtml(job.company)}</p>
          <p class="mb-2 small text-secondary">
            <i class="bi bi-geo-alt me-1"></i>${escapeHtml(job.location)} &nbsp;|&nbsp;
            <i class="bi bi-cash-coin me-1"></i>${escapeHtml(job.salary)} &nbsp;|&nbsp;
            ${escapeHtml(job.experience)}
          </p>
          <div class="mb-3">${skills}</div>
          <a href="job-details.html?id=${job.id}" class="btn btn-outline-primary btn-sm mt-auto">View Details</a>
        </div>
      </div>
    `;
  }
});
