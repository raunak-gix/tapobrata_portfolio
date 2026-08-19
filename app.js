/* ==========================================================================
   TAPOBRATA PORTFOLIO — INTERACTIVE ENGINE (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  initMobileNav();
  initScrollSpy();
  initAboutTabs();
  initRoleFilter();
  initNleScrubber();
  initCodePlayground();
  initMotionLab();
  initProjectModals();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Interactive Background Canvas (Node Grid & Particles)
   -------------------------------------------------------------------------- */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: '#EB5348'
    });
  }

  let mouse = { x: width / 2, y: height / 2 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(45, 49, 52, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect particles near cursor or each other
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();

      // Connect to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(235, 83, 72, ${0.22 * (1 - dist / 130)})`;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Mobile Navbar Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links-menu');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3. ScrollSpy Nav Highlighting
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 160;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. About Section Bio Tabs
   -------------------------------------------------------------------------- */
const bioDescriptions = {
  overview: `<strong>Multidisciplinary Focus:</strong> Synthesizing high-tempo video cut pacing, clean modular frontend code, and physics-based motion graphics into unified digital branding.`,
  editor: `<strong>Video Post-Production Specialist:</strong> DaVinci Resolve Studio colorist with expertise in Rec.709 color LUTs, speed ramping, dialogue trimming, and LUFS audio mastering.`,
  dev: `<strong>Frontend Engineering Mindset:</strong> Building scalable React 18 & ES6+ JavaScript web applications with sleek dark glassmorphism, zero layout shift, and 60 FPS CSS rendering.`,
  motion: `<strong>Kinetic Motion Graphics Artist:</strong> Crafting 3D logo stings, After Effects visual FX overlays, Cinema 4D renders, and smooth web Lottie micro-animations.`
};

function initAboutTabs() {
  const tabs = document.querySelectorAll('.bio-tab');
  const display = document.getElementById('bio-tab-display');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-tab');
      if (display && bioDescriptions[key]) {
        display.innerHTML = bioDescriptions[key];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Role & Project Filter Switcher
   -------------------------------------------------------------------------- */
function initRoleFilter() {
  const roleBtns = document.querySelectorAll('.role-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const heroRoleTag = document.getElementById('hero-role-tag');

  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');

      // Update hero tag text
      if (heroRoleTag) {
        if (role === 'editor') heroRoleTag.textContent = 'VIDEO EDITOR & COLORIST';
        else if (role === 'dev') heroRoleTag.textContent = 'FRONTEND CREATIVE ENGINEER';
        else if (role === 'motion') heroRoleTag.textContent = 'MOTION GRAPHICS ARTIST';
        else heroRoleTag.textContent = 'VIDEO EDITOR • FRONTEND DEV • MOTION ARTIST';
      }

      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (role === 'all' || category === role) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. NLE Video Timeline Scrubber & Color Grading LUT Switcher
   -------------------------------------------------------------------------- */
function initNleScrubber() {
  const lutBtns = document.querySelectorAll('.lut-btn');
  const previewImg = document.getElementById('nle-video-preview');
  const lutDisplay = document.getElementById('nle-active-lut');
  const playBtn = document.getElementById('nle-play-toggle');
  const isPlayingText = document.getElementById('nle-playback-state');

  let isPlaying = false;
  let scrubberPos = 0;
  const clipV1 = document.querySelector('.clip-v1');

  lutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lutBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const lut = btn.getAttribute('data-lut');
      if (previewImg) {
        previewImg.className = 'nle-video-preview-img lut-' + lut;
      }
      if (lutDisplay) {
        lutDisplay.textContent = 'LUT: ' + btn.textContent.toUpperCase();
      }
    });
  });

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '⏸' : '▶';
      if (isPlayingText) isPlayingText.textContent = isPlaying ? 'PLAYING (24fps)' : 'PAUSED';
    });
  }

  // Animate timeline clip indicator
  setInterval(() => {
    if (isPlaying && clipV1) {
      scrubberPos = (scrubberPos + 0.5) % 65;
      clipV1.style.left = scrubberPos + '%';
    }
  }, 50);
}

/* --------------------------------------------------------------------------
   7. Live Code & UI Playground
   -------------------------------------------------------------------------- */
