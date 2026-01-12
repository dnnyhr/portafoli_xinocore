// ========================================
// XINOCORE - JavaScript Enhanced
// ========================================

// Projects data will be loaded from JSON
let projectsData = [];

document.addEventListener('DOMContentLoaded', function() {

    // Load projects data
    loadProjects();

    // ========================================
    // NAVIGATION
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

            // Ocultar/mostrar selector de idiomas cuando se abre/cierra el menú (sin animación para evitar lag en iOS)
            const languageSelector = document.querySelector('.language-selector');
            if (languageSelector) {
                if (nav.classList.contains('active')) {
                    languageSelector.style.display = 'none';
                } else {
                    languageSelector.style.display = 'flex';
                }
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';

                // Mostrar selector de idiomas
                const languageSelector = document.querySelector('.language-selector');
                if (languageSelector) {
                    languageSelector.style.display = 'flex';
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth < 768) {
            if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';

                // Mostrar selector de idiomas
                const languageSelector = document.querySelector('.language-selector');
                if (languageSelector) {
                    languageSelector.style.display = 'flex';
                }
            }
        }
    });

    // Sticky header on scroll - OPTIMIZADO
    let lastScroll = 0;
    let headerTicking = false;

    window.addEventListener('scroll', function() {
        if (!headerTicking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;

                if (currentScroll <= 0) {
                    header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                } else {
                    header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }

                lastScroll = currentScroll;
                headerTicking = false;
            });
            headerTicking = true;
        }
    }, { passive: true });

    // Active nav link on scroll (for index.html)
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    if (sections.length > 0) {
        window.addEventListener('scroll', debounce(highlightNavOnScroll, 100), { passive: true });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#' || href.length <= 1) return;

            const targetSection = document.querySelector(href);

            if (targetSection) {
                e.preventDefault();
                const offsetTop = targetSection.offsetTop - 70;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // SCROLL INDICATOR
    // ========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.querySelector('#servicios');
            if (servicesSection) {
                const offsetTop = servicesSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // Fallback: scroll down one viewport height
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ========================================
    // PORTFOLIO FILTERS
    // ========================================
    initPortfolioFilters();

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // ========================================
    // PROJECT MODAL
    // ========================================
    console.log('🔵 Initializing project modal...');
    initProjectModal();
    console.log('✅ Project modal initialized');

    // ========================================
    // FORM HANDLING
    // ========================================
    // Note: Form submission is now handled by components.emailjs.js
    // This section only handles validation display
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    // Función para mostrar mensajes en el formulario
    function showFormMessage(message, type) {
        if (!formMessage) return;

        const iconSvg = type === 'success'
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

        formMessage.innerHTML = iconSvg + '<span>' + message + '</span>';
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'flex';

        // Ocultar después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Validación en tiempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444';
                showFormMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            } else {
                this.style.borderColor = '';
            }
        });
    }

    // ========================================
    // STICKY FILTERS
    // ========================================
    const filtersWrapper = document.getElementById('filters-wrapper');

    if (filtersWrapper) {
        const filtersOffsetTop = filtersWrapper.offsetTop;

        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset >= filtersOffsetTop) {
                filtersWrapper.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                filtersWrapper.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            }
        }, 10));
    }

    // ========================================
    // PARALLAX EFFECT - OPTIMIZADO
    // ========================================
    const parallaxElements = document.querySelectorAll('.space-bg');

    if (window.innerWidth >= 768 && parallaxElements.length > 0) {
        // Usar requestAnimationFrame para mejor rendimiento
        let ticking = false;
        let scrolled = window.pageYOffset;

        window.addEventListener('scroll', function() {
            scrolled = window.pageYOffset;

            if (!ticking) {
                window.requestAnimationFrame(function() {
                    parallaxElements.forEach(element => {
                        element.style.transform = `translate3d(0, ${scrolled * 0.5}px, 0)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========================================
    // SHOOTING STARS ANIMATION - OPTIMIZADO
    // ========================================
    // Solo crear estrellas en desktop para mejor rendimiento
    if (window.innerWidth >= 1024) {
        createShootingStars();
    }


    // ========================================
    // HANDLE WINDOW RESIZE
    // ========================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth >= 768) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (window.innerWidth >= 768 && parallaxElements.length > 0) {
                const scrolled = window.pageYOffset;
                parallaxElements.forEach(element => {
                    const speed = 0.5;
                    element.style.transform = `translateY(${scrolled * speed}px)`;
                });
            } else {
                parallaxElements.forEach(element => {
                    element.style.transform = 'translateY(0)';
                });
            }
        }, 250);
    });

    // ========================================
    // ACCESSIBILITY
    // ========================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-nav *:focus {
            outline: 3px solid #6366f1;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(focusStyle);

    // ========================================
    // INITIAL ANIMATIONS
    // ========================================
    setTimeout(() => {
        const firstElements = document.querySelectorAll('[data-aos]');
        firstElements.forEach((element, index) => {
            if (element.getBoundingClientRect().top < window.innerHeight) {
                setTimeout(() => {
                    element.classList.add('aos-animate');
                }, index * 100);
            }
        });
    }, 100);

    console.log('✨ Xinocore website loaded successfully!');
});

// ========================================
// LOAD PROJECTS FROM JSON
// ========================================
async function loadProjects() {
    try {
        // Intentar cargar desde GitHub primero
        const githubUrl = XinocoreConfig.projects.github.url;
        console.log('🔵 Intentando cargar proyectos desde GitHub:', githubUrl);

        const response = await fetch(githubUrl);

        if (!response.ok) {
            throw new Error(`GitHub fetch failed: ${response.status}`);
        }

        const data = await response.json();
        projectsData = data.projects;
        console.log('✅ Proyectos cargados desde GitHub:', projectsData.length);

        // Renderizar proyectos después de cargarlos
        renderProjectsInIndex();
        renderProjectsInPortfolio();
    } catch (error) {
        console.warn('⚠️ Error cargando desde GitHub:', error.message);
        console.log('🔵 Intentando cargar desde archivo local...');

        // Fallback: intentar cargar desde archivo local
        try {
            const localResponse = await fetch(XinocoreConfig.projects.local);
            const data = await localResponse.json();
            projectsData = data.projects;
            console.log('✅ Proyectos cargados desde archivo local:', projectsData.length);

            renderProjectsInIndex();
            renderProjectsInPortfolio();
        } catch (localError) {
            console.error('❌ Error cargando proyectos locales:', localError);
            // Último fallback: datos embebidos
            projectsData = getFallbackProjects();
            console.log('⚠️ Usando datos de fallback embebidos');
            renderProjectsInIndex();
            renderProjectsInPortfolio();
        }
    }
}

// ========================================
// RENDER PROJECTS IN INDEX.HTML
// ========================================
function renderProjectsInIndex() {
    const portfolioGrid = document.querySelector('.portfolio-preview .portfolio-grid');
    if (!portfolioGrid) {
        console.log('⚠️ Index portfolio grid not found - not in index.html');
        return;
    }

    console.log('🔵 Rendering projects in index.html...');

    // Limpiar proyectos hardcodeados
    portfolioGrid.innerHTML = '';

    // Obtener solo proyectos destacados (featured: true)
    const featuredProjects = projectsData.filter(p => p.featured);

    // Si no hay featured, tomar los primeros 4
    const projectsToShow = featuredProjects.length > 0
        ? featuredProjects.slice(0, 4)
        : projectsData.slice(0, 4);

    projectsToShow.forEach((project, index) => {
        console.log(`🔵 Creating index card ${index + 1}:`, project.title);
        const card = createProjectCard(project, 'portfolio-card');
        portfolioGrid.appendChild(card);
    });

    console.log('✅ Projects rendered in index.html:', projectsToShow.length);
}

// ========================================
// RENDER PROJECTS IN PORTAFOLIO.HTML
// ========================================
function renderProjectsInPortfolio() {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) {
        console.log('⚠️ Portfolio grid not found - not in portafolio.html');
        return;
    }

    console.log('🔵 Rendering projects in portafolio.html...');
    console.log('🔵 Projects data:', projectsData);

    // Limpiar proyectos hardcodeados
    portfolioGrid.innerHTML = '';

    // Renderizar todos los proyectos
    projectsData.forEach((project, index) => {
        console.log(`🔵 Creating card ${index + 1}:`, project.title);
        const card = createProjectCard(project, 'portfolio-item');
        portfolioGrid.appendChild(card);
    });

    console.log('✅ Projects rendered in portafolio.html:', projectsData.length);

    // Generar filtros dinámicos solo si no existen todavía
    const existingFilters = document.querySelectorAll('.filter-btn');
    if (existingFilters.length === 0) {
        generateDynamicFilters();
    }
}

// ========================================
// I18N HELPER - GET LOCALIZED FIELD
// ========================================
function getLocalizedField(project, fieldName) {
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
    const localizedFieldName = `${fieldName}_en`;

    // If English and the English field exists, use it; otherwise fall back to Spanish
    if (currentLang === 'en' && project[localizedFieldName]) {
        return project[localizedFieldName];
    }

    return project[fieldName];
}

// ========================================
// CREATE PROJECT CARD ELEMENT
// ========================================
function createProjectCard(project, cardClass) {
    const article = document.createElement('article');
    article.className = cardClass;
    article.setAttribute('data-category', project.category);
    article.setAttribute('data-aos', '');
    article.setAttribute('data-project-id', project.id);

    // FORZAR VISIBILIDAD - prevenir que animaciones lo oculten
    article.style.opacity = '1';
    article.style.visibility = 'visible';
    article.style.display = 'block';

    // Determinar el ícono según la categoría
    const icons = {
        web: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
        menu: `<path d="M12 2L2 7l10 5 10-5-10-5z"/>
               <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>`,
        catalog: `<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>`,
        card: `<rect x="3" y="4" width="18" height="18" rx="2"/>
               <circle cx="9" cy="9" r="2"/>
               <path d="M3 16l6-6 4 4 5-5"/>`
    };

    const icon = icons[project.category] || icons.web;

    // Estructura para portfolio-card (index.html)
    if (cardClass === 'portfolio-card') {
        article.innerHTML = `
            <div class="portfolio-image">
                ${project.portada ?
                    `<img src="${project.portada}" alt="${project.title}" class="portfolio-cover-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="placeholder-image" style="background: ${project.color}; display: none;">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            ${icon}
                        </svg>
                    </div>`
                    :
                    `<div class="placeholder-image" style="background: ${project.color};">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            ${icon}
                        </svg>
                    </div>`
                }
            </div>
            <div class="portfolio-info">
                <span class="portfolio-category">${getLocalizedField(project, 'categoryLabel')}</span>
                <h3 class="portfolio-title">${getLocalizedField(project, 'title')}</h3>
                <p class="portfolio-description">${getLocalizedField(project, 'description')}</p>
            </div>
        `;
    } else {
        // Estructura para portfolio-item (portafolio.html)
        article.innerHTML = `
            <div class="portfolio-item-image">
                ${project.portada ?
                    `<img src="${project.portada}" alt="${project.title}" class="portfolio-cover-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="placeholder-image" style="background: ${project.color}; display: none;">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            ${icon}
                        </svg>
                    </div>`
                    :
                    `<div class="placeholder-image" style="background: ${project.color};">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            ${icon}
                        </svg>
                    </div>`
                }
                <div class="portfolio-item-overlay">
                    <span class="portfolio-item-category">${getLocalizedField(project, 'categoryLabel')}</span>
                    <h3 class="portfolio-item-title">${getLocalizedField(project, 'title')}</h3>
                    <p class="portfolio-item-description">${getLocalizedField(project, 'description')}</p>
                </div>
            </div>
        `;
    }

    return article;
}

// ========================================
// PROJECT MODAL SYSTEM
// ========================================
function initProjectModal() {
    console.log('🔵 Creating modal element...');

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.id = 'project-modal';

    console.log('✅ Modal element created:', modal);
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" id="modal-close" aria-label="Cerrar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <div class="modal-header">
                <span class="modal-category"></span>
                <h2 class="modal-title"></h2>
                <p class="modal-client"></p>
                <p class="modal-year"></p>
            </div>
            <div class="modal-body">
                <div class="modal-gallery">
                    <div class="modal-main-image">📷</div>
                    <div class="modal-thumbnails"></div>
                </div>
                <div class="modal-description">
                    <h3>Descripción del Proyecto</h3>
                    <p></p>
                </div>
                <div class="modal-features">
                    <h3>Características</h3>
                    <div class="features-list"></div>
                </div>
                <div class="modal-benefits">
                    <h3 class="benefits-title">Beneficios</h3>
                    <div class="benefits-list"></div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-primary modal-btn" id="modal-explore-btn" target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Explorar este proyecto
                </a>
                <a href="#contacto" class="btn btn-secondary modal-btn" id="modal-contact-btn">Solicitar Proyecto Similar</a>
                <button class="btn btn-secondary modal-btn" id="modal-close-btn">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    console.log('✅ Modal appended to body');

    // Add click handlers to all portfolio cards
    console.log('🔵 Adding click handlers to portfolio cards...');
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.portfolio-card, .portfolio-item');
        if (card) {
            const projectId = card.getAttribute('data-project-id');
            if (projectId) {
                openProjectModal(projectId, card);
            } else {
                // Fallback: use data attributes
                const title = card.querySelector('.portfolio-title, .portfolio-item-title')?.textContent;
                const project = projectsData.find(p => p.title === title);
                if (project) {
                    openProjectModal(project.id, card);
                }
            }
        }
    });

    // Close modal handlers
    document.getElementById('modal-close').addEventListener('click', closeProjectModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeProjectModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });
}

function openProjectModal(projectId, clickedElement) {
    console.log('🔵 openProjectModal called with:', projectId);

    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
        console.error('❌ Project not found:', projectId);
        return;
    }

    const modal = document.getElementById('project-modal');
    if (!modal) {
        console.error('❌ Modal element not found!');
        return;
    }

    console.log('✅ Modal found, populating content...');

    // Populate modal content with localized fields
    modal.querySelector('.modal-category').textContent = getLocalizedField(project, 'categoryLabel');
    modal.querySelector('.modal-title').textContent = getLocalizedField(project, 'title');

    // Client and Year labels (translate these too)
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
    const clientLabel = currentLang === 'en' ? 'Client' : 'Cliente';
    const yearLabel = currentLang === 'en' ? 'Year' : 'Año';

    modal.querySelector('.modal-client').textContent = `${clientLabel}: ${project.client}`;
    modal.querySelector('.modal-year').textContent = `${yearLabel}: ${project.year}`;
    modal.querySelector('.modal-description p').textContent = getLocalizedField(project, 'longDescription');

    // Header gradient - mantener el gradiente como color de marca
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.background = project.color;

    // Populate gallery with images
    const mainImage = modal.querySelector('.modal-main-image');
    const thumbnails = modal.querySelector('.modal-thumbnails');
    const localizedTitle = getLocalizedField(project, 'title');
    const imageLabel = currentLang === 'en' ? 'image' : 'imagen';

    if (project.images && project.images.length > 0) {
        // Mostrar la primera imagen en el visor principal
        mainImage.innerHTML = `<img src="${project.images[0]}" alt="${localizedTitle}" style="width: 100%; height: auto; display: block; border-radius: 0.5rem;">`;

        // Si hay más de una imagen, crear miniaturas
        if (project.images.length > 1) {
            thumbnails.innerHTML = project.images.map((img, index) => `
                <img src="${img}"
                     alt="${localizedTitle} - ${imageLabel} ${index + 1}"
                     class="modal-thumbnail ${index === 0 ? 'active' : ''}"
                     data-index="${index}"
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem; cursor: pointer; margin-right: 0.5rem; border: 2px solid ${index === 0 ? '#6366f1' : 'transparent'}; transition: all 0.3s ease;"
                     onclick="document.querySelector('.modal-main-image img').src = this.src;
                              document.querySelectorAll('.modal-thumbnail').forEach(t => t.style.border = '2px solid transparent');
                              this.style.border = '2px solid #6366f1';">
            `).join('');
        } else {
            thumbnails.innerHTML = '';
        }
    } else {
        // Si no hay imágenes, mostrar un placeholder con el gradiente
        mainImage.innerHTML = `
            <div style="width: 100%; min-height: 300px; background: ${project.color}; display: flex; align-items: center; justify-content: center; border-radius: 0.5rem;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            </div>
        `;
        thumbnails.innerHTML = '';
    }

    // Features (use localized array if available)
    const featuresList = modal.querySelector('.features-list');
    const localizedFeatures = getLocalizedField(project, 'features');
    featuresList.innerHTML = localizedFeatures.map(feature =>
        `<div class="feature-item-modal">${feature}</div>`
    ).join('');

    // Benefits (reemplaza technologies para ser más útil al usuario final)
    const benefitsList = modal.querySelector('.benefits-list');
    const benefitsTitle = modal.querySelector('.benefits-title');

    // Actualizar título según idioma
    if (benefitsTitle) {
        benefitsTitle.textContent = currentLang === 'en' ? 'Benefits' : 'Beneficios';
    }

    // Usar benefits si existe, sino fallback a un array vacío
    const benefitsSection = modal.querySelector('.modal-benefits');
    const localizedBenefits = getLocalizedField(project, 'benefits');

    if (localizedBenefits && Array.isArray(localizedBenefits) && localizedBenefits.length > 0) {
        benefitsList.innerHTML = localizedBenefits.map(benefit =>
            `<div class="benefit-item">${benefit}</div>`
        ).join('');
        if (benefitsSection) {
            benefitsSection.style.display = 'block';
        }
    } else {
        // Ocultar sección si no hay beneficios definidos
        if (benefitsSection) {
            benefitsSection.style.display = 'none';
        }
    }

    // Update explore button URL (botón para ver el proyecto terminado)
    const exploreBtn = modal.querySelector('#modal-explore-btn');
    if (exploreBtn) {
        if (project.url && project.url !== '#' && project.url !== '') {
            exploreBtn.href = project.url;
            exploreBtn.style.display = 'inline-block';
        } else {
            // Si no hay URL del proyecto, ocultar el botón
            exploreBtn.style.display = 'none';
        }
    }

    // Update contact button URL (botón para solicitar proyecto similar)
    const contactBtn = modal.querySelector('#modal-contact-btn');
    if (contactBtn) {
        // Crear evento para abrir WhatsApp con tarjeta del proyecto
        contactBtn.removeAttribute('href');
        contactBtn.style.cursor = 'pointer';

        // Limpiar eventos anteriores
        const newContactBtn = contactBtn.cloneNode(true);
        contactBtn.parentNode.replaceChild(newContactBtn, contactBtn);

        newContactBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Obtener la URL del proyecto
            const projectUrl = project.url && project.url !== '#' && project.url !== '' ? project.url : '';

            // Obtener campos localizados para el mensaje
            const localizedTitle = getLocalizedField(project, 'title');
            const localizedCategory = getLocalizedField(project, 'categoryLabel');

            // Crear el mensaje de WhatsApp con textos localizados
            const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
            const messageText = currentLang === 'en'
                ? `I would love to request a similar project to: *${localizedTitle}*\n\n> Category: ${localizedCategory}`
                : `Me encantaría solicitar un proyecto similar a: *${localizedTitle}*\n\n> Categoría: ${localizedCategory}`;

            let mensaje = messageText;

            // Si hay URL del proyecto, agregarla (WhatsApp generará la tarjeta automáticamente)
            if (projectUrl) {
                mensaje += `\n\n🔗${projectUrl}`;
            }

            // Agregar mensaje final
            const finalText = currentLang === 'en'
                ? `\n\nPlease, I would like more information about a similar project.`
                : `\n\nPor favor, me gustaría más información sobre un proyecto similar.`;
            mensaje += finalText;

            const mensajeEncoded = encodeURIComponent(mensaje);

            // Obtener número de WhatsApp según región detectada
            const whatsappNumber = (typeof XinocoreConfig !== 'undefined' && XinocoreConfig.contact.whatsapp)
                ? (XinocoreConfig.contact.whatsapp[window.detectedRegion] || XinocoreConfig.contact.whatsapp[XinocoreConfig.contact.whatsapp.default]).number
                : '50587248446'; // Fallback al número original

            // Crear URL de WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeEncoded}`;

            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

            // Cerrar el modal
            closeProjectModal();
        });
    }

    // Resetear scroll del modal al inicio
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }

    // Mostrar modal inmediatamente - sin scroll
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    console.log('✅ Modal opened');
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    console.log('✅ Modal closed');
}


// ========================================
// SHOOTING STARS
// ========================================
function createShootingStars() {
    const spaceBgs = document.querySelectorAll('.space-bg');

    spaceBgs.forEach(bg => {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 6px 2px white;
                    top: ${Math.random() * 50}%;
                    left: ${Math.random() * 50}%;
                    animation: shootingStar 2s ease-out forwards;
                    pointer-events: none;
                `;
                bg.appendChild(star);

                setTimeout(() => star.remove(), 2000);
            }
        }, 3000);
    });
}


// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>${message}</span>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 90%;
        width: auto;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content svg {
        flex-shrink: 0;
    }
`;
document.head.appendChild(style);

// ========================================
// PORTFOLIO FILTERS SYSTEM
// ========================================
function initPortfolioFilters() {
    const filtersContainer = document.querySelector('.filters');

    if (!filtersContainer) return; // No estamos en portafolio.html

    console.log('🔵 Portfolio filters will be generated after projects load');
}

/**
 * Genera los botones de filtro dinámicamente basándose en las categorías del JSON
 */
function generateDynamicFilters() {
    const filtersContainer = document.querySelector('.filters');

    if (!filtersContainer || projectsData.length === 0) {
        console.log('⚠️ Cannot generate filters: no container or no projects');
        return;
    }

    console.log('🔵 Generating dynamic filters from project categories...');

    // Limpiar filtros existentes
    filtersContainer.innerHTML = '';

    // Obtener idioma actual
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';

    // Crear botón "Todos"
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.setAttribute('data-filter', 'all');
    allButton.textContent = currentLang === 'en' ? 'All' : 'Todos';
    filtersContainer.appendChild(allButton);

    // Extraer categorías únicas del JSON
    const categoriesMap = new Map();

    projectsData.forEach(project => {
        if (!categoriesMap.has(project.category)) {
            categoriesMap.set(project.category, {
                category: project.category,
                labelEs: project.categoryLabel,
                labelEn: project.categoryLabel_en || project.categoryLabel
            });
        }
    });

    console.log('🔵 Found categories:', Array.from(categoriesMap.keys()));

    // Crear botón para cada categoría
    categoriesMap.forEach((catData, categoryKey) => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.setAttribute('data-filter', categoryKey);
        button.setAttribute('data-label-es', catData.labelEs);
        button.setAttribute('data-label-en', catData.labelEn);
        button.textContent = currentLang === 'en' ? catData.labelEn : catData.labelEs;
        filtersContainer.appendChild(button);
    });

    // Agregar event listeners a los nuevos botones
    setupFilterButtonListeners();

    console.log('✅ Dynamic filters generated:', categoriesMap.size + 1, 'buttons');
}

/**
 * Configura los event listeners para los botones de filtro
 */
function setupFilterButtonListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Aplicar filtro
            filterProjects(filter);

            // Scroll en mobile
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    const portfolioGrid = document.getElementById('portfolio-grid');
                    if (portfolioGrid) {
                        const offsetTop = portfolioGrid.offsetTop - 140;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        });
    });

    console.log('✅ Filter button listeners attached');
}

/**
 * Actualiza los textos de los filtros cuando cambia el idioma
 */
function updateFilterLabels() {
    const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        const filter = button.getAttribute('data-filter');

        if (filter === 'all') {
            button.textContent = currentLang === 'en' ? 'All' : 'Todos';
        } else {
            const labelEs = button.getAttribute('data-label-es');
            const labelEn = button.getAttribute('data-label-en');
            button.textContent = currentLang === 'en' ? labelEn : labelEs;
        }
    });

    console.log('✅ Filter labels updated for language:', currentLang);
}

