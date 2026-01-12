// ========================================
// XINOCORE - GSAP ANIMATIONS
// Animaciones avanzadas con GSAP
// ========================================

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========================================
// CONFIGURACIÓN GLOBAL
// ========================================
const ANIMATION_CONFIG = {
    ease: "power3.out",
    easeSmooth: "power2.inOut",
    easeElastic: "elastic.out(1, 0.5)",
    duration: {
        fast: 0.3,
        normal: 0.6,
        slow: 1.2
    }
};

// ========================================
// INICIALIZAR CUANDO EL DOM ESTÉ LISTO
// ========================================
document.addEventListener('DOMContentLoaded', function() {

    // Verificar que GSAP esté cargado
    if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP no está cargado. Animaciones deshabilitadas.');
        return;
    }

    // Esperar un momento para asegurar que todo esté cargado
    setTimeout(() => {
        try {
            // DESHABILITADO: epic-optimized.js maneja estas animaciones
            // initHeroAnimations();
            // initServiceCards();
            // initPortfolioCards();
            initAboutSection();
            initStatsCounter();
            // initCTASection(); // DESHABILITADO - conflicto con epic-optimized
            initParallaxEffects();
            // initHoverEffects(); // DESHABILITADO - conflicto con epic-optimized
            initMagneticButtons();
            // initTextReveal(); // Comentado temporalmente - puede causar problemas
            initScrollIndicator();

            console.log('✨ GSAP Base Animations initialized!');
        } catch (error) {
            console.error('❌ Error inicializando animaciones:', error);
        }
    }, 300);
});

// ========================================
// HERO SECTION - Entrada Dramática
// ========================================
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Crear timeline para secuencia de animaciones
    const tl = gsap.timeline({
        defaults: { ease: ANIMATION_CONFIG.ease }
    });

    // Animar título con efecto split
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        gsap.set(heroTitle, { opacity: 1 }); // Asegurar que sea visible
        tl.from(heroTitle, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }

    // Animar el texto gradiente
    const gradientText = document.querySelector('.gradient-text');
    if (gradientText) {
        tl.from(gradientText, {
            scale: 0.9,
            opacity: 0,
            duration: 0.6,
            ease: ANIMATION_CONFIG.ease
        }, "-=0.4");
    }

    // Animar subtítulo
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        tl.from(heroSubtitle, {
            y: 30,
            opacity: 0,
            duration: 0.6
        }, "-=0.4");
    }

    // Animar botones
    const heroButtons = document.querySelectorAll('.hero-cta .btn');
    if (heroButtons.length > 0) {
        tl.from(heroButtons, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.7)"
        }, "-=0.3");
    }

    // Animar scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        tl.from(scrollIndicator, {
            y: -20,
            opacity: 0,
            duration: 0.6
        }, "-=0.3");

        // Animación continua para el scroll indicator
        gsap.to(scrollIndicator, {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
}

// ========================================
// SERVICE CARDS - Animación con Stagger
// ========================================
function initServiceCards() {
    const serviceCards = gsap.utils.toArray('.service-card');
    if (serviceCards.length === 0) return;

    serviceCards.forEach((card, index) => {
        // Asegurar visibilidad inicial
        gsap.set(card, { opacity: 1 });

        // Animación de entrada más suave
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
        });

        // Animación del icono
        const icon = card.querySelector('.service-icon');
        if (icon) {
            // Efecto de flotación continuo (más sutil)
            gsap.to(icon, {
                y: -8,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2
            });
        }
    });
}

// ========================================
// PORTFOLIO CARDS - Efectos 3D
// ========================================
function initPortfolioCards() {
    const portfolioCards = gsap.utils.toArray('.portfolio-card');
    if (portfolioCards.length === 0) return;

    portfolioCards.forEach((card, index) => {
        // Asegurar visibilidad
        gsap.set(card, { opacity: 1 });

        // Animación de entrada más simple
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out"
        });

        // Efecto de hover mejorado (solo en desktop)
        if (window.innerWidth >= 768) {
            card.addEventListener('mouseenter', function(e) {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.3)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', function(e) {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
    });
}

// ========================================
// ABOUT SECTION - Animaciones
// ========================================
function initAboutSection() {
    const aboutContent = document.querySelector('.about-content');
    const aboutFeatures = document.querySelector('.about-features');

    if (aboutContent) {
        gsap.set(aboutContent, { opacity: 1 });
        gsap.from(aboutContent, {
            scrollTrigger: {
                trigger: aboutContent,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    if (aboutFeatures) {
        gsap.set(aboutFeatures, { opacity: 1 });

        // Animar feature items
        const features = aboutFeatures.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
            gsap.from(feature, {
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: "power2.out"
            });
        });
    }
}

// ========================================
// CONTADORES ANIMADOS - Estadísticas
// ========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    stats.forEach(stat => {
        const target = stat.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));

        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: "top 85%",
                onEnter: () => animateCounter(stat, numericValue, isPercentage, isPlus)
            }
        });
    });
}

function animateCounter(element, target, isPercentage, isPlus) {
    const counter = { value: 0 };

    gsap.to(counter, {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: function() {
            const value = Math.ceil(counter.value);
            let displayValue = value;

            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';

            element.textContent = displayValue;
        }
    });

    // Efecto de pulso
    gsap.from(element, {
        scale: 0.5,
        duration: 0.8,
        ease: "back.out(2)"
    });
}

