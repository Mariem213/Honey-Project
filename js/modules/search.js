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
