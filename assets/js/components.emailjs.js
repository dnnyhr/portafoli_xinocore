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

    // Send auto-response email via Netlify Function
    async function sendAutoResponse(formData) {
        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    language: getCurrentLanguage()
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Auto-response email sent:', result.id);
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

            // Send auto-response email
            const emailResult = await sendAutoResponse(formData);

            if (emailResult.success) {
                console.log('✅ Auto-response sent, now submitting to FormSubmit...');
            } else {
                console.warn('⚠️ Auto-response failed:', emailResult.error);
                // Continue anyway - don't block the form submission
            }

            // Submit to FormSubmit
            contactForm.submit();
        });

        console.log('✅ Email auto-response system ready');
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
