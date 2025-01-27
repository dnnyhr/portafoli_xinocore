AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

function closeMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.remove('active');
}

// Cerrar menú al hacer scroll
window.addEventListener('scroll', closeMenu);