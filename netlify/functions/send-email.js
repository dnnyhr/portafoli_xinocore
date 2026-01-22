// Netlify Function: Send auto-response + notification emails via Resend API
// No dependencies needed - uses native fetch

// API Keys from environment variables (set in Netlify dashboard)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Allowed notification emails (for security - only send to these)
const ALLOWED_targetNotificationEmailS = [
    'Dannyherrod@xinocore.com',
    'Alejandralanzas@xinocore.com'
];

// Default notification email
const DEFAULT_targetNotificationEmail = 'Dannyherrod@xinocore.com';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://xinocore.com',
    'https://www.xinocore.com',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
];

// Verify reCAPTCHA token with Google
async function verifyRecaptcha(token) {
    if (!token || !RECAPTCHA_SECRET_KEY) {
        console.warn('Missing reCAPTCHA token or secret key');
        return { success: false, score: 0 };
    }

    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        });

        const result = await response.json();
        console.log('reCAPTCHA result:', { success: result.success, score: result.score, action: result.action });

        return {
            success: result.success && result.score >= 0.5, // Score 0.5+ = likely human
            score: result.score || 0,
            action: result.action
        };
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return { success: false, score: 0 };
    }
}

// Email templates
const templates = {
    es: (userName) => ({
        subject: '¡Hemos recibido tu mensaje! - Xinocore',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background:#f8f9ff">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8f9ff 0%,#f0f0ff 100%);padding:30px 15px">
        <tr>
            <td align="center">
                <p style="color:#c4b5fd;font-size:16px;letter-spacing:12px;margin:0 0 18px">✦ ✧ ★ ✧ ✦</p>
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(99,102,241,0.15),0 0 0 1px rgba(99,102,241,0.08)">
                    <tr>
                        <td style="padding:45px 40px;text-align:center;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#f472b6 100%)">
                            <img src="https://xinocoree.netlify.app/assets/images/icons/correo.png" alt="Xinocore" width="70" height="70" style="display:block;margin:0 auto 18px;border-radius:16px;box-shadow:0 8px 25px rgba(0,0,0,0.2);z-index:9999">
                            <h1 style="font-family:'Montserrat',Arial,sans-serif;color:#ffffff;font-size:28px;margin:0 0 6px;font-weight:800">¡Mensaje Recibido!</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase">Xinocore</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;background:#ffffff">
                            <p style="font-family:'Montserrat',Arial,sans-serif;color:#1a1a2e;font-size:20px;margin:0 0 18px;font-weight:700">¡Hola ${userName}! 👋</p>
                            <p style="color:#4a4a68;font-size:16px;line-height:1.8;margin:0 0 28px">
                                Gracias por contactar a <strong style="color:#6366f1">Xinocore</strong>. Hemos recibido tu mensaje correctamente y nuestro equipo lo revisará muy pronto.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
                                <tr>
                                    <td style="background:linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%);border-left:4px solid #8b5cf6;padding:18px 20px;border-radius:0 12px 12px 0">
                                        <p style="color:#1a1a2e;font-size:15px;margin:0;line-height:1.6">
                                            ⏱️ <strong style="color:#7c3aed">Tiempo de respuesta:</strong><br>
                                            <span style="color:#6b7280">Te responderemos en menos de 24 horas hábiles.</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color:#6b7280;font-size:15px;margin:0 0 30px;line-height:1.7">
                                Si tienes alguna pregunta urgente, contáctanos por WhatsApp. ¡Estamos para ayudarte! 🚀
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://wa.me/50587248446" style="display:inline-block;background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);color:#ffffff;text-decoration:none;padding:15px 35px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:14px;box-shadow:0 8px 25px rgba(37,211,102,0.3)">💬 Escríbenos por WhatsApp</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 40px;text-align:center;background:#fafaff;border-top:1px solid #f0f0f5">
                            <p style="color:#d4d4e8;font-size:12px;letter-spacing:8px;margin:0 0 15px">· ✧ ·</p>
                            <p style="color:#8b5cf6;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:700;margin:0 0 5px;letter-spacing:1px">XINOCORE</p>
                            <p style="color:#9ca3af;font-size:12px;margin:0 0 12px">Desarrollo Web Profesional</p>
                            <a href="https://xinocore.com" style="color:#6366f1;text-decoration:none;font-size:12px">xinocore.com</a>
                            <p style="color:#c4c4d4;font-size:10px;margin:15px 0 0">© 2024 Xinocore. Todos los derechos reservados.</p>
                        </td>
                    </tr>
                </table>
                <p style="color:#d4d4e8;font-size:14px;letter-spacing:12px;margin:20px 0 0">✧ · ✦ · ✧</p>
            </td>
        </tr>
    </table>
</body>
</html>`
    }),
    en: (userName) => ({
        subject: "We've received your message! - Xinocore",
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background:#f8f9ff">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8f9ff 0%,#f0f0ff 100%);padding:30px 15px">
        <tr>
            <td align="center">
                <p style="color:#c4b5fd;font-size:16px;letter-spacing:12px;margin:0 0 18px">✦ ✧ ★ ✧ ✦</p>
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(99,102,241,0.15),0 0 0 1px rgba(99,102,241,0.08)">
                    <tr>
                        <td style="padding:45px 40px;text-align:center;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#f472b6 100%)">
                            <img src="https://xinocoree.netlify.app/assets/images/icons/correo.png" alt="Xinocore" width="70" height="70" style="display:block;margin:0 auto 18px;border-radius:16px;box-shadow:0 8px 25px rgba(0,0,0,0.2);z-index:9999">
                            <h1 style="font-family:'Montserrat',Arial,sans-serif;color:#ffffff;font-size:28px;margin:0 0 6px;font-weight:800">Message Received!</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase">Xinocore</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;background:#ffffff">
                            <p style="font-family:'Montserrat',Arial,sans-serif;color:#1a1a2e;font-size:20px;margin:0 0 18px;font-weight:700">Hi ${userName}! 👋</p>
                            <p style="color:#4a4a68;font-size:16px;line-height:1.8;margin:0 0 28px">
                                Thank you for contacting <strong style="color:#6366f1">Xinocore</strong>. We've received your message and our team will review it very soon.
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
                                <tr>
                                    <td style="background:linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%);border-left:4px solid #8b5cf6;padding:18px 20px;border-radius:0 12px 12px 0">
                                        <p style="color:#1a1a2e;font-size:15px;margin:0;line-height:1.6">
                                            ⏱️ <strong style="color:#7c3aed">Response time:</strong><br>
                                            <span style="color:#6b7280">We'll get back to you within 24 business hours.</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            <p style="color:#6b7280;font-size:15px;margin:0 0 30px;line-height:1.7">
                                If you have any urgent questions, feel free to reach out via WhatsApp. We're here to help! 🚀
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://wa.me/50587248446" style="display:inline-block;background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);color:#ffffff;text-decoration:none;padding:15px 35px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:14px;box-shadow:0 8px 25px rgba(37,211,102,0.3)">💬 Chat on WhatsApp</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px 40px;text-align:center;background:#fafaff;border-top:1px solid #f0f0f5">
                            <p style="color:#d4d4e8;font-size:12px;letter-spacing:8px;margin:0 0 15px">· ✧ ·</p>
                            <p style="color:#8b5cf6;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:700;margin:0 0 5px;letter-spacing:1px">XINOCORE</p>
                            <p style="color:#9ca3af;font-size:12px;margin:0 0 12px">Professional Web Development</p>
                            <a href="https://xinocore.com" style="color:#6366f1;text-decoration:none;font-size:12px">xinocore.com</a>
                            <p style="color:#c4c4d4;font-size:10px;margin:15px 0 0">© 2024 Xinocore. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
                <p style="color:#d4d4e8;font-size:14px;letter-spacing:12px;margin:20px 0 0">✧ · ✦ · ✧</p>
            </td>
        </tr>
    </table>
</body>
</html>`
    })
};

