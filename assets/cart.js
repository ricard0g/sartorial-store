class CartManager {
    // Configuration constants
    static NOTIFICATION_DURATION = 3000;
    static ANIMATION_DURATION = 310;

    /**
     * Initialize the cart manager and cache DOM elements
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
        // Configuration
        this.options = {
            notificationDuration: CartManager.NOTIFICATION_DURATION,
            animationDuration: CartManager.ANIMATION_DURATION,
            ...options,
        };

        // Cache DOM elements
        this.cartItemCountElement = document.getElementById('cart-item-count');
        this.cartIconMobileElements = document.querySelectorAll('.cart-icon-mobile');

        // Initialize counters
        this.itemCountNumber = this.cartItemCountElement ? parseInt(this.cartItemCountElement.textContent, 10) : 0;
        this.itemCountNumberMobile = this.cartIconMobileElements.length
            ? parseInt(this.cartIconMobileElements[0].dataset.itemCount, 10)
            : 0;

        // Setup event listeners only if needed
        if (document.querySelector('form[action*="/cart/add"]')) {
            this.setupEventListeners();
        }
    }

    /**
     * Set up event listeners for cart-related actions
     */
    setupEventListeners() {
        // Use event delegation for better performance
        document.body.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    /**
     * Handle form submissions, particularly for cart additions
     * @param {Event} e - The submit event
     */
    handleFormSubmit(e) {
        const form = e.target;
        if (form.action && form.action.includes('/cart/add')) {
            e.preventDefault();
            this.addToCart(form);
        }
    }

    /**
     * Add an item to the cart via AJAX
     * @param {HTMLFormElement} form - The product form to submit
     * @returns {Promise<void>}
     */
    async addToCart(form) {
        try {
            const formData = new FormData(form);

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.showCartNotification(data);
            this.handleModalDialog(form);
        } catch (error) {
            console.error('Error adding item to cart:', error.message);
            this.showErrorNotification('Could not add item to cart. Please try again.');
        }
    }

    /**
     * Create the HTML structure for the cart notification
     * @param {Object} data - Product data from the cart API
     * @returns {string} HTML content
     */
    createNotificationHTML(data) {
        // Ensure data has all required properties
        if (!data || !data.featured_image || !data.title) {
            return `
                <div class="cart-notification__added-text">
                    <p>Item added to cart!</p>
                </div>
            `;
        }

        return `
            <div class="cart-notification__added-text">
                <p>Your Item Has Been Added To The Cart!</p>
            </div>
            <div class="cart-notification__wrapper">
                <div class="cart-notification__image-container">
                    <img class="cart-notification__image" 
                         src="${data.featured_image.url}" 
                         alt="${data.featured_image.alt || 'Product image'}" />
                </div>
                <div class="cart-notification__title-container">
                    <span>${data.title}</span>
                </div>
                <div class="cart-notification__price-container">
                    <span>$${data.presentment_price}</span>
                </div>
            </div>
        `;
    }

    /**
     * Show a notification that an item was added to cart
     * @param {Object} data - Product data from the cart API
     */
    showCartNotification(data) {
        if (!data) {
            console.warn('Invalid product data for notification');
            return;
        }

        const notification = document.createElement('div');
        notification.classList.add('cart-notification__container');
        notification.innerHTML = this.createNotificationHTML(data);

        document.body.appendChild(notification);

        // Force browser reflow before adding the active class for animation
        void notification.offsetWidth;
        notification.classList.add('cart-notification__active');

        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('cart-notification__active');
        }, this.options.notificationDuration);

        // Clean up DOM after animation completes
        setTimeout(() => {
            notification.remove();
            this.increaseItemCount();
        }, this.options.notificationDuration + this.options.animationDuration);
    }

    /**
     * Show an error notification when an operation fails
     * @param {string} message - Error message to display
     */
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('cart-notification__container', 'cart-notification__error');
        notification.innerHTML = `
            <div class="cart-notification__added-text">
                <p>${message}</p>
            </div>
        `;

        document.body.appendChild(notification);
        void notification.offsetWidth;
        notification.classList.add('cart-notification__active');

        setTimeout(() => {
            notification.classList.remove('cart-notification__active');
        }, this.options.notificationDuration);

        setTimeout(() => {
            notification.remove();
        }, this.options.notificationDuration + this.options.animationDuration);
    }

    /**
     * Close modal dialog if product was added from a modal
     * @param {HTMLFormElement} form - The form that was submitted
     */
    handleModalDialog(form) {
        const dialog = form.closest('dialog');
        if (dialog) dialog.close();
    }

    /**
     * Increase the cart item count in the UI
     */
    increaseItemCount() {
        this.itemCountNumber++;
        this.itemCountNumberMobile++;

        // Update DOM elements if they exist
        if (this.cartItemCountElement) {
            this.cartItemCountElement.textContent = this.itemCountNumber;
        }

        this.cartIconMobileElements.forEach((el) => {
            el.dataset.itemCount = this.itemCountNumberMobile;
        });
    }
}

if (typeof window.cartManager === 'undefined') {
    window.cartManager = new CartManager();
}

// Quantity Input
class QuantityInput extends HTMLElement {
    constructor() {
        super();
        this.minusBtn = this.querySelector('[data-func="minus"]');
        this.plusBtn = this.querySelector('[data-func="plus"]');
        this.input = this.querySelector('input');
        this.totalText = document.getElementById('TotalCartPrice');
        this.currency = this.totalText.textContent.charAt(0);

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
            this.totalText.textContent = `${this.currency}${data.total_price / 100}`;
        } catch (e) {
            consoe.error('Error updating cart:', e);
        }
    }
}

customElements.define('quantity-input', QuantityInput);
