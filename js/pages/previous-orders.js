const ORDERS_KEY = 'honeyOrders';
const PREVIOUS_ORDERS_CURRENT_USER_KEY = 'honeyCurrentUser';
function getOrdersText(key, fallback) {
    const lang = localStorage.getItem('language') || 'en';
    return translations?.[lang]?.previousOrdersPage?.[key] || fallback;
}

function getLocaleForLang() {
    return (localStorage.getItem('language') || 'en') === 'ar' ? 'ar' : 'en';
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(PREVIOUS_ORDERS_CURRENT_USER_KEY) || 'null');
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

function formatCurrency(value) {
    return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(isoDate) {
    try {
        return new Date(isoDate).toLocaleString(getLocaleForLang(), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return isoDate || '-';
    }
}

function getStaticDemoOrders(userId) {
    return [
        {
            id: 'ORD-20260214-1142',
            userId,
            createdAt: '2026-02-14T11:42:00.000Z',
            status: 'delivered',
            shippingMethod: 'express',
            subtotal: 88,
            shippingCost: 25,
            tax: 0,
            total: 113,
            items: [
                {
                    name: 'Wildflower Reserve',
                    size: '500g',
                    qty: 2,
                    unitPrice: 24,
                    total: 48,
                    image: 'assets/shop1Honey.png'
                },
                {
                    name: 'Royal Acacia',
                    size: '350g',
                    qty: 1,
                    unitPrice: 32,
                    total: 32,
                    image: 'assets/shop2Honey.png'
                },
                {
                    name: 'Raw Honeycomb',
                    size: '250g',
                    qty: 1,
                    unitPrice: 8,
                    total: 8,
                    image: 'assets/shop3Honey.png'
                }
            ]
        },
        {
            id: 'ORD-20260128-0905',
            userId,
            createdAt: '2026-01-28T09:05:00.000Z',
            status: 'shipped',
            shippingMethod: 'standard',
            subtotal: 56,
            shippingCost: 8,
            tax: 0,
            total: 64,
            items: [
                {
                    name: 'Raw Honeycomb',
                    size: '250g',
                    qty: 2,
                    unitPrice: 18,
                    total: 36,
                    image: 'assets/shop3Honey.png'
                },
                {
                    name: 'Wildflower Reserve',
                    size: '500g',
                    qty: 1,
                    unitPrice: 20,
                    total: 20,
                    image: 'assets/shop1Honey.png'
                }
            ]
        },
        {
            id: 'ORD-20260105-1931',
            userId,
            createdAt: '2026-01-05T19:31:00.000Z',
            status: 'processing',
            shippingMethod: 'standard',
            subtotal: 72,
            shippingCost: 8,
            tax: 0,
            total: 80,
            items: [
                {
                    name: 'Royal Acacia',
                    size: '350g',
                    qty: 2,
                    unitPrice: 32,
                    total: 64,
                    image: 'assets/shop2Honey.png'
                },
                {
                    name: 'Raw Honeycomb',
                    size: '250g',
                    qty: 1,
                    unitPrice: 8,
                    total: 8,
                    image: 'assets/shop3Honey.png'
                }
            ]
        }
    ];
}

const currentUser = getCurrentUser() || { id: 'demo-user', firstName: 'Demo', lastName: 'User' };

const allOrders = getOrders();
const userOrders = allOrders.filter((order) => String(order.userId) === String(currentUser.id));
const renderedOrders = userOrders.length ? userOrders : getStaticDemoOrders(currentUser.id);
const ordersListEl = document.getElementById('orders-list');
const ordersCountChip = document.getElementById('orders-count-chip');
function getStatusLabel(status) {
    if (status === 'delivered') return getOrdersText('delivered', 'Delivered');
    if (status === 'shipped') return getOrdersText('shipped', 'Shipped');
    return getOrdersText('processing', 'Processing');
}

function getShippingLabel(method) {
    return method === 'express'
        ? getOrdersText('express', 'Express')
        : getOrdersText('standard', 'Standard');
}

function renderOrders() {
    ordersCountChip.textContent = `${renderedOrders.length} ${renderedOrders.length === 1 ? getOrdersText('order', 'order') : getOrdersText('orders', 'orders')}`;

    if (!renderedOrders.length) {
        ordersListEl.innerHTML = `
                    <div class="empty-orders">
                        <i data-lucide="shopping-bag"></i>
                        <h3>${getOrdersText('emptyTitle', 'No orders yet')}</h3>
                        <p>${getOrdersText('emptyDesc', 'You have not placed any orders yet.')}</p>
                        <a href="/offering.html">
                            <span>${getOrdersText('shopNow', 'Shop now')}</span>
                            <i data-lucide="arrow-right"></i>
                        </a>
                    </div>
                `;
        lucide.createIcons();
        return;
    }

    ordersListEl.innerHTML = renderedOrders.map((order) => {
        const itemsHtml = (order.items || []).map((item) => `
                    <div class="order-item">
                        <img src="${item.image || 'https://placehold.co/120x120/f7f7f7/6b7280?text=Honey'}" alt="${item.name || getOrdersText('productFallback', 'Product')}">
                        <div>
                            <p class="order-item-name">${item.name || getOrdersText('productFallback', 'Product')}</p>
                            <p class="order-item-meta">${getOrdersText('qty', 'Qty')}: ${item.qty || 1}${item.size ? ` • ${getOrdersText('size', 'Size')}: ${item.size}` : ''}</p>
                        </div>
                        <p class="order-item-price">${formatCurrency(item.total)}</p>
                    </div>
                `).join('');

        const status = String(order.status || 'processing').toLowerCase();
        return `
                    <article class="order-card">
                        <div class="order-card-head">
                            <div>
                                <p class="order-id">${order.id || '-'}</p>
                                <p class="order-date">${formatDate(order.createdAt)}</p>
                            </div>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <span class="order-status-pill ${status}">${getStatusLabel(status)}</span>
                                <span class="order-total-pill">${formatCurrency(order.total)}</span>
                            </div>
                        </div>
                        <div class="order-items">${itemsHtml}</div>
                        <div class="order-card-foot">
                            <span>${getOrdersText('shipping', 'Shipping')}: ${getShippingLabel(order.shippingMethod || 'standard')}</span>
                            <span>${getOrdersText('subtotal', 'Subtotal')}: ${formatCurrency(order.subtotal)}</span>
                            <span>${getOrdersText('shippingCost', 'Shipping Cost')}: ${formatCurrency(order.shippingCost)}</span>
                        </div>
                    </article>
                `;
    }).join('');

    lucide.createIcons();
}

renderOrders();
window.addEventListener('languageChanged', renderOrders);

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

