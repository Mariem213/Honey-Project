// Initialize Lucide Icons
lucide.createIcons();

const CURRENT_USER_KEY = 'honeyCurrentUser';

function getCurrentUser() {
	try {
		return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
	} catch (error) {
		return null;
	}
}

function createProfileAvatar(fullName, imageSrc, className) {
	const avatar = document.createElement('img');
	avatar.className = className;
	avatar.alt = `${fullName || 'User'} profile`;
	avatar.src = imageSrc || '';
	return avatar;
}

function getAvatarFallback(firstName) {
	const initial = (firstName || 'U').charAt(0).toUpperCase() || 'U';
	return `https://placehold.co/100x100/f6f6f6/6b7280?text=${initial}`;
}

function createProfileDropdownItem(key, fallback, icon, href) {
	const item = document.createElement('a');
	item.className = 'profile-dropdown-item';
	item.href = href;
	item.innerHTML = `<i data-lucide="${icon}"></i><span data-nav-i18n-key="${key}" data-nav-i18n-fallback="${fallback}">${getNavTranslation(key, fallback)}</span>`;
	return item;
}

function createMobileSheetActionLink(key, fallback, icon, href) {
	const link = document.createElement('a');
	link.className = 'sheet-action-link mobile-account-action';
	link.href = href;
	link.innerHTML = `<i data-lucide="${icon}"></i><span data-nav-i18n-key="${key}" data-nav-i18n-fallback="${fallback}">${getNavTranslation(key, fallback)}</span>`;
	return link;
}

function getNavTranslation(key, fallback) {
	const lang = localStorage.getItem('language') || 'en';
	return translations?.[lang]?.nav?.[key] || fallback;
}

function updateAccountMenuTranslations() {
	const translatableLabels = document.querySelectorAll('[data-nav-i18n-key]');
	translatableLabels.forEach((label) => {
		const key = label.getAttribute('data-nav-i18n-key');
		const fallback = label.getAttribute('data-nav-i18n-fallback') || '';
		label.textContent = getNavTranslation(key, fallback);
	});
}

function attachProfileDropdown(desktopAuthLink, user) {
	const navActions = desktopAuthLink.closest('.nav-actions');
	if (!navActions) return;

	const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
	const dropdown = document.createElement('div');
	dropdown.className = 'profile-dropdown';
	dropdown.innerHTML = `
		<div class="profile-dropdown-header">
			<p class="profile-dropdown-name">${fullName || 'Member'}</p>
			<p class="profile-dropdown-email">${user.email || ''}</p>
		</div>
	`;

	const profileLink = createProfileDropdownItem('profile', 'Profile', 'user-circle', '/profile.html');
	const ordersLink = createProfileDropdownItem('previousOrders', 'Previous Orders', 'receipt-text', '/previous-orders.html');
	const changePasswordLink = createProfileDropdownItem('changePassword', 'Change Password', 'key-round', '#');
	const logoutButton = document.createElement('button');
	logoutButton.type = 'button';
	logoutButton.className = 'profile-dropdown-item profile-dropdown-logout';
	logoutButton.innerHTML = '<i data-lucide="log-out"></i><span data-nav-i18n-key="logout" data-nav-i18n-fallback="Logout">Logout</span>';

	changePasswordLink.addEventListener('click', (e) => {
		e.preventDefault();
		alert(getNavTranslation('changePasswordSoon', 'Change Password feature will be available soon.'));
	});

	logoutButton.addEventListener('click', () => {
		localStorage.removeItem(CURRENT_USER_KEY);
		window.location.href = '/auth.html';
	});

	dropdown.appendChild(profileLink);
	dropdown.appendChild(ordersLink);
	dropdown.appendChild(changePasswordLink);
	dropdown.appendChild(logoutButton);

	const wrapper = document.createElement('div');
	wrapper.className = 'profile-menu-wrapper hide-mobile';
	wrapper.appendChild(desktopAuthLink.cloneNode(true));
	wrapper.appendChild(dropdown);
	desktopAuthLink.replaceWith(wrapper);

	const trigger = wrapper.querySelector('.profile-icon-btn');
	const closeDropdown = () => {
		dropdown.classList.remove('active');
		trigger.setAttribute('aria-expanded', 'false');
	};

	trigger.setAttribute('href', '#');
	trigger.setAttribute('aria-haspopup', 'true');
	trigger.setAttribute('aria-expanded', 'false');
	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		const isOpen = dropdown.classList.toggle('active');
		trigger.setAttribute('aria-expanded', String(isOpen));
	});

	document.addEventListener('click', (e) => {
		if (!wrapper.contains(e.target)) {
			closeDropdown();
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeDropdown();
		}
	});
}

