import { searchManagerInstance } from './navbar.js';
let mobileNavManager;
let mobileNavStickyManager;

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

class MobileNavManager {
    constructor() {
        // Only store essential top-level containers
        this.menuDrawer = document.querySelector('.mobile-navbar__container');
        this.backgroundNavbarMobile = document.querySelector('.mobile-navbar__container-background');
        this.body = document.body;

        this.init();
    }

    init() {
        // Single document-level event listener for all mobile navbar interactions
        document.addEventListener('click', (e) => this.handleMobileNavbarEvents(e));
    }

    handleMobileNavbarEvents(e) {
        const target = e.target;

        // Handle hamburger button clicks
        if (target.matches('#hamburger-btn-mobile') || target.closest('#hamburger-btn-mobile')) {
            this.handleHamburgerBtnClick(target.closest('#hamburger-btn-mobile'));
            return;
        }

        // Handle background clicks
        if (target.matches('.mobile-navbar__container-background')) {
            this.closeMenu();
            return;
        }

        // Handle mega menu link clicks
        if (target.matches('.mobile-navbar__primary-inner-link')) {
            this.handleMegaMenuLink(e);
            return;
        }

        // Handle mega menu back button clicks
        if (target.matches('.mobile-navbar__mega-menu-back') || target.closest('.mobile-navbar__mega-menu-back')) {
            this.handleMegaMenuBack(e);
            return;
        }
    }

    handleHamburgerBtnClick(hamburgerBtn) {
        const navbar = hamburgerBtn.closest('.subnavbar-wrapper');
        if (!navbar) return;

        // Get hamburger lines within this specific navbar
        const lines = {
            first: navbar.querySelector('#first-line-hamburguer'),
            second: navbar.querySelector('#second-line-hamburguer'),
            third: navbar.querySelector('#third-line-hamburguer'),
        };

        // Toggle hamburger animation classes
        Object.values(lines).forEach((line, index) => {
            if (!line) return;
            line.classList.toggle(`${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}-line`);
        });

        if (searchManagerInstance.dropdownOpened) {
            searchManagerInstance.closeAllSearchDropdowns();
        }

        // Toggle menu drawer
        if (this.menuDrawer) {
            const isVisible = this.menuDrawer.style.display === 'block';
            this.menuDrawer.style.display = isVisible ? 'none' : 'block';

            if (!isVisible) {
                this.body.style.overflow = 'hidden';
                this.body.style.scrollBehavior = 'none';
            } else {
                this.body.style.overflow = '';
                this.body.style.scrollBehavior = '';
            }

            // Animate opacity after display change
            requestAnimationFrame(() => {
                this.menuDrawer.style.opacity = isVisible ? '0' : '1';
            });
        }
    }

    handleMegaMenuLink(e) {
        e.preventDefault();
        const menu = e.target.nextElementSibling;
        if (!menu) return;

        // Show mega menu with animation
        menu.style.display = 'block';
        this.body.style.overflow = 'hidden';
        this.body.style.scrollBehavior = 'none';
        requestAnimationFrame(() => {
            menu.classList.add('mobile-navbar__show-mega-menu');
        });
    }

    handleMegaMenuBack(e) {
        const menu = e.target.closest('.mobile-navbar__mega-menu-container');
        if (!menu) return;

        // Hide mega menu with animation
        menu.classList.remove('mobile-navbar__show-mega-menu');
        this.body.style.overflow = '';
        this.body.style.scrollBehavior = '';
        this.onTransitionEnd(menu, () => {
            menu.style.display = 'none';
        });
    }

    closeMenu() {
        // Find all hamburger lines in any navbar
        document.querySelectorAll('[id^="first-line"], [id^="second-line"], [id^="third-line"]').forEach((line) => {
            const className = line.id.includes('first') ? 'first' : line.id.includes('second') ? 'second' : 'third';
            line.classList.remove(`${className}-line`);
        });

        // Close menu drawer with animation
        if (this.menuDrawer) {
            this.menuDrawer.style.opacity = '0';
            this.onTransitionEnd(this.menuDrawer, () => {
                this.menuDrawer.style.display = 'none';
            });
        }
        this.body.style.overflow = '';
        this.body.style.scrollBehavior = '';
    }

    // Utility method for handling transitions
    onTransitionEnd(element, callback) {
        const handler = () => {
            element.removeEventListener('transitionend', handler);
            callback();
        };
        element.addEventListener('transitionend', handler);
    }
}

class MobileNavStickyManager {
    constructor() {
        if (window.innerWidth < 769) {
            if (window.mobileNavStickyManagerInstance) {
                return window.mobileNavStickyManagerInstance;
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }

            window.mobileNavStickyManagerInstance = this;
        }
    }

    initialize() {
        const originalNavbar = document.getElementById('subnavbar-wrapper-sm');
        const header = document.querySelector('header');
        this.navbar = originalNavbar.cloneNode(true);
        this.navbar.style.display = 'none';
        this.navbar.style.transform = 'translateY(-100%)';

        document.body.insertBefore(this.navbar, header);

        this.desktopNavbarDimensions = document.querySelector('.main-navbar-wrapper');
        this.animationFrame = null;
        this.isVisible = false;

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
        const mainNavbarBottom = this.desktopNavbarDimensions.getBoundingClientRect().bottom + window.scrollY + 100;

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
mobileNavStickyManager = new MobileNavStickyManager();

// Since both navbar.js and navbar-mobile.js are loaded on the same page and as modules we want to prevent multiple instances of MobileNavManager
if (!window.mobileNavManagerInstance) {
    mobileNavManager = new MobileNavManager();
    window.mobileNavManagerInstance = mobileNavManager;
} else {
    mobileNavManager = window.mobileNavManagerInstance;
}

export { mobileNavManager };
