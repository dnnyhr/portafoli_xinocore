// Sistema de Internacionalización para Xinocore
(function() {
    'use strict';

    // ========================================
    // CONFIGURACIÓN
    // ========================================

    const I18N_CONFIG = {
        defaultLang: 'es',
        supportedLangs: ['es', 'en'],
        storageKey: 'xinocore_language',
        translationsPath: 'assets/data/translations.json',
        dataAttr: 'data-i18n'
    };

    // Estado global
    let currentLang = null;
    let translations = null;
    let isLoading = false;

    // ========================================
    // FUNCIONES CORE
    // ========================================

    /**
     * Detectar idioma del navegador
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // 'es-MX' → 'es'

        console.log('[i18n] Browser language detected:', browserLang, '→', langCode);

        return I18N_CONFIG.supportedLangs.includes(langCode)
            ? langCode
            : I18N_CONFIG.defaultLang;
    }

    /**
     * Obtener idioma desde localStorage
     */
    function getSavedLanguage() {
        try {
            const saved = localStorage.getItem(I18N_CONFIG.storageKey);
            console.log('[i18n] Saved language from localStorage:', saved);
            return saved;
        } catch (e) {
            console.warn('[i18n] Error reading language from localStorage:', e);
            return null;
        }
    }

    /**
     * Guardar idioma en localStorage
     */
    function saveLanguage(lang) {
        try {
            localStorage.setItem(I18N_CONFIG.storageKey, lang);
            console.log('[i18n] Language saved to localStorage:', lang);
        } catch (e) {
            console.warn('[i18n] Error saving language to localStorage:', e);
        }
    }

    /**
     * Cargar archivo de traducciones
     */
    async function loadTranslations() {
        if (isLoading) {
            console.log('[i18n] Already loading translations...');
            return;
        }
        if (translations) {
            console.log('[i18n] Translations already loaded');
            return translations; // Ya cargado
        }

        isLoading = true;
        console.log('[i18n] Loading translations from:', I18N_CONFIG.translationsPath);

        try {
            const response = await fetch(I18N_CONFIG.translationsPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            translations = await response.json();
            isLoading = false;
            console.log('[i18n] ✅ Translations loaded successfully');
            return translations;
        } catch (error) {
            console.error('[i18n] ❌ Error loading translations:', error);
            isLoading = false;
            return null;
        }
    }

    /**
     * Obtener traducción por clave (soporta anidación: "nav.home")
     */
    function getTranslation(key, lang) {
        if (!translations || !translations[lang]) {
            console.warn('[i18n] Translations not loaded or language not found:', lang);
            return key;
        }

        const keys = key.split('.');
        let value = translations[lang];

        for (const k of keys) {
            if (value[k] === undefined) {
                console.warn('[i18n] Translation key not found:', key, 'for language:', lang);
                return key;
            }
            value = value[k];
        }

        return value;
    }

    /**
     * Detectar qué página estamos viendo
     */
    function detectCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('portafolio')) {
            return 'portfolio';
        }
        if (path.includes('gracias')) {
            return 'thanks';
        }
        if (path.includes('404')) {
            return 'error404';
        }
        return 'index';
    }

    /**
     * Actualizar título de la página según el idioma
     */
    function updatePageTitle(lang) {
        const page = detectCurrentPage();
        const titleData = translations[lang]?.page_title;

        if (!titleData || !titleData[page]) {
            console.warn('[i18n] Page title not found for:', page);
            return;
        }

        document.title = titleData[page];
        console.log('[i18n] Page title updated to:', titleData[page]);
    }

    /**
     * Aplicar traducciones a elementos con data-i18n
     */
    function applyTranslations(lang) {
        console.log('[i18n] Applying translations for language:', lang);
        let elementsTranslated = 0;

        // Textos normales
        document.querySelectorAll(`[${I18N_CONFIG.dataAttr}]`).forEach(el => {
            const key = el.getAttribute(I18N_CONFIG.dataAttr);
            const translation = getTranslation(key, lang);

            // Preservar HTML interno si existe (como <strong>)
            if (translation.includes('<')) {
                el.innerHTML = translation;
            } else {
                el.textContent = translation;
            }
            elementsTranslated++;
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = getTranslation(key, lang);
            el.placeholder = translation;
            elementsTranslated++;
        });

        // Aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            const translation = getTranslation(key, lang);
            el.setAttribute('aria-label', translation);
            elementsTranslated++;
        });

        // Titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = getTranslation(key, lang);
            el.title = translation;
            elementsTranslated++;
        });

        console.log('[i18n] ✅ Translated', elementsTranslated, 'elements');

        // Actualizar atributo lang en html
        document.documentElement.lang = lang;

        // Actualizar título de la página
        updatePageTitle(lang);

        // Actualizar botón selector
        updateLanguageSelector(lang);

        // Evento personalizado para que otros componentes reaccionen
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    /**
     * Cambiar idioma
     */
    async function changeLanguage(lang) {
        if (!I18N_CONFIG.supportedLangs.includes(lang)) {
            console.warn(`[i18n] Language '${lang}' not supported`);
            return;
        }

        if (!translations) {
            await loadTranslations();
        }

        currentLang = lang;
        saveLanguage(lang);
        applyTranslations(lang);

        console.log(`[i18n] ✅ Language changed to: ${lang}`);
    }

    /**
     * Inicializar sistema i18n
     */
    async function init() {
        console.log('[i18n] 🌐 Initializing i18n system...');

        // Cargar traducciones
        await loadTranslations();

        if (!translations) {
            console.error('[i18n] ❌ Failed to load translations, aborting');
            return;
        }

        // Determinar idioma inicial
        const savedLang = getSavedLanguage();
        const browserLang = detectBrowserLanguage();
        const initialLang = savedLang || browserLang;

        console.log('[i18n] Language selection: Saved:', savedLang, '| Browser:', browserLang, '| Initial:', initialLang);

        // Aplicar idioma
        await changeLanguage(initialLang);

        // Configurar botón selector
        setupLanguageSelector();

        console.log('[i18n] ✅ i18n system initialized successfully');
    }

    /**
     * Actualizar estado visual del selector
     */
    function updateLanguageSelector(lang) {
        document.querySelectorAll('.lang-selector-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    /**
     * Configurar event listeners del selector
     */
    function setupLanguageSelector() {
        document.querySelectorAll('.lang-selector-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                console.log('[i18n] User clicked language selector:', lang);
                changeLanguage(lang);
            });
        });
    }

    // ========================================
    // EXPORTAR API GLOBAL
    // ========================================

    window.i18n = {
        init,
        changeLanguage,
        getCurrentLanguage: () => currentLang,
        getTranslation: (key) => getTranslation(key, currentLang)
    };

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
