const PROFILE_CURRENT_USER_KEY = 'honeyCurrentUser';
function getProfileText(key, fallback) {
    const lang = localStorage.getItem('language') || 'en';
    return translations?.[lang]?.profile?.[key] || fallback;
}

function updateProfileWelcomeTitle(user) {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    document.getElementById('profile-name').textContent = fullName || getProfileText('welcome', 'Welcome');
}

const currentUser = JSON.parse(localStorage.getItem(PROFILE_CURRENT_USER_KEY) || 'null');

if (!currentUser) {
    window.location.href = '/auth.html';
} else {
    updateProfileWelcomeTitle(currentUser);
    document.getElementById('profile-email').textContent = currentUser.email || '';
    document.getElementById('profile-email-card').textContent = currentUser.email || '-';
    document.getElementById('profile-first-name').textContent = currentUser.firstName || '-';
    document.getElementById('profile-last-name').textContent = currentUser.lastName || '-';

    const avatar = document.getElementById('profile-avatar');
    if (currentUser.profileImage) {
        avatar.src = currentUser.profileImage;
    } else {
        const firstLetter = (currentUser.firstName || 'U').charAt(0).toUpperCase();
        avatar.src = `https://placehold.co/200x200/f6f6f6/6b7280?text=${firstLetter}`;
        document.getElementById('profile-empty').textContent = getProfileText('noProfilePicture', 'No profile picture uploaded yet.');
    }
}

window.addEventListener('languageChanged', () => {
    updateProfileWelcomeTitle(currentUser);
    if (currentUser && !currentUser.profileImage) {
        document.getElementById('profile-empty').textContent = getProfileText('noProfilePicture', 'No profile picture uploaded yet.');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem(PROFILE_CURRENT_USER_KEY);
    window.location.href = '/auth.html';
});

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

