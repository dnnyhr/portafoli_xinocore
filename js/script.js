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
setTimeout(() => {
    gsap.to(window, {
        duration: 7, // 
        scrollTo: {
            y: "#proyectos",
            offsetY: 70 
        },
        ease: "power2.inOut", 
        overwrite: "auto" 
    });
}, 2000); 
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
link: "https://lacatrina.surge.sh" 
},
"amigas": {
title: "Menu Interactivo Cafeteria Amigas Express",
description: "Un menú llamativo donde explorar los platillos de forma interactiva a través de categorías con fotos e ingredientes.",
video: "/path/to/amigas-video.mp4", 
link: "https://amigas_express.surge.sh" 
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
const video = document.getElementById('hero-video');
const videoLarge = document.getElementById('video-large');
const videoSmall = document.getElementById('video-small');

// Función para cambiar el video dependiendo del tamaño de la pantalla
function updateVideoSource() {
    if (window.innerWidth >= 768) {  // Pantalla grande (por ejemplo, mayor a 768px)
        videoLarge.src = "ruta-del-video-grande.mp4"; // Fuente de video para pantallas grandes
        videoSmall.src = ""; // Desactiva la fuente para pantallas pequeñas
    } else {  // Pantalla pequeña
        videoSmall.src = "ruta-del-video-pequeño.mp4"; // Fuente de video para pantallas pequeñas
        videoLarge.src = ""; // Desactiva la fuente para pantallas grandes
    }
}

// Llamar a la función al cargar la página y cuando se redimensione la ventana
window.addEventListener('load', updateVideoSource);
window.addEventListener('resize', updateVideoSource);

// Pausar el video cuando termine
video.addEventListener('ended', () => {
    video.pause(); // Pausa el video cuando termine
    video.currentTime = video.duration; // Asegura que se quede en el último fotograma
});