function filterProjects(filter) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    console.log('🔵 Filtering projects by:', filter);

    // Limpiar grid
    portfolioGrid.innerHTML = '';

    // Filtrar proyectos
    const filteredProjects = filter === 'all'
        ? projectsData
        : projectsData.filter(p => p.category === filter);

    console.log('🔵 Filtered projects count:', filteredProjects.length);

    // Renderizar proyectos filtrados
    filteredProjects.forEach((project, index) => {
        const card = createProjectCard(project, 'portfolio-item');

        // Agregar animación de entrada escalonada
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        portfolioGrid.appendChild(card);

        // Animar entrada
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 50);
    });

    console.log('✅ Projects filtered and rendered');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// FALLBACK PROJECTS DATA
// ========================================
function getFallbackProjects() {
    return [
        {
            id: "cafe-las-nubes",
            title: "Café Las Nubes",
            category: "web",
            categoryLabel: "Página Web",
            client: "Café Las Nubes",
            description: "Sitio web completo para cafetería artesanal",
            longDescription: "Sitio web elegante para cafetería artesanal especializada en café de altura de Jinotega.",
            color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            technologies: ["HTML5", "CSS3", "JavaScript"],
            features: ["Galería de productos", "Menú digital", "Sistema de reservas"],
            year: "2024"
        }
        // More fallback projects...
    ];
}

// ========================================
// I18N LANGUAGE CHANGE EVENT LISTENER
// ========================================
// Re-render projects when language changes
window.addEventListener('languageChanged', function(e) {
    console.log('[Projects] Language changed to:', e.detail.language);
    console.log('[Projects] Re-rendering projects with new language...');

    // Re-render projects in both pages
    renderProjectsInIndex();
    renderProjectsInPortfolio();

    // Update filter labels (sin regenerar los filtros para mantener el estado activo)
    updateFilterLabels();

    console.log('[Projects] ✅ Projects re-rendered in new language');
});