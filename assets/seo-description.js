class SeoManager {
    constructor() {
        this.seoDescription = document.querySelector('.seo-description__text-content');
        this.openButton = document.querySelector('.seo-description__button');
        this.isOpened = false;
        
        this.openButton.addEventListener('click', () => this.toggleDescription());
    }

    toggleDescription() {
        this.seoDescription.classList.toggle('seo-description__text-content-is-closed');
        this.isOpened = !this.isOpened;
        this.openButton.innerText = this.isOpened ? 'Read Less' : 'Read More';
    }
}

const seoManager = new SeoManager();