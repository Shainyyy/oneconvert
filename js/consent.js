// ── Cookie Consent + GA Consent Mode ──

(function() {
  // Apply saved consent immediately
  const saved = localStorage.getItem('oc-consent');
  if (saved === 'accepted') {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    }
  }

  // Don't show banner if already decided
  if (saved) return;

  // Create and inject banner
  document.addEventListener('DOMContentLoaded', function() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div style="flex:1;min-width:200px;">
        <p style="font-weight:600;margin-bottom:0.3rem;font-size:0.9rem;">🍪 We use cookies</p>
        <p style="font-size:0.8rem;color:var(--muted);line-height:1.5;">
          We use Google Analytics and AdSense for anonymous usage statistics and to show ads that keep this site free.
          Your files are <strong>never</strong> uploaded — all processing is local.
          <a href="/privacy.html" style="color:var(--accent2);">Privacy Policy</a>
        </p>
      </div>
      <div style="display:flex;gap:0.6rem;flex-shrink:0;align-items:center;flex-wrap:wrap;">
        <button onclick="acceptCookies()" style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:0.55rem 1.2rem;font-weight:600;cursor:pointer;font-size:0.85rem;white-space:nowrap;">Accept</button>
        <button onclick="declineCookies()" style="background:var(--bg3);color:var(--muted);border:1px solid var(--border);border-radius:8px;padding:0.55rem 1rem;cursor:pointer;font-size:0.85rem;white-space:nowrap;">Decline</button>
      </div>`;
    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => { banner.style.transform = 'translateY(0)'; banner.style.opacity = '1'; }, 100);
  });
})();

function acceptCookies() {
  localStorage.setItem('oc-consent', 'accepted');
  if (typeof gtag === 'function') {
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
  }
  removeBanner();
}

function declineCookies() {
  localStorage.setItem('oc-consent', 'declined');
  removeBanner();
}

function removeBanner() {
  const b = document.getElementById('cookie-banner');
  if (b) {
    b.style.transform = 'translateY(100%)';
    b.style.opacity = '0';
    setTimeout(() => b.remove(), 400);
  }
}
