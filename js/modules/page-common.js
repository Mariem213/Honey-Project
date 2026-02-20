(function () {
    function initScrollToTop(options) {
        const config = options || {};
        const buttonId = config.buttonId || 'scrollToTop';
        const threshold = Number.isFinite(config.threshold) ? config.threshold : 300;

        const scrollToTopBtn = document.getElementById(buttonId);
        if (!scrollToTopBtn) return;

        if (scrollToTopBtn.dataset.scrollToTopInit === 'true') return;
        scrollToTopBtn.dataset.scrollToTopInit = 'true';

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > threshold) {
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
    }

    window.honeyPageUtils = window.honeyPageUtils || {};
    window.honeyPageUtils.initScrollToTop = initScrollToTop;
})();
