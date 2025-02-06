const navLinks = document.querySelectorAll('.nav-link');
const subNavbarWrapper = document.querySelectorAll('.subnavbar-wrapper');

// Cache mega menus
const megaMenus = Array.from(navLinks).map((link) => ({
    link,
    menu: link.nextElementSibling,
}));

// Single event handler for mouseover
const handleMouseOver = (activeIndex) => {
    megaMenus.forEach(({ link, menu }, index) => {
        if (menu.classList.contains('show') && index !== activeIndex) {
            link.classList.remove('underline');
            menu.classList.remove('show');
            menu.style.display = 'none';
        }
    });

    const { link, menu } = megaMenus[activeIndex];
    link.classList.add('underline');
    menu.style.display = 'block';
    setTimeout(() => {
        requestAnimationFrame(() => menu.classList.add('show'));
    }, 5);
};

// Single event handler for mouseleave
const handleMouseLeave = (activeIndex) => {
    const { link, menu } = megaMenus[activeIndex];
    link.classList.remove('underline');
    menu.classList.remove('show');
    menu.style.display = 'none';
};

// Attach events
navLinks.forEach((_, index) => {
    navLinks[index].addEventListener('mouseover', () => handleMouseOver(index));
});

subNavbarWrapper.forEach((wrapper) => {
    wrapper.addEventListener('mouseleave', () => {
        const activeIndex = megaMenus.findIndex(({ menu }) => menu.classList.contains('show'));
        if (activeIndex !== -1) handleMouseLeave(activeIndex);
    });
});

// Adding dropdown menu to navbar on smaller screens
const dropdownSearch = document.querySelector('.main-search-small-screens');
const searchButtons = Object.values(document.querySelectorAll('.search-button'));
const predictiveSearchResults = document.getElementById('predictive-search-results');
const searchInput = document.querySelector('.header-search-input-small-screens');

const handleSearchButtonClick = () => {
    dropdownSearch.classList.toggle('show-main-search-small-screens');
};

const handleClickOutside = (e) => {
    const isClickInsideSearch = dropdownSearch.contains(e.target);
    const isClickOnSearchButton = searchButtons.some((btn) => btn.contains(e.target));
    const isClickInsidePredictiveSearch = predictiveSearchResults?.contains(e.target);
    if (!isClickInsideSearch && !isClickOnSearchButton && !isClickInsidePredictiveSearch) {
        dropdownSearch.classList.remove('show-main-search-small-screens');
        setTimeout(() => {
            searchInput.value = '';
        }, 350);
    }
};

searchButtons.forEach((btn) => btn.addEventListener('click', handleSearchButtonClick));
document.addEventListener('click', handleClickOutside);
