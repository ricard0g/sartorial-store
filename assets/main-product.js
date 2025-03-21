document.addEventListener('DOMContentLoaded', function () {
    var $carousel = $('.main-product__carousel-main').flickity({
        imagesLoaded: true,
        cellAlign: 'center',
        pageDots: false,
    });

    var $carouselNav = $('.main-product__carousel-nav');
    var $carouselNavCells = $carouselNav.find('.main-product__carousel-nav-cell');

    $carouselNav.on('click', '.main-product__carousel-nav-cell', function (e) {
        var index = $(e.currentTarget).index();
        $carousel.flickity('select', index);
    });

    var flkty = $carousel.data('flickity');
    var navTop = $carouselNav.position().top;
    var navCellHeight = $carouselNavCells.height();
    var navHeight = $carouselNav.height();

    $carousel.on('select.flickity', function () {
        $carouselNav.find('.is-nav-selected').removeClass('is-nav-selected');
        var $selected = $carouselNavCells.eq(flkty.selectedIndex).addClass('is-nav-selected');
        var scrollY = $selected.position().top + $carouselNav.scrollTop() - (navHeight + navCellHeight) / 2;
        $carouselNav.animate({
            scrollTop: scrollY,
        });
    });
});
