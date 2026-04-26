/**
 * [Resume Pro Engine - v2.1 Professional]
 * Technologies: Vanilla Javascript, Fetch API, html2pdf.js
 * Purpose: This script orchestrates the dynamic rendering of the professional resume
 * by fetching data from the MERN backend, injecting it into structured templates,
 * and providing high-fidelity PDF export capabilities.
 */

// --- [GATEWAY_CONFIGURATION] ---
const query = new URLSearchParams(window.location.search);
const configuredApi = query.get('api');
const isDispatchAuto = query.get('system_dispatch') === 'true';

/**
 * buildApiCandidates
 * @desc Resolves the most reliable API endpoint based on the current environment
 * and explicit configuration overlays.
 */
const buildApiCandidates = () => {
  const candidates = [];
  if (configuredApi) candidates.push(configuredApi);
  if (window.location.hostname === 'localhost')
    candidates.push('http://localhost:5001/api/profile');
  candidates.push('https://mern-portfolio-yasar.onrender.com/api/profile');
  candidates.push('https://mern-portfolio-yasar-1.onrender.com/api/profile');
  return [...new Set(candidates.filter(Boolean))];
};

const CONFIG = {
  apiCandidates: buildApiCandidates(),
  templates: {
    header: './templates/header.html',
    summary: './templates/summary.html',
    skills: './templates/skills.html',
    experience: './templates/experience.html',
    projects: './templates/projects.html',
    education: './templates/education.html',
    footer: './templates/footer.html',
  },
  components: {
    'component-loading-overlay': './components/loading-overlay.html',
    'component-resume-actions': './components/resume-actions.html',
    'component-more-modal': './components/more-modal.html',
    'component-download-overlay': './components/dispatch-overlay.html',
  },
};

// --- [DOM_ORCHESTRATION_UTILITIES] ---
let UI = {};

const initUI = () => {
  UI = {
    overlay: document.getElementById('loading-overlay'),
    message: document.getElementById('loader-message'),
    progress: document.getElementById('loader-progress'),
    main: document.getElementById('main-resume'),
    actions: document.getElementById('resume-actions'),
    shareModal: document.getElementById('more-modal'),
    downloadOverlay: document.getElementById('download-overlay'),
    themeToggle: document.getElementById('theme-toggle'),
    moreToggle: document.getElementById('more-toggle'),
    moreClose: document.getElementById('more-close'),
    shareToggle: document.getElementById('share-toggle'),
  };
};

const setProgress = (percent, message) => {
  if (UI.progress) UI.progress.style.width = `${percent}%`;
  if (UI.message) UI.message.innerText = message || 'PROCESSING...';
};

/**
 * [DATA_SANITIZATION_LAYER]
 * Removes technical tags like "(Professional)" or "(Basics)" from the UI display
 * to maintain a cleaner aesthetic on the physical document.
 */
const sanitizeSkill = (s) => s.replace(/\s*\(.*?\)\s*/g, '').trim();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeStr = (v, f = '') => (typeof v === 'string' ? v : f);
const safeObj = (v) => (v && typeof v === 'object' ? v : {});

// --- [CORE_HANDSHAKE_LOGIC] ---

/**
 * fetchProfile
 * @desc Attempts to retrieve the profile data from available API candidates with
 * built-in retry logic and terminal feedback.
 */
async function fetchProfile(maxAttempts = 3) {
  setProgress(10, 'LOADING PROFILE...');
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const url of CONFIG.apiCandidates) {
      try {
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        setProgress(40, 'PROFILE LOADED.');
        return data;
      } catch (e) {
        lastError = e;
      }
    }
    if (attempt < maxAttempts) {
      setProgress(10 + attempt * 10, `RECONNECTING (${attempt}/${maxAttempts})...`);
      await sleep(2000);
    }
  }
  throw lastError || new Error('All endpoints unreachable');
}

/**
 * loadTemplates / loadComponents
 * @desc Dynamically mounts the HTML blueprint and interactive UI modules.
 */
async function loadTemplates() {
  setProgress(50, 'LOADING UI...');
  const keys = Object.keys(CONFIG.templates);
  const results = {};
  const promises = keys.map(async (key, idx) => {
    const r = await fetch(CONFIG.templates[key]);
    const text = await r.text();
    results[key] = text;
    setProgress(
      50 + Math.floor(((idx + 1) / keys.length) * 40),
      `PREPARING ${key.toUpperCase()}...`,
    );
    return text;
  });
  await Promise.all(promises);
  return results;
}

