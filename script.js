/* =====================================================
   TalentBridge — Global JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile menu toggle ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── Scroll reveal animations ── */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* ── Animated counters ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Sidebar toggle for dashboards ── */
  let sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  let backdrop = document.querySelector('.sidebar-backdrop');

  // Fallback to top hamburger if floating toggle is removed
  if (!sidebarToggle && sidebar && hamburger) {
    sidebarToggle = hamburger;
  }

  if (sidebarToggle && sidebar) {
    // Create backdrop if not exists
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const toggleSidebar = (show) => {
      const isOpen = show !== undefined ? show : sidebar.classList.toggle('open');
      if (show !== undefined) {
        if (show) sidebar.classList.add('open');
        else sidebar.classList.remove('open');
      }

      const currentState = sidebar.classList.contains('open');
      backdrop.classList.toggle('open', currentState);

      if (sidebarToggle.classList.contains('hamburger')) {
        sidebarToggle.classList.toggle('open', currentState);
      } else {
        sidebarToggle.innerHTML = currentState
          ? '<i class="fas fa-times"></i>'
          : '<i class="fas fa-bars"></i>';
      }
      document.body.style.overflow = currentState ? 'hidden' : '';
    };

    sidebarToggle.addEventListener('click', () => toggleSidebar());
    backdrop.addEventListener('click', () => toggleSidebar(false));
  }

  /* ── Password toggle ── */
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.innerHTML = isText
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  });

  /* ── Form validation utility ── */
  window.validateForm = function (formEl) {
    let valid = true;
    formEl.querySelectorAll('[required]').forEach(field => {
      const errorEl = formEl.querySelector(`[data-error="${field.name}"]`);
      const isEmpty = !field.value.trim();
      if (isEmpty) {
        field.classList.add('error');
        if (errorEl) errorEl.classList.add('show');
        valid = false;
      } else {
        field.classList.remove('error');
        if (errorEl) errorEl.classList.remove('show');
      }
      // Email
      if (field.type === 'email' && field.value.trim()) {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!emailOk) {
          field.classList.add('error');
          if (errorEl) { errorEl.textContent = 'Please enter a valid email address.'; errorEl.classList.add('show'); }
          valid = false;
        }
      }
      // Phone
      if (field.type === 'tel' && field.value.trim()) {
        const telOk = /^\+?[\d\s\-()]{7,15}$/.test(field.value.trim());
        if (!telOk) {
          field.classList.add('error');
          if (errorEl) { errorEl.textContent = 'Please enter a valid phone number.'; errorEl.classList.add('show'); }
          valid = false;
        }
      }
    });
    return valid;
  };

  /* ── Live field validation ── */
  document.querySelectorAll('.form-control[required]').forEach(field => {
    field.addEventListener('blur', () => {
      const form = field.closest('form');
      if (!form) return;
      const errorEl = form.querySelector(`[data-error="${field.name}"]`);
      if (field.value.trim()) {
        field.classList.remove('error');
        if (errorEl) errorEl.classList.remove('show');
      } else {
        field.classList.add('error');
        if (errorEl) errorEl.classList.add('show');
      }
    });
  });

  /* ── Toast notifications ── */
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><p>${message}</p>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideInRight .4s ease reverse';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  /* ── Progress bar animations ── */
  const progressObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width || '0%';
        progressObs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    bar.style.width = '0';
    progressObs.observe(bar);
  });

  /* ── Chart bar animations ── */
  const chartObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.chart-bar').forEach(bar => {
          const h = bar.dataset.height || '50%';
          bar.style.height = h;
        });
        chartObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.chart-placeholder').forEach(chart => {
    chart.querySelectorAll('.chart-bar').forEach(bar => bar.style.height = '0');
    chartObs.observe(chart);
  });

  /* ── Login page role redirect ── */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.validateForm(loginForm)) return;
      const role = document.getElementById('role').value;
      const email = document.getElementById('email').value;
      sessionStorage.setItem('tb_email', email);
      sessionStorage.setItem('tb_role', role);
      showToast('Logged in successfully! Redirecting…', 'success');
      setTimeout(() => {
        if (role === 'admin') window.location.href = 'admin-dashboard.html';
        else window.location.href = 'user-dashboard.html';
      }, 1200);
    });
  }

  /* ── Show user email in dashboards ── */
  const email = sessionStorage.getItem('tb_email');
  const emailDisplayEls = document.querySelectorAll('.user-email-display');
  if (email && emailDisplayEls.length) {
    emailDisplayEls.forEach(el => el.textContent = email);
  }

  /* ── Newsletter form ── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.validateForm(newsletterForm)) return;
      window.location.href = '404.html';
      newsletterForm.reset();
    });
  }

  /* ── Contact form ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!window.validateForm(contactForm)) return;
      window.location.href = '404.html';
      contactForm.reset();
    });
  }

  /* ── Tab switching ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const target = btn.dataset.tab;
      document.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.tab-pane[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.querySelector(`.tab-pane[data-tab="${target}"][data-group="${group}"]`);
      if (pane) pane.classList.add('active');
    });
  });

  /* ── Dashboard Navigation (Sidebar) ── */
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
  const dashboardTabs = document.querySelectorAll('.dashboard-main .tab-pane');

  function switchDashboardTab(tabId) {
    if (!tabId) return;

    // Update links
    sidebarLinks.forEach(link => {
      if (link.getAttribute('href') === tabId) link.classList.add('active');
      else link.classList.remove('active');
    });

    // Update panes
    dashboardTabs.forEach(pane => {
      if ('#' + pane.id === tabId) {
        pane.classList.add('active');
        // Re-trigger animations for elements inside the tab
        pane.querySelectorAll('.animate-on-scroll').forEach(el => {
          el.classList.remove('in-view');
          setTimeout(() => el.classList.add('in-view'), 50);
        });
      } else {
        pane.classList.remove('active');
      }
    });

    // Close sidebar on mobile
    if (window.innerWidth <= 900 && sidebar) {
      sidebar.classList.remove('open');
      if (sidebarToggle) sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href;
        switchDashboardTab(targetId);
        window.location.hash = targetId;
      }
    });
  });

  // Handle initial hash or default to overview
  if (sidebarLinks.length > 0) {
    const initialHash = window.location.hash;
    const validHash = Array.from(sidebarLinks).some(l => l.getAttribute('href') === initialHash);
    if (validHash) {
      switchDashboardTab(initialHash);
    } else {
      // Default to first link (#overview usually)
      const firstHref = sidebarLinks[0].getAttribute('href');
      switchDashboardTab(firstHref);
    }
  }

});


// Map Intersection Observer
    const mapSection = document.querySelector(".map-section");
    const mapPlaceholder = document.querySelector(".map-placeholder");

    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Replace placeholder with actual map
                mapPlaceholder.innerHTML = `
                    <iframe
                        src="https://www.google.com/maps?q=MMR+Complex,+Chinna+Thirupathi,+near+Chinna+Muniyappan+Kovil,+Salem,+Tamil+Nadu+636008&output=embed"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                `;

                // Stop observing once loaded
                mapObserver.unobserve(mapSection);
            }
        });
    }, { threshold: 0.3 });

    if (mapSection) {
        mapObserver.observe(mapSection);
    }