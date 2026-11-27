const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitions = document.querySelectorAll('.scene-transition');
const sections = document.querySelectorAll('.portfolio-section');
const navLinks = document.querySelectorAll('nav a');
const reveals = document.querySelectorAll('.reveal');

// Replay reveal animations as elements enter and leave the viewport
if (prefersReducedMotion) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  reveals.forEach((el) => observer.observe(el));
}

// Drive transition shot progress and active nav highlight on scroll
let ticking = false;

function updateTransitions() {
  const viewportHeight = window.innerHeight;

  transitions.forEach((scene) => {
    if (prefersReducedMotion) {
      scene.style.setProperty('--scene-progress', '1');
      return;
    }

    const rect = scene.getBoundingClientRect();
    const rawProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const progress = Math.max(0, Math.min(1, rawProgress));
    scene.style.setProperty('--scene-progress', progress.toFixed(3));
  });

  let currentId = '';
  sections.forEach((sec) => {
    const top = sec.getBoundingClientRect().top;
    if (top <= viewportHeight * 0.35) {
      currentId = sec.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const matches = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('is-active', matches);
  });

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateTransitions);
    ticking = true;
  }
}, { passive: true });

updateTransitions();
