// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // 1. Data Object - Using available images
    const products = [
        {
            id: "1",
            names: { en: "Wildflower Reserve", ar: "عسل الأزهار البرية الفاخر" },
            price: 24.00,
            category: "SIGNATURE",
            image: "assets/shop1Honey.png"
        },
        {
            id: "2",
            names: { en: "Royal Acacia", ar: "عسل الأكاسيا الملكي" },
            price: 32.00,
            category: "PREMIUM",
            image: "assets/shop2Honey.png"
        },
        {
            id: "3",
            names: { en: "Raw Honeycomb", ar: "قرص العسل الخام" },
            price: 18.00,
            category: "RAW",
            image: "assets/shop3Honey.png"
        },
        {
            id: "4",
            names: { en: "Lavender Infusion", ar: "عسل اللافندر المنقوع" },
            price: 28.00,
            category: "INFUSED",
            image: "assets/shop1Honey.png"
        },
        {
            id: "5",
            names: { en: "Buckwheat Bold", ar: "عسل الحنطة السوداء القوي" },
            price: 26.00,
            category: "SIGNATURE",
            image: "assets/shop2Honey.png"
        },
        {
            id: "6",
            names: { en: "Manuka Gold", ar: "عسل المانوكا الذهبي" },
            price: 55.00,
            category: "PREMIUM",
            image: "assets/shop3Honey.png"
        },
        {
            id: "7",
            names: { en: "Orange Blossom", ar: "عسل زهر البرتقال" },
            price: 22.00,
            category: "SIGNATURE",
            image: "assets/shop1Honey.png"
        },
        {
            id: "8",
            names: { en: "Truffle Honey", ar: "عسل الكمأة" },
            price: 45.00,
            category: "GOURMET",
            image: "assets/shop2Honey.png"
        }
    ];
    const quantityByProductId = {};

    // 2. DOM Elements
    const grid = document.getElementById('product-grid');
    const searchInput = document.getElementById('search-bar');
    const countLabel = document.getElementById('result-count');
    const emptyState = document.getElementById('empty-state');
    const clearBtn = document.getElementById('clear-search');

    // Custom Dropdown Elements
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownText = document.getElementById('dropdown-text');
    const dropdownOverlay = document.getElementById('dropdown-overlay');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    let currentSortValue = 'Featured';

    // Check if required elements exist
    if (!grid) {
        console.error('Product grid not found!');
        return;
    }

    function getCurrentLang() {
        return localStorage.getItem('language') || 'en';
    }

    function getCurrentLocale() {
        return getCurrentLang() === 'ar' ? 'ar' : 'en';
    }

    function getProductName(product) {
        const lang = getCurrentLang();
        return product.names[lang] || product.names.en;
    }

    function getLocalizedCategory(product) {
        const currentLang = getCurrentLang();
        const categoryMap = {
            SIGNATURE: 'signature',
            PREMIUM: 'premium',
            RAW: 'raw',
            INFUSED: 'infused',
            GOURMET: 'gourmet'
        };
        const key = categoryMap[product.category];
        return translations?.[currentLang]?.featured?.category?.[key] || product.category;
    }

    function applySearchFilter(items) {
        const term = (searchInput?.value || '').trim().toLocaleLowerCase(getCurrentLocale());
        if (!term) return items;
        return items.filter(product => {
            const name = getProductName(product).toLocaleLowerCase(getCurrentLocale());
            const category = getLocalizedCategory(product).toLocaleLowerCase(getCurrentLocale());
            return name.includes(term) || category.includes(term);
        });
    }

    // 3. Render Function
    function renderProducts(items) {
        if (!grid) {
            console.error('Grid element not available');
            return;
        }
        grid.innerHTML = '';
        if (countLabel) {
            countLabel.innerText = items.length;
        }

        if (items.length === 0) {
            if (emptyState) {
                emptyState.classList.add('active');
            }
        } else {
            if (emptyState) {
                emptyState.classList.remove('active');
            }
            items.forEach(product => {
                const productName = getProductName(product);
                const productQuantity = quantityByProductId[product.id] || 1;
                // Get translated category key
                const categoryMap = {
                    'SIGNATURE': 'featured.category.signature',
                    'PREMIUM': 'featured.category.premium',
                    'RAW': 'featured.category.raw',
                    'INFUSED': 'featured.category.infused',
                    'GOURMET': 'featured.category.gourmet'
                };
                const categoryKey = categoryMap[product.category] || product.category;

                const card = `
                            <div class="offering-product-card" data-product-id="${product.id}">
                                <div class="offering-card-img-wrapper">
                                    <img src="${product.image}" alt="${productName}" loading="lazy">
                                    <div class="offering-image-overlay">
                                        <a href="/product.html" class="view-product-link">
                                            <span data-i18n="featured.viewProduct">View Product</span>
                                        </a>
                                    </div>
                                </div>
                                <div class="offering-card-info">
                                    <div class="offering-card-category-row">
                                        <span class="offering-card-category" data-i18n="${categoryKey}">${product.category}</span>
                                        <span class="offering-card-price">$${product.price.toFixed(2)}</span>
                                    </div>
                                    <h3 class="offering-card-name">${productName}</h3>
                                    <div class="offering-card-footer">
                                        <div class="quantity-stepper" data-product-id="${product.id}">
                                            <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
                                            <span class="qty-value">${productQuantity}</span>
                                            <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                                        </div>
                                        <button class="add-to-bag-btn add-btn">
                                            <span data-i18n="featured.addToBag">ADD TO BAG</span> <i data-lucide="arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                grid.innerHTML += card;
            });
            lucide.createIcons(); // Re-render icons for new elements

            // Translate the newly created cards
            if (typeof languageManager !== 'undefined' && languageManager) {
                languageManager.translatePage();
            }

            // Re-attach event listeners for add to bag buttons
            attachAddToBagListeners();
            attachQuantityListeners();
        }
    }

    // 4. Filter Logic
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applySorting(currentSortValue);
        });
    }

    // 5. Custom Dropdown Logic
    function toggleDropdown() {
        dropdownButton.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
        dropdownOverlay.classList.toggle('active');
    }

    function closeDropdown() {
        dropdownButton.classList.remove('active');
        dropdownMenu.classList.remove('active');
        dropdownOverlay.classList.remove('active');
    }

    function selectSortOption(value) {
        currentSortValue = value;

        // Get translated text for the selected option
        const currentLang = localStorage.getItem('language') || 'en';
        let translatedText = value;
        let i18nKey = '';

        if (translations && translations[currentLang] && translations[currentLang].offering) {
            const offering = translations[currentLang].offering;
            if (value === 'Featured') {
                translatedText = offering.featured || value;
                i18nKey = 'offering.featured';
            } else if (value === 'Price: Low to High') {
                translatedText = offering.priceLow || value;
                i18nKey = 'offering.priceLow';
            } else if (value === 'Price: High to Low') {
                translatedText = offering.priceHigh || value;
                i18nKey = 'offering.priceHigh';
            } else if (value === 'Newest') {
                translatedText = offering.newest || value;
                i18nKey = 'offering.newest';
            }
        }

        dropdownText.textContent = translatedText;
        if (i18nKey) {
            dropdownText.setAttribute('data-i18n', i18nKey);
        }

        // Update selected state
        dropdownItems.forEach(item => {
            if (item.dataset.value === value) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });

        // Apply sorting
        applySorting(value);
        closeDropdown();
    }

    function applySorting(sortValue) {
        let sorted = [...products];

        if (sortValue === 'Price: Low to High') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'Price: High to Low') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'Newest') {
            sorted.reverse();
        } else {
            sorted.sort((a, b) =>
                getProductName(a).localeCompare(getProductName(b), getCurrentLocale(), { sensitivity: 'base' })
            );
        }

        // Apply current search filter
        const filtered = applySearchFilter(sorted);
        renderProducts(filtered);
    }

    // Dropdown event listeners
    if (dropdownButton) {
        dropdownButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });
    }

    if (dropdownItems.length > 0) {
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                selectSortOption(item.dataset.value);
            });
        });
    }

    if (dropdownOverlay) {
        dropdownOverlay.addEventListener('click', () => {
            closeDropdown();
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            closeDropdown();
        }
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
            }
            selectSortOption('Featured');
        });
    }

    // 6. Add to Bag functionality
    function attachQuantityListeners() {
        const steppers = document.querySelectorAll('.offering-product-card .quantity-stepper');
        steppers.forEach(stepper => {
            const productId = stepper.getAttribute('data-product-id');
            const minusBtn = stepper.querySelector('.qty-minus');
            const plusBtn = stepper.querySelector('.qty-plus');
            const qtyValue = stepper.querySelector('.qty-value');
            if (!productId || !minusBtn || !plusBtn || !qtyValue) return;

            minusBtn.addEventListener('click', () => {
                const current = Number(qtyValue.textContent) || 1;
                const next = Math.max(1, current - 1);
                qtyValue.textContent = String(next);
                quantityByProductId[productId] = next;
            });

            plusBtn.addEventListener('click', () => {
                const current = Number(qtyValue.textContent) || 1;
                const next = current + 1;
                qtyValue.textContent = String(next);
                quantityByProductId[productId] = next;
            });
        });
    }

    function attachAddToBagListeners() {
        const addToBagButtons = document.querySelectorAll('.add-to-bag-btn');
        addToBagButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const productCard = this.closest('.offering-product-card');
                const productName = productCard?.querySelector('.offering-card-name')?.textContent || 'Product';
                const productPrice = productCard?.querySelector('.offering-card-price')?.textContent || '';
                const quantityText = productCard?.querySelector('.quantity-stepper .qty-value')?.textContent || '1';
                const quantity = Number(quantityText) || 1;

                // Add visual feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i data-lucide="check"></i> Added!';
                this.style.color = '#DA830A';
                lucide.createIcons();

                // Optional: Add to cart logic here
                console.log(`Added ${quantity} x ${productName} (${productPrice}) to bag`);

                // Reset after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.color = '';
                    lucide.createIcons();
                }, 2000);
            });
        });
    }

    // Initial Render
    console.log('Initializing products...', products.length, 'products found');
    if (grid) {
        console.log('Product grid found, rendering products...');
        applySorting(currentSortValue);
    } else {
        console.error('Product grid element not found!');
    }

    lucide.createIcons();
    console.log('Products initialized successfully!');

    // Listen for language changes and re-translate cards
    window.addEventListener('languageChanged', () => {
        // Re-translate dropdown items
        const currentLang = localStorage.getItem('language') || 'en';
        if (translations && translations[currentLang] && translations[currentLang].offering) {
            const offering = translations[currentLang].offering;
            dropdownItems.forEach(item => {
                const value = item.dataset.value;
                let translatedText = value;
                if (value === 'Featured') translatedText = offering.featured || value;
                else if (value === 'Price: Low to High') translatedText = offering.priceLow || value;
                else if (value === 'Price: High to Low') translatedText = offering.priceHigh || value;
                else if (value === 'Newest') translatedText = offering.newest || value;
                item.textContent = translatedText;
            });
            // Update current dropdown text
            if (currentSortValue) {
                selectSortOption(currentSortValue);
            }
        }
    });

    window.honeyPageUtils?.initScrollToTop();

    // Initialize icons
    lucide.createIcons();
}); // End DOMContentLoaded