// ========================================
// CTA SECTION - Cohete y Animaciones
// ========================================
function initCTASection() {
    const ctaContent = document.querySelector('.cta-content');
    const rocket = document.querySelector('.rocket');

    if (ctaContent) {
        gsap.from('.cta-title', {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 80%"
            },
            scale: 0.5,
            opacity: 0,
            duration: 1,
            ease: "back.out(2)"
        });

        gsap.from('.cta-text', {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 75%"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: ANIMATION_CONFIG.ease
        });

        gsap.from('.cta-content .btn', {
            scrollTrigger: {
                trigger: ctaContent,
                start: "top 70%"
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(2)"
        });
    }

    // Mejorar la animación del cohete
    if (rocket) {
        // Efecto de vibración al cohete
        gsap.to(rocket, {
            x: "+=5",
            y: "+=3",
            rotation: "+=2",
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Efecto de brillo en las llamas
        const flames = rocket.querySelectorAll('.rocket-flame path');
        flames.forEach((flame, index) => {
            gsap.to(flame, {
                opacity: 0.3,
                scaleY: 0.8,
                duration: 0.15 + (index * 0.05),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }
}

// ========================================
// PARALLAX EFFECTS - ScrollTrigger
// ========================================
function initParallaxEffects() {
    // Solo activar parallax en desktop
    if (window.innerWidth < 768) return;

    try {
        // Parallax suave para nebulosas (opcional)
        const nebulas = gsap.utils.toArray('.nebula');
        if (nebulas.length > 0) {
            nebulas.forEach((nebula, index) => {
                gsap.to(nebula, {
                    y: -50 * (index + 1),
                    scrollTrigger: {
                        trigger: nebula,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1
                    }
                });
            });
        }
    } catch (error) {
        console.warn('Parallax effects disabled:', error);
    }
}

// ========================================
// HOVER EFFECTS - Botones con Brillo Siguiendo Cursor
// ========================================
function initMagneticButtons() {
    // Solo en desktop
    if (window.innerWidth < 768) return;

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        // Crear capa de brillo que sigue el cursor
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mover la capa de brillo ::before siguiendo el cursor
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;

            // Actualizar posición del gradiente radial
            const beforeLayer = button.querySelector('::before');
            button.style.setProperty('--mouse-x', `${percentX}%`);
            button.style.setProperty('--mouse-y', `${percentY}%`);

            // Movimiento sutil del botón (muy reducido)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 40; // Reducido de /10 a /40
            const moveY = (y - centerY) / 40;

            gsap.to(button, {
                x: moveX,
                y: moveY,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', function() {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    });
}

// ========================================
// EFECTOS DE HOVER MEJORADOS
// ========================================
function initHoverEffects() {
    // Solo en desktop
    if (window.innerWidth < 768) return;

    // Logo animation simple
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            gsap.to('.logo-icon svg', {
                rotation: 360,
                scale: 1.1,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        logo.addEventListener('mouseleave', function() {
            gsap.to('.logo-icon svg', {
                rotation: 0,
                scale: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    }

    // WhatsApp float button - Sin pulso, solo hover
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        // Solo efecto en hover, sin animación continua
        whatsappBtn.addEventListener('mouseenter', function() {
            gsap.to(whatsappBtn, {
                scale: 1.08,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });

        whatsappBtn.addEventListener('mouseleave', function() {
            gsap.to(whatsappBtn, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }
}

// ========================================
// TEXT REVEAL ANIMATION - DISABLED
// ========================================
function initTextReveal() {
    // Función deshabilitada para evitar problemas
    // Los títulos se mostrarán normalmente
    return;
}

// ========================================
// SCROLL INDICATOR ANIMATION
// ========================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    // Desaparecer al hacer scroll
    ScrollTrigger.create({
        start: "top -100",
        end: "top -100",
        onEnter: () => {
            gsap.to(scrollIndicator, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: ANIMATION_CONFIG.ease
            });
        },
        onLeaveBack: () => {
            gsap.to(scrollIndicator, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: ANIMATION_CONFIG.ease
            });
        }
    });
}

// ========================================
// CONTACT FORM ANIMATIONS
// ========================================
function initContactForm() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            gsap.to(this, {
                scale: 1.02,
                boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
                duration: 0.3,
                ease: ANIMATION_CONFIG.ease
            });
        });

        input.addEventListener('blur', function() {
            gsap.to(this, {
                scale: 1,
                boxShadow: "none",
                duration: 0.3,
                ease: ANIMATION_CONFIG.ease
            });
        });
    });
}

// ========================================
// SMOOTH SCROLL CON GSAP
// ========================================
function initSmoothScroll() {
    // Esta función se puede usar para scroll suave en navegación
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            gsap.to(window, {
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                duration: 1,
                ease: "power3.inOut"
            });
        });
    });
}

// ========================================
// REFRESH SCROLL TRIGGER ON RESIZE
// ========================================
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
// Deshabilitar animaciones en dispositivos de bajo rendimiento
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0);
    console.log('⚠️ Reduced motion detected - animations disabled');
}
