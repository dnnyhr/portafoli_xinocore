// ========================================
// XINOCORE - EPIC ANIMATIONS OPTIMIZED
// Versión optimizada sin lag
// ========================================

gsap.registerPlugin(ScrollTrigger);

// ========================================
// INICIALIZAR
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') return;

    setTimeout(() => {
        try {
            initHyperspaceEntry();
            initEpicHero();
            initServiceCardsOptimized();
            initPortfolioCardsEnhanced();
            initTextEffects();
            initCTAFixed();
            // initModalsOptimized(); // DESACTIVADO - dejando CSS original manejar modales

            console.log('🚀 Epic Optimized loaded (modals use CSS only)!');
        } catch (error) {
            console.error('Error:', error);
        }
    }, 100);
});

// ========================================
// HIPERESPACIO OPTIMIZADO (visual original, performance mejorado)
// ========================================
function initHyperspaceEntry() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const isMobile = window.innerWidth < 768;
    const lineCount = isMobile ? 15 : 25; // Mantener cantidad original

    const overlay = document.createElement('div');
    overlay.className = 'hyperspace-overlay';
    overlay.innerHTML = `
        <div class="warp-lines-container"></div>
        <div class="hyperspace-flash"></div>
    `;
    hero.prepend(overlay);

    const container = overlay.querySelector('.warp-lines-container');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.className = 'warp-line';
        line.style.cssText = `
            position: absolute;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 150 + 30}px;
            background: linear-gradient(to bottom, transparent, white, transparent);
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.6 + 0.3};
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
        `;
        fragment.appendChild(line);
    }
    container.appendChild(fragment);

    const tl = gsap.timeline({
        defaults: { force3D: true, ease: "power2.out" }
    });

    // Flash original
    tl.to('.hyperspace-flash', { opacity: 1, duration: 0.1 })
      .to('.hyperspace-flash', { opacity: 0, duration: 0.15 });

    // Líneas originales pero optimizadas con GPU
    tl.from('.warp-line', {
        scaleY: 0,
        y: -800,
        duration: 0.8,
        stagger: { each: 0.008, from: "random" },
        ease: "power2.out"
    }, 0.1);

    tl.to('.warp-line', {
        scaleY: 0,
        y: 1200,
        duration: 0.6,
        stagger: { each: 0.006, from: "random" },
        ease: "power2.in"
    }, 0.7);

    tl.to('.hyperspace-overlay', {
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
            overlay.remove();
        }
    }, 1.2);
}

// ========================================
// HERO ÉPICO PERO LIMPIO - OPTIMIZADO
// ========================================
function initEpicHero() {
    const heroTitle = document.querySelector('.hero-title');
    const gradientText = document.querySelector('.gradient-text');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelectorAll('.hero-cta .btn');

    const isMobile = window.innerWidth < 768;
    const tl = gsap.timeline({
        delay: 1.8,
        defaults: {
            force3D: true, // Forzar aceleración GPU en todas las animaciones
            transformPerspective: 1000
        }
    });

    // Título con explosión controlada - OPTIMIZADO
    if (heroTitle) {
        gsap.set(heroTitle, {
            opacity: 1,
            willChange: 'transform, opacity' // Pre-optimizar
        });

        // En móvil: animación más simple sin blur
        if (isMobile) {
            tl.from(heroTitle, {
                scale: 2.5,
                opacity: 0,
                y: -50,
                duration: 0.9,
                ease: "power3.out",
                onComplete: () => {
                    heroTitle.style.willChange = 'auto'; // Limpiar después
                }
            });
        } else {
            // En desktop: efecto completo pero optimizado
            tl.from(heroTitle, {
                scale: 3,
                opacity: 0,
                filter: "blur(20px)", // Reducido de 30px a 20px
                duration: 1,
                ease: "power3.out",
                onComplete: () => {
                    heroTitle.style.willChange = 'auto';
                }
            });
        }
    }

    // Texto gradiente con rotación simple - OPTIMIZADO
    if (gradientText) {
        gsap.set(gradientText, {
            willChange: 'transform, opacity',
            transformStyle: 'preserve-3d'
        });

        // En móvil: sin rotación 3D
        if (isMobile) {
            tl.from(gradientText, {
                scale: 0.5,
                opacity: 0,
                y: 30,
                duration: 0.7,
                ease: "back.out(1.5)",
                onComplete: () => {
                    gradientText.style.willChange = 'auto';
                }
            }, "-=0.5");
        } else {
            // En desktop: rotación optimizada
            tl.from(gradientText, {
                scale: 0.5,
                rotationY: 180,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.5)",
                onComplete: () => {
                    gradientText.style.willChange = 'auto';
                }
            }, "-=0.6");
        }
    }

    // Subtítulo simple - OPTIMIZADO
    if (heroSubtitle) {
        gsap.set(heroSubtitle, { willChange: 'transform, opacity' });
        tl.from(heroSubtitle, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                heroSubtitle.style.willChange = 'auto';
            }
        }, "-=0.4");
    }

    // Botones con entrada limpia - OPTIMIZADO
    if (heroButtons.length > 0) {
        gsap.set(heroButtons, {
            opacity: 1,
            scale: 1,
            clearProps: "transform",
            willChange: 'transform, opacity'
        });
        tl.from(heroButtons, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
            onComplete: () => {
                heroButtons.forEach(btn => {
                    btn.style.willChange = 'auto';
                });
            }
        }, "-=0.3");
    }
}

