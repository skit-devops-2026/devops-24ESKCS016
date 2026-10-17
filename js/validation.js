// js/validation.js
// Login + register form handling: client-side validation (Bootstrap's
// was-validated pattern) plus the actual API calls to create a session.

$(function () {
  const $loginForm = $("#loginForm");
  const $registerForm = $("#registerForm");

  if ($loginForm.length) initLoginForm($loginForm);
  if ($registerForm.length) initRegisterForm($registerForm);
});

function showFormError(formEl, message) {
  let $alert = formEl.find(".form-api-error");
  if (!$alert.length) {
    $alert = $('<div class="alert alert-danger form-api-error mb-3"></div>').prependTo(formEl);
  }
  $alert.text(message).removeClass("d-none");
}

function clearFormError(formEl) {
  formEl.find(".form-api-error").addClass("d-none");
}

function initLoginForm($form) {
  $form.on("submit", async function (e) {
    e.preventDefault();
    clearFormError($form);

    const form = this;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const email = $("#email").val().trim();
    const password = $("#password").val();
    const $btn = $form.find('button[type="submit"]');
    const originalLabel = $btn.text();
    $btn.prop("disabled", true).text("Logging in…");

    try {
      const { token, user } = await SmartJobsAPI.login(email, password);
      SmartJobsAPI.setSession(token, user);
      window.location.href = "index.html";
    } catch (err) {
      showFormError($form, err.message);
      $btn.prop("disabled", false).text(originalLabel);
    }
  });
}

function initRegisterForm($form) {
  $form.on("submit", async function (e) {
    e.preventDefault();
    clearFormError($form);

    const form = this;
    const password = $("#password").val();
    const confirmPassword = $("#confirmPassword").val();

    // Custom rule Bootstrap can't express with plain attributes:
    // confirm-password must match password.
    const $confirm = document.getElementById("confirmPassword");
    if (password !== confirmPassword) {
      $confirm.setCustomValidity("Passwords do not match.");
    } else {
      $confirm.setCustomValidity("");
    }

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const fullName = $("#fullName").val().trim();
    const email = $("#email").val().trim();
    const userType = $('input[name="userType"]:checked').val();
    const $btn = $form.find('button[type="submit"]');
    const originalLabel = $btn.text();
    $btn.prop("disabled", true).text("Creating account…");

    try {
      const { token, user } = await SmartJobsAPI.register(fullName, email, password, userType);
      SmartJobsAPI.setSession(token, user);
      window.location.href = "index.html";
    } catch (err) {
      showFormError($form, err.message);
      $btn.prop("disabled", false).text(originalLabel);
    }
  });
}
