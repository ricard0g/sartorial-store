class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search');

        this.input.addEventListener('input', this.debounce((e) => {
            this.onchange(e);
        }, 300).bind(this));
    }

    onChange() {
        const searchTerm = this.input.value.trim();
    }
}