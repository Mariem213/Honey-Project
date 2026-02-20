// Language Management System
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = translations;
        this.init();
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLang);
        
        // Add language toggle event listener
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute and dir
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update body class for RTL/LTR
        document.body.classList.remove('rtl', 'ltr');
        document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
        
        // Update language toggle button
        this.updateLangButton();
        
        // Translate all elements
        this.translatePage();
        
        // Handle grid reversals for RTL
        this.handleRTLGrids();
        
        // Handle arrow direction changes
        this.handleArrowDirection();
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Dispatch custom event for language change
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }

    updateLangButton() {
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            const span = langToggle.querySelector('span');
            if (span) {
                span.textContent = this.currentLang === 'en' ? 'EN' : 'AR';
            }
        }
    }

    translatePage() {
        // Translate all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                // Check if element is input placeholder
                if (element.tagName === 'INPUT' && element.type !== 'submit' && element.type !== 'button') {
                    element.placeholder = translation;
                } else if (element.tagName === 'BUTTON' || element.type === 'submit') {
                    element.textContent = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Translate placeholder attributes
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Translate elements with data-i18n-html (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.getTranslation(key);
            if (translation) {
                element.innerHTML = translation;
            }
        });
    }

    getTranslation(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return null;
            }
        }
        
        return typeof value === 'string' ? value : null;
    }

    handleRTLGrids() {
        // Handle tradition-grid and grid-2 (2 columns) - reverse order for RTL
        const gridsToHandle = document.querySelectorAll('.tradition-grid, .grid-2');
        const isRTL = this.currentLang === 'ar';
        
        gridsToHandle.forEach(grid => {
            const children = Array.from(grid.children);
            
            // For 2-column grids, set order based on direction
            if (children.length === 2) {
                const firstChild = children[0];
                const secondChild = children[1];
                const isContentFirst = firstChild.classList.contains('tradition-content');
                
                // Determine desired order:
                // LTR (EN): Content left, Image right → Content should be first
                // RTL (AR): Image left, Content right → Image should be first (Content should NOT be first)
                const shouldBeContentFirst = !isRTL;
                
                // If order doesn't match, reverse it by moving the first child after the second
                if (shouldBeContentFirst !== isContentFirst) {
                    grid.insertBefore(firstChild, secondChild.nextSibling);
                }
            }
        });
    }

    handleArrowDirection() {
        // Get all arrow icons in featured section (view-all and add-btn)
        const isRTL = this.currentLang === 'ar';
        const arrowIcon = isRTL ? 'arrow-left' : 'arrow-right';
        
        // Update arrows in "View all products" link
        const viewAllLinks = document.querySelectorAll('.view-all i[data-lucide]');
        viewAllLinks.forEach(icon => {
            icon.setAttribute('data-lucide', arrowIcon);
        });
        
        // Update arrows in "ADD TO BAG" buttons
        const addButtons = document.querySelectorAll('.add-btn i[data-lucide]');
        addButtons.forEach(icon => {
            icon.setAttribute('data-lucide', arrowIcon);
        });

        // Update arrows in "View Product" links on shop cards
        const viewProductLinks = document.querySelectorAll('.view-product-link i[data-lucide]');
        viewProductLinks.forEach(icon => {
            icon.setAttribute('data-lucide', arrowIcon);
        });
    }
}

// Initialize language manager when DOM is ready
let languageManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        languageManager = new LanguageManager();
    });
} else {
    languageManager = new LanguageManager();
}
