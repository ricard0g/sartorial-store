class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search');

        this.input.addEventListener(
            'input',
            this.debounce((e) => {
                this.onChange(e);
            }, 300).bind(this)
        );
    }

    onChange() {
        const searchTerm = this.input.value.trim();

        if (!searchTerm.length) {
            this.close();
            return;
        }

        this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm) {
        fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`)
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    this.closes();
                    throw error;
                }

                return response.text();
            })
            .then((text) => {
                const resultsMarkup = new DOMParser()
                    .parseFromString(text, 'text/html')
                    .querySelector('#shopify-section-predictive-search').innerHTML;
                console.log(resultsMarkup);
                this.predictiveSearchResults.innerHTML = resultsMarkup;
                this.open();
            })
            .catch((error) => {
                this.close();
                throw error;
            });
    }

    open() {
        this.predictiveSearchResults.style.display = 'block';
    }

    close() {
        this.predictiveSearchResults.style.display = 'none';
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        }
    }
}

customElements.define('predictive-search', PredictiveSearch);