// Account Icon
class AccountIcon extends HTMLElement {
    constructor() {
        super();
        this.icon = this.querySelector('.icon');
    }

    connectedCallback() {
        document.addEventListener('storefront:signincompleted', this.handleStoreFrontSigninCompleted(this));
    }

    handleStoreFrontSigninCompleted(event) {
        if (event?.detail?.avatar) {
            this.icon?.replaceWith(event.detail.avatar.cloneNode());
        }
    }
}

customElements.define('account-icon', AccountIcon);

// Dialog Animation
// Add this to your product-slider.js file