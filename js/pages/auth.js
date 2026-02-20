// Initialize Icons
lucide.createIcons();

// Tabs Logic
const triggers = document.querySelectorAll('.tab-trigger');
const contents = document.querySelectorAll('.tab-content');

triggers.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');

        triggers.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

const USERS_KEY = 'honeyUsers';
const AUTH_CURRENT_USER_KEY = 'honeyCurrentUser';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerImageInput = document.getElementById('profile-image');
const profilePreview = document.getElementById('profile-preview');
let selectedProfileImage = '';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (error) {
        return [];
    }
}

function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(user) {
    localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user));
}

function setLoading(btn, isLoading, defaultText) {
    btn.disabled = isLoading;
    btn.innerText = isLoading ? 'Processing...' : defaultText;
}

registerImageInput.addEventListener('change', () => {
    const file = registerImageInput.files[0];
    if (!file) {
        selectedProfileImage = '';
        profilePreview.style.display = 'none';
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        selectedProfileImage = event.target.result;
        profilePreview.src = selectedProfileImage;
        profilePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = registerForm.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    setLoading(btn, true, originalText);

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('r-email').value.trim().toLowerCase();
    const password = document.getElementById('r-password').value;

    const users = getUsers();
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
        setLoading(btn, false, originalText);
        alert('This email already exists. Please login.');
        return;
    }

    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        password,
        profileImage: selectedProfileImage
    };

    users.push(newUser);
    setUsers(users);
    setCurrentUser(newUser);

    setLoading(btn, false, originalText);
    window.location.href = '/profile.html';
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = loginForm.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    setLoading(btn, true, originalText);

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const users = getUsers();
    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
        setLoading(btn, false, originalText);
        alert('Invalid email or password.');
        return;
    }

    setCurrentUser(user);
    setLoading(btn, false, originalText);
    window.location.href = '/profile.html';
});

