(function () {
  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_ACCEPTED = 'accepted';
  const COOKIE_REJECTED = 'rejected';
  const DAYS_365 = 365;

  function getCookie(name) {
    const key = encodeURIComponent(name) + '=';
    const parts = document.cookie ? document.cookie.split('; ') : [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.indexOf(key) === 0) {
        return decodeURIComponent(p.substring(key.length));
      }
    }
    return null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const secureFlag = location.protocol === 'https:' ? '; Secure' : '';
    // SameSite=Lax is a good default for a static site.
    document.cookie =
      encodeURIComponent(name) + '=' + encodeURIComponent(value) +
      '; expires=' + expires.toUTCString() +
      '; path=/' +
      '; SameSite=Lax' +
      secureFlag;
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.remove();
  }

  function onChoice(value) {
    setCookie(COOKIE_NAME, value, DAYS_365);
    hideBanner();
  }

  function init() {
    const existing = getCookie(COOKIE_NAME);
    if (existing === COOKIE_ACCEPTED || existing === COOKIE_REJECTED) return;

    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    const acceptBtn = document.getElementById('cookie-consent-accept');
    const rejectBtn = document.getElementById('cookie-consent-reject');

    if (acceptBtn) acceptBtn.addEventListener('click', () => onChoice(COOKIE_ACCEPTED));
    if (rejectBtn) rejectBtn.addEventListener('click', () => onChoice(COOKIE_REJECTED));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

