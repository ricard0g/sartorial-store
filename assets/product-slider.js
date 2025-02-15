// Products Carousel
var elem = document.querySelector('.product-slider__carousel');
var flkty = new Flickity(elem, {
    freeScroll: true,
    contain: true,
    wrapAround: true,
    pageDots: false,
});

// Dialog Carousel
var dialogElem = document.querySelector('.product-slider__carousel-dialog');
var dialogFlkty = new Flickity(dialogElem, {
    contain: true,
    pageDots: false,
});

// Modal
const modal = document.querySelector('[data-modal]');
const carousel = document.querySelector('.product-slider__container');

document.addEventListener('DOMContentLoaded', () => {
    carousel.addEventListener('click', (e) => {
        if (e.target.matches('[data-open-modal]')) {
            e.preventDefault();
            e.target.nextElementSibling.showModal();
        }

        if (e.target.matches('[data-close-modal]')) {
            e.preventDefault();
            e.target.nextElementSibling.close();
        }
    });
});