function renderAuthStateInNavbar() {
	const user = getCurrentUser();
	const desktopAuthLink = document.querySelector('.nav-actions a.icon-btn.hide-mobile[href="/auth.html"]');
	const mobileAuthLink = document.querySelector('.sheet-actions .sheet-action-link[href="/auth.html"]');
	const mobileActionsContainer = document.querySelector('.sheet-actions');

	if (!user) return;

	const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
	const avatarSrc = user.profileImage || getAvatarFallback(user.firstName);

	if (desktopAuthLink) {
		desktopAuthLink.href = '/profile.html';
		desktopAuthLink.classList.add('profile-icon-btn');
		desktopAuthLink.innerHTML = '';
		desktopAuthLink.appendChild(createProfileAvatar(fullName, avatarSrc, 'nav-profile-avatar'));
		attachProfileDropdown(desktopAuthLink, user);
	}

	if (mobileAuthLink) {
		mobileAuthLink.href = '/profile.html';
		mobileAuthLink.innerHTML = '';
		mobileAuthLink.appendChild(createProfileAvatar(fullName, avatarSrc, 'nav-profile-avatar nav-profile-avatar-mobile'));
		const label = document.createElement('span');
		label.textContent = fullName || 'My Profile';
		mobileAuthLink.appendChild(label);
	}

	if (mobileActionsContainer) {
		// Clear previously injected account actions before re-inserting.
		mobileActionsContainer.querySelectorAll('.mobile-account-action').forEach((node) => node.remove());

		const ordersLink = createMobileSheetActionLink('previousOrders', 'Previous Orders', 'receipt-text', '/previous-orders.html');
		const changePasswordLink = createMobileSheetActionLink('changePassword', 'Change Password', 'key-round', '#');
		const logoutLink = createMobileSheetActionLink('logout', 'Logout', 'log-out', '#');

		changePasswordLink.addEventListener('click', (e) => {
			e.preventDefault();
			alert(getNavTranslation('changePasswordSoon', 'Change Password feature will be available soon.'));
		});

		logoutLink.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.removeItem(CURRENT_USER_KEY);
			window.location.href = '/auth.html';
		});

		const cartLink = mobileActionsContainer.querySelector('.sheet-action-link[href="/cart.html"]');
		if (cartLink) {
			mobileActionsContainer.insertBefore(ordersLink, cartLink);
			mobileActionsContainer.insertBefore(changePasswordLink, cartLink);
			mobileActionsContainer.insertBefore(logoutLink, cartLink);
		} else {
			mobileActionsContainer.appendChild(ordersLink);
			mobileActionsContainer.appendChild(changePasswordLink);
			mobileActionsContainer.appendChild(logoutLink);
		}
	}
}

renderAuthStateInNavbar();
updateAccountMenuTranslations();
lucide.createIcons();
window.addEventListener('languageChanged', () => {
	updateAccountMenuTranslations();
});

// Search Toggle Functionality (only on pages that have search, not auth page)
const searchToggle = document.getElementById('search-toggle');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');

if (searchToggle && searchContainer && searchInput && searchClose) {
	// Toggle search on search icon click
	searchToggle.addEventListener('click', (e) => {
		e.stopPropagation();
		searchContainer.classList.toggle('active');
		if (searchContainer.classList.contains('active')) {
			// Focus input when opened
			setTimeout(() => {
				searchInput.focus();
			}, 100);
		} else {
			// Clear input when closed
			searchInput.value = '';
		}
		lucide.createIcons();
	});

	// Close search on close button click
	searchClose.addEventListener('click', (e) => {
		e.stopPropagation();
		searchContainer.classList.remove('active');
		searchInput.value = '';
		lucide.createIcons();
	});

	// Close search when clicking outside
	document.addEventListener('click', (e) => {
		if (searchContainer.classList.contains('active') && 
			!searchContainer.contains(e.target) && 
			!searchToggle.contains(e.target)) {
			searchContainer.classList.remove('active');
			searchInput.value = '';
		}
	});

	// Close search on ESC key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
			searchContainer.classList.remove('active');
			searchInput.value = '';
		}
	});

	// Handle search input (you can add search functionality here)
	searchInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			const searchTerm = searchInput.value.trim();
			if (searchTerm) {
				// Add your search logic here
				console.log('Searching for:', searchTerm);
				// Example: window.location.href = `/search.html?q=${encodeURIComponent(searchTerm)}`;
			}
		}
	});
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('nav-initial');
    } else {
        navbar.classList.add('nav-initial');
        navbar.classList.remove('nav-scrolled');
    }
});

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

// Quantity stepper functionality (Home + any static product cards)
function attachQuantityStepperListeners() {
    const steppers = document.querySelectorAll('.quantity-stepper');
    steppers.forEach(stepper => {
        const minusBtn = stepper.querySelector('.qty-minus');
        const plusBtn = stepper.querySelector('.qty-plus');
        const qtyValue = stepper.querySelector('.qty-value');
        if (!minusBtn || !plusBtn || !qtyValue) return;

        minusBtn.addEventListener('click', () => {
            const current = Number(qtyValue.textContent) || 1;
            qtyValue.textContent = String(Math.max(1, current - 1));
        });

        plusBtn.addEventListener('click', () => {
            const current = Number(qtyValue.textContent) || 1;
            qtyValue.textContent = String(current + 1);
        });
    });
}

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

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form-main');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const emailInput = this.querySelector('.newsletter-input');
        const submitButton = this.querySelector('.btn-newsletter');
        const email = emailInput.value;

        if (email) {
            // Visual feedback
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Subscribed!';
            submitButton.style.background = '#4ade80';

            // Optional: Add to newsletter logic here
            console.log(`Newsletter subscription: ${email}`);

            // Reset form
            emailInput.value = '';

            // Reset button after 2 seconds
            setTimeout(() => {
                submitButton.textContent = originalButtonText;
                submitButton.style.background = '';
            }, 2000);
        }
    });
}