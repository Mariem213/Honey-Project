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
