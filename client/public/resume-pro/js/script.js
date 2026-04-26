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
        portfolioUrl: portfolio.replace('https://', ''),
      }),
    );
  },
  summary(tpl, p) {
    inject('summary-module', processTemplate(tpl, { summary: safeStr(p.summary) }));
  },
  skills(tpl, p) {
    inject('skills-module', tpl);
    const s = safeObj(p.technicalSkills);
    const html = [
      { l: 'Frontend', v: safeArr(s.frontend).map(sanitizeSkill).join(', ') },
      { l: 'Backend', v: safeArr(s.backend).map(sanitizeSkill).join(', ') },
      { l: 'Database', v: safeArr(s.database).map(sanitizeSkill).join(', ') },
      { l: 'Tools', v: safeArr(s.tools).map(sanitizeSkill).join(', ') },
      { l: 'AI Tech', v: safeArr(s.aiTools).map(sanitizeSkill).join(', ') },
      { l: 'Expertise', v: safeArr(s.other).map(sanitizeSkill).join(', ') },
    ]
      .map((i) => (i.v ? `<div class="skill-item"><b>${i.l}:</b> ${i.v}</div>` : ''))
      .join('');
    inject('skills-list', html);
  },
  experience(tpl, p) {
    inject('experience-module', tpl);
    const html = safeArr(p.experience)
      .map(
        (exp) => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(exp.role)}</span><span><i>${safeStr(exp.period)}</i></span></div>
                <div class="exp-sub"><span>${safeStr(exp.company)}, ${safeStr(exp.location)}</span></div>
                <ul>${safeArr(exp.description)
                  .map((d) => `<li>${safeStr(d)}</li>`)
                  .join('')}</ul>
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
      .map(
        (pr) => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(pr.name)}</span></div>
                <div class="exp-sub"><span><i>Role: ${safeStr(pr.role || 'Full Stack Contributor')} | Tech: ${safeArr(pr.technologies).join(', ')}</i></span></div>
                <ul>${safeArr(pr.description)
                  .map((d) => `<li>${safeStr(d)}</li>`)
                  .join('')}</ul>
            </div>
        `,
      )
      .join('');
    inject('projects-container', html);
  },
  education(tpl, p) {
    inject('education-module', tpl);
    const html = safeArr(p.education)
      .map(
        (edu) => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(edu.degree)}</span><span>${safeStr(edu.year)}</span></div>
                <div class="exp-sub"><span>${safeStr(edu.institution)}</span></div>
            </div>
        `,
      )
      .join('');
    inject('education-container', html);
  },
  footer(tpl, p) {
    inject('footer-module', tpl);
    const inf = safeObj(p.additionalInfo);
    inject(
      'additional-container',
      `
            <div><b>Availability:</b> ${safeStr(inf.availability)}</div>
            <div><b>Languages:</b> ${safeArr(inf.languages).join(', ')}</div>
            <div style="margin-top:5px"><b>Soft Skills:</b> ${safeArr(p.softSkills).join(', ')}</div>
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

function getPDFEngine() {
  const engine = window.html2pdf;
  if (!engine) {
    alert('PDF Engine offline. Please check your internet connection.');
    throw new Error('html2pdf library not loaded.');
  }
  return engine;
}

/**
 * downloadAsPDF
 * @desc Transforms the active DOM into a high-resolution PDF document
 * using a virtual canvas snapshot.
 */
async function downloadAsPDF() {
  document.body.classList.add('pdf-capture');
  await sleep(100);
  const opt = {
    margin: 0,
    filename: 'A_MOHAMED_YASAR_RESUME.pdf',
    image: { type: 'jpeg', quality: 1.0 }, // Maximum Quality
    html2canvas: {
      scale: 4, // 16K Clarity Level
      useCORS: true,
      logging: false,
      letterRendering: true,
      windowWidth: 2480, // A4 @ 300DPI equivalent
      windowHeight: 3508,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };
  try {
    await getPDFEngine()().set(opt).from(UI.main).save();
  } finally {
    document.body.classList.remove('pdf-capture');
  }
}
window.downloadAsPDF = downloadAsPDF;

async function getPDFBlob() {
  document.body.classList.add('pdf-capture');
  await sleep(100);
  const opt = {
    margin: 0,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 4, // 16K Quality Calibration
      useCORS: true,
      logging: false,
      windowWidth: 2480,
      windowHeight: 3508,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };
  try {
    return await getPDFEngine()().set(opt).from(UI.main).output('blob');
  } finally {
    document.body.classList.remove('pdf-capture');
  }
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
  UI.shareModal.classList.add('hidden');
  toggleShareMode('menu'); // Reset UI

  if (type === 'file') {
    UI.downloadOverlay.classList.remove('hidden');
    try {
      const blob = await getPDFBlob();
      const file = new File([blob], 'A_MOHAMED_YASAR_RESUME.pdf', { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'A. Mohamed Yasar Resume', files: [file] });
      } else {
        downloadAsPDF();
      }
    } catch (e) {
      downloadAsPDF();
    } finally {
      UI.downloadOverlay.classList.add('hidden');
    }
  } else {
    // Share Link
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      await navigator.share({
        title: 'A. Mohamed Yasar - Resume',
        text: 'View the professional resume of A. Mohamed Yasar.',
        url: url,
      });
    } else {
      window.shareToWhatsApp();
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
  UI.shareModal.classList.add('hidden');
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
  navigator.clipboard.writeText(url).then(() => {
    showNotification('Link Copied');
    UI.shareModal.classList.add('hidden');
  });
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

init();
