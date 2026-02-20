lucide.createIcons();

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form handling
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    e.target.reset();
});

