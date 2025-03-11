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

    static renderPage(searchParams, event, updateURLHash = true) {
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

        // This function will check if the element that was clicked is the same as the one that was returned from the server
        // If it is, we will return true and the element will be rendered
        // If it is not, we will return false and the element will not be rendered
        // It's a function that checks the interacted element with the one that was returned from the server
        const matchesId = (el) => {
            const jsFilter = event ? event.target.closest('.js-filter') : undefined;
            return jsFilter ? el.id === jsFilter.id : false;
        };

        // FacetsToRender is an array containing all the facets that are returned from the server except the one that was clicked
        const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((el) => !matchesId(el));
        // Counts are the number right next to the actual filter. "Counting" the number of items available for that filter
        // In this case we are looking for the element that has the same id as the one that was clicked
        const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);

        // For each Facet to Render we will check if the element already exists in the DOM
        // If it does, we will update the innerHTML of the element with the one that was returned from the server
        // If it doesn't, we will insert the new element after the previous one
        facetsToRender.forEach((elToRender, index) => {
            const currentElement = document.getElementById(elToRender.id);
            // Element already rendered in the DOM so just update the innerHTML
            if (currentElement) {
                document.getElementById(elToRender.id).innerHTML = elToRender.innerHTML;
            } else {
                if (index > 0) {
                    const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
                    // Same facet type (eg vertical or drawer/mobile)
                    if (elToRender.className === previousElementClassName) {
                        // Insert the new element after the previous one
                        document.getElementById(previousElementId).after(elToRender);
                        return;
                    }
                }
            }

            if (elToRender.parentElement) {
                document.querySelector(`#${elToRender.parentElement.id} .js-filter`).before(elToRender);
            }
        });

        FacetFiltersForm.renderActiveFacets(parsedHTML);
        FacetFiltersForm.renderAdditionalElements(parsedHTML);

        // Render the counts for the facets that were returned from the server, if there are any changes
        if (countsToRender) {
            const closestJSFilterId = event.target.closest('.js-filter').id;

            if (closestJSFilterId) {
                FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
                FacetFiltersForm.renderMobileCounts(countsToRender, document.getElementById(closestJSFilterId));

                const newFacetDetailsElement = document.getElementById(closestJSFilterId);
                const newElementSelector = newFacetDetailsElement.classList.contains('mobile-facets__details')
                    ? '.mobile-facets__close-button'
                    : '.facets__summary';
                const newElementToActive = newFacetDetailsElement.querySelector(newElementSelector);

                const isTextInput = event.target.getAttribute('type') === 'text';

                if (newElementToActive && !isTextInput) newElementToActive.focus();
            }
        }
    }

    // Method to handle the selected filters on the UI. Here we manage those filter "tags" that are shown on the top of the page
    // Here we're updating the entire section that contains the active filter tags applied to the collection grid
    static renderActiveFacets(html) {
        const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

        activeFacetElementSelectors.forEach((selector) => {
            // Here we have the active facets that are returned from the server and then replace the active facets section that's currently in the DOM with those returned from the server
            const activeFacetsElement = html.querySelector(selector);
            if (!activeFacetsElement) return;
            document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
        });

        FacetFiltersForm.toggleActiveFacets(false);
    }

    static renderAdditionalElements(html) {
        const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

        mobileElementSelectors.forEach((selector) => {
            if (!html.querySelector(selector)) return;
            // Here we have the active facets that are returned from the server and then replace the active facets section that's currently in the DOM with those returned from the server
            document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
        });

        // bindEvents will reattach all event listeners to the mobile drawer after its HTML content has been updated
        // Important line for re-initializing the mobile drawer functionality
        document.getElementById('FacetFiltersFormMobile').closest('menu-drawer').bindEvents();
    }

    static renderCounts(source, target) {
        const targetSummary = target.querySelector('.facets__summary');
        const sourceSummary = source.querySelector('.facets__summary');

        if (sourceSummary && targetSummary) {
            targetSummary.outerHTML = sourceSummary.outerHTML;
        }

        const targetHeaderElement = target.querySelector('.facets__header');
        const sourceHeaderElement = source.querySelector('.facets__header');

        if (sourceHeaderElement && targetHeaderElement) {
            targetHeaderElement.outerHTML = sourceHeaderElement.outerHTML;
        }

        const targetWrapElement = target.querySelector('.facets-wrap');
        const sourceWrapElement = source.querySelector('.facets-wrap');

        if (sourceWrapElement && targetWrapElement) {
            const isShowingMore = Boolean(targetWrapElement.querySelector('show-more-button .label-show-more.hidden'));
            if (isShowingMore) {
                sourceWrapElement
                    .querySelectorAll('.facets__item.hidden')
                    .forEach((hiddenItem) => hiddenItem.classList.replace('hidden', 'show-more-item'));
            }

            targetWrapElement.outerHTML = sourceWrapElement.outerHTML;
        }
    }

    static renderMobileCounts(source, target) {
        const targetFacetList = target.querySelector('.mobile-facets__list');
        const sourceFacetList = source.querySelector('.mobile-facets__list');

        if (sourceFacetList && targetFacetList) {
            targetFacetList.outerHTML = sourceFacetList.outerHTML;
        }
    }

    static updateURLHash(searchParams) {
        history.pushState(
            { searchParams },
            '',
            `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`
        );
    }

    // Method to get sections that will be updated maybe using Section Rendering API
    static getSections() {
        return [
            {
                section: document.getElementById('product-grid').dataset.id,
            },
        ];
    }

    createSearchParams(form) {
        const formData = new FormData(form);
        return new URLSearchParams(formData).toString();
    }

    onSubmitForm(searchParams, e) {
        FacetFiltersForm.renderPage(searchParams, e);
    }

    onSubmitHandler(e) {
        e.preventDefault();
        const sortFilterForms = document.querySelectorAll('facet-filters-form form');
        if (e.target.className == 'mobile-facets__checkbox') {
            const searchParams = this.createSearchParams(e.target.closest('form'));
            this.onSubmitForm(searchParams, e);
        } else {
            const forms = [];
            const isMobile = e.target.closest('form').id === 'FacetFiltersFormMobile';

            sortFilterForms.forEach((form) => {
                if (!isMobile) {
                    if (
                        form.id === 'FacetSortForm' ||
                        form.id === 'FacetFiltersForm' ||
                        form.id === 'FacetSortDrawerForm'
                    ) {
                        forms.push(this.createSearchParams(form));
                    }
                } else if (form.id === 'FacetFiltersFormMobile') {
                    forms.push(this.createSearchParams(form));
                }
            });
            this.onSubmitForm(forms.join('&'), e);
        }
    }

    onActiveFilterClick(e) {
        e.preventDefault();
        FacetFiltersForm.toggleActiveFacets();
        const url =
            e.currentTarget.href.indexOf('?') === -1
                ? ''
                : e.currentTarget.href.slice(e.currentTarget.href.indexOf('?') + 1);
        FacetFiltersForm.renderPage(url);
    }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();