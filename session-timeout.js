(() => {
  // 15 minutes
  const TIMEOUT_MS = 15 * 60 * 1000;

  // Change this if your login entry page differs
  const REDIRECT_TO = "portal-auth.html";

  // Optional keys you may use elsewhere
  const SESSION_KEYS_TO_CLEAR = [
    "portal_session",
    "volunteer_session",
    "cast_session",
    "admin_session"
  ];

  let timer;

  function clearKnownSessionKeys() {
    try {
      SESSION_KEYS_TO_CLEAR.forEach((k) => {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      });
    } catch (_) {
      // no-op
    }
  }

  async function signOutIfSupabasePresent() {
    try {
      // If a global supabase client exists on a page, sign out cleanly
      if (window.supabase && typeof window.supabase.auth?.signOut === "function") {
        await window.supabase.auth.signOut();
      }
    } catch (_) {
      // no-op
    }
  }

  async function handleTimeout() {
    clearKnownSessionKeys();
    await signOutIfSupabasePresent();

    alert("Your session timed out after 15 minutes of inactivity.");
    window.location.href = REDIRECT_TO;
  }

  function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(handleTimeout, TIMEOUT_MS);
  }

  // Activity events that reset idle timeout
  const events = ["click", "mousemove", "mousedown", "keydown", "scroll", "touchstart"];

  events.forEach((evt) => {
    window.addEventListener(evt, resetTimer, { passive: true });
  });

  // Reset when tab becomes active again
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resetTimer();
  });

  // Start timer
  resetTimer();
})();
