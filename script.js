document.addEventListener('DOMContentLoaded', function () {
  // ====================== SCROLL REVEAL ======================
  const srElements = document.querySelectorAll('.sr, .g-item');
  if ('IntersectionObserver' in window && srElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    srElements.forEach(el => observer.observe(el));
  } else {
    srElements.forEach(el => el.classList.add('in'));
  }

  // ====================== MOBILE NAV ======================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    if (!navToggle || !navLinks) return;
    navToggle.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', String(open));
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      setMenu(!navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  // ====================== LIGHTBOX ======================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const gItems = Array.from(document.querySelectorAll('.g-item'));
  let currentIndex = 0;

  function getImgData(item) {
    const img = item.querySelector('img');
    return img ? { src: img.src, alt: img.alt || 'Aananda Homestay gallery image' } : { src: '', alt: '' };
  }

  function updateCounter() {
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${gItems.length}`;
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !gItems.length) return;
    currentIndex = index;
    const { src, alt } = getImgData(gItems[currentIndex]);
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.94)';
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateCounter();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      lightboxImg.style.opacity = '';
      lightboxImg.style.transform = '';
    }));
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    if (!lightboxImg || !gItems.length) return;
    currentIndex = (currentIndex + dir + gItems.length) % gItems.length;
    const { src, alt } = getImgData(gItems[currentIndex]);
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `scale(0.94) translateX(${dir > 0 ? '20px' : '-20px'})`;
    window.setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxImg.style.transform = `scale(0.94) translateX(${dir > 0 ? '-10px' : '10px'})`;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        lightboxImg.style.opacity = '';
        lightboxImg.style.transform = '';
      }));
      updateCounter();
    }, 160);
  }

  if (lightbox && lightboxImg && gItems.length) {
    gItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => navigate(-1));
    lightboxNext?.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    }, { passive: true });
  }
  // ====================== CONTACT FORM ======================
  const contactForm = document.getElementById('contactForm');

  function validateForm(data) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }

    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.push('Please enter a valid email address.');
    }

    if (!data.phone || data.phone.replace(/[^\d]/g, '').length < 7) {
      errors.push('Please enter a valid phone number.');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters.');
    }

    return errors;
  }

  function buildWhatsAppFallback(data) {
    const whatsappMessage = `
Hello Aananda Homestay,

I would like to inquire about a stay.

Name: ${data.name.trim()}
Email: ${data.email.trim()}
Phone: ${data.phone.trim()}

Message:
${data.message.trim()}
    `.trim();

    return `https://wa.me/9779741833003?text=${encodeURIComponent(whatsappMessage)}`;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formMessage = document.getElementById('formMessage');
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send inquiry';
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Web3Forms honeypot spam check
      if (data.botcheck) return;

      const errors = validateForm(data);

      if (errors.length) {
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.innerHTML = `<strong>Please fix:</strong><br>${errors.join('<br>')}`;
        }
        return;
      }

      const accessKey = formData.get('access_key');
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.innerHTML = '<strong>Form setup incomplete.</strong><br>Please replace YOUR_WEB3FORMS_ACCESS_KEY in index.html.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      if (formMessage) {
        formMessage.className = 'form-message';
        formMessage.textContent = '';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(result.message || 'Unable to submit the form.');
        }

        if (formMessage) {
          formMessage.className = 'form-message success';
          formMessage.innerHTML = '<strong>Message sent successfully.</strong><br>We will get back to you soon.';
        }

        contactForm.reset();
        window.gtag?.('event', 'contact_form_submission', {
          event_category: 'Lead',
          event_label: 'Web3Forms contact form'
        });
      } catch (error) {
        console.error('Form error:', error);
        const whatsappUrl = buildWhatsAppFallback(data);

        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.innerHTML = `<strong>Unable to send right now.</strong><br>Please try again, or <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">send the same message on WhatsApp</a>.`;
        }
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      }
    });
  }
  // ====================== ANALYTICS EVENTS ======================
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', () => window.gtag?.('event', 'click_whatsapp', { event_category: 'Lead', event_label: link.textContent.trim() || 'WhatsApp' }));
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => window.gtag?.('event', 'click_phone', { event_category: 'Lead', event_label: 'Phone call' }));
  });
});

// ====================== SERVICES TAB ======================
function showTab(tabName, btn) {
  document.querySelectorAll('.service-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabName);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}
