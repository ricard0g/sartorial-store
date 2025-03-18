class SortBy extends HTMLElement {
    constructor() {
        super();
        this.select = this.querySelector('select');
        this.onChange = this.onChange.bind(this);
        this.setEventListener();
    }

    setEventListener() {
        this.select.addEventListener('change', this.onChange);
    }

    onChange() {
        const url = new URL(window.location.href);
        url.searchParams.set('sort_by', this.select.value);
        window.location.href = url.href;
    }
}

customElements.define('sort-by', SortBy);

class FormFacets extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.onInput = this.onInput.bind(this);
        this.setEventListener();
    }

    setEventListener() {
        this.form.addEventListener('input', this.onInput);
    }

    onInput(e) {
        const value = e.target.value;
        const name = e.target.name;
        const checked = e.target.checked;
        const url = new URL(window.location.href);
        const targetPrice = e.target.closest('#PriceRange');

        if (targetPrice) return;

        if (checked) {
            url.searchParams.append(name, value);
        } else {
            this.removeSpecificParams(url.searchParams, name, value);
        }
        window.location.href = url.href;
    }

    removeSpecificParams(searchParams, name, valueToRemove) {
        const values = searchParams.getAll(name);
        searchParams.delete(name);

        values.forEach((value) => {
            if (value !== valueToRemove) {
                searchParams.append(name, value);
            }
        });
    }
}

customElements.define('form-facets', FormFacets);

class MobileDrawer extends HTMLElement {
    constructor() {
        super();
        this.openBtn = document.querySelector('.mobile-drawer-filters__open-btn');
        this.closeBtn = this.querySelector('.mobile-drawer-filters__close-btn');
        this.drawer = this.querySelector('.mobile-drawer-filters__container');
        this.mobileDrawerElement = this;

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setEventListener();
    }

    setEventListener() {
        this.openBtn.addEventListener('click', this.onOpen);
        this.closeBtn.addEventListener('click', this.onClose);
    }

    onOpen() {
        this.drawer.classList.add('mobile-drawer-filters__show-container');
        this.mobileDrawerElement.classList.add('drawer-open');
        document.body.style.overflow = 'hidden';
    }

    onClose() {
        this.drawer.classList.remove('mobile-drawer-filters__show-container');
        this.mobileDrawerElement.classList.remove('drawer-open');
        document.body.style.overflow = 'auto';
    }
}

customElements.define('mobile-drawer', MobileDrawer);
