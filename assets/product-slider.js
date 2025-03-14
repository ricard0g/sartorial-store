// Products Carousel
if (!window.location.pathname.includes('/collections')) {
    var elem = document.querySelector('.product-slider__carousel');
    const smallScreen = window.innerWidth < 769;
    var flkty = new Flickity(elem, {
        freeScroll: true,
        contain: true,
        wrapAround: true,
        pageDots: false,
        draggable: smallScreen,
        prevNextButtons: !smallScreen,
    });
}

// Modal
document.addEventListener('DOMContentLoaded', () => {
    const carousel =
        document.querySelector('.product-slider__container') ||
        document.querySelector('.collection-product-grid__products-wrapper');
    let dialogCarousels = {};

    carousel.addEventListener('click', (e) => {
        if (e.target.matches('[data-open-modal]')) {
            const dialog = e.target.nextElementSibling;
            dialog.showModal();

            // Initialize the carousel
            if (!dialogCarousels[dialog.id]) {
                const dialogCarousel = dialog.querySelector('.product-slider__carousel-dialog');
                console.log(dialogCarousel);
                dialogCarousels[dialog.id] = new Flickity(dialogCarousel, {
                    wrapAround: true,
                    cellAllign: 'center',
                    imagesLoaded: true,
                    pageDots: false,
                    draggable: false,
                });
            }
        }

        if (e.target.matches('[data-close-modal]') || e.target.closest('[data-close-modal]')) {
            const dialog = e.target.closest('dialog');
            dialog.close();
        }
    });
});
