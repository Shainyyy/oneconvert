// ── Common JS for OneConvert ──

const HANDLE_SVG = `<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><circle cx="4" cy="3" r="1.5"/><circle cx="10" cy="3" r="1.5"/><circle cx="4" cy="9" r="1.5"/><circle cx="10" cy="9" r="1.5"/><circle cx="4" cy="15" r="1.5"/><circle cx="10" cy="15" r="1.5"/></svg>`;

// ── FAQ Accordion ──
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(b => { b.classList.remove('open'); b.nextElementSibling.classList.remove('open'); });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
    });
  });
}

// ── Status messages ──
function showStatus(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'status ' + type;
  el.textContent = msg;
}

// ── Dropzone setup ──
function setupDropzone(zoneId, inputId, onFiles) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;
  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files.length) onFiles(input.files); input.value = ''; });
  zone.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', e => { e.stopPropagation(); zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); zone.classList.remove('drag-over'); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); });
}

// ── Ad Overlay ──
let pendingDownload = null;
let pendingBlobs = null;
let countdownTimer = null;

function showAdAndDownload(bytes, filename, mime) {
  pendingDownload = { bytes, filename, mime: mime || 'application/pdf' };
  pendingBlobs = null;
  startAdCountdown();
}

function showAdAndDownloadBlobs(blobs) {
  pendingBlobs = blobs;
  pendingDownload = null;
  startAdCountdown();
}

function startAdCountdown() {
  const overlay = document.getElementById('ad-overlay');
  if (!overlay) { triggerDownload(); return; }
  overlay.classList.add('active');
  const cdEl = document.getElementById('countdown');
  const skipBtn = document.getElementById('skip-btn');
  let secs = 5;
  cdEl.textContent = secs;
  cdEl.style.display = 'block';
  if (skipBtn) skipBtn.style.display = 'none';
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    secs--;
    cdEl.textContent = secs;
    if (secs <= 0) {
      clearInterval(countdownTimer);
      cdEl.style.display = 'none';
      if (skipBtn) skipBtn.style.display = 'inline-flex';
    }
  }, 1000);
}

function triggerDownload() {
  if (pendingDownload) {
    const { bytes, filename, mime } = pendingDownload;
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  } else if (pendingBlobs) {
    pendingBlobs.forEach(({ blob, name }, i) => {
      setTimeout(() => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = name; a.click();
        URL.revokeObjectURL(url);
      }, i * 300);
    });
  }
  const overlay = document.getElementById('ad-overlay');
  if (overlay) { overlay.classList.remove('active'); }
  const cdEl = document.getElementById('countdown');
  if (cdEl) cdEl.style.display = 'block';
  pendingDownload = null; pendingBlobs = null;
}

// ── Direct download (no ad, single page) ──
function directDownload(bytes, filename, mime) {
  const blob = new Blob([bytes], { type: mime || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Format bytes ──
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();

  // Active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '/') {
      a.classList.add('active');
    }
  });

  // Ad overlay close on overlay click
  const overlay = document.getElementById('ad-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
  }
});
