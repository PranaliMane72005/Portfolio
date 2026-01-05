document.addEventListener('DOMContentLoaded', function () {
  initNavbar();
  initSmoothScrolling();
  initSkillBars();
  initContactForm();
  initScrollAnimations();
  console.log('🚀 Portfolio website loaded successfully!');
});

// Navbar scroll effect
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
}

// Smooth scrolling for # links
function initSmoothScrolling() {
  document.addEventListener('click', function (e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    e.preventDefault();
    const id = target.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (!el) return;
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const top = el.offsetTop - navbarHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

// Skills animation
function initSkillBars() {
  const skillBars = document.querySelectorAll('.progress-bar');
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillBars.forEach((bar) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
              bar.classList.add('animate');
            }, 200);
          });
          observer.unobserve(skillsSection);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(skillsSection);
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.hero-content, .about-content, .interests-card, .skill-item, .project-card, .contact-item, .contact-form'
  );

  animatedElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// Contact form + EmailJS
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    if (!validateForm(formData)) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // EmailJS params – must match your template variables
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    const SERVICE_ID = 'service_uv9vme7';   // from EmailJS
    const TEMPLATE_ID = 'template_1l13ckn'; // from EmailJS

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        showNotification("Message sent successfully! I'll get back to you soon.", 'success');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        showNotification('Failed to send message. Please try again later.', 'error');
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });

  function validateForm(data) {
    const errors = [];
    if (!data.name) errors.push('Name is required');
    if (!data.email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email');
    }
    if (!data.subject) errors.push('Subject is required');
    if (!data.message) errors.push('Message is required');

    if (errors.length) {
      showNotification(errors.join('\n'), 'error');
      return false;
    }
    return true;
  }
}

// Notification toast
function showNotification(message, type = 'info') {
  const existing = document.querySelectorAll('.notification');
  existing.forEach((n) => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateX(400px);
    transition: transform 0.3s ease-out;
    max-width: 400px;
    background-color: ${colors[type] || colors.info};
    cursor: pointer;
    font-family: var(--font-family-base);
    font-size: 14px;
    line-height: 1.5;
  `;

  if (message.includes('\n')) {
    notification.innerHTML = message.split('\n').map((m) => `<div>${m}</div>`).join('');
  } else {
    notification.textContent = message;
  }

  document.body.appendChild(notification);

  setTimeout(() => (notification.style.transform = 'translateX(0)'), 100);
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);

  notification.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  });
}
