gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
gsap.to('.hero h1', {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.5
});
gsap.to('.hero p', {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.8
});
gsap.to('.nav', {
    y: 0,
    duration: 1,
    delay: 1
});
// Bloquear y desbloquear scroll durante la animación automática
const blockScroll = () => {
    document.body.classList.add('no-scroll'); // Bloquea el scroll
};

const unblockScroll = () => {
    document.body.classList.remove('no-scroll'); // Restaura el scroll
};

// Ejecutar scroll automático
setTimeout(() => {
    blockScroll(); // Bloquea el scroll antes de iniciar la animación

    gsap.to(window, {
        duration: 2, // Duración del scroll automático
        scrollTo: {
            y: "#proyectos", // ID de la sección de destino
            offsetY: 70 // Offset si es necesario
        },
        ease: "power2.inOut", // Animación suave
        overwrite: "auto",
        onComplete: unblockScroll // Desbloquear el scroll cuando la animación termine
    });
}, 2000); // Inicia el scroll automático después de 2 segundos

gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.2
    });
});
gsap.to('.contact-content', {
    scrollTrigger: {
        trigger: '.contact-content',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1
});
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active'); // Activa/desactiva el menú
    hamburger.classList.toggle('active'); // Activa/desactiva animación del botón
});
// Datos de los proyectos
const projectDetails = {
"lacatrina": {
title: "Menú interactivo La Catrina Taqueria",
description: "Un menú llamativo donde explorar los platillos de forma interactiva pudiendo ver fotos y sus ingredientes.",
video: "./assets/lacatrina.mp4",
link: "https://lacatrina.xinocore.com" 
},
"amigas": {
title: "Menu Interactivo Cafeteria Amigas Express (sin terminar)",
description: "Un menú llamativo donde explorar los platillos de forma interactiva a través de categorías con fotos e ingredientes.",
video: "/path/to/amigas-video.mp4", 
link: "https://amigasexpress.xinocore.com" 
}
};
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalVideoSource = document.getElementById('modal-video-source');
const projectLink = document.getElementById('project-link');
const closeButton = document.querySelector('.close-button');
document.querySelectorAll('.project-card').forEach(card => {
card.addEventListener('click', (e) => {
e.preventDefault();
const projectId = card.getAttribute('data-id');
const details = projectDetails[projectId];
if (details) {
    modalTitle.textContent = details.title;
    modalDescription.textContent = details.description;
    modalVideoSource.src = details.video;
    projectLink.href = details.link;
    modal.style.display = 'flex';
    const videoElement = document.querySelector("#modal-video video");
    videoElement.load();
} else {
    console.error(`Detalles no encontrados para ID: ${projectId}`);
}
});
});
closeButton.addEventListener('click', () => {
modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
if (e.target === modal) {
modal.style.display = 'none';
}
});
// Detectar si es un dispositivo iPhone o iOS
// Función para detectar iOS
// Función para detectar Android
// Función para detectar Android
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

// Configuración del fondo (imagen por defecto, video en Android)
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('hero-video');
    const fallbackImage = document.getElementById('fallback-image');

    if (isAndroid()) {
        console.log('Dispositivo Android detectado. Mostrando video.');
        fallbackImage.style.display = 'none'; // Oculta la imagen de fondo
        video.style.display = 'block'; // Muestra el video
        video.play().catch((error) => {
            console.warn('El video no se puede reproducir automáticamente:', error);
            video.style.display = 'none'; // Oculta el video si falla
            fallbackImage.style.display = 'block'; // Vuelve a mostrar la imagen
        });
    } else {
        console.log('No se detectó Android. Mostrando imagen de fondo por defecto.');
        fallbackImage.style.display = 'block'; // Asegura que la imagen se muestre
    }
});


// Obtener el video de la sección 
const video = document.getElementById('hero-video');

// Reproducir el video automáticamente
video.play();

// Pausar el video cuando termine
video.addEventListener('ended', () => {
    video.pause(); // Pausa el video cuando termine
    video.currentTime = video.duration; // Asegura que se quede en el último fotograma
});

