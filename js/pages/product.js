function getProductText(key, fallback) {
    const lang = localStorage.getItem('language') || 'en';
    return translations?.[lang]?.product?.[key] || fallback;
}

const mainImage = document.getElementById('main-product-image');
const thumbs = document.querySelectorAll('.thumb');
thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
        thumbs.forEach((btn) => btn.classList.remove('active'));
        thumb.classList.add('active');
        mainImage.src = thumb.getAttribute('data-image');
    });
});

const qtyRoot = document.querySelector('.quantity-stepper');
if (qtyRoot) {
    const minus = qtyRoot.querySelector('.qty-minus');
    const plus = qtyRoot.querySelector('.qty-plus');
    const value = qtyRoot.querySelector('.qty-value');
    minus.addEventListener('click', () => {
        const next = Math.max(1, (Number(value.textContent) || 1) - 1);
        value.textContent = String(next);
    });
    plus.addEventListener('click', () => {
        const next = (Number(value.textContent) || 1) + 1;
        value.textContent = String(next);
    });
}

const addBtn = document.getElementById('product-add-btn');
if (addBtn) {
    addBtn.addEventListener('click', () => {
        const quantity = document.querySelector('.quantity-stepper .qty-value')?.textContent || '1';
        const original = addBtn.innerHTML;
        addBtn.innerHTML = `<i data-lucide="check"></i> ${getProductText('added', 'Added')}`;
        addBtn.style.background = '#16a34a';
        lucide.createIcons();
        console.log('Added Wildflower Reserve x' + quantity);
        setTimeout(() => {
            addBtn.innerHTML = original;
            addBtn.style.background = '';
            lucide.createIcons();
        }, 1800);
    });
}

window.honeyPageUtils?.initScrollToTop();


lucide.createIcons();
