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
