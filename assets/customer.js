class MainAddresses extends HTMLElement {
    constructor() {
        super();
        this.countryEl = this.querySelector('[data-address-country-select]');
        this.provinceEl = this.querySelector('[data-address-province-select]');
        this.provinceContainer = this.querySelector('#ProvinceInput');

        this.countryEl.addEventListener('change', () => this.countryHandler());

        this.initCountry();
        this.initProvince();
    }

    _setSelectorByValue(selector, value) {
        for (let i = 0, count = selector.options.length; i < count; i++) {
            const option = selector.options[i];
            if (option.value === value || option.innerHTML === value) {
                selector.selectedIndex = i;
                return i;
            }
        }
    }

    initCountry() {
        const country = this.countryEl.getAttribute('data-default');
        this._setSelectorByValue(this.countryEl, country);
        this.countryHandler();
    }

    initProvince() {
        const province = this.provinceEl.getAttribute('data-default');
        if (province && this.provinceEl.options.length > 0) {
            this._setSelectorByValue(this.provinceEl, province);
        }
    }

    countryHandler(e) {
        const opt = this.countryEl.options[this.countryEl.selectedIndex];
        const raw = opt.getAttribute('data-provinces');
        const provinces = JSON.parse(raw);

        this.clearOptions(this.provinceEl);
        if (provinces && provinces.length == 0) {
            this.provinceContainer.style.display = 'none';
        } else {
            for (let i = 0; i < provinces.length; i++) {
                const option = document.createElement('option');
                option.value = provinces[i][0];
                option.innerHTML = provinces[i][1];
                this.provinceEl.appendChild(option);
            }

            this.provinceContainer.style.display = '';
        }
    }

    clearOptions(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }
}

class EditAddress extends MainAddresses {
    constructor() {
        super();
        this.editButton = this.querySelector('.main-addresses__edit-button');
        this.editForm = this.querySelector('.main-addresses__edit-address');
        this.cancelBtn = this.querySelector('.main-addresses__cancel-button');
        this.viewAddress = this.querySelector('.main-addresses__view-address');
        this.deleteButton = this.querySelector('#DeleteBtn');

        this.setEventListeners();
    }

    setEventListeners() {
        this.editButton.addEventListener('click', (e) => this.toggleForm(e));
        this.editForm.addEventListener('submit', (e) => this.submitForm(e));
        this.cancelBtn.addEventListener('click', (e) => this.toggleForm(e));

        // Add confirmation for delete button
        if (this.deleteButton) {
            this.deleteButton.addEventListener('click', (e) => {
                e.preventDefault(); // Stop the form from submitting immediately

                // Show the native browser confirmation dialog
                if (window.confirm('Are you sure you want to delete this address?')) {
                    this.deleteAddress(); // If confirmed, submit the form
                }
            });
        }
    }

    toggleForm(e) {
        // Fix the condition - it was always evaluating to true
        this.editForm.style.display = this.editForm.style.display === 'block' ? 'none' : 'block';
        this.viewAddress.style.display = this.viewAddress.style.display === 'block' ? 'none' : 'block';
    }

    deleteAddress() {
        const deleteForm = this.querySelector('.main-addresses__addresses-delete-form');
        if (deleteForm) {
            deleteForm.submit();
        }
    }
}

customElements.define('edit-address', EditAddress);

class AddAddress extends MainAddresses {
    constructor() {
        super();
        this.actionBtn = document.querySelector('.main-addresses__action-button');
        this.content = this.querySelector('.main-addresses__add-address-form');
        this.cancelBtn = this.querySelector('.main-addresses__cancel-button');
        this.setEventListeners();
    }

    setEventListeners() {
        this.actionBtn.addEventListener('click', (e) => this.addForm(e));
        this.cancelBtn.addEventListener('click', (e) => this.hideForm(e));
    }

    addForm(e) {
        this.content.style.display = 'block';
    }

    hideForm(e) {
        this.content.style.display = 'none';
    }
}

customElements.define('add-address', AddAddress);
