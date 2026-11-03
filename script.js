/**
 * ==============================================================================
 * SCRIPT.JS — John Paulo Sanchez Portfolio
 * Plain JavaScript: Beginner-readable, modular, and single-purpose functions.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initSmoothScroll();
  initMobileNav();
  initScrollReveal();
  initActiveNavHighlight();
  initCopyEmail();
  initMessageForm();
  initVideoReels();
  initMediaLightbox();
  initInteractiveCanvas();
});

/**
 * ------------------------------------------------------------------------------
 * 1. SMOOTH SCROLLING
 * Ensures all internal anchor links (#about, #experience, etc.) scroll smoothly
 * with appropriate spacing from the top.
 * ------------------------------------------------------------------------------
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      
      // Ignore bare '#' links
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();

        // Scroll smoothly to target element
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Update the browser URL without jumping
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }
      }
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 2. MOBILE NAVIGATION TOGGLE
 * Toggles the navigation links dropdown on smaller screens and closes it
 * automatically when a link is clicked.
 * ------------------------------------------------------------------------------
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggleBtn');
  const navLinksList = document.getElementById('navLinksList');

  if (!toggleBtn || !navLinksList) return;

  // Toggle dropdown on button click
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.textContent = isOpen ? '[ close ]' : '[ menu ]';
  });

  // Automatically close dropdown when any navigation link is clicked
  const links = navLinksList.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '[ menu ]';
    });
  });

  // Close dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!toggleBtn.contains(event.target) && !navLinksList.contains(event.target)) {
      navLinksList.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '[ menu ]';
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 3. SCROLL REVEAL EFFECT
 * Uses the native browser IntersectionObserver API to gently fade and slide up
 * sections and cards as they enter the viewport.
 * ------------------------------------------------------------------------------
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers: show all elements immediately
    revealElements.forEach((el) => el.classList.add('active'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Triggers slightly before element reaches bottom
    threshold: 0.1,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, unobserve to optimize performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/**
 * ------------------------------------------------------------------------------
 * 4. ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
 * Highlights the active section link in the navbar as the visitor scrolls down.
 * ------------------------------------------------------------------------------
 */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/**
 * ------------------------------------------------------------------------------
 * 5. COPY EMAIL TO CLIPBOARD
 * Allows the viewer to quickly copy John Paulo's email with a single click.
 * ------------------------------------------------------------------------------
 */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('contactEmailLink');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = emailLink ? emailLink.textContent.trim() : 'johnpaulosnchz@gmail.com';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for insecure / restricted iframe contexts
        const tempInput = document.createElement('textarea');
        tempInput.value = emailToCopy;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Visual feedback
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span>✓ Copied!</span>';
      copyBtn.style.color = '#10b981';
      copyBtn.style.borderColor = '#10b981';

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.color = '';
        copyBtn.style.borderColor = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 6. MESSAGE SENDER FORM
 * Validates inputs, provides instant visual feedback, and triggers a formatted
 * mailto message so the message is actually sent directly to John Paulo Sanchez.
 * ------------------------------------------------------------------------------
 */
