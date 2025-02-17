// Products Carousel
var elem = document.querySelector('.product-slider__carousel');
var flkty = new Flickity(elem, {
    freeScroll: true,
    contain: true,
    wrapAround: true,
    pageDots: false,
});

// Modal
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.product-slider__container');
    let dialogCarousels = {};

    carousel.addEventListener('click', (e) => {
        if (e.target.matches('[data-open-modal]') || carousel.contains(e.target)) {
            e.preventDefault();
            const dialog = e.target.nextElementSibling;
            dialog.showModal();

            // Initialize the carousel
            if (!dialogCarousels[dialog.id]) {
                const dialogCarousel = dialog.querySelector('.product-slider__carousel-dialog');
                dialogCarousels[dialog.id] = new Flickity(dialogCarousel, {
                    contain: true,
                    pageDots: false,
                })
            }
        }

        if (e.target.matches('[data-close-modal]')) {
            e.preventDefault();
            const dialog = e.target.nextElementSibling;
            dialog.close();
        }
    });
});
