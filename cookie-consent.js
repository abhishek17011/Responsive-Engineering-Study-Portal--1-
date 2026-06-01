(function () {
  console.log('[cookie-consent] script loaded');
  const COOKIE_NAME = 'cookie_consent';
  const COOKIE_ACCEPTED = 'accepted';
  // Reject removed (single-button consent)
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
    if (!banner) return;

    // Ensure it disappears immediately.
    banner.style.display = 'none';
    banner.style.visibility = 'hidden';
    try {
      banner.parentNode && banner.parentNode.removeChild(banner);
    } catch (e) {
      // ignore
    }

    // Then remove from DOM.

    try {
      banner.remove();
    } catch (e) {
      // no-op
    }
  }


  function onChoice(value) {
    console.log('[cookie-consent] onChoice value:', value);
    // Persist choice before hiding banner.
    setCookie(COOKIE_NAME, value, DAYS_365);
    console.log('[cookie-consent] after setCookie document.cookie:', document.cookie);



    // Click ke baad feedback (optional). Banner immediate hide hoga.
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      const textEl = banner.querySelector('.cookie-consent-text');
      if (textEl) {
        textEl.textContent = 'Thanks! Cookies accepted.';
      }
    }

    // Immediate disappear
    hideBanner();
  }

  function init() {
    const existing = getCookie(COOKIE_NAME);
    console.log('[cookie-consent] existing cookie value:', existing);


    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    // If user already chose earlier, ensure banner is gone immediately.
    if (existing === COOKIE_ACCEPTED) {
      hideBanner();
      return;
    }

    const okBtn = document.getElementById('cookie-consent-ok');

    // Single-button UI
    if (okBtn) {
      okBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onChoice(COOKIE_ACCEPTED);
      });
    }

    // Har condition me banner visible rahe (unless cookie accepted hai)
    banner.style.display = '';
    banner.style.visibility = '';
  }


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

