// Interactive functionality for Trinadha Siripurapu's Portfolio

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initSkillsFilter();
  initResumeModal();
  initContactForm();
  initCopyButtons();
});

// ==================== THEME MANAGEMENT ====================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const html = document.documentElement;

  // Check saved theme or preference
  const savedTheme = localStorage.getItem('trinadha_portfolio_theme');
  if (savedTheme === 'light') {
    html.classList.add('light');
    updateThemeIcons(true);
  } else {
    html.classList.remove('light');
    updateThemeIcons(false);
  }

  function toggle() {
    html.classList.toggle('light');
    const isLight = html.classList.contains('light');
    localStorage.setItem('trinadha_portfolio_theme', isLight ? 'light' : 'dark');
    updateThemeIcons(isLight);
    showToast(isLight ? 'Light theme activated' : 'Dark theme activated');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggle);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggle);
}

function updateThemeIcons(isLight) {
  const sunIcons = document.querySelectorAll('.theme-icon-sun');
  const moonIcons = document.querySelectorAll('.theme-icon-moon');

  sunIcons.forEach(icon => {
    if (isLight) icon.classList.remove('hidden');
    else icon.classList.add('hidden');
  });

  moonIcons.forEach(icon => {
    if (isLight) icon.classList.add('hidden');
    else icon.classList.remove('hidden');
  });
}

// ==================== NAVIGATION ====================
function initNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Active link highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-indigo-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-indigo-400', 'font-semibold');
      }
    });
  });
}

// ==================== SKILLS FILTER ====================
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-gray-800/60', 'text-gray-400', 'hover:text-white');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('bg-gray-800/60', 'text-gray-400');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// ==================== RESUME MODAL ====================
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtn = document.getElementById('close-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim() || 'Inquiry from Portfolio';
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const recipient = 'trinadhsiripurapu4@gmail.com';
    const body = `Hi Trinadha,\n\nMy name is ${name} (${email}).\n\n${message}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    showToast('Email client opened! You can also copy details directly.');
    form.reset();
  });
}

// ==================== COPY BUTTONS & TOAST ====================
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Could not copy, text: ${textToCopy}`);
        });
      }
    });
  });
}

function showToast(message, type = 'info') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border flex items-center gap-3';
    document.body.appendChild(toast);
  }

  if (type === 'error') {
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border flex items-center gap-3 bg-rose-900/90 text-rose-200 border-rose-700 show';
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border flex items-center gap-3 bg-gray-900/95 text-gray-100 border-indigo-500/40 shadow-indigo-500/10 show';
  }

  toast.innerHTML = `
    <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span>${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
