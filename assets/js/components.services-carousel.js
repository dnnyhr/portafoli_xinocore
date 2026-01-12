/**
 * ========================================
 * SERVICES CAROUSEL - Mobile Component
 * Carrusel automático con controles táctiles
 * ========================================
 */

(function() {
    'use strict';

    // Configuración del carrusel
    const CONFIG = {
        autoPlayInterval: 5000,      // 5 segundos entre cambios
        transitionDuration: 400,      // Duración de la animación en ms (reducida para mejor fluidez)
        enableAutoPlay: true,         // Activar reproducción automática
        pauseOnInteraction: true,     // Pausar al interactuar
        enableSwipe: true,            // Habilitar gestos táctiles
        swipeThreshold: 50,           // Distancia mínima para swipe (px)
        particlesCount: 0            // Número de partículas espaciales
    };

    class ServicesCarousel {
        constructor() {
            this.currentIndex = 0;
            this.isTransitioning = false;
            this.autoPlayTimer = null;
            this.isPaused = false;
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.touchStartTime = 0;

            this.init();
        }

        init() {
            // Solo ejecutar en móvil
            if (window.innerWidth >= 768) return;

            this.createCarouselStructure();
            this.cacheElements();
            this.setupEventListeners();
            this.createSpaceParticles();
            this.updateCarousel(false); // Sin animación inicial

            if (CONFIG.enableAutoPlay) {
                this.startAutoPlay();
            }

            // Observer para detener cuando no está visible
            this.setupIntersectionObserver();
        }

        createCarouselStructure() {
            const servicesSection = document.querySelector('.services');
            if (!servicesSection) return;

            const servicesGrid = servicesSection.querySelector('.services-grid');
            if (!servicesGrid) return;

            // Obtener todas las tarjetas de servicio
            this.serviceCards = Array.from(servicesGrid.querySelectorAll('.service-card'));

            if (this.serviceCards.length === 0) return;

            // Crear contenedor del carrusel
            const carouselHTML = `
                <div class="services-carousel-container">
                    <div class="carousel-space-particles"></div>

                    <div class="services-carousel">
                        <button class="carousel-nav-btn prev-btn" aria-label="Servicio anterior">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>

                        <div class="services-carousel-track">
                            ${this.generateCarouselCards()}
                        </div>

                        <button class="carousel-nav-btn next-btn" aria-label="Siguiente servicio">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>

                    <div class="carousel-indicators">
                        ${this.generateIndicators()}
                    </div>
                </div>
            `;

            // Insertar después del header de la sección
            const sectionHeader = servicesSection.querySelector('.section-header');
            if (sectionHeader) {
                sectionHeader.insertAdjacentHTML('afterend', carouselHTML);
            }
        }

        generateCarouselCards() {
            return this.serviceCards.map((card, index) => {
                const icon = card.querySelector('.service-icon')?.innerHTML || '';
                const title = card.querySelector('.service-title')?.getAttribute('data-i18n') ||
                             card.querySelector('.service-title')?.textContent || '';
                const description = card.querySelector('.service-description')?.getAttribute('data-i18n') ||
                                  card.querySelector('.service-description')?.textContent || '';
                const benefits = Array.from(card.querySelectorAll('.service-benefits li'))
                    .map(li => {
                        const dataI18n = li.getAttribute('data-i18n');
                        return dataI18n ?
                            `<li data-i18n="${dataI18n}">${li.textContent}</li>` :
                            `<li>${li.textContent}</li>`;
                    })
                    .join('');

                const titleDataI18n = card.querySelector('.service-title')?.getAttribute('data-i18n');
                const descDataI18n = card.querySelector('.service-description')?.getAttribute('data-i18n');

                return `
                    <div class="service-card-carousel" data-index="${index}">
                        <div class="service-icon">${icon}</div>
                        <h3 class="service-title" ${titleDataI18n ? `data-i18n="${titleDataI18n}"` : ''}>${card.querySelector('.service-title')?.textContent || ''}</h3>
                        <p class="service-description" ${descDataI18n ? `data-i18n="${descDataI18n}"` : ''}>${card.querySelector('.service-description')?.textContent || ''}</p>
                        <ul class="service-benefits">${benefits}</ul>
                    </div>
                `;
            }).join('');
        }

        generateIndicators() {
            return this.serviceCards.map((_, index) =>
                `<button class="carousel-indicator" data-index="${index}" aria-label="Ir al servicio ${index + 1}"></button>`
            ).join('');
        }

        cacheElements() {
            this.container = document.querySelector('.services-carousel-container');
            this.track = document.querySelector('.services-carousel-track');
            this.cards = document.querySelectorAll('.service-card-carousel');
            this.indicators = document.querySelectorAll('.carousel-indicator');
            this.prevBtn = document.querySelector('.carousel-nav-btn.prev-btn');
            this.nextBtn = document.querySelector('.carousel-nav-btn.next-btn');
            this.particlesContainer = document.querySelector('.carousel-space-particles');
        }

        setupEventListeners() {
            if (!this.container) return;

            // Botones de navegación
            this.prevBtn?.addEventListener('click', () => this.handleNavClick('prev'));
            this.nextBtn?.addEventListener('click', () => this.handleNavClick('next'));

            // Indicadores
            this.indicators.forEach(indicator => {
                indicator.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.goToSlide(index);
                });
            });

            // Touch events para swipe
            if (CONFIG.enableSwipe) {
                this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
                this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
                this.track.addEventListener('touchend', () => this.handleTouchEnd());
            }

            // Pausar en hover (solo en dispositivos con hover)
            if (window.matchMedia('(hover: hover)').matches) {
                this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
                this.container.addEventListener('mouseleave', () => this.resumeAutoPlay());
            }

            // Pausar cuando la pestaña no está visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoPlay();
                } else {
                    this.resumeAutoPlay();
                }
            });

            // Reiniciar en resize (móvil a desktop)
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (window.innerWidth >= 768) {
                        this.destroy();
                    }
                }, 250);
            });
        }

        handleNavClick(direction) {
            if (this.isTransitioning) return;

            if (CONFIG.pauseOnInteraction) {
                this.pauseAutoPlay();
                setTimeout(() => this.resumeAutoPlay(), 3000);
            }

            if (direction === 'next') {
                this.next();
            } else {
                this.prev();
            }
        }

        handleTouchStart(e) {
            this.touchStartX = e.changedTouches[0].clientX;
            this.touchStartTime = Date.now();
        }

        handleTouchMove(e) {
            this.touchEndX = e.changedTouches[0].clientX;
        }

        handleTouchEnd() {
            if (!this.touchStartX || !this.touchEndX) {
                this.touchStartX = 0;
                this.touchEndX = 0;
                return;
            }

            const diff = this.touchStartX - this.touchEndX;
            const timeDiff = Date.now() - this.touchStartTime;

            // Swipe rápido y con suficiente distancia
            if (Math.abs(diff) > CONFIG.swipeThreshold && timeDiff < 500) {
                if (diff > 0) {
                    // Swipe left - next
                    this.handleNavClick('next');
                } else {
                    // Swipe right - prev
                    this.handleNavClick('prev');
                }
            }

            // Resetear valores
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.touchStartTime = 0;
        }

        next() {
            if (this.isTransitioning) return;
            this.currentIndex = (this.currentIndex + 1) % this.cards.length;
            this.updateCarousel();
        }

        prev() {
            if (this.isTransitioning) return;
            this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
            this.updateCarousel();
        }

        goToSlide(index) {
            if (this.isTransitioning || index === this.currentIndex) return;

            if (CONFIG.pauseOnInteraction) {
                this.pauseAutoPlay();
                setTimeout(() => this.resumeAutoPlay(), 3000);
            }

            this.currentIndex = index;
            this.updateCarousel();
        }

        updateCarousel(animate = true) {
            if (!this.cards.length) return;

            if (animate) {
                this.isTransitioning = true;
            }

            const totalCards = this.cards.length;

            // Usar requestAnimationFrame para mejor rendimiento
            requestAnimationFrame(() => {
                this.cards.forEach((card, index) => {
                    // Remover todas las clases de una vez
                    card.className = 'service-card-carousel';

                    if (index === this.currentIndex) {
                        card.classList.add('active');
                    } else if (index === (this.currentIndex + 1) % totalCards) {
                        card.classList.add('next');
                    } else if (index === (this.currentIndex - 1 + totalCards) % totalCards) {
                        card.classList.add('prev');
                    } else {
                        card.classList.add('hidden');
                    }
                });

                // Actualizar indicadores
                this.indicators.forEach((indicator, index) => {
                    if (index === this.currentIndex) {
                        indicator.classList.add('active');
                    } else {
                        indicator.classList.remove('active');
                    }
                });
            });

            if (animate) {
                setTimeout(() => {
                    this.isTransitioning = false;
                }, CONFIG.transitionDuration);
            }
        }

        startAutoPlay() {
            if (!CONFIG.enableAutoPlay || this.autoPlayTimer) return;

            this.autoPlayTimer = setInterval(() => {
                if (!this.isPaused && !document.hidden) {
                    this.next();
                }
            }, CONFIG.autoPlayInterval);
        }

        pauseAutoPlay() {
            this.isPaused = true;
        }

        resumeAutoPlay() {
            this.isPaused = false;
        }

        stopAutoPlay() {
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
                this.autoPlayTimer = null;
            }
        }

        createSpaceParticles() {
            if (!this.particlesContainer) return;

            for (let i = 0; i < CONFIG.particlesCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'space-particle';

                // Posición aleatoria
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.animationDuration = `${8 + Math.random() * 4}s`;

                // Tamaño aleatorio
                const size = 1 + Math.random() * 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                this.particlesContainer.appendChild(particle);
            }
        }

        setupIntersectionObserver() {
            if (!this.container) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.resumeAutoPlay();
                    } else {
                        this.pauseAutoPlay();
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(this.container);
        }

        destroy() {
            this.stopAutoPlay();
            if (this.container) {
                this.container.remove();
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ServicesCarousel();
        });
    } else {
        new ServicesCarousel();
    }

    // Reinicializar si el i18n cambia el idioma
    window.addEventListener('languageChanged', () => {
        const existingCarousel = document.querySelector('.services-carousel-container');
        if (existingCarousel && window.innerWidth < 768) {
            existingCarousel.remove();
            setTimeout(() => new ServicesCarousel(), 100);
        }
    });
})();
