import { tabletManager } from './navbar.js';

class PredictiveSearch extends HTMLElement {
    static selectors = {
        results: '#predictive-search-results',
        productList: '.predictive-search-products-list',
        productItems: '.predictive-search-product-item-a',
        productTitles: '.predictive-search-product-title',
        leftBar: '.predictive-search-left-bar',
        collections: '.predictive-search-collections',
        products: '.predictive-search-products',
    };

    static classes = {
        sticky: {
            base: 'predictive-search-sticky-navbar',
            productsList: 'predictive-search-sticky-navbar-products-list',
            productTitle: 'predictive-search-sticky-navbar-product-title',
            productItem: 'predictive-search-sticky-navbar-product-item-a',
            leftBar: 'predictive-search-sticky-navbar-left-bar',
            collections: 'predictive-search-sticky-navbar-collections',
            products: 'predictive-search-sticky-navbar-products',
        },
    };

    constructor() {
        super();

        this.input = this.querySelector('input[type="search"]');
        this.predictiveSearchResults = this.querySelector('#predictive-search');
        this._boundHandleClickOutside = this.handleClickOutside.bind(this);

        this.input.addEventListener(
            'input',
            this.debounce((e) => {
                this.onChange(e);
            }, 300).bind(this)
        );

        this.initializeEventListener();
    }

    initializeEventListener() {
        document.removeEventListener('click', this._boundHandleClickOutside);
        document.addEventListener('click', this._boundHandleClickOutside);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._boundHandleClickOutside);
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
        // const tabletManager = window.tabletManager;
        if (tabletManager?.isVisible) {
            this.initializePredictiveResultsSection();
            this.arrangeResults();
        }
        this.predictiveSearchResults.style.display = 'block';
    }

    close() {
        this.predictiveSearchResults.style.display = 'none';
    }

    arrangeResults() {
        const { classes } = PredictiveSearch;

        try {
            const containers = {
                div: this.predictiveSearchResultsDiv,
                list: this.predictiveSearchResultsList,
                leftBar: this.predictiveSearchResultsLeftBar,
                collections: this.predictiveSearchResultsCollections,
                products: this.predictiveSearchResultsProducts,
            };

            Object.entries(containers).forEach(([key, element]) => {
                if (!element) return;
                const className = classes.sticky[key === 'div' ? 'base' : key];
                element.classList.add(className);
            });

            const lists = {
                items: {
                    elements: this.predictiveSearchResultsListItem,
                    className: classes.sticky.productItem,
                },
                titles: {
                    elements: this.predictiveSearchResultsListItemTitle,
                    className: classes.sticky.productTitle,
                },
            };

            Object.values(lists).forEach(({ elements, className }) => {
                if (!elements?.length) return;
                elements.forEach((element) => element.classList.add(className));
            });

            return true;
        } catch (e) {
            console.warn('Error arranging predictive search results', e);
            return false;
        }
    }

    initializePredictiveResultsSection() {
        const { selectors } = PredictiveSearch;

        try {
            this.predictiveSearchResultsDiv = this.predictiveSearchResults.querySelector(selectors.results);
            if (!this.predictiveSearchResultsDiv) throw new Error('Results container not found');

            const elements = {
                list: selectors.productList,
                leftBar: selectors.leftBar,
                collections: selectors.collections,
                products: selectors.products,
            };

            Object.entries(elements).forEach(([key, selectors]) => {
                this[`predictiveSearchResults${key.charAt(0).toUpperCase()}${key.slice(1)}`] =
                    this.predictiveSearchResultsDiv.querySelector(selectors);
            });

            this.predictiveSearchResultsListItem = Array.from(
                this.predictiveSearchResultsList?.querySelectorAll(selectors.productItems) || []
            );

            this.predictiveSearchResultsListItemTitle = Array.from(
                this.predictiveSearchResultsDiv.querySelectorAll(selectors.productTitles)
            );

            return true;
        } catch (e) {
            console.warn('Error initializing predictive search results section', e);
            return false;
        }
    }

    handleClickOutside(e) {
        if (!this.predictiveSearchResults.contains(e.target)) {
            this.close();
        }
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
