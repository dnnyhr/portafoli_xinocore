/**
 * ========================================
 * PROCESS CAROUSEL - Mobile Component
 * Carrusel automático con controles táctiles
 * Sin botones de navegación
 * ========================================
 */

(function() {
    'use strict';

    // Configuración del carrusel
    const CONFIG = {
        autoPlayInterval: 4000,      // 3 segundos entre cambios
        transitionDuration: 400,      // Duración de la animación en ms
        enableAutoPlay: true,         // Activar reproducción automática
        pauseOnInteraction: true,     // Pausar al interactuar
        enableSwipe: true,            // Habilitar gestos táctiles
        swipeThreshold: 50            // Distancia mínima para swipe (px)
    };

    class ProcessCarousel {
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
            this.updateCarousel(false); // Sin animación inicial

            if (CONFIG.enableAutoPlay) {
                this.startAutoPlay();
            }

            // Observer para detener cuando no está visible
            this.setupIntersectionObserver();
        }

        createCarouselStructure() {
            const processSection = document.querySelector('.process-section');
            if (!processSection) return;

            const processGrid = processSection.querySelector('.process-grid');
            if (!processGrid) return;

            // Obtener todos los pasos del proceso
            this.processSteps = Array.from(processGrid.querySelectorAll('.process-step'));

            if (this.processSteps.length === 0) return;

            // Crear contenedor del carrusel (sin botones de navegación)
            const carouselHTML = `
                <div class="process-carousel-container">
                    <div class="process-carousel">
                        <div class="process-carousel-track">
                            ${this.generateCarouselCards()}
                        </div>
                    </div>

                    <div class="process-carousel-indicators">
                        ${this.generateIndicators()}
                    </div>
                </div>
            `;

            // Insertar después del header de la sección
            const sectionHeader = processSection.querySelector('.section-header');
            if (sectionHeader) {
                sectionHeader.insertAdjacentHTML('afterend', carouselHTML);
            }
        }

        generateCarouselCards() {
            return this.processSteps.map((step, index) => {
                const number = step.querySelector('.process-number')?.textContent || `0${index + 1}`;
                const icon = step.querySelector('.process-icon')?.innerHTML || '';

                const titleElement = step.querySelector('.process-title');
                const titleDataI18n = titleElement?.getAttribute('data-i18n');
                const titleText = titleElement?.textContent || '';

                const descElement = step.querySelector('.process-description');
                const descDataI18n = descElement?.getAttribute('data-i18n');
                const descText = descElement?.textContent || '';

                return `
                    <div class="process-step-carousel" data-index="${index}">
                        <div class="process-number">${number}</div>
                        <div class="process-icon">${icon}</div>
                        <h3 class="process-title" ${titleDataI18n ? `data-i18n="${titleDataI18n}"` : ''}>${titleText}</h3>
                        <p class="process-description" ${descDataI18n ? `data-i18n="${descDataI18n}"` : ''}>${descText}</p>
                    </div>
                `;
            }).join('');
        }

        generateIndicators() {
            return this.processSteps.map((_, index) =>
                `<button class="process-carousel-indicator" data-index="${index}" aria-label="Ir al paso ${index + 1}"></button>`
            ).join('');
        }

        cacheElements() {
            this.container = document.querySelector('.process-carousel-container');
            this.track = document.querySelector('.process-carousel-track');
            this.cards = document.querySelectorAll('.process-step-carousel');
            this.indicators = document.querySelectorAll('.process-carousel-indicator');
        }

        setupEventListeners() {
            if (!this.container) return;

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
                if (CONFIG.pauseOnInteraction) {
                    this.pauseAutoPlay();
                    setTimeout(() => this.resumeAutoPlay(), 3000);
                }

                if (diff > 0) {
                    // Swipe left - next
                    this.next();
                } else {
                    // Swipe right - prev
                    this.prev();
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
                    card.className = 'process-step-carousel';

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
            new ProcessCarousel();
        });
    } else {
        new ProcessCarousel();
    }

    // Reinicializar si el i18n cambia el idioma
    window.addEventListener('languageChanged', () => {
        const existingCarousel = document.querySelector('.process-carousel-container');
        if (existingCarousel && window.innerWidth < 768) {
            existingCarousel.remove();
            setTimeout(() => new ProcessCarousel(), 100);
        }
    });
})();