// ========================================
// SERVICE CARDS SIMPLIFICADAS
// ========================================
function initServiceCardsOptimized() {
    const serviceCards = gsap.utils.toArray('.service-card');

    serviceCards.forEach((card, index) => {
        gsap.set(card, { opacity: 1 });

        // Entrada simple y elegante
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
        });

        const icon = card.querySelector('.service-icon');
        if (icon) {
            // Solo flotación sutil
            gsap.to(icon, {
                y: -6,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2
            });
        }

        // Hover limpio
        card.addEventListener('mouseenter', function() {
            gsap.to(card, {
                y: -8,
                scale: 1.02,
                boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.4)",
                duration: 0.3,
                ease: "power2.out"
            });

            if (icon) {
                gsap.to(icon, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                duration: 0.3,
                ease: "power2.out"
            });

            if (icon) {
                gsap.to(icon, { scale: 1, duration: 0.3 });
            }
        });
    });
}

// ========================================
// PORTFOLIO CARDS MEJORADAS
// ========================================
function initPortfolioCardsEnhanced() {
    const portfolioCards = gsap.utils.toArray('.portfolio-card');

    portfolioCards.forEach((card, index) => {
        gsap.set(card, { opacity: 1 });

        // Entrada épica pero optimizada
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            scale: 0.3,
            rotation: 360,
            opacity: 0,
            filter: "blur(15px)",
            duration: 0.9,
            delay: index * 0.1,
            ease: "back.out(1.7)"
        });

        // Hover sofisticado con parallax y brillo continuo (solo en desktop)
        if (window.innerWidth >= 768) {
            // Crear capa de brillo permanente
            const glowLayer = document.createElement('div');
            glowLayer.className = 'card-glow-layer';
            glowLayer.style.cssText = `
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 60%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            `;
            card.style.position = 'relative';
            card.appendChild(glowLayer);

            card.addEventListener('mouseenter', function() {
                gsap.to(card, {
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
                    duration: 0.4,
                    ease: "power3.out"
                });

                glowLayer.style.opacity = '1';
            });

            // Parallax 3D suave siguiendo cursor
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Parallax más sutil
                const rotateX = ((y - centerY) / centerY) * 5;
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, {
                    rotationX: -rotateX,
                    rotationY: rotateY,
                    duration: 0.5,
                    ease: "power2.out",
                    transformPerspective: 1000,
                    transformStyle: "preserve-3d"
                });

                // Mover el brillo siguiendo cursor
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                glowLayer.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.2) 30%, transparent 60%)`;
            });

            // Mouseleave suave
            card.addEventListener('mouseleave', function() {
                gsap.to(card, {
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    duration: 0.6,
                    ease: "power3.inOut"
                });

                glowLayer.style.opacity = '0';
            });
        }
    });
}

// ========================================
// EFECTOS DE TEXTO SUTILES Y BONITOS
// ========================================
function initTextEffects() {
    // Section titles con entrada elegante
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });

        // Efecto de brillo sutil al entrar
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            filter: "brightness(0.7)",
            duration: 1.2,
            ease: "power2.out"
        });
    });

    // Portfolio titles con fade suave
    gsap.utils.toArray('.portfolio-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 90%"
            },
            y: 15,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    });

    // Service titles con fade simple
    gsap.utils.toArray('.service-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%"
            },
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    // Section subtitles con efecto sutil
    gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
        gsap.from(subtitle, {
            scrollTrigger: {
                trigger: subtitle,
                start: "top 85%"
            },
            y: 20,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power2.out"
        });
    });
}

// ========================================
// CTA SECTION ARREGLADA
// ========================================
function initCTAFixed() {
    const ctaSection = document.querySelector('.cta-section');
    if (!ctaSection) return;

    const ctaContent = ctaSection.querySelector('.cta-content');
    const ctaTitle = ctaSection.querySelector('.cta-title');
    const ctaText = ctaSection.querySelector('.cta-text');
    const ctaBtn = ctaSection.querySelector('.btn');

    // Asegurar visibilidad
    if (ctaContent) gsap.set(ctaContent, { opacity: 1 });
    if (ctaTitle) gsap.set(ctaTitle, { opacity: 1 });
    if (ctaText) gsap.set(ctaText, { opacity: 1 });
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 1 });

    // Animaciones simples y seguras
    if (ctaTitle) {
        gsap.from(ctaTitle, {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 70%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    if (ctaText) {
        gsap.from(ctaText, {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 65%",
                toggleActions: "play none none none"
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out"
        });
    }

    if (ctaBtn) {
        gsap.from(ctaBtn, {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 60%",
                toggleActions: "play none none none"
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.4,
            ease: "power2.out"
        });
    }
}

// ========================================
// MODALES OPTIMIZADOS
// ========================================
function initModalsOptimized() {
    // Esperar a que window.openProjectModal esté definido
    const checkAndWrap = () => {
        if (typeof window.openProjectModal === 'undefined' || typeof window.closeProjectModal === 'undefined') {
            return; // Aún no está listo, esperar
        }

        const originalOpen = window.openProjectModal;
        const originalClose = window.closeProjectModal;

        // Solo sobrescribir si no lo hemos hecho ya
        if (window.openProjectModal._wrapped) return;

        window.openProjectModal = function(projectId) {
            // Llamar la función original primero
            originalOpen(projectId);

            // Aplicar animación GSAP después - con verificación
            setTimeout(() => {
                const modal = document.getElementById('project-modal');
                if (!modal) {
                    console.warn('⚠️ Modal not found for animation');
                    return;
                }

                const modalContent = modal.querySelector('.modal-content');
                if (!modalContent) {
                    console.warn('⚠️ Modal content not found for animation');
                    return;
                }

                console.log('🎬 Animating modal with GSAP...');

                // FORZAR position fixed para asegurar que esté en viewport
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';

                // Añadir clase active para hacer visible (CSS maneja esto)
                modal.classList.add('active');

                // Configurar perspectiva 3D en el MODAL (contenedor padre)
                modal.style.perspective = '1200px';
                modalContent.style.transformStyle = 'preserve-3d';

                // Solo animar la rotación 3D con GSAP
                gsap.fromTo(modalContent,
                    {
                        rotationY: 180,
                        scale: 0.8
                    },
                    {
                        rotationY: 0,
                        scale: 1,
                        duration: 0.7,
                        ease: "back.out(1.5)"
                    }
                );

                console.log('✅ GSAP animation started - modal at viewport center');
            }, 50);
        };
        window.openProjectModal._wrapped = true;

        window.closeProjectModal = function() {
            const modal = document.getElementById('project-modal');
            if (!modal) {
                originalClose();
                return;
            }

            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent) {
                originalClose();
                return;
            }

            // Animar salida con rotación inversa
            gsap.to(modalContent, {
                rotationY: -180,
                scale: 0.8,
                duration: 0.4,
                ease: "back.in(1.5)",
                onComplete: () => {
                    originalClose();
                }
            });
        };
        window.closeProjectModal._wrapped = true;
    };

    // Intentar varias veces con delays incrementales
    checkAndWrap();
    setTimeout(checkAndWrap, 100);
    setTimeout(checkAndWrap, 500);
    setTimeout(checkAndWrap, 1000);
}


console.log('⚡ Optimized loaded!');
