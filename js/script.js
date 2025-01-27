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
// Forzar ajuste del tamaño en dispositivos móviles para evitar desbordamiento
window.addEventListener('resize', () => {
    document.body.style.overflowX = 'hidden'; // Asegura que no haya desbordamiento al cambiar el tamaño
});

// Cerrar menú al hacer scroll
window.addEventListener('scroll', closeMenu);