function initCodePlayground() {
  const previewBox = document.getElementById('code-interactive-preview');
  const toggleBtn = document.getElementById('code-effect-toggle');

  if (toggleBtn && previewBox) {
    toggleBtn.addEventListener('click', () => {
      const isCyan = previewBox.classList.contains('neon-cyan-active');
      if (isCyan) {
        previewBox.classList.remove('neon-cyan-active');
        previewBox.style.boxShadow = '0 0 30px rgba(186, 255, 0, 0.4)';
        previewBox.style.borderColor = '#BAFF00';
        toggleBtn.textContent = 'Active Theme: LIME';
      } else {
        previewBox.classList.add('neon-cyan-active');
        previewBox.style.boxShadow = '0 0 30px rgba(0, 240, 255, 0.4)';
        previewBox.style.borderColor = '#00F0FF';
        toggleBtn.textContent = 'Active Theme: CYAN';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. Motion Graphics Interactive Lab Controls
   -------------------------------------------------------------------------- */
function initMotionLab() {
  const targetBox = document.getElementById('motion-target-box');
  const scaleInput = document.getElementById('motion-scale-slider');
  const rotateInput = document.getElementById('motion-rotate-slider');
  const glowInput = document.getElementById('motion-glow-slider');

  const valScale = document.getElementById('val-scale');
  const valRotate = document.getElementById('val-rotate');
  const valGlow = document.getElementById('val-glow');

  function updateMotion() {
    if (!targetBox) return;
    const scale = scaleInput ? scaleInput.value : 1;
    const rotate = rotateInput ? rotateInput.value : 0;
    const glow = glowInput ? glowInput.value : 20;

    targetBox.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
    targetBox.style.boxShadow = `0 0 ${glow}px rgba(0, 240, 255, 0.8)`;

    if (valScale) valScale.textContent = scale + 'x';
    if (valRotate) valRotate.textContent = rotate + 'deg';
    if (valGlow) valGlow.textContent = glow + 'px';
  }

  if (scaleInput) scaleInput.addEventListener('input', updateMotion);
  if (rotateInput) rotateInput.addEventListener('input', updateMotion);
  if (glowInput) glowInput.addEventListener('input', updateMotion);

  updateMotion();
}

/* --------------------------------------------------------------------------
   9. Project Details Modal Popup
   -------------------------------------------------------------------------- */
const projectData = {
  'p1': {
    title: 'Neon Cyberpunk Narrative Short — Director’s Cut',
    type: 'Video Editing & Color Grading',
    client: 'Cinematic Post-Production',
    tools: 'DaVinci Resolve Studio • Premiere Pro • After Effects',
    desc: 'High-pacing cinematic story edit with custom sound design, multi-camera audio sync, manual frame-by-frame color grading in Rec.709, and custom neon light leaks.',
    image: 'assets/video_edit.jpg'
  },
  'p2': {
    title: 'AetherFlow WebGL Analytics Dashboard',
    type: 'Frontend Engineering',
    client: 'Interactive WebGL Showcase',
    tools: 'React 18 • Three.js • Vanilla CSS • GSAP Animations',
    desc: 'Real-time telemetry frontend monitoring platform featuring high-performance canvas particle visualizations, dark glassmorphism UI components, and 60fps responsive micro-interactions.',
    image: 'assets/frontend_web.jpg'
  },
  'p3': {
    title: 'Kinetic Quantum 3D Motion Reveal Reel',
    type: 'Motion Graphics',
    client: '3D Motion Design Showcase',
    tools: 'After Effects • Cinema 4D • Rive • WebGL',
    desc: 'Dynamic 3D title sequence and brand intro reel with spline curves, kinetic typography sync, and smooth physics-based UI particle explosions.',
    image: 'assets/motion_graphics.jpg'
  }
};


function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalType = document.getElementById('modal-type');
  const modalClient = document.getElementById('modal-client');
  const modalTools = document.getElementById('modal-tools');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-pid');
      const data = projectData[pid];
      if (data && modal) {
        modalTitle.textContent = data.title;
        modalType.textContent = data.type;
        modalClient.textContent = data.client;
        modalTools.textContent = data.tools;
        modalDesc.textContent = data.desc;
        modalImg.src = data.image;

        modal.classList.add('active');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. Contact Form Handling
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('contact-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = '<span style="color: var(--accent-lime); font-family: var(--font-mono);">✔ Message transmitted successfully! Tapobrata will respond within 24 hours.</span>';
        form.reset();
      }
    });
  }
}

