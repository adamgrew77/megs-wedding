// =========================================================
// Meg's Wedding — shared vanilla JS
// Mobile nav toggle + homepage countdown + RSVP form handling
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  initNavToggle();
  initCountdown();
  initRsvpForm();
});

// ---------- Mobile nav toggle ----------
function initNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// ---------- Countdown ----------
// Set this to the actual wedding date/time once known.
// Format: "YYYY-MM-DDTHH:MM:SS"
var WEDDING_DATE = "2027-08-14T13:30:00";

function initCountdown() {
  var countdownEl = document.querySelector("[data-countdown]");
  if (!countdownEl) return;

  var daysEl = countdownEl.querySelector("[data-days]");
  var hoursEl = countdownEl.querySelector("[data-hours]");
  var minutesEl = countdownEl.querySelector("[data-minutes]");
  var secondsEl = countdownEl.querySelector("[data-seconds]");

  var target = new Date(WEDDING_DATE).getTime();

  function tick() {
    var now = new Date().getTime();
    var distance = target - now;

    if (distance <= 0) {
      countdownEl.innerHTML = '<p class="hero-welcome">The big day is here!</p>';
      clearInterval(timer);
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  function pad(n) {
    return n < 10 ? "0" + n : n;
  }

  tick();
  var timer = setInterval(tick, 1000);
}

// ---------- RSVP form ----------
// Submits to Formspree (see the form's "action" attribute in rsvp.html),
// which emails the response straight to adam.grew@btinternet.com. Uses
// fetch + Accept: application/json so Formspree returns JSON instead of
// redirecting, letting us show the inline "Thank You" message below.
function initRsvpForm() {
  var form = document.querySelector("[data-rsvp-form]");
  if (!form) return;

  var successMessage = document.querySelector("[data-rsvp-success]");
  var errorMessage = document.querySelector("[data-rsvp-error]");
  var submitButton = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (errorMessage) errorMessage.classList.remove("is-visible");
    if (submitButton) submitButton.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Form submission failed");

        form.classList.add("is-hidden");
        if (successMessage) {
          successMessage.classList.add("is-visible");
          successMessage.setAttribute("tabindex", "-1");
          successMessage.focus();
        }
      })
      .catch(function () {
        if (submitButton) submitButton.disabled = false;
        if (errorMessage) {
          errorMessage.classList.add("is-visible");
        } else {
          alert("Sorry, something went wrong sending your RSVP. Please try again or email us directly.");
        }
      });
  });
}
