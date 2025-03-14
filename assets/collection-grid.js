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
