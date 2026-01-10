// script.js

// Function to close the sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
        sidebar.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Function to open the sidebar
function openSidebar() {
    const sidebar = document.getElementById('sidebar-nav');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar) {
        sidebar.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    if (overlay) {
        overlay.classList.add('active');
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('sidebar-overlay');

    // Open sidebar when hamburger is clicked
    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            openSidebar();
        });
    }

    // Close sidebar when close button is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeSidebar();
        });
    }

    // Close sidebar when overlay is clicked
    if (overlay) {
        overlay.addEventListener('click', function () {
            closeSidebar();
        });
    }

    // Close sidebar with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Smooth scroll for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't prevent default for non-hash links or external links
            if (this.getAttribute('href').startsWith('#') &&
                !this.classList.contains('resume-btn') &&
                !this.hasAttribute('target')) {

                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close sidebar after a small delay
                    setTimeout(closeSidebar, 100);
                }
            }
        });
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('.send-message-btn');

            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields before sending your message.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const formData = new FormData(contactForm);
                // Optional: add extra metadata
                formData.append('_subject', 'New message from portfolio contact form');
                formData.append('_replyto', email);

                const res = await fetch('https://formspree.io/f/mldpodry', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (res.ok) {
                    showFormMessage('Message sent successfully! Thank you for reaching out. I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const data = await res.json().catch(() => ({}));
                    const err = (data && data.errors && data.errors[0] && data.errors[0].message) || 'Something went wrong. Please try again later.';
                    showFormMessage(err, 'error');
                }
            } catch (err) {
                showFormMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }
        });
    }

    // Button functionality
    const secondaryBtn = document.querySelector('.btn-secondary');
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function () {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    const primaryBtn = document.querySelector('.btn-primary');
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function () {
            const contactSection = document.getElementById('projects');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ---------- Featured Projects Only ----------
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        renderFeaturedProjects(false);
        const viewMoreBtn = document.getElementById('view-more-projects');
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', function () {
                renderFeaturedProjects(true);
            });
        }
    }

    // ---------- Certifications (dynamic) ----------
    const certsContainer = document.getElementById('certifications-container');
    if (certsContainer) {
        renderCertifications(false);
        const viewMoreBtn = document.getElementById('view-more-certifications');
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', function () {
                renderCertifications(true);
            });
        }
    }

    // Modal wiring
    setupModal();

    // ---------- Scroll Reveal Animation ----------
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Typing Effect ----------
    const typingSpan = document.querySelector('.typing-text');
    if (typingSpan) {
        const words = ["Mobile App Developer", "AWS Certified Developer", "Flutter Expert", "Tech Enthusiast"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typingSpan.textContent = currentWord.substring(0, charIndex--);
                typeSpeed = 50;
            } else {
                typingSpan.textContent = currentWord.substring(0, charIndex++);
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing
        type();
    }
});

