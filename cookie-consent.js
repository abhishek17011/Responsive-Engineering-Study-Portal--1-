(function () {
  function hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.remove();
    }
  }

  function initCookieBanner() {
    const okButton = document.getElementById('cookie-consent-ok');
    if (okButton) {
      okButton.addEventListener('click', function (event) {
        event.preventDefault();
        hideBanner();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner);
  } else {
    initCookieBanner();
  }
})();
