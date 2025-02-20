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

class MegaMenuManager {
    constructor() {
        this.subNavbarWrapper = document.querySelectorAll('.subnavbar-wrapper');
        this.megaMenus = new Map();
        this.initializeMegaMenus();
        this.initEventDelegation();
    }

    initializeMegaMenus() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            this.megaMenus.set(link, link.nextElementSibling);
        });
    }

    initEventDelegation() {
        this.subNavbarWrapper.forEach((wrapper) => {
            wrapper.addEventListener('mouseover', (e) => {
                const navLink = e.target.closest('.nav-link');
                if (navLink && this.megaMenus.has(navLink)) {
                    this.handleMouseOver(navLink);
                }
            });

            wrapper.addEventListener('mouseleave', () => {
                const activeLink = Array.from(this.megaMenus.keys()).find((link) =>
                    this.megaMenus.get(link).classList.contains('show')
                );
                if (activeLink) {
                    this.hideMenu(activeLink);
                }
            });
        });
    }

    handleMouseOver(activeLink) {
        this.megaMenus.forEach((menu, link) => {
            if (menu.classList.contains('show') && link !== activeLink) {
                this.hideMenu(link);
            }
        });

        this.showMenu(activeLink);
    }

    showMenu(link) {
        const menu = this.megaMenus.get(link);
        link.classList.add('underline');
        menu.style.display = 'block';
        setTimeout(() => {
            requestAnimationFrame(() => menu.classList.add('show'));
        }, 5);
    }

    hideMenu(link) {
        const menu = this.megaMenus.get(link);
        link.classList.remove('underline');
        menu.classList.remove('show');
        menu.style.display = 'none';
    }
}

class SearchManager {
    constructor() {
        this.elements = {
            navbars: document.querySelectorAll('.subnavbar-wrapper'),
            searchDropdowns: document.querySelectorAll('.main-search-small-screens'),
            predictiveSearch: document.getElementById('predictive-search-results'),
        };

        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.search-button') || e.target.closest('.search-button')) {
                this.handleSearchClick(e);
                return;
            }

            this.handleClickOutside(e);
        });
    }

    handleSearchClick(e) {
        const navbar = e.target.closest('.subnavbar-wrapper');
        if (!navbar) return;

        // close mobile menu if open
        if (mobileNavManager.menuDrawer?.style.display === 'block') {
            mobileNavManager.closeMenu();
        }

        // toggle search dropdown
        const dropdown = navbar.querySelector('.main-search-small-screens');
        this.toggleSearchDropdown(dropdown);
    }

    hidePredictiveSearchResults() {
        this.mainSearchSmallScreens.forEach((search) => {
            search.classList.remove('show-main-search-small-screens');
        });
    }

    handleClickOutside(e) {
        const isClickRelevant =
            e.target.closest('.subnavbar-wrapper') ||
            e.target.closest('.search-button') ||
            e.target.closest('.predictive-search-results');

        if (!isClickRelevant) {
            this.closeAllSearchDropdowns();
        }
    }

    toggleSearchDropdown(dropdown) {
        if (!dropdown) return;

        this.closeAllSearchDropdowns();

        dropdown.classList.toggle('show-main-search-small-screens');
    }

    closeAllSearchDropdowns() {
        this.elements.searchDropdowns.forEach((dropdown) => {
            dropdown.classList.remove('show-main-search-small-screens');
        });
    }
}

// Show Tablet Navbar on Scroll Down
const tabletNavbar = document.getElementById('subnavbar-wrapper-md');
let start;

// Replace your window.onscroll with this:
window.onscroll = throttle(() => {
    const desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper').getBoundingClientRect();
    const absoluteBottom = desktopNavbarDimensions.bottom + window.scrollY + 400;

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
}, 50); // Executes at most once every 50ms

const animation = (timestamp) => {
    if (start === undefined) start = timestamp;
    const elapsed = timestamp - start;

    const shift = Math.min(0.6 * elapsed, 100);
    tabletNavbar.style.transform = `translateY(-${100 - shift}%)`;

    if (shift < 100) {
        window.requestAnimationFrame(animation);
    }
};

class TabletManager {
    constructor() {
        this.navbar = document.querySelector('.main-navbar-wrapper');
        this.desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper');
        this.animationFrame = null;
        this.initializeScrollListener();
    }

    initializeScrollListener() {
        window.addEventListener(
            'scroll',
            throttle(() => {
                this.handleScroll();
            }, 50)
        );
    }

    handleScroll() {
        const mainNavbarBottom = this.desktopNavbarDimensions.getBoundingClientRect().bottom + window.scrollY + 400;

        if (mainNavbarBottom < window.scrollY) {
            this.showTabletNavbar();
        } else {
            this.hideTabletNavbar();
        }
    }

    showTabletNavbar() {
        tabletNavbar.style.display = 'block';
        tabletNavbar.style.position = 'sticky';
        tabletNavbar.style.top = '0';
        this.startAnimation();
    }

    hideTabletNavbar() {
        tabletNavbar.style.display = 'none';
        tabletNavbar.style.transform = 'translateY(-100%)';
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    startAnimation(startTime = null) {
        if (!startTime) {
            this.animationFrame = requestAnimationFrame((timestamp) => this.startAnimation(timestamp));
            return;
        }

        const progress = Math.min((Date.now() - startTime) * 0.6, 100);
        this.navbar.style.transform = `translateY(-${100 - progress}%)`;

        if (progress < 100) {
            this.animationFrame = requestAnimationFrame(() => this.startAnimation(startTime));
        }
    }
}

const megaMenuManager = new MegaMenuManager();
const searchManager = new SearchManager();
