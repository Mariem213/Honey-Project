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
