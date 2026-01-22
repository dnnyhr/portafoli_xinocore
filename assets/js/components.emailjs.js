// ========================================
// XINOCORE - Auto-Response Email System
// Uses Netlify Functions + Resend API
// ========================================

(function() {
    'use strict';

    // Get current language
    function getCurrentLanguage() {
        if (window.i18n && typeof window.i18n.getCurrentLanguage === 'function') {
            return window.i18n.getCurrentLanguage();
        }
        return localStorage.getItem('xinocore-language') || 'es';
    }

    // Get notification email based on detected region
    function getNotificationEmail() {
        // Try to get from ContactRegion system
        if (window.ContactRegion && typeof window.ContactRegion.getContactInfo === 'function') {
            const region = window.ContactRegion.getRegion();
            const contactInfo = window.ContactRegion.getContactInfo(region);
            if (contactInfo && contactInfo.email) {
                return contactInfo.email;
            }
        }
        // Fallback to XinocoreConfig
        if (typeof XinocoreConfig !== 'undefined' && XinocoreConfig.contact.regions) {
            const region = window.detectedRegion || XinocoreConfig.contact.regions.default;
            const regionConfig = XinocoreConfig.contact.regions[region];
            if (regionConfig && regionConfig.email) {
                return regionConfig.email;
            }
        }
        // Default fallback
        return 'Dannyherrod@xinocore.com';
    }

    // reCAPTCHA v3 Site Key
    const RECAPTCHA_SITE_KEY = '6LdlSkwsAAAAANXLgAdrK6CNaqRMH5POVC05WkOo';

    // Get reCAPTCHA token
    async function getRecaptchaToken() {
        return new Promise((resolve, reject) => {
            if (typeof grecaptcha === 'undefined') {
                console.warn('reCAPTCHA not loaded');
                resolve(null);
                return;
            }
            grecaptcha.ready(() => {
                grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact_form' })
                    .then(token => resolve(token))
                    .catch(err => {
                        console.error('reCAPTCHA error:', err);
                        resolve(null);
                    });
            });
        });
    }

    // Send contact form via Netlify Function (auto-response + notification)
    async function sendContactForm(formData, recaptchaToken) {
        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    service: formData.service,
                    message: formData.message,
                    language: getCurrentLanguage(),
                    recaptchaToken: recaptchaToken,
                    notificationEmail: getNotificationEmail()
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Contact form sent:', result.autoResponseId);
                return { success: true, result };
            } else {
                console.error('❌ Failed to send email:', result.error);
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            return { success: false, error: error.message };
        }
    }

    // Setup form handler
    function setupFormHandler() {
        const contactForm = document.getElementById('contact-form');

        if (!contactForm) {
            console.log('ℹ️ Contact form not found on this page');
            return;
        }

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const formMessage = document.getElementById('form-message');

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name')?.value || '',
                email: contactForm.querySelector('#email')?.value || '',
                phone: contactForm.querySelector('#phone')?.value || '',
                service: contactForm.querySelector('#service')?.value || '',
                message: contactForm.querySelector('#message')?.value || ''
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                showFormMessage(formMessage, getCurrentLanguage() === 'en'
                    ? 'Please fill in all required fields.'
                    : 'Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>' + (getCurrentLanguage() === 'en' ? 'Sending...' : 'Enviando...') + '</span>';
            }

            // Get reCAPTCHA token
            const recaptchaToken = await getRecaptchaToken();

            if (!recaptchaToken) {
                console.warn('⚠️ Could not get reCAPTCHA token, continuing anyway...');
            }

            // Send contact form (auto-response to client + notification to owner)
            const emailResult = await sendContactForm(formData, recaptchaToken);

            if (emailResult.success) {
                console.log('✅ Form submitted successfully!');
                // Show success message
                showFormMessage(formMessage, getCurrentLanguage() === 'en'
                    ? 'Message sent successfully! We\'ll get back to you soon.'
                    : '¡Mensaje enviado con éxito! Te responderemos pronto.', 'success');
                // Reset form
                contactForm.reset();
                // Reset button
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>' + (getCurrentLanguage() === 'en' ? 'Send Message' : 'Enviar Mensaje') + '</span>';
                }
            } else if (emailResult.error === 'reCAPTCHA verification failed') {
                // Bot detected - don't submit
                showFormMessage(formMessage, getCurrentLanguage() === 'en'
                    ? 'Verification failed. Please try again.'
                    : 'Verificación fallida. Por favor intenta de nuevo.', 'error');
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>' + (getCurrentLanguage() === 'en' ? 'Send Message' : 'Enviar Mensaje') + '</span>';
                }
            } else {
                // Other error
                console.warn('⚠️ Form submission failed:', emailResult.error);
                showFormMessage(formMessage, getCurrentLanguage() === 'en'
                    ? 'Something went wrong. Please try again.'
                    : 'Algo salió mal. Por favor intenta de nuevo.', 'error');
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>' + (getCurrentLanguage() === 'en' ? 'Send Message' : 'Enviar Mensaje') + '</span>';
                }
            }
        });

        console.log('✅ Contact form system ready (no FormSubmit)');
    }

    // Show form message helper
    function showFormMessage(element, message, type) {
        if (!element) return;

        const iconSvg = type === 'success'
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

        element.innerHTML = iconSvg + '<span>' + message + '</span>';
        element.className = 'form-message ' + type;
        element.style.display = 'flex';

        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupFormHandler);
    } else {
        setupFormHandler();
    }

    // Expose for debugging
    window.XinocoreEmail = {
        sendAutoResponse,
        getCurrentLanguage
    };

})();
