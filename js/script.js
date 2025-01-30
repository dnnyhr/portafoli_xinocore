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

 // Initialize AOS (Animate On Scroll)
 AOS.init({
    duration: 1000,
    once: true
});
let bgColorHistory = [];

function triggerBgColorPicker() {
document.getElementById('bgColorInput').click();
}

function updateBackgroundColor(color) {
// Update CSS variable
document.documentElement.style.setProperty('--preview-background', color);

// Update preview display
const preview = document.getElementById('bgColorPreview');
preview.style.background = color;

// Update color input value
document.getElementById('bgColorInput').value = color;

}


// Function to preview the uploaded logo
function previewLogo(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('logoPreview').src = e.target.result;
            document.getElementById('previewLogo').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// Function to toggle between solid and gradient color options
function toggleColorType(type) {
    const solidColors = document.getElementById('solidColors');
    const gradientColors = document.getElementById('gradientColors');
    const gradientCustomization = document.getElementById('gradientCustomization');
    const gradientHistorySection = document.getElementById('gradientHistorySection');

    if (type === 'solid') {
        solidColors.style.display = 'flex';
        gradientColors.style.display = 'none';
        gradientCustomization.style.display = 'none';
        gradientHistorySection.style.display = 'none';
    } else if (type === 'gradient') {
        solidColors.style.display = 'none';
        gradientColors.style.display = 'flex';
        gradientCustomization.style.display = 'block';
        gradientHistorySection.style.display = 'block';
    }
}

// Function to update the color preview
function updateColor(color) {
    document.documentElement.style.setProperty('--preview-primary', color);

    // Update the active state of color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.style.background.includes(color.replace(/.*gradient.*\(|\)/g, ''))) {
            option.classList.add('active');
        }
    });
}

// Function to apply the custom gradient
function applyGradient() {
    const color1 = document.getElementById('gradientColor1').value;
    const color2 = document.getElementById('gradientColor2').value;
    const angle = document.getElementById('gradientAngle').value;

    const customGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    document.documentElement.style.setProperty('--preview-primary', customGradient);

    // Update the angle value display
    document.getElementById('angleValue').textContent = `${angle}°`;

    // Update the color previews
    document.getElementById('previewColor1').style.background = color1;
    document.getElementById('previewColor2').style.background = color2;

    // Add the gradient to the history
    addToHistory(customGradient);
}

// Function to add a gradient to the history
function addToHistory(gradient) {
    const gradientHistory = document.getElementById('gradientHistory');
    if (gradientHistory.querySelector(`[data-gradient="${gradient}"]`)) return; // Avoid duplicates

    const gradientButton = document.createElement('div');
    gradientButton.className = 'color-option';
    gradientButton.style.background = gradient;
    gradientButton.setAttribute('data-gradient', gradient);
    gradientButton.title = gradient;
    gradientButton.onclick = () => {
        document.documentElement.style.setProperty('--preview-primary', gradient);
    };

    gradientHistory.appendChild(gradientButton);
}
