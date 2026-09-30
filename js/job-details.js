// js/job-details.js
// Logic for job-details.html: reads ?id= from the URL, fetches that job,
// renders it, and handles the Apply button (including the logged-out case).

$(function () {
  const $content = $("#jobDetailsContent");
  if (!$content.length) return; // not on job-details.html

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) {
    showError("No job specified.");
    return;
  }

  loadJob(jobId);

  async function loadJob(id) {
    try {
      const { job } = await SmartJobsAPI.fetchJob(id);
      renderJob(job);
    } catch (err) {
      showError(err.message);
    }
  }

  function renderJob(job) {
    document.title = job.title + " — SmartJobs";
    const skills = (job.skills || [])
      .map((s) => `<span class="badge skill-badge">${escapeHtml(s)}</span>`)
      .join("");

    $content.html(`
      <div class="card p-4 p-md-5">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h2 class="fw-bold mb-1">${escapeHtml(job.title)}</h2>
            <p class="text-secondary mb-0"><i class="bi bi-building me-1"></i>${escapeHtml(job.company)}</p>
          </div>
          <span class="badge type-badge fs-6">${escapeHtml(job.type)}</span>
        </div>

        <div class="d-flex flex-wrap gap-3 text-secondary small my-3">
          <span><i class="bi bi-geo-alt me-1"></i>${escapeHtml(job.location)}</span>
          <span><i class="bi bi-cash-coin me-1"></i>${escapeHtml(job.salary)}</span>
          <span><i class="bi bi-person-badge me-1"></i>${escapeHtml(job.experience)}</span>
          <span><i class="bi bi-tag me-1"></i>${escapeHtml(job.category)}</span>
        </div>

        <div class="mb-4">${skills}</div>

        <h6 class="fw-semibold">About this role</h6>
        <p class="text-secondary">${escapeHtml(job.description)}</p>

        <div id="applyArea" class="mt-4"></div>
      </div>
    `);

    renderApplyArea(job);
  }

  function renderApplyArea(job) {
    const $applyArea = $("#applyArea");

    if (!SmartJobsAPI.isLoggedIn()) {
      $applyArea.html(`
        <a href="login.html" class="btn btn-primary px-4">Login to Apply</a>
      `);
      return;
    }

    const $btn = $('<button class="btn btn-primary px-4">Apply Now</button>');
    $applyArea.html($btn);

    $btn.on("click", async function () {
      $btn.prop("disabled", true).text("Applying…");
      try {
        await SmartJobsAPI.applyToJob(job.id);
        $applyArea.html(
          '<div class="alert alert-success mb-0"><i class="bi bi-check-circle me-1"></i>Applied! Track it from <a href="dashboard.html">My Applications</a>.</div>'
        );
      } catch (err) {
        $applyArea.html(
          `<div class="alert alert-warning mb-0">${escapeHtml(err.message)}</div>`
        );
      }
    });
  }

  function showError(message) {
    $content.html(`<div class="alert alert-danger">${escapeHtml(message)}</div>`);
  }
});
