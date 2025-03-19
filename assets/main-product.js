const elemNav = document.querySelector('.main-product__carousel-nav');
var flktyNav = new Flickity(elemNav, {
    asNavFor: '.main-product__carousel-main',
    contain: true,
    pageDots: false,
    draggable: false,
    cellAlign: 'left',
});

const elem = document.querySelector('.main-product__carousel-main');
var flkty = new Flickity(elem, {
    contain: true,
    cellAlign: 'left',
});
