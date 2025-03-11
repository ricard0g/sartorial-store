class FacetFiltersForm extends HTMLElement {
    constructor() {
        super();
        this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

        this.debouncedOnSubmit = debounce((e) => {
            this.onSubmitHandler(e);
        }, 800);

        const facetForm = this.querySelector('form');
        facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

        const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
        if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpScape);
    }

    // Method to establish the initial filters and keep track of them on change.
    static setListeners() {
        const onHistoryChange = (e) => {
            const searchParams = e.state ? e.state.searchParams : FacetFiltersForm.searchParamsInitial;
            // If the searchParams are the same as the previous ones, do nothing
            if (searchParams === FacetFiltersForm.searchParamsPrev) return;
            FacetFiltersForm.renderPage(searchParams, null, false);
        };
        window.addEventListener('popstate', onHistoryChange);
    }

    static toggleActiveFacets(disable = true) {
        document.querySelectorAll('.js-facet-remove').forEach((el) => {
            // By passing the second argument to toggle (disable = true) we make it only one-way toggle, we can only make "disabled" appear, we cannot remove it
            el.classList.toggle('disabled', disable);
        });
    }

    static renderPage(searchParams, facetForm, updateURLHash = true) {
        FacetFiltersForm.searchParamsPrev = searchParams;
        const sections = FacetFiltersForm.getSections();
        const countContainer = document.getElementById('ProductCount');
        const countContainerDesktop = document.getElementById('ProductCountDesktop');

        // On Dawn code there are loading spinners, but we don't have them

        // For each section we'll check if the section's URL is already in the cache if it is, we will render it from the cache
        // If not, we will fetch it from the server
        // We are using the Section Rendering API to get the sections
        sections.forEach((section) => {
            const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
            const filterDataUrl = (el) => el.url === url;

            FacetFiltersForm.filterData.some(filterDataUrl)
                ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
                : FacetFiltersForm.renderSectionFromFetch(url, event);
        });

        if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
    }

    // Rendering the filters and sections from the server because it's new data.
    static renderSectionFromFetch(url, event) {
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                const html = responseText;
                FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
                console.log(FacetFiltersForm.filterData);
                FacetFiltersForm.renderFilters(html, event);
                FacetFiltersForm.renderProductGridContainer(html);
                FacetFiltersForm.renderProductCount(html);
            });
    }

    // Rendering the sections and filters from cache because it's data that was already fetched. Based on History and Filtering
    static renderSectionFromCache(filterDataUrl, event) {
        const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
    }

    // Rendering the Product Grid once the filters are applied
    static renderProductGridContainer(html) {
        document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('ProductGridContainer').innerHTML;
    }

    // Rendering the Product Count found based on filters, once the filters are applied
    static renderProductCount(html) {
        const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCount').innerHTML;
        const container = document.getElementById('ProductCount');
        const containerDesktop = document.getElementById('ProductCountDesktop');
        container.innerHTML = count;

        if (containerDesktop) {
            containerDesktop.innerHTML = count;
        }
    }

    static renderFilters(html, event) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
        const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
            '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
        );
        const facetDetailsElementsFromDom = document.querySelectorAll(
            '#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter'
        );

        // Remove Facets that are no longer returned from the server
        Array.from(facetDetailsElementsFromDom).forEach((currentEl) => {
            if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentEl.id === id)) {
                currentEl.remove();
            }
        });

        const matchesId = (el) => {
            const jsFilter = event ? event.target.closest('.js-filter') : undefined;
            return jsFilter ? el.id === jsFilter.id : false;
        };

        const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((el) => !matchesId(el));
        const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);
    }

    // Method to get sections that will be updated maybe using Section Rendering API
    static getSections() {
        return [
            {
                section: document.getElementById('product-grid').dataset.id,
            },
        ];
    }
}