// Notification templates for owner (you receive this when someone contacts you)
const notificationTemplates = {
    es: (data) => ({
        subject: `📬 Nuevo mensaje de ${data.name} - Xinocore`,
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background:#f8f9ff">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8f9ff 0%,#f0f0ff 100%);padding:30px 15px">
        <tr>
            <td align="center">
                <p style="color:#c4b5fd;font-size:16px;letter-spacing:12px;margin:0 0 18px">✦ ✧ ★ ✧ ✦</p>
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(99,102,241,0.15),0 0 0 1px rgba(99,102,241,0.08)">
                    <tr>
                        <td style="padding:45px 40px;text-align:center;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#f472b6 100%)">
                            <img src="https://xinocoree.netlify.app/assets/images/icons/correo.png" alt="Xinocore" width="70" height="70" style="display:block;margin:0 auto 18px;border-radius:16px;box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                            <h1 style="font-family:'Montserrat',Arial,sans-serif;color:#ffffff;font-size:28px;margin:0 0 6px;font-weight:800">📬 Nuevo Mensaje</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase">Formulario de Contacto</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;background:#ffffff">
                            <p style="font-family:'Montserrat',Arial,sans-serif;color:#1a1a2e;font-size:20px;margin:0 0 25px;font-weight:700">¡Tienes un nuevo mensaje! 🎉</p>

                            <!-- Datos del contacto -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
                                <tr>
                                    <td style="background:linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%);border-radius:12px;padding:20px;border:1px solid #e9d5ff">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">👤 Nombre</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0;font-weight:600">${data.name}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">📧 Email</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0"><a href="mailto:${data.email}" style="color:#6366f1;text-decoration:none">${data.email}</a></p>
                                                </td>
                                            </tr>
                                            ${data.phone ? `<tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">📱 Teléfono</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0"><a href="tel:${data.phone}" style="color:#6366f1;text-decoration:none">${data.phone}</a></p>
                                                </td>
                                            </tr>` : ''}
                                            ${data.service ? `<tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">🛠️ Servicio</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0">${data.service}</p>
                                                </td>
                                            </tr>` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Mensaje -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
                                <tr>
                                    <td style="background:#f8fafc;border-left:4px solid #6366f1;padding:20px;border-radius:0 12px 12px 0">
                                        <span style="color:#6366f1;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:10px">💬 Mensaje</span>
                                        <p style="color:#374151;font-size:15px;margin:0;line-height:1.8;white-space:pre-wrap">${data.message}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Botones de acción -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:5px">
                                        <a href="mailto:${data.email}?subject=Re: Tu mensaje en Xinocore" style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:14px;box-shadow:0 8px 25px rgba(99,102,241,0.3)">✉️ Responder por Email</a>
                                    </td>
                                </tr>
                                ${data.phone ? `<tr>
                                    <td align="center" style="padding:10px 5px 5px">
                                        <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="display:inline-block;background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);color:#ffffff;text-decoration:none;padding:12px 25px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:13px;box-shadow:0 8px 25px rgba(37,211,102,0.3)">💬 WhatsApp</a>
                                    </td>
                                </tr>` : ''}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 40px;text-align:center;background:#fafaff;border-top:1px solid #f0f0f5">
                            <p style="color:#9ca3af;font-size:12px;margin:0">Recibido el ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                    </tr>
                </table>
                <p style="color:#d4d4e8;font-size:14px;letter-spacing:12px;margin:20px 0 0">✧ · ✦ · ✧</p>
            </td>
        </tr>
    </table>
</body>
</html>`
    }),
    en: (data) => ({
        subject: `📬 New message from ${data.name} - Xinocore`,
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Nunito',Arial,sans-serif;background:#f8f9ff">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#f8f9ff 0%,#f0f0ff 100%);padding:30px 15px">
        <tr>
            <td align="center">
                <p style="color:#c4b5fd;font-size:16px;letter-spacing:12px;margin:0 0 18px">✦ ✧ ★ ✧ ✦</p>
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(99,102,241,0.15),0 0 0 1px rgba(99,102,241,0.08)">
                    <tr>
                        <td style="padding:45px 40px;text-align:center;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#f472b6 100%)">
                            <img src="https://xinocoree.netlify.app/assets/images/icons/correo.png" alt="Xinocore" width="70" height="70" style="display:block;margin:0 auto 18px;border-radius:16px;box-shadow:0 8px 25px rgba(0,0,0,0.2)">
                            <h1 style="font-family:'Montserrat',Arial,sans-serif;color:#ffffff;font-size:28px;margin:0 0 6px;font-weight:800">📬 New Message</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;letter-spacing:2px;text-transform:uppercase">Contact Form</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px;background:#ffffff">
                            <p style="font-family:'Montserrat',Arial,sans-serif;color:#1a1a2e;font-size:20px;margin:0 0 25px;font-weight:700">You have a new message! 🎉</p>

                            <!-- Contact data -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
                                <tr>
                                    <td style="background:linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%);border-radius:12px;padding:20px;border:1px solid #e9d5ff">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">👤 Name</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0;font-weight:600">${data.name}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">📧 Email</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0"><a href="mailto:${data.email}" style="color:#6366f1;text-decoration:none">${data.email}</a></p>
                                                </td>
                                            </tr>
                                            ${data.phone ? `<tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">📱 Phone</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0"><a href="tel:${data.phone}" style="color:#6366f1;text-decoration:none">${data.phone}</a></p>
                                                </td>
                                            </tr>` : ''}
                                            ${data.service ? `<tr>
                                                <td style="padding:12px 0;border-bottom:1px solid #e9d5ff">
                                                    <span style="color:#7c3aed;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px">🛠️ Service</span>
                                                    <p style="color:#1a1a2e;font-size:16px;margin:5px 0 0">${data.service}</p>
                                                </td>
                                            </tr>` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 25px">
                                <tr>
                                    <td style="background:#f8fafc;border-left:4px solid #6366f1;padding:20px;border-radius:0 12px 12px 0">
                                        <span style="color:#6366f1;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:10px">💬 Message</span>
                                        <p style="color:#374151;font-size:15px;margin:0;line-height:1.8;white-space:pre-wrap">${data.message}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:5px">
                                        <a href="mailto:${data.email}?subject=Re: Your message to Xinocore" style="display:inline-block;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:14px;box-shadow:0 8px 25px rgba(99,102,241,0.3)">✉️ Reply by Email</a>
                                    </td>
                                </tr>
                                ${data.phone ? `<tr>
                                    <td align="center" style="padding:10px 5px 5px">
                                        <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="display:inline-block;background:linear-gradient(135deg,#25d366 0%,#128c7e 100%);color:#ffffff;text-decoration:none;padding:12px 25px;border-radius:50px;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:13px;box-shadow:0 8px 25px rgba(37,211,102,0.3)">💬 WhatsApp</a>
                                    </td>
                                </tr>` : ''}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 40px;text-align:center;background:#fafaff;border-top:1px solid #f0f0f5">
                            <p style="color:#9ca3af;font-size:12px;margin:0">Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                    </tr>
                </table>
                <p style="color:#d4d4e8;font-size:14px;letter-spacing:12px;margin:20px 0 0">✧ · ✦ · ✧</p>
            </td>
        </tr>
    </table>
</body>
</html>`
    })
};

exports.handler = async (event, context) => {
    // Get origin from request
    const origin = event.headers.origin || event.headers.Origin || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // CORS headers - only allow specific origins
    const headers = {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, email, phone, service, message, language = 'es', recaptchaToken, notificationEmail } = data;

        // Validate and get notification email (security check)
        const targetNotificationEmail = ALLOWED_targetNotificationEmailS.includes(notificationEmail)
            ? notificationEmail
            : DEFAULT_targetNotificationEmail;

        // Verify reCAPTCHA first
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);

        if (!recaptchaResult.success) {
            console.warn('reCAPTCHA failed - possible bot. Score:', recaptchaResult.score);
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'reCAPTCHA verification failed', score: recaptchaResult.score })
            };
        }

        console.log('reCAPTCHA passed. Score:', recaptchaResult.score);

        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Name, email and message are required' })
            };
        }

        // Prepare form data for notification
        const formData = { name, email, phone, service, message };

        // Get templates based on language
        const autoResponseTemplate = templates[language] || templates.es;
        const notificationTemplate = notificationTemplates[language] || notificationTemplates.es;

        const autoResponseContent = autoResponseTemplate(name);
        const notificationContent = notificationTemplate(formData);

        // Send both emails in parallel
        const [autoResponseResult, notificationResult] = await Promise.all([
            // 1. Auto-response to customer
            fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Xinocore <noreply@xinocore.com>',
                    to: [email],
                    subject: autoResponseContent.subject,
                    html: autoResponseContent.html
                })
            }),
            // 2. Notification to owner (you)
            fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Xinocore Forms <noreply@xinocore.com>',
                    to: [targetNotificationEmail],
                    reply_to: email,
                    subject: notificationContent.subject,
                    html: notificationContent.html
                })
            })
        ]);

        const autoResponseData = await autoResponseResult.json();
        const notificationData = await notificationResult.json();

        // Check results
        if (!autoResponseResult.ok) {
            console.error('Auto-response error:', autoResponseData);
        }
        if (!notificationResult.ok) {
            console.error('Notification error:', notificationData);
        }

        // Return success if at least auto-response worked
        if (autoResponseResult.ok) {
            console.log('Emails sent - Auto-response:', autoResponseData.id, '| Notification:', notificationData.id || 'failed');
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    autoResponseId: autoResponseData.id,
                    notificationId: notificationData.id || null
                })
            };
        }

        return {
            statusCode: autoResponseResult.status,
            headers,
            body: JSON.stringify({ error: autoResponseData.message || 'Failed to send email' })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
