// WhatsApp Modal con animaciones GSAP - Temática Espacial
(function() {
    'use strict';

    // ========================================
    // VARIABLES GLOBALES
    // ========================================

    // Estado global de región
    let detectedRegion = null;
    let regionSource = null; // 'cache', 'api', 'manual', 'unknown'
    let isDetecting = false;

    // Constantes
    const STORAGE_KEY = 'xinocore_whatsapp_region';
    const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 días

    // ========================================
    // FUNCIONES DE DETECCIÓN DE REGIÓN
    // ========================================

    /**
     * Obtener región desde localStorage (caché)
     */
    function getRegionFromCache() {
        try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const now = Date.now();

            // Verificar si el caché expiró
            if (now - data.timestamp > CACHE_DURATION) {
                localStorage.removeItem(STORAGE_KEY);
                return null;
            }

            return data.region;
        } catch (e) {
            console.warn('Error reading region cache:', e);
            return null;
        }
    }

    /**
     * Guardar región en localStorage
     */
    function saveRegionToCache(region, source) {
        try {
            const data = {
                region: region,
                source: source,
                timestamp: Date.now()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Error saving region cache:', e);
        }
    }

    /**
     * Detectar región mediante API de geolocalización
     */
    async function detectRegionFromAPI() {
        if (typeof XinocoreConfig === 'undefined' || !XinocoreConfig.geolocation) {
            console.log('[WhatsApp Region] ❌ XinocoreConfig no está definido');
            return null;
        }

        const config = XinocoreConfig.geolocation;

        if (!config.enabled) {
            console.log('[WhatsApp Region] ⚠️ Geolocalización deshabilitada en config');
            return null;
        }

        try {
            console.log('[WhatsApp Region] 🌐 Llamando a API:', config.api.url);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

            const response = await fetch(config.api.url, {
                signal: controller.signal,
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            console.log('[WhatsApp Region] 📡 Respuesta de API:', data);

            const countryCode = data.country_code || data.country;

            if (!countryCode) {
                throw new Error('No country code in response');
            }

            console.log('[WhatsApp Region] 🌍 Código de país detectado:', countryCode);

            // Mapear código de país a región
            const mapping = config.countryMapping;
            const region = mapping[countryCode] || null;

            console.log('[WhatsApp Region] 🗺️ Región mapeada:', region || 'No soportada');

            return region;

        } catch (error) {
            if (error.name === 'AbortError') {
                console.warn('[WhatsApp Region] ⏱️ Timeout de API (>3s)');
            } else {
                console.warn('[WhatsApp Region] ❌ Error en API:', error.message);
            }
            return null;
        }
    }

    /**
     * Detectar región (flujo completo con caché)
     */
    async function detectRegion() {
        if (isDetecting) return;

        console.log('[WhatsApp Region] 🔍 Iniciando detección de región...');
        isDetecting = true;

        // 1. Intentar caché primero
        const cached = getRegionFromCache();
        if (cached) {
            detectedRegion = cached;
            regionSource = 'cache';
            isDetecting = false;
            console.log('[WhatsApp Region] ✅ Región encontrada en caché:', cached);
            return cached;
        }
        console.log('[WhatsApp Region] ℹ️ No hay región en caché, llamando a API...');

        // 2. Intentar API
        const apiRegion = await detectRegionFromAPI();
        if (apiRegion) {
            detectedRegion = apiRegion;
            regionSource = 'api';
            saveRegionToCache(apiRegion, 'api');
            isDetecting = false;
            console.log('[WhatsApp Region] ✅ Región detectada por API:', apiRegion);
            return apiRegion;
        }
        console.log('[WhatsApp Region] ❌ API falló o país no soportado');

        // 3. Fallback: región desconocida (mostrar selector)
        detectedRegion = null;
        regionSource = 'unknown';
        isDetecting = false;
        console.log('[WhatsApp Region] ⚠️ Mostrando selector manual');
        return null;
    }

    /**
     * Obtener número de WhatsApp según región
     */
    function getWhatsAppNumber(region) {
        console.log('[WhatsApp Region] 📞 Obteniendo número para región:', region);

        if (typeof XinocoreConfig === 'undefined' || !XinocoreConfig.contact.whatsapp) {
            console.log('[WhatsApp Region] ⚠️ Usando número fallback (config no definido)');
            return '50587248446'; // Fallback al número original
        }

        const config = XinocoreConfig.contact.whatsapp;

        // Si no hay región, usar default
        if (!region || !config[region]) {
            region = config.default;
            console.log('[WhatsApp Region] ⚠️ Región no válida, usando default:', region);
        }

        const number = config[region].number;
        console.log('[WhatsApp Region] ✅ Número seleccionado:', number, '(' + config[region].display + ')');
        return number;
    }

    /**
     * Establecer región manualmente (desde selector UI)
     */
    function setRegionManually(region) {
        detectedRegion = region;
        regionSource = 'manual';
        saveRegionToCache(region, 'manual');

        // Ocultar selector de región si está visible
        hideRegionSelector();
    }

    // ========================================
    // UI DEL SELECTOR DE REGIÓN
    // ========================================

    /**
     * Mostrar selector de región en el modal
     */
    function showRegionSelector() {
        const modal = document.getElementById('whatsapp-modal');
        if (!modal) return;

        const modalContent = modal.querySelector('.whatsapp-modal-content');
        if (!modalContent) return;

        // Verificar si ya existe el selector
        let selector = modalContent.querySelector('.region-selector');

        if (!selector) {
            // Crear selector
            selector = document.createElement('div');
            selector.className = 'region-selector';

            const config = XinocoreConfig.contact.whatsapp;

            selector.innerHTML = `
                <div class="region-selector-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <h4>Selecciona tu ubicación</h4>
                    <p>Para enviarte al número correcto de WhatsApp</p>
                </div>
                <div class="region-buttons">
                    <button class="region-btn" data-region="nicaragua">
                        <span class="region-flag">${config.nicaragua.flag}</span>
                        <span class="region-name">Nicaragua</span>
                        <span class="region-phone">${config.nicaragua.display}</span>
                    </button>
                    <button class="region-btn" data-region="usa">
                        <span class="region-flag">${config.usa.flag}</span>
                        <span class="region-name">Estados Unidos</span>
                        <span class="region-phone">${config.usa.display}</span>
                    </button>
                </div>
            `;

            // Insertar antes del formulario
            const modalBody = modalContent.querySelector('.whatsapp-modal-body');
            if (modalBody) {
                modalBody.insertBefore(selector, modalBody.firstChild);
            }

            // Agregar event listeners a los botones
            const regionButtons = selector.querySelectorAll('.region-btn');
            regionButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const region = this.getAttribute('data-region');
                    setRegionManually(region);

                    // Feedback visual
                    regionButtons.forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');

                    // Animar salida del selector
                    if (typeof gsap !== 'undefined') {
                        gsap.to(selector, {
                            opacity: 0,
                            y: -20,
                            duration: 0.3,
                            onComplete: () => {
                                selector.style.display = 'none';
                            }
                        });
                    } else {
                        selector.style.display = 'none';
                    }
                });
            });
        }

        // Mostrar selector con animación
        selector.style.display = 'block';
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(selector,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            );
        }
    }

    /**
     * Ocultar selector de región
     */
    function hideRegionSelector() {
        const selector = document.querySelector('.region-selector');
        if (selector) {
            if (typeof gsap !== 'undefined') {
                gsap.to(selector, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    onComplete: () => {
                        selector.style.display = 'none';
                    }
                });
            } else {
                selector.style.display = 'none';
            }
        }
    }

    // ========================================
    // INICIALIZACIÓN DEL MODAL
    // ========================================

    // Wait for GSAP to load
    async function initWhatsAppModal() {
        console.log('[WhatsApp Region] 🚀 Inicializando WhatsApp Modal');
        // Iniciar detección de región de forma asíncrona (no bloquea)
        detectRegion();
        if (typeof gsap === 'undefined') {
            console.log('[WhatsApp Region] ⏳ Esperando GSAP...');
            setTimeout(initWhatsAppModal, 100);
            return;
        }
        console.log('[WhatsApp Region] ✅ GSAP cargado, configurando eventos');

        const modal = document.getElementById('whatsapp-modal');
        const openBtn = document.getElementById('whatsapp-float-btn');
        const closeBtn = document.getElementById('close-modal');
        const backdrop = modal.querySelector('.whatsapp-modal-backdrop');
        const form = document.getElementById('whatsapp-form');
        const modalContent = modal.querySelector('.whatsapp-modal-content');
        const planets = modal.querySelectorAll('.planet');
        const shootingStars = modal.querySelectorAll('.shooting-star');
        const whatsappIcon = modal.querySelector('.whatsapp-icon-large');

        // Función para abrir el modal con animaciones GSAP
        function openModal() {
            console.log('[WhatsApp Region] 🎯 Abriendo modal, región actual:', detectedRegion);

            // Guardar posición de scroll actual
            const scrollY = window.scrollY;
            document.body.style.top = `-${scrollY}px`;

            modal.classList.add('active');
            document.body.classList.add('modal-open');
            document.documentElement.classList.add('modal-open');

            // Esperar un momento para que la detección automática termine
            // Solo mostrar selector si después de 500ms aún no hay región detectada
            setTimeout(() => {
                console.log('[WhatsApp Region] ⏰ Timeout 500ms - Región detectada:', detectedRegion);
                if (!detectedRegion && modal.classList.contains('active')) {
                    console.log('[WhatsApp Region] 🎨 Mostrando selector de región');
                    showRegionSelector();
                } else {
                    console.log('[WhatsApp Region] ✅ Región ya detectada, NO mostrando selector');
                }
            }, 500);

            // Timeline principal para la apertura
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' }
            });

            // Animar entrada del modal
            tl.to(modal, {
                opacity: 1,
                duration: 0.3
            })
            .to(backdrop, {
                opacity: 1,
                duration: 0.4
            }, 0)
            // Animar contenido del modal con efecto de entrada espacial
            .fromTo(modalContent,
                {
                    scale: 0.5,
                    opacity: 0,
                    rotationY: -180,
                    y: -100
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                },
                0.2
            )
            // Animar icono de WhatsApp (sin animaciones continuas)
            .fromTo(whatsappIcon,
                {
                    scale: 0,
                    y: -50
                },
                {
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                },
                0.4
            )
            // Animar planetas
            .fromTo(planets,
                {
                    scale: 0,
                    opacity: 0
                },
                {
                    scale: 1,
                    opacity: 0.7,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'back.out(1.7)'
                },
                0.3
            );

            // Animación suave de las estrellas fugaces - menos frecuentes y aleatorias
            shootingStars.forEach((star, index) => {
                // Posiciones aleatorias en Y para cada estrella
                const randomTopStart = Math.random() * 80 + 10; // Entre 10% y 90%
                const randomTopEnd = randomTopStart + (Math.random() * 20 - 10); // Variación de ±10%

                // Delays más espaciados y aleatorios
                const baseDelay = 2 + (index * 8); // 2s, 10s, 18s
                const randomDelay = baseDelay + (Math.random() * 3); // +0-3s aleatorio

                // Duración aleatoria para cada estrella
                const duration = 2 + (Math.random() * 1.5); // Entre 2-3.5s

                // Repeat delay más largo (15-20 segundos)
                const repeatDelay = 15 + (Math.random() * 5);

                gsap.fromTo(star,
                    {
                        x: 0,
                        y: 0,
                        opacity: 0,
                        rotation: -35 // Ángulo diagonal más natural
                    },
                    {
                        x: window.innerWidth * 0.6, // 60% del ancho de la pantalla
                        y: 300 + (Math.random() * 100), // Distancia variable
                        opacity: 0,
                        rotation: -35,
                        duration: duration,
                        delay: randomDelay,
                        repeat: -1,
                        repeatDelay: repeatDelay,
                        ease: 'power1.inOut',
                        onStart: function() {
                            // Posicionar la estrella en una posición aleatoria
                            gsap.set(this.targets()[0], {
                                top: randomTopStart + '%'
                            });

                            // Fade in rápido
                            gsap.to(this.targets()[0], {
                                opacity: 0.9,
                                duration: 0.2,
                                ease: 'power2.out'
                            });
                        },
                        onUpdate: function() {
                            const progress = this.progress();
                            // Fade out gradual desde el 70%
                            if (progress > 0.7) {
                                const fadeProgress = (progress - 0.7) / 0.3;
                                gsap.set(this.targets()[0], {
                                    opacity: 0.9 * (1 - fadeProgress)
                                });
                            }
                        },
                        onRepeat: function() {
                            // Cambiar posición aleatoria en cada repetición
                            const newTop = Math.random() * 80 + 10;
                            gsap.set(this.targets()[0], {
                                top: newTop + '%'
                            });
                        }
                    }
                );
            });

            // Animación de flotación de planetas
            planets.forEach((planet, index) => {
                gsap.to(planet, {
                    y: '+=30',
                    x: '+=20',
                    rotation: 360,
                    duration: 8 + index * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });

            // Animación del textarea al hacer focus
            const textarea = form.querySelector('textarea');
            textarea.addEventListener('focus', function() {
                gsap.to(this, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });

                gsap.to(this, {
                    boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1), 0 0 30px rgba(139, 92, 246, 0.3)',
                    duration: 0.3
                });
            });

            textarea.addEventListener('blur', function() {
                gsap.to(this, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }

        // Función para cerrar el modal con animaciones GSAP
        function closeModal() {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.in' },
                onComplete: () => {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    document.documentElement.classList.remove('modal-open');

                    // Restaurar posición de scroll
                    const scrollY = document.body.style.top;
                    document.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);

                    // Kill todas las animaciones del modal
                    gsap.killTweensOf([modalContent, whatsappIcon, planets, shootingStars]);
                }
            });

            // Animar salida
            tl.to(modalContent, {
                scale: 0.5,
                opacity: 0,
                rotationY: 180,
                y: 100,
                duration: 0.5,
                ease: 'back.in(1.7)'
            })
            .to(modal, {
                opacity: 0,
                duration: 0.3
            }, 0.2);
        }

        // Función para enviar mensaje a WhatsApp
        function sendToWhatsApp(e) {
            e.preventDefault();

            const messageInput = document.getElementById('whatsapp-message');
            const message = messageInput.value.trim();

            if (!message) {
                // Animación de error si no hay mensaje
                gsap.to(messageInput, {
                    x: -10,
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        gsap.to(messageInput, { x: 0 });
                    }
                });
                return;
            }

            // Crear URL de WhatsApp ANTES de cualquier animación
            const encodedMessage = encodeURIComponent(message);
            // Obtener número según región detectada
            const whatsappNumber = getWhatsAppNumber(detectedRegion);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Abrir WhatsApp INMEDIATAMENTE (crítico para iOS)
            // iOS bloquea window.open() si no se ejecuta directamente en el evento
            const whatsappWindow = window.open(whatsappUrl, '_blank');

            // Animación del botón DESPUÉS de abrir la ventana
            const sendBtn = form.querySelector('.btn-whatsapp-send');

            // Animación de éxito
            const tl = gsap.timeline();
            tl.to(sendBtn, {
                backgroundColor: '#10b981',
                scale: 0.95,
                duration: 0.1
            })
            .to(sendBtn, {
                scale: 1.1,
                duration: 0.2
            })
            .to(sendBtn, {
                scale: 1,
                duration: 0.2,
                onComplete: () => {
                    // Cerrar modal
                    setTimeout(() => {
                        closeModal();
                        // Reset form
                        messageInput.value = '';
                        gsap.set(sendBtn, { backgroundColor: '' });
                    }, 300);
                }
            });
        }

        // Event Listeners
        if (openBtn) {
            openBtn.addEventListener('click', openModal);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeModal);
        }

        if (form) {
            form.addEventListener('submit', sendToWhatsApp);
        }

        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Animación inicial del botón flotante al cargar
        if (openBtn) {
            gsap.fromTo(openBtn, {
                scale: 0,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                delay: 0.5
            });
        }
    }

    // Exponer funciones y variables globalmente para uso en otros scripts
    window.detectedRegion = detectedRegion;
    window.getWhatsAppNumber = getWhatsAppNumber;

    // Observador para actualizar window.detectedRegion cuando cambie
    const originalDetectRegion = detectRegion;
    detectRegion = async function() {
        const result = await originalDetectRegion();
        window.detectedRegion = detectedRegion;
        return result;
    };

    const originalSetRegionManually = setRegionManually;
    setRegionManually = function(region) {
        originalSetRegionManually(region);
        window.detectedRegion = detectedRegion;
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppModal);
    } else {
        initWhatsAppModal();
    }
})();
