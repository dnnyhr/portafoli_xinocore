// Netlify Function: Send auto-response email via Resend API
// No dependencies needed - uses native fetch

const RESEND_API_KEY = 're_QUS8fwjd_LbuQqeAQtAcAprPum1MN8MFS';

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

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
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
        const { name, email, language = 'es' } = data;

        // Validate required fields
        if (!name || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Name and email are required' })
            };
        }

        // Get template based on language
        const template = templates[language] || templates.es;
        const emailContent = template(name);

        // Send email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Xinocore <noreply@xinocore.com>',
                to: [email],
                subject: emailContent.subject,
                html: emailContent.html
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend API error:', result);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: result.message || 'Failed to send email' })
            };
        }

        console.log('Email sent successfully:', result.id);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: result.id })
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
