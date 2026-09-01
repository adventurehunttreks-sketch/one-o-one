// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// Back to Top Button
const backToTop = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleBackToTop);

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Gallery Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentImageIndex = 0;
let imageSources = [];

// Collect all gallery images
galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    imageSources.push(img.src);

    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img.src);
    });
});

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Make openLightbox globally accessible
window.openLightbox = openLightbox;

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrevImage);
lightboxNext.addEventListener('click', showNextImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

// Header scroll effect
const header = document.querySelector('.header');

function handleHeaderScroll() {
    if (window.pageYOffset > 50) {
        header.style.background = 'rgba(13, 13, 13, 0.98)';
        header.style.padding = '10px 0';
    } else {
        header.style.background = 'var(--dark-bg)';
        header.style.padding = '15px 0';
    }
}

window.addEventListener('scroll', handleHeaderScroll);

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(contactForm);

    // Show success message
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.style.background = '#28a745';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// Smooth reveal on scroll
function revealOnScroll() {
    const elements = document.querySelectorAll('.course-card, .info-item, .feature');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initial styles for reveal animation
document.querySelectorAll('.course-card, .info-item, .feature').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Counter animation for statistics (if needed)
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Preloader
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
function parallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
}

window.addEventListener('scroll', parallaxEffect);

// Dropdown for course selection (mobile)
const selectElements = document.querySelectorAll('select');
selectElements.forEach(select => {
    select.addEventListener('change', function() {
        this.style.color = this.value ? '#333' : '#999';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navbar background change on scroll
function updateNavbar() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
}

window.addEventListener('scroll', updateNavbar);

// Touch swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        showNextImage();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        showPrevImage();
    }
}

// Lazy loading for gallery images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Load Team from localStorage on page load
function loadTeamFromStorage() {
    const team = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid || team.length === 0) return;

    teamGrid.innerHTML = '';
    
    team.forEach(member => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `
            <div class="team-img">
                <img src="${member.photo || 'photos1.jpg'}" alt="${member.name}">
                <div class="team-social">
                    ${member.facebook ? `<a href="${member.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>` : ''}
                    ${member.instagram ? `<a href="${member.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                </div>
            </div>
            <h3>${member.name}</h3>
            <p class="team-role">${member.role}</p>
        `;
        teamGrid.appendChild(div);
    });
}

// Load Content from localStorage on page load
function loadContentFromStorage() {
    const content = JSON.parse(localStorage.getItem('siteContent') || '{}');
    if (Object.keys(content).length === 0) return;

    if (content.heroTitle) {
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) heroTitle.textContent = content.heroTitle;
    }
    if (content.heroSubtitle) {
        const heroSubtitle = document.querySelector('.hero-content p');
        if (heroSubtitle) heroSubtitle.textContent = content.heroSubtitle;
    }
    if (content.aboutTitle) {
        const aboutTitle = document.querySelector('.about-text h3');
        if (aboutTitle) aboutTitle.textContent = content.aboutTitle;
    }
    if (content.aboutText) {
        const aboutText = document.querySelector('.about-text p');
        if (aboutText) aboutText.textContent = content.aboutText;
    }
}

// Load Gallery from localStorage on page load
function loadGalleryFromStorage() {
    const images = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    if (images.length === 0) return;

    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';
    
    images.forEach(img => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.category = img.category;
        div.innerHTML = `
            <img src="${img.src}" alt="${img.alt}">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        galleryGrid.appendChild(div);
    });

    // Rebind lightbox for new images
    bindLightbox();
}

// Load Courses from localStorage on page load
function loadCoursesFromStorage() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    if (courses.length === 0) return;

    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;

    coursesGrid.innerHTML = '';
    
    courses.forEach((course, index) => {
        const isFeatured = index === 2;
        const div = document.createElement('div');
        div.className = `course-card ${isFeatured ? 'featured' : ''}`;
        div.dataset.course = course.id;
        div.innerHTML = `
            ${isFeatured ? '<div class="course-badge">Most Popular</div>' : ''}
            ${course.isFree ? '<div class="course-badge free">FREE</div>' : ''}
            <div class="course-icon">
                <i class="fas ${course.isFree ? 'fa-coffee' : index === 1 ? 'fa-fire' : index === 2 ? 'fa-award' : 'fa-user'}"></i>
            </div>
            <h3>${course.name}</h3>
            <p>${course.desc}</p>
            <div class="course-meta">
                <span><i class="fas fa-clock"></i> ${course.duration}</span>
                <span class="course-price ${course.isFree ? 'free-price' : ''}">${course.price}</span>
            </div>
            <ul class="course-features">
                ${course.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <a href="#contact" class="btn btn-primary">${course.isFree ? 'Join Free Class' : 'Enroll Now'}</a>
        `;
        coursesGrid.appendChild(div);
    });
}

// Bind lightbox to gallery items
function bindLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && typeof openLightbox === 'function') {
                openLightbox(img.src);
            }
        });
    });
}

// Initialize all storage loading on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadTeamFromStorage();
    loadContentFromStorage();
    loadGalleryFromStorage();
    loadCoursesFromStorage();
});

console.log('One O One Coffee & Barista School - Website Loaded Successfully!');
