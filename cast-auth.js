window.CAST_PAGE_PASSWORDS = {
  "cast-fences.html": "Legacy",
  "cast-midsummer.html": "Fantasy",
  "cast-bare.html": "Identity",
  "cast-godofcarnage.html": "Conflict",
  "cast-rivals.html": "Romance",
  "cast-pillowman.html": "Darkness",
  "cast-godot.html": "Absurdity"
};

window.CAST_PAGE_CONFIG = {
  "cast-fences.html": {
    title: "Fences",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to the Fences cast portal.",
      "Check the calendar regularly for rehearsal and call updates.",
      "Contact stage management with any conflicts as early as possible."
    ]
  },
  "cast-midsummer.html": {
    title: "A Midsummer Night's Dream",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to the A Midsummer Night's Dream cast portal.",
      "Review your rehearsal schedule before each week begins.",
      "Watch this space for costume, prop, and callboard updates."
    ]
  },
  "cast-bare.html": {
    title: "Bare",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to the Bare cast portal.",
      "Check the calendar regularly for rehearsal and call updates.",
      "New production notes will appear here as they are posted."
    ]
  },
  "cast-godofcarnage.html": {
    title: "God of Carnage",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to the God of Carnage cast portal.",
      "Review your rehearsal calendar before arriving at the theater.",
      "Production updates and reminders will rotate here."
    ]
  },
  "cast-rivals.html": {
    title: "The Rivals",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to The Rivals cast portal.",
      "Please monitor the calendar for call time adjustments.",
      "Check this ticker for direction and design updates."
    ]
  },
  "cast-pillowman.html": {
    title: "The Pillowman",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to The Pillowman cast portal.",
      "Refer to the calendar for the most current rehearsal plan.",
      "Important notes from the team will rotate here."
    ]
  },
  "cast-godot.html": {
    title: "Waiting for Godot",
    calendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York",
    updates: [
      "Welcome to the Waiting for Godot cast portal.",
      "Review the calendar before each rehearsal day.",
      "Stage management and creative updates will appear here."
    ]
  }
};

(function () {
  const path = window.location.pathname.split("/").pop() || "";
  const expectedPassword = window.CAST_PAGE_PASSWORDS[path];
  const pageConfig = window.CAST_PAGE_CONFIG[path];

  if (!expectedPassword) {
    return;
  }

  const storageKey = `cast_access_${path}`;
  const hasAccess = sessionStorage.getItem(storageKey) === "granted";

  function renderProtectedPage() {
    if (!document.body || !pageConfig) return;

    document.title = `${pageConfig.title} Cast | The Laboratory Theater of Florida`;
    document.body.innerHTML = `
      <input type="checkbox" id="nav-toggle" class="nav-toggle">
      <label for="nav-toggle" class="nav-toggle-label"><span></span></label>
      <label for="nav-toggle" class="nav-overlay"></label>

      <nav class="hamburger-menu">
        <a href="about.html">Origin Story</a>
        <a href="archive25.html">Past Experiments</a>
        <a href="index.html">Back to the Slab</a>
        <a href="plan.html">Lab Protocols</a>
        <a href="cast-portal.html">Cast Portal</a>
        <a href="support.html">Fuel the Innovation</a>
        <a href="sponsors.html">Core Collaborators</a>
      </nav>

      <header>
        <div class="logo">
          THE <span>LAB</span>
          <p class="tagline">Intentionally innovative live theater</p>
        </div>
      </header>

      <main>
        <div class="production-header" style="max-width:1000px;margin:2rem auto 1rem;padding:0 1rem;">
          <h1>${pageConfig.title}</h1>
          <p class="production-dates">Cast Portal</p>
        </div>

        <section style="max-width:1000px;margin:0 auto 1.5rem;padding:0 1rem;">
          <div style="background:#181818;border:1px solid #333;border-radius:10px;padding:1rem 1.25rem;overflow:hidden;">
            <h2 style="margin-top:0;">Updates</h2>
            <div id="cast-ticker" style="min-height:1.5rem;color:#f1f1f1;font-weight:600;"></div>
          </div>
        </section>

        <section class="production-calendar" style="max-width:1000px;margin:2rem auto;padding:0 1rem;">
          <h2>Production Calendar</h2>
          <p>View rehearsals, calls, and performance dates below.</p>
          <div style="position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;">
            <iframe
              src="${pageConfig.calendarEmbedUrl}"
              style="border:0;position:absolute;top:0;left:0;width:100%;height:100%;"
              frameborder="0"
              scrolling="no"
              title="${pageConfig.title} Production Calendar"
              loading="lazy">
            </iframe>
          </div>
        </section>
      </main>
    `;

    const tickerEl = document.getElementById("cast-ticker");
    const updates = Array.isArray(pageConfig.updates) ? pageConfig.updates : [];
    let index = 0;

    if (tickerEl && updates.length) {
      tickerEl.textContent = updates[0];
      if (updates.length > 1) {
        window.setInterval(() => {
          index = (index + 1) % updates.length;
          tickerEl.textContent = updates[index];
        }, 4000);
      }
    }
  }

  function blockPage() {
    if (!document.body) return;

    document.body.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f0f10;color:#f1f1f1;font-family:Arial,sans-serif;padding:24px;">
        <div style="width:100%;max-width:420px;background:#181818;border:1px solid #333;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.35);">
          <h1 style="margin:0 0 10px;font-size:1.6rem;">Cast Portal Access</h1>
          <p style="margin:0 0 16px;color:#d0d0d0;line-height:1.45;">Enter the show password to continue.</p>
          <form id="cast-password-form">
            <label for="cast-password-input" style="display:block;margin-bottom:8px;font-weight:700;">Password</label>
            <input id="cast-password-input" type="password" autocomplete="current-password" style="display:block;width:100%;max-width:100%;padding:10px 12px;border-radius:8px;border:1px solid #444;background:#101010;color:#fff;box-sizing:border-box;" />
            <div id="cast-password-error" style="min-height:20px;margin-top:10px;color:#efb0b0;font-size:.95rem;"></div>
            <button type="submit" style="margin-top:8px;width:100%;border:0;border-radius:8px;padding:10px 14px;background:#d72638;color:#fff;cursor:pointer;font-weight:700;">Enter Cast Portal</button>
          </form>
        </div>
      </div>
    `;

    const form = document.getElementById("cast-password-form");
    const input = document.getElementById("cast-password-input");
    const error = document.getElementById("cast-password-error");

    input.focus();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if ((input.value || "").trim() === expectedPassword) {
        sessionStorage.setItem(storageKey, "granted");
        renderProtectedPage();
        return;
      }
      error.textContent = "Incorrect password. Please try again.";
      input.select();
    });
  }

  function init() {
    if (hasAccess) {
      renderProtectedPage();
    } else {
      blockPage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