function initMessageForm() {
  const form = document.getElementById('contactForm');
  const statusMsg = document.getElementById('formStatusMsg');

  if (!form || !statusMsg) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim() || 'Portfolio Inquiry';
    const message = messageInput.value.trim();

    // Basic Validation
    if (!name || !email || !message) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Please complete all required fields before sending.';
      return;
    }

    // Success feedback
    statusMsg.className = 'form-status-msg success';
    statusMsg.textContent = `Thank you, ${name}! Preparing your message... Opening your default email client.`;

    // Construct mailto link
    const mailtoRecipient = 'johnpaulosnchz@gmail.com';
    const encodedSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
    const encodedBody = encodeURIComponent(
      `Hi John Paulo,\n\n${message}\n\n---\nSender: ${name}\nEmail: ${email}`
    );

    const mailtoUrl = `mailto:${mailtoRecipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // Trigger mail client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 600);

    // Reset form after short delay
    setTimeout(() => {
      form.reset();
      setTimeout(() => {
        statusMsg.style.display = 'none';
        statusMsg.className = 'form-status-msg';
      }, 5000);
    }, 2000);
  });
}

/**
 * ------------------------------------------------------------------------------
 * 7. 9:16 VIDEO REELS INTERACTION
 * Handles play/pause toggle, mute/unmute audio control, and focus for 9:16 reels.
 * ------------------------------------------------------------------------------
 */
function initVideoReels() {
  const reelCards = document.querySelectorAll('.video-reel-card');

  reelCards.forEach((card) => {
    const video = card.querySelector('.reel-video-element');
    const soundBtn = card.querySelector('.video-sound-btn');

    if (!video) return;

    // Toggle play/pause on card click
    const togglePlayback = (e) => {
      // Don't trigger if clicked on sound button
      if (e.target.closest('.video-sound-btn')) return;

      if (video.paused) {
        // Pause all other videos first to maintain single-focus
        document.querySelectorAll('.reel-video-element').forEach((v) => {
          if (v !== video && !v.paused) {
            v.pause();
            const parentCard = v.closest('.video-reel-card');
            if (parentCard) parentCard.classList.remove('is-playing');
          }
        });

        video.play().then(() => {
          card.classList.add('is-playing');
        }).catch((err) => {
          // If autoplay with audio was blocked or src not yet loaded, toggle visually
          console.warn('Video playback notice:', err);
          card.classList.toggle('is-playing');
        });
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    };

    card.addEventListener('click', togglePlayback);

    // Keyboard accessibility: Enter or Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePlayback(e);
      }
    });

    // Sound toggle
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card click
        video.muted = !video.muted;

        if (video.muted) {
          // Show muted icon
          soundBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          `;
          soundBtn.setAttribute('title', 'Unmute audio');
        } else {
          // Show unmuted icon
          soundBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          `;
          soundBtn.setAttribute('title', 'Mute audio');
        }
      });
    }

    // Update class if video ends
    video.addEventListener('ended', () => {
      card.classList.remove('is-playing');
    });
  });
}

/**
 * ------------------------------------------------------------------------------
 * 8. MEDIA GRAPHICS LIGHTBOX MODAL
 * Opens high-resolution view of graphics or reels when clicked.
 * ------------------------------------------------------------------------------
 */
function initMediaLightbox() {
  const modal = document.getElementById('lightboxModal');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalDesc = document.getElementById('lightboxDesc');
  const modalTags = document.getElementById('lightboxTags');
  const mediaContainer = document.getElementById('lightboxMediaContainer');

  if (!modal || !closeBtn) return;

  function openLightbox(title, desc, tagsString, mediaSrc) {
    modalTitle.textContent = title || 'Media Asset Preview';
    modalDesc.textContent = desc || '';
    
    // Clear and populate tags
    modalTags.innerHTML = '';
    if (tagsString) {
      const tags = tagsString.split(',');
      tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'tag-badge';
        span.textContent = tag.trim();
        modalTags.appendChild(span);
      });
    }

    // Inject media element
    mediaContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = mediaSrc;
    img.alt = title || 'Full Media Preview';
    img.className = 'lightbox-media-img';
    mediaContainer.appendChild(img);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mediaContainer.innerHTML = '';
  }

  // Attach click to all graphic cards
  const graphicCards = document.querySelectorAll('.media-graphic-card');
  graphicCards.forEach((card) => {
    const frame = card.querySelector('.media-graphic-thumb-frame');
    const inspectBtn = card.querySelector('.media-inspect-btn');

    const triggerOpen = () => {
      if (!frame) return;
      const title = frame.getAttribute('data-title');
      const desc = frame.getAttribute('data-desc');
      const tags = frame.getAttribute('data-tags');
      const src = frame.getAttribute('data-src');
      openLightbox(title, desc, tags, src);
    };

    if (frame) frame.addEventListener('click', triggerOpen);
    if (inspectBtn) inspectBtn.addEventListener('click', triggerOpen);
  });

  // Close handlers
  closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    // If clicked on the backdrop (outside dialog), close modal
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/**
 * ------------------------------------------------------------------------------
 * 9. INTERACTIVE BACKGROUND CANVAS FOR SIDE MARGINS & CONSTELLATION NODES
 * Generates an ultra-smooth, high-DPI constellation network in the background.
 * Features organic velocity damping, harmonic oscillation, lerped mouse tracking,
 * soft quadratic connection fade, and gentle click ripples.
 * ------------------------------------------------------------------------------
 */
let canvasRipples = [];

function initInteractiveCanvas() {
  const canvas = document.getElementById('sideInteractiveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Set high-DPI canvas buffer and viewport sizing
  function resizeCanvas() {
    const oldWidth = width || window.innerWidth;
    const oldHeight = height || window.innerHeight;

    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Rescale existing particle coordinates proportionally to prevent visual jumps
    if (particles.length > 0 && oldWidth > 0 && oldHeight > 0) {
      const rx = width / oldWidth;
      const ry = height / oldHeight;
      for (let i = 0; i < particles.length; i++) {
        particles[i].x *= rx;
        particles[i].y *= ry;
      }
    } else {
      initParticles();
    }
  }

  // Smooth mouse coordinates with target interpolation
  const mouse = {
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    active: false,
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    if (!mouse.active) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Particle pool
  const particles = [];

  function initParticles() {
    particles.length = 0;
    // Adapt particle count for screens
    const count = width > 900 ? 75 : 45;

    for (let i = 0; i < count; i++) {
      // Gentle baseline velocities
      let bVx = (Math.random() - 0.5) * 0.32;
      let bVy = (Math.random() - 0.5) * 0.32;
      if (Math.abs(bVx) < 0.08) bVx = bVx >= 0 ? 0.12 : -0.12;
      if (Math.abs(bVy) < 0.08) bVy = bVy >= 0 ? 0.12 : -0.12;

      // Color scheme: mostly subtle lavender/indigo, with emerald & cyan accents
      const randColor = Math.random();
      let coreColor = 'rgba(165, 180, 252, ALPHA)';
      let haloColor = 'rgba(165, 180, 252, ALPHA)';
      if (randColor > 0.85) {
        coreColor = 'rgba(16, 185, 129, ALPHA)';
        haloColor = 'rgba(16, 185, 129, ALPHA)';
      } else if (randColor > 0.72) {
        coreColor = 'rgba(56, 189, 248, ALPHA)';
        haloColor = 'rgba(56, 189, 248, ALPHA)';
      }

      const radius = Math.random() * 1.2 + 1.1;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx: bVx,
        baseVy: bVy,
        vx: bVx,
        vy: bVy,
        radius: radius,
        baseAlpha: Math.random() * 0.3 + 0.22,
        pulsePhase: Math.random() * Math.PI * 2,
        coreColor: coreColor,
        haloColor: haloColor,
        hasHalo: radius > 1.7,
      });
    }
  }

  // Smooth expanding click ripple
  function addRipple(x, y) {
    canvasRipples.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: Math.min(width, height) * 0.22 + 45,
      alpha: 0.65,
      speed: 3.2,
    });
  }

  window.addEventListener('click', (e) => {
    // Only spawn ripple on background clicks (avoid buttons/inputs/links/videos)
    if (!e.target.closest('button, a, input, textarea, video, .video-reel-card')) {
      addRipple(e.clientX, e.clientY);
    }
  });

  // Handle debounced resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 120);
  });

  // Initial sizing & particles setup
  resizeCanvas();

  // Animation timing
  let lastTime = performance.now();

  function render(currentTime) {
    const delta = Math.min((currentTime - lastTime) / 16.667, 2.0);
    lastTime = currentTime;

    ctx.clearRect(0, 0, width, height);

    // 1. Smooth lerping for mouse position
    if (mouse.active) {
      mouse.x += (mouse.targetX - mouse.x) * 0.14;
      mouse.y += (mouse.targetY - mouse.y) * 0.14;
    }

    // 2. Render & update ripples
    for (let i = canvasRipples.length - 1; i >= 0; i--) {
      const r = canvasRipples[i];
      r.radius += r.speed * delta;
      r.alpha -= 0.014 * delta;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        canvasRipples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${r.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (r.radius > 16) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.68, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${(r.alpha * 0.45).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      ctx.restore();

      // Gentle ripple shockwave push on nearby particles
      for (let j = 0; j < particles.length; j++) {
        const p = particles[j];
        const rdx = p.x - r.x;
        const rdy = p.y - r.y;
        const rdist = Math.hypot(rdx, rdy);
        if (Math.abs(rdist - r.radius) < 22 && rdist > 2) {
          const pushForce = 0.04 * (1 - r.radius / r.maxRadius);
          p.vx += (rdx / rdist) * pushForce;
          p.vy += (rdy / rdist) * pushForce;
        }
      }
    }

    // 3. Update particle positions with organic physics
    const pad = 28;
    const mouseMaxDist = 145;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Subtle harmonic waving drift
      const waveX = Math.sin(currentTime * 0.0007 + p.pulsePhase) * 0.07;
      const waveY = Math.cos(currentTime * 0.0007 + p.pulsePhase) * 0.07;

      p.x += (p.vx + waveX) * delta;
      p.y += (p.vy + waveY) * delta;

      // Smooth wrap-around
      if (p.x < -pad) p.x = width + pad;
      else if (p.x > width + pad) p.x = -pad;
      if (p.y < -pad) p.y = height + pad;
      else if (p.y > height + pad) p.y = -pad;

      // Mouse magnetic attraction & velocity damping
      if (mouse.active) {
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.hypot(mdx, mdy);

        if (mdist < mouseMaxDist && mdist > 2) {
          const norm = 1 - mdist / mouseMaxDist;
          const force = norm * 0.032;
          p.vx += (mdx / mdist) * force;
          p.vy += (mdy / mdist) * force;

          // Draw soft tether to mouse
          const tetherAlpha = Math.pow(norm, 1.8) * 0.28;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${tetherAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }

      // Smooth velocity return to baseline drift
      p.vx = p.vx * 0.955 + p.baseVx * 0.045;
      p.vy = p.vy * 0.955 + p.baseVy * 0.045;
    }

    // 4. Draw connecting lines with quadratic smooth distance falloff
    const maxLineDist = 92;
    const maxLineDistSq = maxLineDist * maxLineDist;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;

        // Prevent wrap-around streaks across the canvas
        if (Math.abs(dx) > maxLineDist || Math.abs(dy) > maxLineDist) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < maxLineDistSq) {
          const dist = Math.sqrt(distSq);
          const ratio = 1 - dist / maxLineDist;
          const lineAlpha = (ratio * ratio * 0.16).toFixed(3);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // 5. Draw crisp anti-aliased nodes with breathing cycle
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const pulse = Math.sin(currentTime * 0.0022 + p.pulsePhase) * 0.08;
      const currentAlpha = Math.max(0.12, Math.min(0.85, p.baseAlpha + pulse));

      // Subtle outer glow halo for larger nodes
      if (p.hasHalo) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.3, 0, Math.PI * 2);
        ctx.fillStyle = p.haloColor.replace('ALPHA', (currentAlpha * 0.18).toFixed(3));
        ctx.fill();
      }

      // Main node core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.coreColor.replace('ALPHA', currentAlpha.toFixed(3));
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