async function loadComponents() {
  const keys = Object.keys(CONFIG.components);
  const promises = keys.map(async (id) => {
    const r = await fetch(CONFIG.components[id]);
    const html = await r.text();
    const container = document.getElementById(id);
    if (container) container.innerHTML = html;
  });
  await Promise.all(promises);
  initUI();
  
  // Hide share toggle if viewed directly (not in an iframe) as per user request
  if (window.self === window.top) {
    if (UI.shareToggle) UI.shareToggle.style.display = 'none';
  }

  setupEventListeners();
}

function setupEventListeners() {
  UI.shareToggle?.addEventListener('click', () => UI.shareModal.classList.remove('hidden'));
  UI.moreToggle?.addEventListener('click', () => UI.shareModal.classList.remove('hidden'));
  UI.moreClose?.addEventListener('click', () => UI.shareModal.classList.add('hidden'));
  UI.themeToggle?.addEventListener('click', () =>
    document.body.classList.toggle('dark-mode-interactive'),
  );
}

// --- [DYNAMIC_RENDER_ENGINE] ---

function inject(id, html) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = html;
    el.classList.add('fade-in');
  }
}

function processTemplate(tpl, data) {
  let output = tpl;
  Object.keys(data).forEach((key) => {
    output = output.split(`{{${key}}}`).join(data[key]);
  });
  return output;
}

