import { mobileNavManager } from './navbar-mobile.js';

// Add this throttle function at the top of your file
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

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
const searchParents = Array.of(
    document.getElementById('subnavbar-wrapper-md'),
    document.getElementById('subnavbar-wrapper-sm')
);
let activeParent = searchParents.find((el) => window.getComputedStyle(el).display !== 'none');
let activeDropdownSearch = activeParent?.querySelector('.main-search-small-screens');
let activeSearchButton = activeParent?.querySelector('.search-button');
let activeSearchInput = activeParent?.querySelector('.header-search-input-small-screens');
const predictiveSearchResults = document.getElementById('predictive-search-results');
console.log(activeParent);

const handleSearchButtonClick = () => {
    if (mobileNavManager.menuDrawer.style.display === 'block') {
        mobileNavManager.closeMenu();
    }
    activeDropdownSearch.classList.toggle('show-main-search-small-screens');
};

const handleClickOutside = (e) => {
    const isClickInsideSearch = activeDropdownSearch?.contains(e.target);
    const isClickOnSearchButton = activeSearchButton?.contains(e.target);
    const isClickInsidePredictiveSearch = predictiveSearchResults?.contains(e.target);
    if (!isClickInsideSearch && !isClickOnSearchButton && !isClickInsidePredictiveSearch) {
        activeDropdownSearch?.classList.remove('show-main-search-small-screens');
    }
};

activeSearchButton?.addEventListener('click', handleSearchButtonClick);
document.addEventListener('click', handleClickOutside);
window.onresize = () => {
    activeParent = searchParents.find((el) => window.getComputedStyle(el).display !== 'none');
};

// Show Tablet Navbar on Scroll Down
const tabletNavbar = document.getElementById('subnavbar-wrapper-md');
let start;

// Replace your window.onscroll with this:
window.onscroll = throttle(() => {
    const desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper').getBoundingClientRect();
    const absoluteBottom = desktopNavbarDimensions.bottom + window.scrollY;

    if (absoluteBottom < window.scrollY) {
        tabletNavbar.style.display = 'block';
        tabletNavbar.style.position = 'sticky';
        tabletNavbar.style.top = '0';
        window.requestAnimationFrame(animation);
    } else {
        tabletNavbar.style.display = 'none';
        tabletNavbar.style.transform = 'translateY(-100%)';
        start = undefined;
    }
}, 50); // Executes at most once every 150ms

const animation = (timestamp) => {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    const shift = Math.min(0.8 * elapsed, 100);
    tabletNavbar.style.transform = `translateY(-${100 - shift}%)`;

    if (shift < 100) {
        window.requestAnimationFrame(animation);
    }
};
