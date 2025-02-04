//js global, uwu
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
window.addEventListener('resize', () => {
    document.body.style.overflowX = 'hidden';
});
window.addEventListener('scroll', closeMenu);
 AOS.init({
    duration: 1000,
    once: true
});
function triggerBgColorPicker() {
document.getElementById('bgColorInput').click();
}
function updateBackgroundColor(color) {
document.documentElement.style.setProperty('--preview-background', color);
const preview = document.getElementById('bgColorPreview');
preview.style.background = color;
document.getElementById('bgColorInput').value = color;
}
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
function updateColor(color) {
    document.documentElement.style.setProperty('--preview-primary', color);
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.style.background.includes(color.replace(/.*gradient.*\(|\)/g, ''))) {
            option.classList.add('active');
        }
    });
}
function applyGradient() {
    const color1 = document.getElementById('gradientColor1').value;
    const color2 = document.getElementById('gradientColor2').value;
    const angle = document.getElementById('gradientAngle').value;
    const customGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    document.documentElement.style.setProperty('--preview-primary', customGradient);
    document.getElementById('angleValue').textContent = `${angle}°`;
    document.getElementById('previewColor1').style.background = color1;
    document.getElementById('previewColor2').style.background = color2;

    addToHistory(customGradient);
}
function addToHistory(gradient) {
    const gradientHistory = document.getElementById('gradientHistory');
    if (gradientHistory.querySelector(`[data-gradient="${gradient}"]`)) return;

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
let currentDish = 0;
const dishes = document.querySelectorAll('.menu-items');
function loadDish(index) {
    currentDish = index;
    const dish = dishes[index];
    const currentImage = dish.querySelector('.item-image img').src;
    document.getElementById('dishName').value = 
        dish.querySelector('.item-title').innerText;
    
    document.getElementById('dishDescription').value = 
        dish.querySelector('.item-description').innerText;
    
    document.getElementById('dishPrice').value = 
        dish.querySelector('.item-price').innerText.replace('$', '');
      
    document.getElementById('dishImagePreview').src = currentImage;
}
function updateDish(type, value) {
    const dish = dishes[currentDish];
    
    switch(type) {
        case 'title':
            dish.querySelector('.item-title').innerText = value;
            break;
        case 'description':
            dish.querySelector('.item-description').innerText = value;
            break;
        case 'price':
            dish.querySelector('.item-price').innerText = `$${value}`;
            break;
    }
}
function updateDishImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const dishImage = dishes[currentDish].querySelector('.item-image img');
        const previewImage = document.getElementById('dishImagePreview');
        
        reader.onload = function(e) {
            dishImage.src = e.target.result;
            previewImage.src = e.target.result;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}
function toggleDishEditor() {
    const editor = document.getElementById('dishEditor');
    const button = document.querySelector('.toggle-button');
    
    editor.classList.toggle('active');
    
    if(editor.classList.contains('active')) {
        button.textContent = '▲ Ocultar';
    } else {
        button.textContent = '▼ Mostrar';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const handleScroll = (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const offset = target.offsetTop - navbarHeight;
            window.scroll({
                top: offset,
                behavior: 'smooth'
            });
            console.log('Scroll ejecutado a:', offset); 
        }
        document.getElementById('navMenu').classList.remove('active');
    };
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleScroll);
    });
    window.toggleMenu = () => {
        document.getElementById('navMenu').classList.toggle('active');
    };
});
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo svg');
    const leftEye = document.getElementById('left-eye');
    const rightEye = document.getElementById('right-eye');
    const mouth = document.getElementById('mouth');
    const logocontainer = document.querySelector('.logo-container');
    const name = document.querySelector('.brand-name');
    
    let isAnimating = false;
    const elements = [leftEye, rightEye, mouth];

    const startAnimation = () => {
        if (isAnimating) return;
        
        isAnimating = true;

        elements.forEach(element => {
            element.style.animation = 'none';
            element.classList.remove('animate-once');
            void element.offsetWidth; 
            element.style.animation = ''; 
        });

        requestAnimationFrame(() => {
            elements.forEach(element => {
                element.classList.add('animate-once');
            });
        });
        setTimeout(() => {
            isAnimating = false;
            elements.forEach(element => {
            });
        }, 9000); 
    };
    startAnimation();
    const clickableElements = [logo, logocontainer, name];
    clickableElements.forEach(element => {
        if (element) { 
            element.addEventListener('click', (e) => {
                e.preventDefault(); 
                if (!isAnimating) {
                    startAnimation();
                }
            });
        }
    });
});

const filterButtons = document.querySelectorAll('.filter-button');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.textContent.trim();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        document.querySelectorAll('.project-card').forEach(project => {
            const category = project.dataset.category;
            if (filter === 'Todos' || category === filter) {
                project.classList.remove('hidden');
                project.style.opacity = '1';
                project.style.transform = 'scale(1)';
            } else {
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';
                setTimeout(() => project.classList.add('hidden'), 300);
            }
        });
    });
});
loadDish(0);