const RenderEngine = {
  header(tpl, p) {
    const socials = safeObj(p.socials);
    // Extract the slug from the full LinkedIn URL
    const linkedinId = safeStr(socials.linkedin).split('/').filter(Boolean).pop() || 'linkedin';
    const portfolio =
      safeArr(p.projects).find((pr) => safeStr(pr.name).includes('Portfolio'))?.link ||
      'mern-portfolio-yasar-1.onrender.com';
    inject(
      'header-module',
      processTemplate(tpl, {
        name: safeStr(p.name, 'A. MOHAMED YASAR'),
        title: safeStr(p.title, 'Full Stack Engineer | React.js | MERN Stack'),
        location: safeStr(p.location, 'Chennai, TN'),
        phone: safeStr(p.phone, '+91-9025943184'),
        email: safeStr(p.email, 'mohamedyasar081786@gmail.com'),
        linkedinId,
        portfolioUrl: portfolio.replace(/^https?:\/\//, ''),
      }),
    );
  },
  summary(tpl, p) {
    inject('summary-module', processTemplate(tpl, { summary: safeStr(p.summary) }));
  },
  skills(tpl, p) {
    inject('skills-module', tpl);
    const s = safeObj(p.technicalSkills);
    // ATS-friendly: label on same line as comma-separated values
    const html = [
      { l: 'Frontend',  v: safeArr(s.frontend).map(sanitizeSkill).join(', ') },
      { l: 'Backend',   v: safeArr(s.backend).map(sanitizeSkill).join(', ') },
      { l: 'Database',  v: safeArr(s.database).map(sanitizeSkill).join(', ') },
      { l: 'Tools',     v: safeArr(s.tools).map(sanitizeSkill).join(', ') },
      { l: 'AI & ML',   v: safeArr(s.aiTools).map(sanitizeSkill).join(', ') },
      { l: 'Expertise', v: safeArr(s.other).map(sanitizeSkill).join(', ') },
    ]
      .filter((i) => i.v)
      .map((i) => `<div class="skill-item"><b>${i.l}:</b> ${i.v}</div>`)
      .join('');
    inject('skills-list', html);
  },
  experience(tpl, p) {
    inject('experience-module', tpl);
    const html = safeArr(p.experience)
      .map(
        (exp) => `
        <div class="exp-item">
          <div class="exp-top">
            <span>${safeStr(exp.role)}</span>
            <span>${safeStr(exp.period)}</span>
          </div>
          <div class="exp-sub">
            <span>${safeStr(exp.company)}${exp.location ? ', ' + safeStr(exp.location) : ''}</span>
          </div>
          <ul>${safeArr(exp.description).map((d) => `<li>${safeStr(d)}</li>`).join('')}</ul>
        </div>
      `,
      )
      .join('');
    inject('experience-container', html);
  },
  projects(tpl, p) {
    inject('projects-module', tpl);
    const html = safeArr(p.projects)
      .filter((pr) => pr.name !== 'Scientific Calculator')
      .map((pr) => {
        // Add GitHub/live link if available — ATS can index URLs
        const linkStr = pr.link
          ? `<span style="font-weight:400;"> | <a href="${pr.link}" target="_blank" style="color:#1a1a1a;">${pr.link.replace(/^https?:\/\//, '')}</a></span>`
          : '';
        const techStr = safeArr(pr.technologies).join(', ');
        return `
        <div class="exp-item">
          <div class="exp-top">
            <span>${safeStr(pr.name)}${linkStr}</span>
          </div>
          <div class="exp-sub">
            <span>Role: ${safeStr(pr.role || 'Full Stack Contributor')} | Technologies: ${techStr}</span>
          </div>
          <ul>${safeArr(pr.description).map((d) => `<li>${safeStr(d)}</li>`).join('')}</ul>
        </div>
      `;
      })
      .join('');
    inject('projects-container', html);
  },
  education(tpl, p) {
    inject('education-module', tpl);
    const html = safeArr(p.education)
      .map(
        (edu) => `
        <div class="exp-item">
          <div class="exp-top">
            <span>${safeStr(edu.degree)}</span>
            <span>${safeStr(edu.year)}</span>
          </div>
          <div class="exp-sub">
            <span>${safeStr(edu.institution)}</span>
          </div>
        </div>
      `,
      )
      .join('');
    inject('education-container', html);
  },
  footer(tpl, p) {
    inject('footer-module', tpl);
    const inf = safeObj(p.additionalInfo);
    const softSkills = safeArr(p.softSkills).join(', ');
    const languages = safeArr(inf.languages).join(', ');
    inject(
      'additional-container',
      `
        <div class="skill-item"><b>Availability:</b> ${safeStr(inf.availability)}</div>
        ${inf.workPreference ? `<div class="skill-item"><b>Work Preference:</b> ${safeStr(inf.workPreference)}</div>` : ''}
        ${languages ? `<div class="skill-item"><b>Languages:</b> ${languages}</div>` : ''}
        ${softSkills ? `<div class="skill-item"><b>Soft Skills:</b> ${softSkills}</div>` : ''}
      `,
    );
  },
};

// --- [LIFECYCLE_ORCHESTRATION] ---

async function init() {
  try {
    await loadComponents();

    // --- [DATA_EXTRACTION_PROTOCOL] ---
    // The backend now supports SSR (EJS/Thymeleaf equivalent).
    // We prioritize preloaded data from the server for instant hydration.
    let profile;
    if (window.__PRELOADED_PROFILE__) {
      profile = window.__PRELOADED_PROFILE__;
      console.log('🚀 [HYDRATION] State pre-hydrated from Server (SSR).');
    } else {
      const profileResponse = await fetchProfile();
      profile = profileResponse.payload || profileResponse;
    }

    // --- Apply Resume Content Overrides (Legacy details restoration) ---
    if (profile.resumeOverride) {
      if (profile.resumeOverride.summary) profile.summary = profile.resumeOverride.summary;
      if (profile.resumeOverride.experience) {
        profile.experience = profile.experience.map((exp) => {
          const override = profile.resumeOverride.experience.find((o) => o.company === exp.company);
          return override ? { ...exp, description: override.description } : exp;
        });
      }
      if (profile.resumeOverride.projects) {
        profile.projects = profile.projects.map((pr) => {
          const override = profile.resumeOverride.projects.find(
            (o) => o.name === pr.name || o.name.includes(pr.name) || pr.name.includes(o.name),
          );
          return override ? { ...pr, description: override.description } : pr;
        });
      }
    }

    const templates = await loadTemplates();
    setProgress(95, 'FINALIZING...');

    // Sequence the rendering of each individual document module
    RenderEngine.header(templates.header, profile);
    RenderEngine.summary(templates.summary, profile);
    RenderEngine.skills(templates.skills, profile);
    RenderEngine.experience(templates.experience, profile);
    RenderEngine.projects(templates.projects, profile);
    RenderEngine.education(templates.education, profile);
    RenderEngine.footer(templates.footer, profile);

    setProgress(100, 'READY.');
    await sleep(500);

    // Hide loader and activate document view
    UI.overlay.classList.add('hidden');
    UI.main.classList.remove('hidden');
    UI.actions.classList.remove('hidden');

    // Handle auto-dispatch link scenario
    if (isDispatchAuto) {
      UI.downloadOverlay.classList.remove('hidden');
      setTimeout(() => {
        window.downloadAsPDF();
        UI.downloadOverlay.classList.add('hidden');
      }, 1500);
    }
  } catch (err) {
    setProgress(100, 'OFFLINE. RETRYING...');
    setTimeout(() => window.location.reload(), 5000);
  }
}

// --- [GLOBAL_PDF_ORCHESTRATION] ---
// Adapted from onPresignedUrlDownload / doPdfAction patterns:
// All actions share a single blob source and use createObjectURL + anchor.

const PDF_FILENAME = 'A. Mohamed Yasar - Resume.pdf';

function getPDFEngine() {
  const engine = window.html2pdf;
  if (!engine) {
    alert('PDF Engine offline. Please check your internet connection.');
    throw new Error('html2pdf library not loaded.');
  }
  return engine;
}

/**
 * buildPDFBlob  [Single blob source — shared by download, share, and copy actions]
 * @desc Applies pdf-capture CSS, renders the resume DOM to a PDF blob via html2pdf,
 * then removes the capture class. All callers receive the same Blob.
 */
async function buildPDFBlob() {
  document.body.classList.add('pdf-capture');
  await sleep(400); // allow pdf-capture CSS to fully apply

  const el = UI.main;

  // A4 at 96 dpi ≈ 794px wide. Telling html2canvas the window is exactly
  // that wide makes the captured layout match what you see on screen.
  const A4_PX = 794;

  const opt = {
    margin: [10, 10, 10, 10], // mm: top right bottom left — small bleed so content isn't cut
    filename: PDF_FILENAME,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: A4_PX,
      onclone: (clonedDoc) => {
        const clonedBody = clonedDoc.body;
        const clonedEl   = clonedDoc.getElementById('main-resume');
        clonedBody.style.height    = 'auto';
        clonedBody.style.overflow  = 'visible';
        clonedBody.style.minHeight = 'unset';
        clonedBody.style.width     = A4_PX + 'px';
        if (clonedEl) {
          clonedEl.style.height   = 'auto';
          clonedEl.style.overflow = 'visible';
          clonedEl.style.maxWidth = '100%';
        }
      },
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: ['.exp-item', 'li'] },
  };

  try {
    return await getPDFEngine()().set(opt).from(el).output('blob');
  } finally {
    document.body.classList.remove('pdf-capture');
  }
}

