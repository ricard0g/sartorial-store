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
const searchButton = document.querySelector('.search-button');

const handleSearchButtonClick = () => {
    dropdownSearch.classList.toggle('show-main-search-small-screens');
};

const handleClickOutside = (e) => {
    const predictiveSearchResults = document.getElementById('predictive-search-results');
    if (
        !dropdownSearch.contains(e.target) &&
        !searchButton.contains(e.target) &&
        !predictiveSearchResults?.contains(e.target)
    ) {
        dropdownSearch.classList.remove('show-main-search-small-screens');
    }
};

searchButton.addEventListener('click', handleSearchButtonClick);
document.addEventListener('click', handleClickOutside);
