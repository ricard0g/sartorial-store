import { tabletManager } from './navbar.js';

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
                this.predictiveSearchResults.innerHTML = resultsMarkup;
                this.open();
            })
            .catch((error) => {
                this.close();
                throw error;
            });
    }

    open() {
        if (tabletManager.isVisible) {
            this.initializePredictiveResultsSection();
            this.arrangeResults();
        }
        this.predictiveSearchResults.style.display = 'block';
    }

    close() {
        this.predictiveSearchResults.style.display = 'none';
    }

    arrangeResults() {
        this.predictiveSearchResultsDiv.classList.add('predictive-search-sticky-navbar');
        this.predictiveSearchResultsList.classList.add('predictive-search-sticky-navbar-products-list');
        this.predictiveSearchResultstListItem.forEach((item) => {
            item.classList.add('predictive-search-sticky-navbar-product-item-a');
        });
        this.predictiveSearchResultsListItemTitle.forEach((title) => {
            title.classList.add('predictive-search-sticky-navbar-product-title');
        });
        this.predictiveSearchResultsLeftNavbar.classList.add('predictive-search-sticky-navbar-left-bar');
        this.predictiveSearchResultsCollections.classList.add('predictive-search-sticky-navbar-collections');
        this.predictiveSearchResultsProducts.classList.add('predictive-search-sticky-navbar-products');
    }

    initializePredictiveResultsSection() {
        this.predictiveSearchResultsDiv = this.predictiveSearchResults.querySelector('#predictive-search-results');
        this.predictiveSearchResultsList = this.predictiveSearchResultsDiv.querySelector(
            '.predictive-search-products-list'
        );
        this.predictiveSearchResultstListItem = Array.from(
            this.predictiveSearchResultsList.querySelectorAll('.predictive-search-product-item-a')
        );
        this.predictiveSearchResultsListItemTitle = document.querySelectorAll('.predictive-search-product-title');
        this.predictiveSearchResultsLeftNavbar =
            this.predictiveSearchResultsDiv.querySelector('.predictive-search-left-bar');
        this.predictiveSearchResultsCollections = this.predictiveSearchResultsDiv.querySelector(
            '.predictive-search-collections'
        );
        this.predictiveSearchResultsProducts =
            this.predictiveSearchResultsDiv.querySelector('.predictive-search-products');
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }
}

if (!customElements.get('predictive-search')) {
    customElements.define('predictive-search', PredictiveSearch);
}

export function getPredictiveSearch() {
    return document.querySelector('predictive-search');
}
