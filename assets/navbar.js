import { mobileNavManager } from './navbar-mobile.js';
let megaMenuManager;
let searchManagerInstance;
let tabletManager;

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
        if (window.searchManagerInstance) {
            return window.searchManagerInstance;
        }

        this.elements = {
            navbars: document.querySelectorAll('.subnavbar-wrapper'),
            searchDropdowns: document.querySelectorAll('.main-search-small-screens'),
            predictiveSearch: document.getElementById('predictive-search'),
        };

        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);

        this.initializeEventListeners();
        window.searchManagerInstance = this;
        searchManagerInstance = this;
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

        const megaMenuDesktopOpened = megaMenuManager.megaMenus
            .keys()
            .find((link) => megaMenuManager.megaMenus.get(link).classList.contains('show'));

        const megaMenuTabletOpened = tabletManager.megaMenus
            .keys()
            .find((link) => tabletManager.megaMenus.get(link).classList.contains('show'));

        console.log(megaMenuTabletOpened);

        if (megaMenuDesktopOpened) {
            megaMenuManager.hideMenu(megaMenuDesktopOpened);
        } else if (megaMenuTabletOpened) {
            tabletManager.hideMenu(megaMenuTabletOpened);
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

class TabletManager {
    constructor() {
        if (window.innerWidth < 769) return;
        document.addEventListener('DOMContentLoaded', () => {
            const header = document.querySelector('header');
            const originalNavbar = document.getElementById('subnavbar-wrapper-md');
            this.navbar = originalNavbar.cloneNode(true);
            this.navbar.style.display = 'none';
            this.navbar.style.transform = 'translateY(-100%)';

            document.body.insertBefore(this.navbar, header);

            this.desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper');
            this.animationFrame = null;
            this.isVisible = false;

            // Initialize mega menu functionality for cloned navbar
            this.initializeMegaMenus();
            this.initializeScrollListener();
        });
    }

    initializeMegaMenus() {
        // Create a new map for this navbar's mega menus
        this.megaMenus = new Map();

        // Get all nav links in the cloned navbar
        const navLinks = this.navbar.querySelectorAll('.nav-link');

        // Set up mega menu map
        navLinks.forEach((link) => {
            this.megaMenus.set(link, link.nextElementSibling);
        });

        // Add mouseover event listener to the cloned navbar
        this.navbar.addEventListener('mouseover', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink && this.megaMenus.has(navLink)) {
                this.handleMouseOver(navLink);
            }
        });

        // Add mouseleave event listener
        this.navbar.addEventListener('mouseleave', () => {
            const activeLink = Array.from(this.megaMenus.keys()).find((link) =>
                this.megaMenus.get(link).classList.contains('show')
            );
            if (activeLink) {
                this.hideMenu(activeLink);
            }
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
            if (!this.isVisible) {
                this.showTabletNavbar();
            }
        } else {
            this.hideTabletNavbar();
        }
    }

    showTabletNavbar() {
        this.navbar.style.display = 'block';
        this.navbar.style.position = 'sticky';
        this.navbar.style.top = '0';
        this.startAnimation();
        searchManagerInstance.closeAllSearchDropdowns();
    }

    hideTabletNavbar() {
        this.navbar.style.display = 'none';
        this.navbar.style.transform = 'translateY(-100%)';
        if (this.animationFrame) {
            window.cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.isVisible = false;
    }

    startAnimation(startTime = null) {
        if (!startTime) {
            this.animationFrame = requestAnimationFrame((timestamp) => this.startAnimation(timestamp));
        }

        const progress = Math.min((performance.now() - startTime) * 0.6, 100);
        this.navbar.style.transform = `translateY(-${100 - progress}%)`;
        if (progress < 100) {
            this.animationFrame = requestAnimationFrame(() => this.startAnimation(startTime));
        } else {
            this.isVisible = true;
            this.animationFrame = null;
        }
    }
}
if (!window.tabletManagerInstance) {
    tabletManager = new TabletManager();
    window.tabletManagerInstance = tabletManager;
} else {
    tabletManager = window.tabletManagerInstance;
}

megaMenuManager = new MegaMenuManager();
window.megaMenuManager = megaMenuManager;

setTimeout(() => {
    if (!window.searchManagerInstance) {
        searchManagerInstance = new SearchManager();
        window.searchManagerInstance = searchManagerInstance;
    } else {
        searchManagerInstance = window.searchManagerInstance;
    }
}, 1);
export { searchManagerInstance, tabletManager, megaMenuManager };
