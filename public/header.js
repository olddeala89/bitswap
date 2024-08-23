const width = window.innerWidth;
var isMobile = false;
var isOpen = false;
let header = document.getElementById('header');
let openmenu = document.getElementById('openmenu');
let nvlinks = document.querySelectorAll('.nav_link');

if (width <= 634) {
    isMobile = true;
    nvlinks.forEach(element => {
        element.classList.add('hidden');
    });
}
else {
    openmenu.classList.add('hidden');
}

if (isMobile) {
    openmenu.addEventListener('click', () => {
        if (isOpen) {
            close();
        }
        else {
            extand();
        }
    });
}

function extand() {
    header.style.height = '238px';
    nvlinks.forEach(element => {
        element.classList.remove('hidden');
    });
    isOpen = true;
}

function close() {
    header.style.height = '100px';
    nvlinks.forEach(element => {
        element.classList.add('hidden');
    });
    isOpen = false;
}