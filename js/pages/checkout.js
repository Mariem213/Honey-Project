lucide.createIcons();

window.honeyPageUtils?.initScrollToTop();


const ORDERS_KEY = 'honeyOrders';
const CART_KEY = 'honeyCart';
const CURRENT_USER_KEY = 'honeyCurrentUser';

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
    } catch (error) {
        return null;
    }
}

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getCartItems() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login before placing an order.');
        window.location.href = '/auth.html';
        return;
    }

    const items = getCartItems();
    if (!items.length) {
        alert('Your cart is empty.');
        window.location.href = '/cart.html';
        return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shippingMethodInput = document.querySelector('input[name="shipping"]:checked');
    const shippingMethod = shippingMethodInput?.value || 'standard';
    const shippingCost = shippingMethod === 'express' ? 25 : 8;
    const tax = 0;
    const total = subtotal + shippingCost + tax;

    const order = {
        id: `ORD-${Date.now()}`,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        shippingMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        items
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    localStorage.removeItem(CART_KEY);

    alert('Order placed successfully!');
    window.location.href = '/previous-orders.html';
});