// Form message helper
function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;

    // Insert message above the form
    const form = document.querySelector('.contact-form');
    const container = document.querySelector('.contact-form-container');
    container.insertBefore(messageEl, form);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Basic HTML escaping helpers
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(str) {
    // Minimal attribute escaping; URLs will be used as href values
    return escapeHtml(str).replace(/`/g, '&#96;');
}

// Show only first 4 projects, reveal all on 'View More' click
function renderFeaturedProjects(showAll = false) {
    const holder = document.getElementById('featured-projects');
    const script = document.getElementById('projects-featured');
    if (!holder || !script) return;
    try {
        const cfg = JSON.parse(script.textContent || '{}');
        const list = Array.isArray(cfg.projects) ? cfg.projects : [];
        if (!list.length) return;
        const frag = document.createDocumentFragment();
        (showAll ? list : list.slice(0, 4)).forEach(item => {
            const card = document.createElement('div');
            card.className = 'card project-card';
            const title = escapeHtml(item.title || 'Untitled Project');
            const dates = escapeHtml(item.dates || '');
            const desc = escapeHtml(item.description || '');
            const tags = Array.isArray(item.tags) ? item.tags : [];
            const codeUrl = item.codeUrl ? String(item.codeUrl) : '';
            const liveUrl = item.liveUrl ? String(item.liveUrl) : '';
            const chips = tags.map(t => `<span class="chip">${escapeHtml(t)}</span>`).join(' ');
            const links = [
                codeUrl ? `<a class="btn-link" href="${escapeAttribute(codeUrl)}" target="_blank" rel="noopener">Code</a>` : '',
                liveUrl ? `<a class="btn-link" href="${escapeAttribute(liveUrl)}" target="_blank" rel="noopener">Live</a>` : ''
            ].filter(Boolean).join('\n');
            card.innerHTML = `
                <div class="project-card-body">
                    <h3 class="project-title">${title}</h3>
                    ${dates ? `<div class="project-date">${dates}</div>` : ''}
                    <p class="project-desc">${desc}</p>
                    ${chips ? `<div class="project-chips">${chips}</div>` : ''}
                    ${links ? `<div class="project-links">${links}</div>` : ''}
                </div>
            `;
            frag.appendChild(card);
        });
        holder.innerHTML = '';
        holder.appendChild(frag);
        // Show/hide View More button
        const btn = document.getElementById('view-more-projects');
        if (btn) {
            btn.style.display = list.length > 4 && !showAll ? 'block' : 'none';
        }
    } catch (e) {
        console.warn('Invalid projects-featured JSON:', e);
    }
}

// Show only first 4 certificates, reveal all on 'View More' click
function renderCertifications(showAll = false) {
    const holder = document.getElementById('certifications-container');
    const script = document.getElementById('certifications-data');
    if (!holder || !script) return;
    try {
        const cfg = JSON.parse(script.textContent || '{}');
        const list = Array.isArray(cfg.certifications) ? cfg.certifications : [];
        if (!list.length) return;
        const frag = document.createDocumentFragment();
        (showAll ? list : list.slice(0, 4)).forEach(item => {
            const card = document.createElement('div');
            card.className = 'certification-card';
            const title = escapeHtml(item.title || 'Certification');
            const issuer = escapeHtml(item.issuer || '');
            const year = escapeHtml(item.year || '');
            const icon = item.icon || 'fas fa-certificate';
            const verifyUrl = item.verifyUrl ? String(item.verifyUrl) : '';
            const available = !!verifyUrl && !isPlaceholderUrl(verifyUrl);
            card.innerHTML = `
                <div class="cert-icon">
                    <i class="${icon}"></i>
                </div>
                <h3>${title}</h3>
                ${issuer ? `<p class="cert-issuer">${issuer}</p>` : ''}
                ${year ? `<p class="cert-year">${year}</p>` : ''}
                ${available
                    ? `<button class="view-cert-btn" data-cert-url="${escapeAttribute(verifyUrl)}">View Certificate <i class="fas fa-external-link-alt"></i></button>`
                    : `<span class="cert-upcoming">Upcoming in future</span>`}
            `;
            frag.appendChild(card);
        });
        holder.innerHTML = '';
        holder.appendChild(frag);
        // Attach click handlers for preview buttons
        holder.querySelectorAll('.view-cert-btn[data-cert-url]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const url = e.currentTarget.getAttribute('data-cert-url');
                openPreviewModal(url);
            });
        });
        // Show/hide View More button
        const btn = document.getElementById('view-more-certifications');
        if (btn) {
            btn.style.display = list.length > 4 && !showAll ? 'block' : 'none';
        }
    } catch (e) {
        console.warn('Invalid certifications-data JSON:', e);
    }
}

function setupModal() {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    if (!overlay || !closeBtn) return;

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    // Close on button click
    closeBtn.addEventListener('click', closeModal);
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function openPreviewModal(url) {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    if (!overlay || !body) return;
    body.innerHTML = '';

    if (isPdf(url)) {
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '600';
        iframe.style.border = 'none';
        body.appendChild(iframe);
    } else {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Certificate preview';
        body.appendChild(img);
    }

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    if (!overlay || !body) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    body.innerHTML = '';
}

function isPdf(url) {
    try {
        const u = new URL(url, window.location.href);
        return u.pathname.toLowerCase().endsWith('.pdf');
    } catch (_) {
        return String(url).toLowerCase().endsWith('.pdf');
    }
}

// Treat typical placeholder paths as not-available
function isPlaceholderUrl(url) {
    const s = String(url).toLowerCase();
    return (
        s.startsWith('path/to/') ||
        s.includes('placeholder') ||
        s === '#' ||
        s.trim() === ''
    );
}