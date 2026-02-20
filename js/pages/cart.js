lucide.createIcons();
const CART_KEY = 'honeyCart';

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

function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// Logic to update totals
function updateCartTotals() {
    let subtotal = 0;
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseFloat(item.dataset.price);
        const qty = parseInt(item.querySelector('.qty-val').innerText);
        const itemTotal = price * qty;
        const name = item.querySelector('.item-info h3')?.innerText?.trim() || 'Product';
        const sizeText = item.querySelector('.item-info p')?.innerText || '';
        const size = sizeText.split(':')[1]?.trim() || '';
        const image = item.querySelector('.item-img')?.getAttribute('src') || '';

        item.querySelector('.item-total').innerText = `$${itemTotal.toFixed(2)}`;
        subtotal += itemTotal;
        cartItems.push({
            name,
            size,
            qty,
            unitPrice: price,
            total: itemTotal,
            image
        });
    });

    const tax = 0; // Tax calculation can be added here
    const total = subtotal + tax;

    document.getElementById('subtotal-val').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-val').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${total.toFixed(2)}`;
    saveCart(cartItems);
}

// Quantity Listeners
document.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', () => {
        let valObj = btn.parentElement.querySelector('.qty-val');
        valObj.innerText = parseInt(valObj.innerText) + 1;
        updateCartTotals();
        lucide.createIcons();
    });
});

document.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', () => {
        let valObj = btn.parentElement.querySelector('.qty-val');
        let current = parseInt(valObj.innerText);
        if (current > 1) {
            valObj.innerText = current - 1;
            updateCartTotals();
            lucide.createIcons();
        }
    });
});

// Remove item functionality
document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const cartItem = btn.closest('.cart-item');
        cartItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            cartItem.remove();
            updateCartTotals();
        }, 300);
    });
});

// Initialize totals on page load
updateCartTotals();

