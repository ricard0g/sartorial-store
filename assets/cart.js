class CartManager {
    constructor() {
        const cartItemCountText = document.getElementById('cart-item-count').textContent;
        this.itemCountNumber = parseInt(cartItemCountText, 10);
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('submit', (e) => {
            const form = e.target;

            if (form.action.includes('/cart/add')) {
                e.preventDefault();
                this.addToCart(form);
            }
        });
    }

    async addToCart(form) {
        try {
            const formData = new FormData(form);

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Item added to cart:', data);

            this.showCartNotification(data);

            this.handleModalDialog(form);
        } catch (e) {
            console.error('Error adding item to cart:', e);
        }
    }

    showCartNotification(data) {
        const notification = document.createElement('div');
        notification.classList.add('cart-notification__container');
        notification.innerHTML = `<div class="cart-notification__added-text"><p>Your Item Has Been Added To The Cart!</p></div><div class="cart-notification__wrapper"><div class="cart-notification__image-container">
            <img class="cart-notification__image" src=${data.featured_image.url} alt=${data.featured_image.alt} />
        </div><div class="cart-notification__title-container"><span>${data.title}</span></div><div class="cart-notification__price-container"><span>$${data.presentment_price}</span></div></div>`;

        document.body.appendChild(notification);
        notification.classList.add('cart-notification__active');

        setTimeout(() => {
            notification.classList.remove('cart-notification__active');
        }, 3000);

        setTimeout(() => {
            notification.remove();
            this.increaseItemCount();
        }, 3310);
    }

    handleModalDialog(form) {
        const dialog = form.closest('dialog');
        if (dialog) dialog.close();
    }

    increaseItemCount() {
        this.itemCountNumber++;
        document.getElementById('cart-item-count').textContent = this.itemCountNumber;
    }
}

const cartManager = new CartManager();

// Quantity Input
class QuantityInput extends HTMLElement {
    constructor() {
        super();
        this.minusBtn = this.querySelector('[data-func="minus"]');
        this.plusBtn = this.querySelector('[data-func="plus"]');
        this.input = this.querySelector('input');
        this.totalText = document.getElementById('TotalCartPrice');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.minusBtn.addEventListener('click', () => {
            this.updateQuantity(-1);
        });
        this.plusBtn.addEventListener('click', () => {
            this.updateQuantity(1);
        });
        this.input.addEventListener('input', () => {
            this.validateInput();
        });
    }

    updateQuantity(num) {
        const currentValue = parseInt(this.input.value, 10);
        const newValue = currentValue + num;
        if (newValue) {
            this.input.value = newValue;
            this.updateTotal();
        }
    }

    async updateTotal() {
        try {
            let updates = {
                [this.dataset.id]: this.input.value,
            };

            console.log('Updating cart with:', updates);
            const response = await fetch('/cart/update.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ updates }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            this.totalText.textContent = data.total_price / 100;
        } catch (e) {
            consoe.error('Error updating cart:', e);
        }
    }
}

customElements.define('quantity-input', QuantityInput);
