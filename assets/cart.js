class CartManager {
    constructor() {
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
        notification.innerHTML = `<div class="cart-notification__added-text">Your Item Has Been Added To The Cart</div><div class="cart-notification__wrapper"><div class="cart-notification__image-container">
            <img class="cart-notification__image" src=${data.featured_image.url} alt=${data.featured_image.alt} />
        </div><div class="cart-notification__title-container"><span>${data.title}</span></div><div class="cart-notification__price-container"><span>$${data.price}</span></div></div>`;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000)
    }

    handleModalDialog(form) {
        const dialog = form.closest('dialog');
        if (dialog) dialog.close();
    }
}

const cartManager = new CartManager();
