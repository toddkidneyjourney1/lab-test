window.CAST_PAGE_PASSWORDS = {
  "cast-fences.html": "Legacy",
  "cast-midsummer.html": "Fantasy",
  "cast-bare.html": "Identity",
  "cast-godofcarnage.html": "Conflict",
  "cast-rivals.html": "Romance",
  "cast-pillowman.html": "Darkness",
  "cast-godot.html": "Absurdity"
};

(function () {
  const path = window.location.pathname.split("/").pop() || "";
  const expectedPassword = window.CAST_PAGE_PASSWORDS[path];

  if (!expectedPassword) {
    return;
  }

  const storageKey = `cast_access_${path}`;
  const hasAccess = sessionStorage.getItem(storageKey) === "granted";

  if (hasAccess) {
    return;
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
            <input id="cast-password-input" type="password" autocomplete="current-password" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid #444;background:#101010;color:#fff;" />
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
        window.location.reload();
        return;
      }
      error.textContent = "Incorrect password. Please try again.";
      input.select();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", blockPage);
  } else {
    blockPage();
  }
})();
