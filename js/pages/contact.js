lucide.createIcons();

window.honeyPageUtils?.initScrollToTop();


// Form handling
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We will get back to you soon.");
    e.target.reset();
});