/**
 * downloadAsPDF  [onPresignedUrlDownload pattern]
 * @desc Gets the PDF blob → createObjectURL → anchor with download attr → click → revoke.
 * Filename is set on the <a> element so the browser always saves with the correct name.
 */
async function downloadAsPDF() {
  const blob = await buildPDFBlob();
  const fileUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = PDF_FILENAME;
  a.click();
  window.URL.revokeObjectURL(fileUrl); // free memory
}

/**
 * downloadAsPDFWithOverlay
 * @desc Public-facing download: closes modal, shows overlay, runs downloadAsPDF, hides overlay.
 */
async function downloadAsPDFWithOverlay() {
  if (UI.shareModal) UI.shareModal.classList.add('hidden');
  const overlay = UI.downloadOverlay || document.getElementById('download-overlay');
  if (overlay) overlay.classList.remove('hidden');
  try {
    await downloadAsPDF();
  } finally {
    if (overlay) overlay.classList.add('hidden');
  }
}
window.downloadAsPDF = downloadAsPDF;
window.downloadAsPDFWithOverlay = downloadAsPDFWithOverlay;

/**
 * getPDFBlob  [Exposed to parent iframe for React Resume.js to consume]
 * @desc Returns the raw PDF Blob so the React parent can apply its own
 * onPresignedUrlDownload / navigator.share logic with full filename control.
 */
async function getPDFBlob() {
  return buildPDFBlob();
}
window.getPDFBlob = getPDFBlob;

