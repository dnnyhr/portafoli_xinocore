// Sistema de Detección de Región para Información de Contacto
(function() {
    'use strict';

    // ========================================
    // FUNCIONES DE DETECCIÓN
    // ========================================

    /**
     * Obtener región detectada desde el sistema de WhatsApp
     * (Reutiliza la detección ya hecha por components.whatsapp.js)
     */
    function getDetectedRegion() {
        // Intentar usar la región ya detectada por WhatsApp
        if (window.detectedRegion) {
            console.log('[Contact Region] ✅ Usando región detectada por WhatsApp:', window.detectedRegion);
            return window.detectedRegion;
        }

        // Si no hay región detectada, usar default
        if (typeof XinocoreConfig !== 'undefined' && XinocoreConfig.contact.regions) {
            const defaultRegion = XinocoreConfig.contact.regions.default;
            console.log('[Contact Region] ⚠️ No hay región detectada, usando default:', defaultRegion);
            return defaultRegion;
        }

        console.log('[Contact Region] ❌ Config no disponible, usando fallback: nicaragua');
        return 'nicaragua';
    }

    /**
     * Obtener información de contacto según región
     */
    function getContactInfo(region) {
        if (typeof XinocoreConfig === 'undefined' || !XinocoreConfig.contact.regions) {
            console.warn('[Contact Region] Config no disponible');
            return {
                email: 'Dannyherrod@xinocore.com',
                phone: '+505 8724 8446',
                location: 'Jinotega, Nicaragua'
            };
        }

        const config = XinocoreConfig.contact.regions;

        // Si no hay región o no existe, usar default
        if (!region || !config[region]) {
            region = config.default;
        }

        return config[region];
    }

    /**
     * Actualizar elementos de contacto en el DOM
     */
    function updateContactElements() {
        console.log('[Contact Region] 🔄 Actualizando elementos de contacto...');

        const region = getDetectedRegion();
        const contactInfo = getContactInfo(region);

        console.log('[Contact Region] 📍 Región:', region);
        console.log('[Contact Region] 📧 Información:', contactInfo);

        // Actualizar email en sección de contacto
        const emailElements = document.querySelectorAll('[data-contact="email"]');
        emailElements.forEach(el => {
            el.textContent = contactInfo.email;
            console.log('[Contact Region] ✅ Email actualizado:', contactInfo.email);
        });

        // Actualizar teléfono/WhatsApp en sección de contacto
        const phoneElements = document.querySelectorAll('[data-contact="phone"]');
        phoneElements.forEach(el => {
            el.textContent = contactInfo.phone;
            console.log('[Contact Region] ✅ Teléfono actualizado:', contactInfo.phone);
        });

        // Actualizar ubicación según región
        const locationElements = document.querySelectorAll('[data-contact="location"]');
        locationElements.forEach(el => {
            el.textContent = contactInfo.location;
            console.log('[Contact Region] ✅ Ubicación actualizada:', contactInfo.location);
        });

        // Actualizar placeholder del campo de teléfono en el formulario
        const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
        phoneInputs.forEach(input => {
            if (contactInfo.phonePlaceholder) {
                input.placeholder = contactInfo.phonePlaceholder;
                console.log('[Contact Region] ✅ Placeholder de teléfono actualizado:', contactInfo.phonePlaceholder);
            }
        });

        // Note: Form action is no longer needed since we use Netlify Functions
        // The notification email is sent dynamically via components.emailjs.js
        console.log('[Contact Region] 📬 Email de notificación para esta región:', contactInfo.email);
    }

    /**
     * Inicializar sistema de detección de región para contacto
     */
    function init() {
        console.log('[Contact Region] 🚀 Inicializando sistema de región para contacto...');

        // Esperar un poco para dar tiempo a que WhatsApp detecte la región
        setTimeout(() => {
            updateContactElements();
        }, 100);

        // Escuchar cambios de región desde WhatsApp
        // (Si el usuario selecciona manualmente en el modal de WhatsApp)
        const checkInterval = setInterval(() => {
            if (window.detectedRegion) {
                console.log('[Contact Region] 🔔 Región detectada, actualizando...');
                updateContactElements();
                clearInterval(checkInterval);
            }
        }, 500);

        // Detener chequeo después de 10 segundos (región ya debería estar detectada)
        setTimeout(() => {
            clearInterval(checkInterval);
            console.log('[Contact Region] ⏹️ Chequeo de región finalizado');
        }, 10000);

        console.log('[Contact Region] ✅ Sistema inicializado');
    }

    // ========================================
    // EXPORTAR API GLOBAL
    // ========================================

    window.ContactRegion = {
        init,
        update: updateContactElements,
        getRegion: getDetectedRegion,
        getContactInfo
    };

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
