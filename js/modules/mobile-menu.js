// Mobile Menu Toggle - Enhanced Functionality
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');

// Open mobile menu
if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
        // Initialize icons in mobile menu
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    });
}

// Close mobile menu
if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    });
}

// Close menu when clicking outside (on backdrop)
if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('.sheet-links a, .sheet-actions a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
