// js/main.js
// SmartJobs — shared logic that runs on every page:
// swaps the navbar's Login/Register buttons for a user menu when logged in,
// and wires up logout. Page-specific logic lives in jobs.js / job-details.js /
// dashboard.js / validation.js.

$(function () {
  renderAuthNav();

  $(document).on("click", "#logoutBtn", function (e) {
    e.preventDefault();
    SmartJobsAPI.logout().finally(() => {
      SmartJobsAPI.clearSession();
      window.location.href = "index.html";
    });
  });
});

function renderAuthNav() {
  const navAuthArea = document.getElementById("navAuthArea");
  if (!navAuthArea) return; // page doesn't have the shared navbar markup

  const user = SmartJobsAPI.getUser();

  if (!user) {
    navAuthArea.innerHTML = `
      <a href="login.html" class="btn btn-outline-primary">Login</a>
      <a href="register.html" class="btn btn-primary">Register</a>
    `;
    return;
  }

  const initial = (user.fullName || "?").trim().charAt(0).toUpperCase();
  navAuthArea.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <span class="avatar-circle">${initial}</span>
        <span class="d-none d-md-inline">${escapeHtml(user.fullName)}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-file-earmark-text me-2"></i>My Applications</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
      </ul>
    </div>
  `;
}

// Small shared helper — used anywhere we inject user-supplied text as HTML.
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
