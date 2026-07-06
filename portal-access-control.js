const PORTAL_ACCESS_FLAG_KEY = 'portalAccessGranted';
const PORTAL_ACCESS_TIME_KEY = 'portalAccessGrantedAt';
const PORTAL_ACCESS_TTL_MS = 30 * 60 * 1000;

function grantPortalAccess() {
    sessionStorage.setItem(PORTAL_ACCESS_FLAG_KEY, 'true');
    sessionStorage.setItem(PORTAL_ACCESS_TIME_KEY, String(Date.now()));
}

function clearPortalAccess() {
    sessionStorage.removeItem(PORTAL_ACCESS_FLAG_KEY);
    sessionStorage.removeItem(PORTAL_ACCESS_TIME_KEY);
}

function hasValidPortalAccess() {
    const grantedAtRaw = sessionStorage.getItem(PORTAL_ACCESS_TIME_KEY);
    const grantedAt = grantedAtRaw ? Number(grantedAtRaw) : 0;

    return (
        sessionStorage.getItem(PORTAL_ACCESS_FLAG_KEY) === 'true' &&
        Number.isFinite(grantedAt) &&
        Date.now() - grantedAt <= PORTAL_ACCESS_TTL_MS
    );
}
