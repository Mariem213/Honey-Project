// Add to Bag functionality
const addToBagButtons = document.querySelectorAll('.product-card .add-btn');
addToBagButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const productCard = this.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('h3')?.textContent || 'Product';
        const productPrice = productCard.querySelector('.price')?.textContent || '';
        const quantityText = productCard.querySelector('.quantity-stepper .qty-value')?.textContent || '1';
        const quantity = Number(quantityText) || 1;

        // Add visual feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i data-lucide="check"></i> Added!';
        this.style.color = 'var(--primary)';
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

attachQuantityStepperListeners();
