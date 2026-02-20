// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('nav-initial');
    } else {
        navbar.classList.add('nav-initial');
        navbar.classList.remove('nav-scrolled');
    }
});