function executeEmailDispatch() {
  UI.shareModal.classList.add('hidden');
  const url = `${window.location.origin}${window.location.pathname}?system_dispatch=true`;
  const sub = 'Professional Resume Dispatch | A. Mohamed Yasar';
  const body = `[ RESUME DOWNLOAD ]\n\nA secure connection has been established to deliver the professional PDF resume of A. Mohamed Yasar.\n\n[ VIEW RESUME ]\n${url}\n\nBuilt with MERN Stack | 2026`;
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`,
    '_blank',
  );
}
window.executeEmailDispatch = executeEmailDispatch;
// Alias so the modal button works correctly
window.executeEmailMessage = executeEmailDispatch;

function toggleShareMode(mode) {
  const root = document.getElementById('share-menu-root');
  const selector = document.getElementById('share-mode-selector');
  if (mode === 'select') {
    root.classList.add('hidden');
    selector.classList.remove('hidden');
  } else {
    root.classList.remove('hidden');
    selector.classList.add('hidden');
  }
}
window.toggleShareMode = toggleShareMode;

async function executeDownloadProtocol(type = 'file') {
  if (UI.shareModal) UI.shareModal.classList.add('hidden');
  toggleShareMode('menu'); // Reset UI

  const overlay = UI.downloadOverlay || document.getElementById('download-overlay');

  if (type === 'file') {
    if (overlay) overlay.classList.remove('hidden');
    try {
      const blob = await buildPDFBlob();
      const file = new File([blob], PDF_FILENAME, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'A. Mohamed Yasar - Resume', files: [file] });
      } else {
        // Fallback: blob URL + anchor download
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = PDF_FILENAME;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileUrl);
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        await downloadAsPDF();
      }
    } finally {
      if (overlay) overlay.classList.add('hidden');
    }

  } else if (type === 'link') {
    const url = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      showNotification('✓ Link Copied to Clipboard');
    } catch {
      // Clipboard API unavailable — show prompt as last resort
      window.prompt('Copy this link:', url);
    }
  }
}
window.executeDownloadProtocol = executeDownloadProtocol;

window.shareToWhatsApp = () => {
  const url = window.location.origin + window.location.pathname;
  const text = encodeURIComponent(
    `View the Professional Portfolio & Resume of A. Mohamed Yasar: ${url}`,
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
  if (UI.shareModal) UI.shareModal.classList.add('hidden');
};

function showNotification(message) {
  const toast = document.getElementById('system-toast');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  toast.classList.remove('hidden');

  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.bottom = '40px';
  }, 10);

  // Auto-hide after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.bottom = '30px';
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 3000);
}

window.copyPortfolioLink = () => {
  const url = window.location.origin + window.location.pathname;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showNotification('✓ Link Copied to Clipboard');
      if (UI.shareModal) UI.shareModal.classList.add('hidden');
    })
    .catch(() => window.prompt('Copy this link:', url));
};

window.runSystemAudit = async () => {
  UI.shareModal.classList.add('hidden');
  UI.overlay.classList.remove('hidden');
  const messages = [
    'ANALYZING...',
    'PROCESSING...',
    'CALCULATING...',
    'OPTIMIZING...',
    'VALIDATING...',
  ];
  for (const msg of messages) {
    setProgress(Math.random() * 90, msg);
    await sleep(600);
  }
  setProgress(100, 'AUDIT COMPLETE');
  await sleep(1000);
  UI.overlay.classList.add('hidden');
  showNotification('OPTIMIZATION COMPLETE');
};

window.addEventListener('mousemove', (e) => {
  window.parent.postMessage({ type: 'IFRAME_MOUSE_MOVE', x: e.clientX, y: e.clientY }, '*');
});

window.addEventListener('mouseover', (e) => {
  const interactive = e.target.closest('a, button, [role="button"], .interactive');
  window.parent.postMessage({ type: 'IFRAME_MOUSE_OVER', isHovered: !!interactive }, '*');
});

// --- [CUSTOM_CURSOR_ENGINE] ---
// Only mount when viewed standalone (not inside the portfolio iframe).
// When inside the iframe, the parent React app's CustomCursor handles this.
(function initCursor() {
  if (window.innerWidth < 900) return; // desktop only

  // Inject cursor elements
  const dot = document.createElement('div');
  dot.id = 'rp-cursor-dot';

  const ring = document.createElement('div');
  ring.id = 'rp-cursor-ring';

  // Link label shown inside the ring on link hover
  const label = document.createElement('span');
  label.id = 'rp-cursor-label';
  label.textContent = '↗';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Snap dot instantly, ring trails with lerp
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Distinguish link hover vs button hover
  window.addEventListener('mouseover', (e) => {
    const link   = e.target.closest('a');
    const button = e.target.closest('button, [role="button"], .interactive');

    // Clear all states first
    dot.classList.remove('hovered', 'link-hovered');
    ring.classList.remove('hovered', 'link-hovered');

    if (link) {
      // Link — teal diamond ring with arrow label
      dot.classList.add('link-hovered');
      ring.classList.add('link-hovered');
    } else if (button) {
      // Button — expanded white ring
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    }
  });

  // Smooth trailing ring animation
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();


init();
